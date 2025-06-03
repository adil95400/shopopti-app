import { supabase } from '../../lib/supabase';
import axios from 'axios';

export interface ShopifyConnection {
  id?: string;
  userId: string;
  shopDomain: string;
  accessToken: string;
  scopes: string[];
  isActive: boolean;
  lastSynced?: Date;
}

export interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  variants: ShopifyVariant[];
  images: ShopifyImage[];
  tags: string;
}

export interface ShopifyVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  sku: string;
  position: number;
  inventory_quantity: number;
  option1: string | null;
  option2: string | null;
  option3: string | null;
}

export interface ShopifyImage {
  id: number;
  product_id: number;
  position: number;
  src: string;
  width: number;
  height: number;
}

export interface ShopifyOrder {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  processed_at: string;
  total_price: string;
  subtotal_price: string;
  total_tax: string;
  currency: string;
  financial_status: string;
  fulfillment_status: string | null;
  customer: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  line_items: {
    id: number;
    variant_id: number;
    title: string;
    quantity: number;
    price: string;
    sku: string;
  }[];
  shipping_address: {
    first_name: string;
    last_name: string;
    address1: string;
    address2: string | null;
    city: string;
    province: string;
    country: string;
    zip: string;
    phone: string;
  };
}

export interface SyncOptions {
  products?: boolean;
  orders?: boolean;
  customers?: boolean;
  since?: Date;
}

