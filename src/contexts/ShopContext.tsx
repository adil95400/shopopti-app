// ✅ ShopContext avec gestion des stores connectés (Shopify / Woo)
import { createContext, useContext, useState, ReactNode } from 'react';

type StoreType = 'shopify' | 'woocommerce';

interface ShopContextType {
  storeId: string | null;
  storeType: StoreType | null;
  connectStore: (id: string, type: StoreType) => void;
  disconnectStore: () => void;
  stats: { products: number; orders: number };
  setStats: (s: { products: number; orders: number }) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeType, setStoreType] = useState<StoreType | null>(null);
  const [stats, setStats] = useState({ products: 0, orders: 0 });

  const connectStore = (id: string, type: StoreType) => {
    setStoreId(id);
    setStoreType(type);
  };

  const disconnectStore = () => {
    setStoreId(null);
    setStoreType(null);
    setStats({ products: 0, orders: 0 });
  };

  return (
    <ShopContext.Provider value={{ storeId, storeType, connectStore, disconnectStore, stats, setStats }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};