import { create } from 'zustand';
import { Supplier, SupplierProduct, supplierService } from '../services/supplierService';

interface SupplierState {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  products: SupplierProduct[];
  isLoading: boolean;
  error: string | null;
  filters: {
    country: string;
    category: string;
    verified: boolean;
    minRating: number;
  };
  fetchSuppliers: () => Promise<void>;
  fetchSupplierProducts: (supplierId: string) => Promise<void>;
  setFilter: (key: string, value: any) => void;
  resetFilters: () => void;
  selectSupplier: (supplier: Supplier | null) => void;
}

export const useSupplierStore = create<SupplierState>((set, get) => ({
  suppliers: [],
  selectedSupplier: null,
  products: [],
  isLoading: false,
  error: null,
  filters: {
    country: '',
    category: '',
    verified: false,
    minRating: 0
  },
  fetchSuppliers: async () => {
    try {
      set({ isLoading: true, error: null });
      const suppliers = await supplierService.getSuppliers(get().filters);
      set({ suppliers });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchSupplierProducts: async (supplierId: string) => {
    try {
      set({ isLoading: true, error: null });
      const products = await supplierService.getSupplierProducts(supplierId);
      set({ products });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  setFilter: (key: string, value: any) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value }
    }));
  },
  resetFilters: () => {
    set({
      filters: {
        country: '',
        category: '',
        verified: false,
        minRating: 0
      }
    });
  },
  selectSupplier: (supplier: Supplier | null) => {
    set({ selectedSupplier: supplier });
    if (supplier) {
      get().fetchSupplierProducts(supplier.id);
    }
  }
}));