export const shopifyService = {
  async getConnection(userId: string): Promise<ShopifyConnection | null> {
    try {
      const { data, error } = await supabase
        .from('store_connections')
        .select('*')
        .eq('user_id', userId)
        .eq('platform', 'shopify')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No connection found
        }
        throw error;
      }
      
      return {
        id: data.id,
        userId: data.user_id,
        shopDomain: data.store_url,
        accessToken: data.api_key,
        scopes: data.scopes || [],
        isActive: data.status === 'active',
        lastSynced: data.last_sync ? new Date(data.last_sync) : undefined
      };
    } catch (error) {
      console.error('Error fetching Shopify connection:', error);
      throw error;
    }
  },

  async createConnection(connection: Omit<ShopifyConnection, 'id' | 'lastSynced'>): Promise<ShopifyConnection> {
    try {
      // Validate the connection by making a test API call
      await this.testConnection(connection.shopDomain, connection.accessToken);
      
      const { data, error } = await supabase
        .from('store_connections')
        .insert([{
          user_id: connection.userId,
          platform: 'shopify',
          store_url: connection.shopDomain,
          api_key: connection.accessToken,
          scopes: connection.scopes,
          status: connection.isActive ? 'active' : 'inactive',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        userId: data.user_id,
        shopDomain: data.store_url,
        accessToken: data.api_key,
        scopes: data.scopes || [],
        isActive: data.status === 'active'
      };
    } catch (error) {
      console.error('Error creating Shopify connection:', error);
      throw error;
    }
  },

  async testConnection(shopDomain: string, accessToken: string): Promise<boolean> {
    try {
      const response = await axios.get(`https://${shopDomain}/admin/api/2024-01/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        }
      });
      
      return response.status === 200;
    } catch (error) {
      console.error('Error testing Shopify connection:', error);
      throw new Error('Failed to connect to Shopify. Please check your credentials.');
    }
  },

  async syncProducts(connection: ShopifyConnection, since?: Date): Promise<number> {
    try {
      let url = `https://${connection.shopDomain}/admin/api/2024-01/products.json?limit=250`;
      
      if (since) {
        url += `&updated_at_min=${since.toISOString()}`;
      }
      
      const response = await axios.get(url, {
        headers: {
          'X-Shopify-Access-Token': connection.accessToken,
          'Content-Type': 'application/json'
        }
      });
      
      const shopifyProducts: ShopifyProduct[] = response.data.products;
      
      // Process products in batches
      const batchSize = 50;
      let processedCount = 0;
      
      for (let i = 0; i < shopifyProducts.length; i += batchSize) {
        const batch = shopifyProducts.slice(i, i + batchSize);
        
        // Transform Shopify products to our product format
        const products = batch.map(product => ({
          external_id: product.id.toString(),
          external_source: 'shopify',
          title: product.title,
          description: product.body_html,
          price: parseFloat(product.variants[0].price),
          stock: product.variants[0].inventory_quantity,
          category: product.product_type,
          vendor: product.vendor,
          images: product.images.map(img => img.src),
          variants: product.variants.length > 1 ? JSON.stringify(product.variants) : null,
          tags: product.tags,
          is_published: !!product.published_at,
          created_at: new Date(product.created_at).toISOString(),
          updated_at: new Date(product.updated_at).toISOString()
        }));
        
        // Upsert products to our database
        const { error } = await supabase
          .from('products')
          .upsert(products, {
            onConflict: 'external_id',
            ignoreDuplicates: false
          });
        
        if (error) throw error;
        
        processedCount += batch.length;
      }
      
      // Update last synced timestamp
      if (connection.id) {
        const { error } = await supabase
          .from('store_connections')
          .update({
            last_sync: new Date().toISOString()
          })
          .eq('id', connection.id);
        
        if (error) throw error;
      }
      
      return processedCount;
    } catch (error) {
      console.error('Error syncing Shopify products:', error);
      throw error;
    }
  },

  async syncOrders(connection: ShopifyConnection, since?: Date): Promise<number> {
    try {
      let url = `https://${connection.shopDomain}/admin/api/2024-01/orders.json?limit=250&status=any`;
      
      if (since) {
        url += `&updated_at_min=${since.toISOString()}`;
      }
      
      const response = await axios.get(url, {
        headers: {
          'X-Shopify-Access-Token': connection.accessToken,
          'Content-Type': 'application/json'
        }
      });
      
      const shopifyOrders: ShopifyOrder[] = response.data.orders;
      
      // Process orders in batches
      const batchSize = 50;
      let processedCount = 0;
      
      for (let i = 0; i < shopifyOrders.length; i += batchSize) {
        const batch = shopifyOrders.slice(i, i + batchSize);
        
        // Transform Shopify orders to our order format
        const orders = batch.map(order => ({
          external_id: order.id.toString(),
          external_source: 'shopify',
          order_number: order.name,
          customer_email: order.email,
          customer_name: `${order.customer.first_name} ${order.customer.last_name}`,
          total_price: parseFloat(order.total_price),
          subtotal_price: parseFloat(order.subtotal_price),
          total_tax: parseFloat(order.total_tax),
          currency: order.currency,
          financial_status: order.financial_status,
          fulfillment_status: order.fulfillment_status || 'unfulfilled',
          items: JSON.stringify(order.line_items),
          shipping_address: JSON.stringify(order.shipping_address),
          created_at: new Date(order.created_at).toISOString(),
          updated_at: new Date(order.updated_at).toISOString()
        }));
        
        // Upsert orders to our database
        const { error } = await supabase
          .from('orders')
          .upsert(orders, {
            onConflict: 'external_id',
            ignoreDuplicates: false
          });
        
        if (error) throw error;
        
        processedCount += batch.length;
      }
      
      // Update last synced timestamp
      if (connection.id) {
        const { error } = await supabase
          .from('store_connections')
          .update({
            last_sync: new Date().toISOString()
          })
          .eq('id', connection.id);
        
        if (error) throw error;
      }
      
      return processedCount;
    } catch (error) {
      console.error('Error syncing Shopify orders:', error);
      throw error;
    }
  },

  async syncAll(connection: ShopifyConnection, options: SyncOptions = {}): Promise<{
    products: number;
    orders: number;
  }> {
    const results = {
      products: 0,
      orders: 0
    };
    
    try {
      if (options.products !== false) {
        results.products = await this.syncProducts(connection, options.since);
      }
      
      if (options.orders !== false) {
        results.orders = await this.syncOrders(connection, options.since);
      }
      
      return results;
    } catch (error) {
      console.error('Error syncing Shopify data:', error);
      throw error;
    }
  },

  async createProduct(connection: ShopifyConnection, product: {
    title: string;
    description: string;
    price: number;
    images: string[];
    variants?: any[];
    tags?: string[];
    productType?: string;
    vendor?: string;
  }): Promise<ShopifyProduct> {
    try {
      const shopifyProduct = {
        product: {
          title: product.title,
          body_html: product.description,
          vendor: product.vendor || 'Shopopti+',
          product_type: product.productType || '',
          tags: product.tags?.join(', ') || '',
          variants: product.variants || [
            {
              price: product.price.toString(),
              inventory_management: 'shopify',
              inventory_quantity: 100,
              requires_shipping: true
            }
          ],
          images: product.images.map(src => ({ src }))
        }
      };
      
      const response = await axios.post(
        `https://${connection.shopDomain}/admin/api/2024-01/products.json`,
        shopifyProduct,
        {
          headers: {
            'X-Shopify-Access-Token': connection.accessToken,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.product;
    } catch (error) {
      console.error('Error creating Shopify product:', error);
      throw error;
    }
  },

  async updateProduct(connection: ShopifyConnection, productId: number, updates: Partial<{
    title: string;
    description: string;
    price: number;
    images: string[];
    variants: any[];
    tags: string[];
    productType: string;
    vendor: string;
  }>): Promise<ShopifyProduct> {
    try {
      const shopifyProduct: any = { product: {} };
      
      if (updates.title) shopifyProduct.product.title = updates.title;
      if (updates.description) shopifyProduct.product.body_html = updates.description;
      if (updates.vendor) shopifyProduct.product.vendor = updates.vendor;
      if (updates.productType) shopifyProduct.product.product_type = updates.productType;
      if (updates.tags) shopifyProduct.product.tags = updates.tags.join(', ');
      if (updates.images) shopifyProduct.product.images = updates.images.map(src => ({ src }));
      
      // If price is updated, we need to update the variants
      if (updates.price && !updates.variants) {
        // First, get the current product to get the variant IDs
        const currentProduct = await this.getProduct(connection, productId);
        
        shopifyProduct.product.variants = currentProduct.variants.map(variant => ({
          id: variant.id,
          price: updates.price?.toString()
        }));
      } else if (updates.variants) {
        shopifyProduct.product.variants = updates.variants;
      }
      
      const response = await axios.put(
        `https://${connection.shopDomain}/admin/api/2024-01/products/${productId}.json`,
        shopifyProduct,
        {
          headers: {
            'X-Shopify-Access-Token': connection.accessToken,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.product;
    } catch (error) {
      console.error('Error updating Shopify product:', error);
      throw error;
    }
  },

  async getProduct(connection: ShopifyConnection, productId: number): Promise<ShopifyProduct> {
    try {
      const response = await axios.get(
        `https://${connection.shopDomain}/admin/api/2024-01/products/${productId}.json`,
        {
          headers: {
            'X-Shopify-Access-Token': connection.accessToken,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.product;
    } catch (error) {
      console.error('Error fetching Shopify product:', error);
      throw error;
    }
  },

  async deleteProduct(connection: ShopifyConnection, productId: number): Promise<void> {
    try {
      await axios.delete(
        `https://${connection.shopDomain}/admin/api/2024-01/products/${productId}.json`,
        {
          headers: {
            'X-Shopify-Access-Token': connection.accessToken,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error deleting Shopify product:', error);
      throw error;
    }
  },

  async getOrder(connection: ShopifyConnection, orderId: number): Promise<ShopifyOrder> {
    try {
      const response = await axios.get(
        `https://${connection.shopDomain}/admin/api/2024-01/orders/${orderId}.json`,
        {
          headers: {
            'X-Shopify-Access-Token': connection.accessToken,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.order;
    } catch (error) {
      console.error('Error fetching Shopify order:', error);
      throw error;
    }
  },

  async fulfillOrder(connection: ShopifyConnection, orderId: number, fulfillment: {
    trackingNumber?: string;
    trackingCompany?: string;
    notifyCustomer?: boolean;
  }): Promise<void> {
    try {
      // First, get the order to get the line items
      const order = await this.getOrder(connection, orderId);
      
      // Create the fulfillment
      await axios.post(
        `https://${connection.shopDomain}/admin/api/2024-01/orders/${orderId}/fulfillments.json`,
        {
          fulfillment: {
            line_items: order.line_items.map(item => ({
              id: item.id,
              quantity: item.quantity
            })),
            tracking_number: fulfillment.trackingNumber,
            tracking_company: fulfillment.trackingCompany,
            notify_customer: fulfillment.notifyCustomer !== false
          }
        },
        {
          headers: {
            'X-Shopify-Access-Token': connection.accessToken,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error fulfilling Shopify order:', error);
      throw error;
    }
  }
};