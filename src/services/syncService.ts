import { supabase } from '../lib/supabase';
import { supplierService } from './supplierService';

export const syncService = {
  async syncProductsWithSupplier(supplierId: string): Promise<{
    updated: number;
    failed: number;
  }> {
    try {
      // Récupérer tous les produits liés à ce fournisseur
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .filter('metadata->source_supplier_id', 'eq', supplierId);
      
      if (error) throw error;
      
      let updated = 0;
      let failed = 0;
      
      // Pour chaque produit, mettre à jour le stock et le prix
      for (const product of products) {
        try {
          const externalId = product.metadata.source_id;
          const updatedData = await supplierService.getProductById(supplierId, externalId);
          
          // Mettre à jour le produit
          await supabase
            .from('products')
            .update({
              price: updatedData.price,
              stock: updatedData.stock,
              updated_at: new Date().toISOString()
            })
            .eq('id', product.id);
          
          updated++;
        } catch (err) {
          console.error(`Failed to update product ${product.id}:`, err);
          failed++;
        }
      }
      
      return { updated, failed };
    } catch (error) {
      console.error('Error syncing products with supplier:', error);
      throw error;
    }
  },

  async scheduleSyncForAllSuppliers(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // Appeler la fonction Edge Supabase pour synchroniser tous les produits
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to schedule sync');
      }
      
      return {
        success: true,
        message: 'Sync scheduled successfully'
      };
    } catch (error) {
      console.error('Error scheduling sync:', error);
      throw error;
    }
  }
};