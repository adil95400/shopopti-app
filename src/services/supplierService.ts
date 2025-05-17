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

export interface SupplierProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  msrp?: number;
  moq: number;
  processing_time: string;
  images: string[];
  category: string;
  variants?: {
    name: string;
    price: number;
    moq: number;
  }[];
  customization?: {
    available: boolean;
    options?: string[];
    min_quantity?: number;
  };
  certifications?: string[];
  specifications?: Record<string, string>;
  shipping_methods?: {
    name: string;
    price: number;
    estimated_days: number;
  }[];
}

export interface SupplierFilter {
  country?: string;
  category?: string;
  verified?: boolean;
  minRating?: number;
  processingTime?: string;
  minOrderValue?: number;
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
      if (filters?.processingTime) {
        query = query.eq('processing_time', filters.processingTime);
      }
      if (filters?.minOrderValue) {
        query = query.gte('minimum_order', filters.minOrderValue);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
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
      console.error('Error fetching supplier products:', error);
      throw error;
    }
  },

  async getSupplierDetails(supplierId: string) {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select(`
          *,
          supplier_ratings (
            rating,
            review,
            created_at
          ),
          supplier_certifications (
            name,
            issuer,
            valid_until
          )
        `)
        .eq('id', supplierId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching supplier details:', error);
      throw error;
    }
  },

  async rateSupplier(supplierId: string, rating: number, review?: string) {
    try {
      const { data, error } = await supabase
        .from('supplier_ratings')
        .insert({
          supplier_id: supplierId,
          rating,
          review
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error rating supplier:', error);
      throw error;
    }
  }
};