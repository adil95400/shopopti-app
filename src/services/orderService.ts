import { supabase } from '../lib/supabase';
import { supplierService } from './supplierService';

export const orderService = {
  async forwardOrderToSupplier(orderId: string): Promise<{
    success: boolean;
    message: string;
    externalOrderId?: string;
  }> {
    try {
      // Récupérer les détails de la commande
      const { data: order, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', orderId)
        .single();
      
      if (error) throw error;
      
      // Regrouper les articles par fournisseur
      const itemsBySupplier = {};
      for (const item of order.order_items) {
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', item.product_id)
          .single();
        
        if (productError) throw productError;
        
        const supplierId = product.metadata.source_supplier_id;
        if (!supplierId) continue;
        
        if (!itemsBySupplier[supplierId]) {
          itemsBySupplier[supplierId] = [];
        }
        
        itemsBySupplier[supplierId].push({
          product_id: product.metadata.source_id,
          quantity: item.quantity,
          price: item.price
        });
      }
      
      // Transmettre la commande à chaque fournisseur
      const results = [];
      for (const [supplierId, items] of Object.entries(itemsBySupplier)) {
        const result = await supplierService.createOrder(supplierId, {
          external_order_id: order.id,
          shipping_address: order.shipping_address,
          items
        });
        
        results.push(result);
        
        // Mettre à jour les articles de la commande avec les informations du fournisseur
        for (const item of items) {
          await supabase
            .from('order_items')
            .update({
              metadata: {
                supplier_id: supplierId,
                external_order_id: result.externalOrderId
              }
            })
            .eq('order_id', orderId)
            .eq('product_id', item.product_id);
        }
      }
      
      return {
        success: true,
        message: `Order forwarded to ${results.length} suppliers`,
        externalOrderId: results[0]?.externalOrderId
      };
    } catch (error) {
      console.error('Error forwarding order to supplier:', error);
      throw error;
    }
  },

  async getOrderStatus(orderId: string): Promise<{
    status: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    supplierStatuses: {
      supplierId: string;
      supplierName: string;
      status: string;
      trackingNumber?: string;
      estimatedDelivery?: string;
    }[];
  }> {
    try {
      // Récupérer les détails de la commande
      const { data: order, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', orderId)
        .single();
      
      if (error) throw error;
      
      // Récupérer les statuts de commande auprès des fournisseurs
      const supplierStatuses = [];
      const uniqueSupplierIds = new Set();
      
      for (const item of order.order_items) {
        if (item.metadata?.supplier_id && !uniqueSupplierIds.has(item.metadata.supplier_id)) {
          uniqueSupplierIds.add(item.metadata.supplier_id);
          
          // Récupérer les informations du fournisseur
          const { data: supplier, error: supplierError } = await supabase
            .from('external_suppliers')
            .select('*')
            .eq('id', item.metadata.supplier_id)
            .single();
          
          if (supplierError) {
            console.error(`Error fetching supplier ${item.metadata.supplier_id}:`, supplierError);
            continue;
          }
          
          // Récupérer le statut de la commande auprès du fournisseur
          // Dans une implémentation réelle, vous feriez un appel API au fournisseur
          const status = {
            supplierId: supplier.id,
            supplierName: supplier.name,
            status: ['processing', 'shipped', 'delivered'][Math.floor(Math.random() * 3)],
            trackingNumber: Math.random() > 0.5 ? `TRK${Math.floor(Math.random() * 1000000000)}` : undefined,
            estimatedDelivery: Math.random() > 0.5 ? new Date(Date.now() + Math.floor(Math.random() * 10) * 86400000).toISOString().split('T')[0] : undefined
          };
          
          supplierStatuses.push(status);
        }
      }
      
      // Déterminer le statut global de la commande
      let overallStatus = 'processing';
      if (supplierStatuses.every(s => s.status === 'delivered')) {
        overallStatus = 'delivered';
      } else if (supplierStatuses.some(s => s.status === 'shipped')) {
        overallStatus = 'shipped';
      }
      
      return {
        status: overallStatus,
        trackingNumber: supplierStatuses.find(s => s.trackingNumber)?.trackingNumber,
        estimatedDelivery: supplierStatuses.find(s => s.estimatedDelivery)?.estimatedDelivery,
        supplierStatuses
      };
    } catch (error) {
      console.error('Error getting order status:', error);
      throw error;
    }
  }
};