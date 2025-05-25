import { create } from 'zustand';

interface StoreConnection {
  id: string;
  platform: 'shopify' | 'woocommerce';
  name: string;
  url: string;
  accessToken: string;
  isConnected: boolean;
}

interface StoreState {
  store: StoreConnection | null;
  isLoading: boolean;
  error: string | null;
  connectShopify: (url: string, accessToken: string) => Promise<void>;
  connectWooCommerce: (url: string, consumerKey: string, consumerSecret: string) => Promise<void>;
  disconnectStore: () => void;
}

export const useStoreStore = create<StoreState>((set) => ({
  store: null,
  isLoading: false,
  error: null,
  connectShopify: async (url: string, accessToken: string) => {
    try {
      set({ isLoading: true, error: null });
      // TODO: Implement Shopify API connection
      set({
        store: {
          id: '1',
          platform: 'shopify',
          name: 'My Shopify Store',
          url,
          accessToken,
          isConnected: true
        }
      });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  connectWooCommerce: async (url: string, consumerKey: string, consumerSecret: string) => {
    try {
      set({ isLoading: true, error: null });
      // TODO: Implement WooCommerce API connection
      set({
        store: {
          id: '2',
          platform: 'woocommerce',
          name: 'My WooCommerce Store',
          url,
          accessToken: `${consumerKey}:${consumerSecret}`,
          isConnected: true
        }
      });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  disconnectStore: () => {
    set({ store: null });
  }
}));