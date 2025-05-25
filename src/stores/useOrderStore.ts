import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    address: string;
  };
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  product_id: string;
  variant_id?: string;
  quantity: number;
  price: number;
  title: string;
}

interface OrderStore {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string;
    dateRange: [Date | null, Date | null];
    search: string;
  };
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  addTrackingNumber: (id: string, tracking: string) => Promise<void>;
  setFilter: (key: string, value: any) => void;
  resetFilters: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,
  filters: {
    status: '',
    dateRange: [null, null],
    search: ''
  },

  fetchOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ orders: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        orders: state.orders.map(o => o.id === id ? data : o)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addTrackingNumber: async (id, tracking) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          tracking_number: tracking,
          status: 'shipped'
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        orders: state.orders.map(o => o.id === id ? data : o)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  setFilter: (key, value) => {
    set(state => ({
      filters: { ...state.filters, [key]: value }
    }));
  },

  resetFilters: () => {
    set({
      filters: {
        status: '',
        dateRange: [null, null],
        search: ''
      }
    });
  }
}));