import { supabase } from '../lib/supabase';

export interface Supplier {
  id: string;
  name: string;
  country: string;
  categories: string[];
  products_count: number;
  rating: number;
  processing_time: string;
  shipping_time: string;
  minimum_order: number;
  verified: boolean;
  logo?: string;
  description?: string;
  contact?: {
    email: string;
    phone?: string;
    website?: string;
  };
  shipping_methods?: {
    name: string;
    price: number;
    estimated_days: number;
  }[];
  payment_methods?: string[];
  certifications?: string[];
  performance?: {
    on_time_delivery: number;
    quality_rating: number;
    response_rate: number;
    response_time: string;
  };
  dropshipping_program?: {
    available: boolean;
    fees?: number;
    minimum_requirements?: string[];
    benefits?: string[];
  };
}

export interface SupplierFilter {
  country?: string;
  category?: string;
  verified?: boolean;
  minRating?: number;
}

export const supplierService = {
  async getDropshippingSuppliers(filters?: SupplierFilter) {
    try {
      let query = supabase
        .from('suppliers')
        .select('*');

      if (filters?.country) {
        query = query.eq('country', filters.country);
      }
      if (filters?.category) {
        query = query.contains('categories', [filters.category]);
      }
      if (filters?.verified !== undefined) {
        query = query.eq('verified', filters.verified);
      }
      if (filters?.minRating !== undefined) {
        query = query.gte('rating', filters.minRating);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des fournisseurs:', error);
      throw error;
    }
  },

  async getSupplierProducts(supplierId: string) {
    try {
      const { data, error } = await supabase
        .from('supplier_products')
        .select('*')
        .eq('supplier_id', supplierId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits du fournisseur:', error);
      throw error;
    }
  }
};