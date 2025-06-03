import { supabase } from '../../lib/supabase';

export interface StockAlert {
  id?: string;
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  status: 'active' | 'resolved' | 'ignored';
  createdAt?: string;
  updatedAt?: string;
}

export interface InventorySettings {
  lowStockThreshold: number;
  notifyOnLowStock: boolean;
  autoReorder: boolean;
  reorderQuantity: number;
  trackInventoryChanges: boolean;
}

export const inventoryService = {
  async getProductStock(productId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      return data?.stock || 0;
    } catch (error) {
      console.error('Error fetching product stock:', error);
      throw error;
    }
  },

  async updateProductStock(productId: string, newStock: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock, updated_at: new Date().toISOString() })
        .eq('id', productId);
      
      if (error) throw error;
      
      // Check if stock is below threshold and create alert if needed
      await this.checkLowStockAlert(productId);
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  },

  async getStockAlerts(status?: 'active' | 'resolved' | 'ignored'): Promise<StockAlert[]> {
    try {
      let query = supabase
        .from('stock_alerts')
        .select('*, products(name)')
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data || []).map(alert => ({
        ...alert,
        productName: alert.products?.name || 'Unknown Product'
      }));
    } catch (error) {
      console.error('Error fetching stock alerts:', error);
      throw error;
    }
  },

  async resolveStockAlert(alertId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('stock_alerts')
        .update({ 
          status: 'resolved', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', alertId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error resolving stock alert:', error);
      throw error;
    }
  },

  async ignoreStockAlert(alertId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('stock_alerts')
        .update({ 
          status: 'ignored', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', alertId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error ignoring stock alert:', error);
      throw error;
    }
  },

  async getInventorySettings(): Promise<InventorySettings> {
    try {
      const { data, error } = await supabase
        .from('inventory_settings')
        .select('*')
        .single();
      
      if (error) {
        // If no settings exist, return defaults
        if (error.code === 'PGRST116') {
          return {
            lowStockThreshold: 5,
            notifyOnLowStock: true,
            autoReorder: false,
            reorderQuantity: 10,
            trackInventoryChanges: true
          };
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching inventory settings:', error);
      // Return default settings if there's an error
      return {
        lowStockThreshold: 5,
        notifyOnLowStock: true,
        autoReorder: false,
        reorderQuantity: 10,
        trackInventoryChanges: true
      };
    }
  },

  async updateInventorySettings(settings: InventorySettings): Promise<void> {
    try {
      const { error } = await supabase
        .from('inventory_settings')
        .upsert([settings]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating inventory settings:', error);
      throw error;
    }
  },

  async checkLowStockAlert(productId: string): Promise<void> {
    try {
      // Get current stock
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('id, name, stock')
        .eq('id', productId)
        .single();
      
      if (productError) throw productError;
      
      // Get inventory settings
      const settings = await this.getInventorySettings();
      
      // Check if stock is below threshold
      if (product.stock <= settings.lowStockThreshold) {
        // Check if an active alert already exists
        const { data: existingAlerts, error: alertError } = await supabase
          .from('stock_alerts')
          .select('id')
          .eq('product_id', productId)
          .eq('status', 'active');
        
        if (alertError) throw alertError;
        
        // If no active alert exists, create one
        if (!existingAlerts || existingAlerts.length === 0) {
          const { error: createError } = await supabase
            .from('stock_alerts')
            .insert([{
              product_id: productId,
              current_stock: product.stock,
              threshold: settings.lowStockThreshold,
              status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }]);
          
          if (createError) throw createError;
          
          // If auto-reorder is enabled, create a reorder
          if (settings.autoReorder) {
            await this.createReorder(productId, settings.reorderQuantity);
          }
        }
      }
    } catch (error) {
      console.error('Error checking low stock alert:', error);
      throw error;
    }
  },

  async createReorder(productId: string, quantity: number): Promise<void> {
    try {
      // In a real app, this would create a reorder in your system
      console.log(`Auto-reordering ${quantity} units of product ${productId}`);
      
      // For now, we'll just log it
      const { error } = await supabase
        .from('reorders')
        .insert([{
          product_id: productId,
          quantity,
          status: 'pending',
          created_at: new Date().toISOString()
        }]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error creating reorder:', error);
      throw error;
    }
  }
};