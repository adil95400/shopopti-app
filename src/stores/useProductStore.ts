import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  status: 'active' | 'draft' | 'archived';
  inventory: number;
  variants?: ProductVariant[];
  category: string;
  supplier_id?: string;
  created_at: string;
  updated_at: string;
}

interface ProductVariant {
  id: string;
  title: string;
  price: number;
  inventory: number;
  sku: string;
  options: Record<string, string>;
}

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string;
    category: string;
    minPrice: number;
    maxPrice: number;
    search: string;
  };
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setFilter: (key: string, value: any) => void;
  resetFilters: () => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  filters: {
    status: 'active',
    category: '',
    minPrice: 0,
    maxPrice: 1000000,
    search: ''
  },

  fetchProducts: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ products: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: async (product) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        products: [data, ...state.products]
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProduct: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        products: state.products.map(p => p.id === id ? data : p)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        products: state.products.filter(p => p.id !== id)
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
        status: 'active',
        category: '',
        minPrice: 0,
        maxPrice: 1000000,
        search: ''
      }
    });
  }
}));