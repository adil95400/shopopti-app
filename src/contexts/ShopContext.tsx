import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StoreConnection {
  id: string;
  platform: 'shopify' | 'woocommerce';
  name: string;
  url: string;
  status: 'active' | 'inactive' | 'pending';
  connected_at: string;
}

interface ShopStats {
  total_products: number;
  total_orders: number;
  revenue_today: number;
  revenue_month: number;
}

interface ShopContextType {
  store: StoreConnection | null;
  isConnected: boolean;
  stats: ShopStats;
  connectShopify: (shop_url: string, api_key: string) => Promise<boolean>;
  connectWooCommerce: (shop_url: string, consumer_key: string, consumer_secret: string) => Promise<boolean>;
  disconnectStore: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [store, setStore] = useState<StoreConnection | null>(() => {
    const savedStore = localStorage.getItem('store');
    return savedStore ? JSON.parse(savedStore) : null;
  });

  const [stats, setStats] = useState<ShopStats>({
    total_products: 0,
    total_orders: 0,
    revenue_today: 0,
    revenue_month: 0
  });

  const connectShopify = async (shop_url: string, api_key: string): Promise<boolean> => {
    try {
      if (shop_url && api_key) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        const newStore: StoreConnection = {
          id: '1',
          platform: 'shopify',
          name: 'Ma Boutique Shopify',
          url: shop_url,
          status: 'active',
          connected_at: new Date().toISOString()
        };
        
        localStorage.setItem('store', JSON.stringify(newStore));
        setStore(newStore);
        
        setStats({
          total_products: 24,
          total_orders: 18,
          revenue_today: 349.99,
          revenue_month: 2879.50
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Shopify connection error:', error);
      return false;
    }
  };

  const connectWooCommerce = async (
    shop_url: string, 
    consumer_key: string, 
    consumer_secret: string
  ): Promise<boolean> => {
    try {
      if (shop_url && consumer_key && consumer_secret) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        const newStore: StoreConnection = {
          id: '1',
          platform: 'woocommerce',
          name: 'Ma Boutique WooCommerce',
          url: shop_url,
          status: 'active',
          connected_at: new Date().toISOString()
        };
        
        localStorage.setItem('store', JSON.stringify(newStore));
        setStore(newStore);
        
        setStats({
          total_products: 32,
          total_orders: 15,
          revenue_today: 425.50,
          revenue_month: 3150.75
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('WooCommerce connection error:', error);
      return false;
    }
  };

  const disconnectStore = () => {
    localStorage.removeItem('store');
    setStore(null);
    setStats({
      total_products: 0,
      total_orders: 0,
      revenue_today: 0,
      revenue_month: 0
    });
  };

  return (
    <ShopContext.Provider 
      value={{ 
        store, 
        isConnected: !!store, 
        stats,
        connectShopify, 
        connectWooCommerce, 
        disconnectStore 
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShopContext = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShopContext must be used within a ShopProvider');
  }
  return context;
};