import { supabase } from '../lib/supabase';
import axios from 'axios';
import { ExternalSupplier, SupplierProduct, ImportFilter, ImportResult, OrderRequest, OrderResult } from '../types/supplier';

export const supplierService = {
  async getSuppliers(): Promise<ExternalSupplier[]> {
    try {
      const { data, error } = await supabase
        .from('external_suppliers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  },

  async getSupplierById(id: string): Promise<ExternalSupplier> {
    try {
      const { data, error } = await supabase
        .from('external_suppliers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching supplier with ID ${id}:`, error);
      throw error;
    }
  },

  async createSupplier(supplier: Omit<ExternalSupplier, 'id' | 'created_at'>): Promise<ExternalSupplier> {
    try {
      // Validate the supplier connection before saving
      await this.testConnection(supplier);
      
      const { data, error } = await supabase
        .from('external_suppliers')
        .insert([{
          ...supplier,
          status: 'active',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  },

  async updateSupplier(id: string, updates: Partial<ExternalSupplier>): Promise<ExternalSupplier> {
    try {
      const { data, error } = await supabase
        .from('external_suppliers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error updating supplier with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteSupplier(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('external_suppliers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error(`Error deleting supplier with ID ${id}:`, error);
      throw error;
    }
  },

  async testConnection(supplier: Omit<ExternalSupplier, 'id' | 'created_at' | 'status'>): Promise<boolean> {
    try {
      // Call the appropriate API endpoint based on supplier type
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/providers/test`;
      
      const response = await axios.post(apiUrl, {
        type: supplier.type,
        apiKey: supplier.apiKey,
        apiSecret: supplier.apiSecret,
        baseUrl: supplier.baseUrl
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      
      return response.data.success;
    } catch (error) {
      console.error('Error testing supplier connection:', error);
      throw error;
    }
  },

  async getProducts(supplierId: string, filters: ImportFilter = {}): Promise<SupplierProduct[]> {
    try {
      // Get the supplier details first
      const supplier = await this.getSupplierById(supplierId);
      
      // Call the appropriate API endpoint based on supplier type
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/providers/${supplier.type}`;
      
      const response = await axios.post(apiUrl, {
        supplierId,
        apiKey: supplier.apiKey,
        apiSecret: supplier.apiSecret,
        baseUrl: supplier.baseUrl,
        filters
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      
      return response.data.products;
    } catch (error) {
      console.error('Error fetching products from supplier:', error);
      throw error;
    }
  },

  async getProductById(supplierId: string, productId: string): Promise<SupplierProduct> {
    try {
      // Get the supplier details first
      const supplier = await this.getSupplierById(supplierId);
      
      // Call the appropriate API endpoint based on supplier type
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/providers/${supplier.type}`;
      
      const response = await axios.post(apiUrl, {
        supplierId,
        apiKey: supplier.apiKey,
        apiSecret: supplier.apiSecret,
        baseUrl: supplier.baseUrl,
        productId
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      
      if (!response.data.product) {
        throw new Error(`Product ${productId} not found`);
      }
      
      return response.data.product;
    } catch (error) {
      console.error(`Error fetching product ${productId} from supplier ${supplierId}:`, error);
      throw error;
    }
  },

  async getProductsByIds(supplierId: string, productIds: string[]): Promise<SupplierProduct[]> {
    try {
      // Get the supplier details first
      const supplier = await this.getSupplierById(supplierId);
      
      // Call the appropriate API endpoint based on supplier type
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/providers/${supplier.type}`;
      
      const response = await axios.post(apiUrl, {
        supplierId,
        apiKey: supplier.apiKey,
        apiSecret: supplier.apiSecret,
        baseUrl: supplier.baseUrl,
        productIds
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      
      return response.data.products;
    } catch (error) {
      console.error(`Error fetching products from supplier ${supplierId}:`, error);
      throw error;
    }
  },

  async getCategories(supplierId: string): Promise<any[]> {
    try {
      // Get the supplier details first
      const supplier = await this.getSupplierById(supplierId);
      
      // Call the appropriate API endpoint based on supplier type
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/providers/${supplier.type}/categories`;
      
      const response = await axios.post(apiUrl, {
        supplierId,
        apiKey: supplier.apiKey,
        apiSecret: supplier.apiSecret,
        baseUrl: supplier.baseUrl
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      
      return response.data.categories;
    } catch (error) {
      console.error('Error fetching categories from supplier:', error);
      throw error;
    }
  },

  async importProducts(supplierId: string, productIds: string[]): Promise<ImportResult> {
    try {
      // Get the supplier details first
      const supplier = await this.getSupplierById(supplierId);
      
      // Call the appropriate API endpoint based on supplier type
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/providers/import`;
      
      const response = await axios.post(apiUrl, {
        supplierId,
        apiKey: supplier.apiKey,
        apiSecret: supplier.apiSecret,
        baseUrl: supplier.baseUrl,
        productIds
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error importing products from supplier:', error);
      throw error;
    }
  },

  async importToShopify(products: SupplierProduct[]): Promise<ImportResult> {
    try {
      // Call the Shopify import endpoint
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/shopify/import`;
      
      const response = await axios.post(apiUrl, {
        products
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error importing products to Shopify:', error);
      throw error;
    }
  },

  async createOrder(supplierId: string, orderData: OrderRequest): Promise<OrderResult> {
    try {
      // Get the supplier details first
      const supplier = await this.getSupplierById(supplierId);
      
      // Call the appropriate API endpoint based on supplier type
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/providers/${supplier.type}/orders`;
      
      const response = await axios.post(apiUrl, {
        supplierId,
        apiKey: supplier.apiKey,
        apiSecret: supplier.apiSecret,
        baseUrl: supplier.baseUrl,
        order: orderData
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating order with supplier:', error);
      throw error;
    }
  },

  async getOrderStatus(supplierId: string, externalOrderId: string): Promise<{
    status: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
  }> {
    try {
      // Get the supplier details first
      const supplier = await this.getSupplierById(supplierId);
      
      // Call the appropriate API endpoint based on supplier type
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/providers/${supplier.type}/orders/${externalOrderId}`;
      
      const response = await axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting order status from supplier:', error);
      throw error;
    }
  }
};