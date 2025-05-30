import { createContext, useContext, useState, ReactNode } from 'react';

type StoreType = 'shopify' | 'woocommerce';

interface ShopContextType {
  storeId: string | null;
  storeType: StoreType | null;
  isConnected: boolean;
  store: {
    name: string;
    url: string;
    platform: StoreType;
    status: string;
  } | null;
  connectShopify: (url: string, accessToken: string) => Promise<boolean>;
  connectWooCommerce: (url: string, consumerKey: string, consumerSecret: string) => Promise<boolean>;
  disconnectStore: () => void;
  stats: { products: number; orders: number };
  setStats: (s: { products: number; orders: number }) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeType, setStoreType] = useState<StoreType | null>(null);
  const [store, setStore] = useState<ShopContextType['store']>(null);
  const [stats, setStats] = useState({ products: 0, orders: 0 });

  const connectShopify = async (url: string, accessToken: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStoreId('shopify-1');
    setStoreType('shopify');
    setStore({
      name: 'My Shopify Store',
      url: url,
      platform: 'shopify',
      status: 'active'
    });
    
    return true;
  };

  const connectWooCommerce = async (url: string, consumerKey: string, consumerSecret: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStoreId('woo-1');
    setStoreType('woocommerce');
    setStore({
      name: 'My WooCommerce Store',
      url: url,
      platform: 'woocommerce',
      status: 'active'
    });
    
    return true;
  };

  const disconnectStore = () => {
    setStoreId(null);
    setStoreType(null);
    setStore(null);
    setStats({ products: 0, orders: 0 });
  };

  return (
    <ShopContext.Provider 
      value={{ 
        storeId, 
        storeType, 
        isConnected: !!storeId, 
        store, 
        connectShopify, 
        connectWooCommerce, 
        disconnectStore,
        stats,
        setStats
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};