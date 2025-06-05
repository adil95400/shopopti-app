import { supabase } from '../lib/supabase';

export interface B2BSupplier {
  id: string;
  name: string;
  country: string;
  category: string;
  delivery_delay: string;
  min_order: number;
  verified: boolean;
  rating: number;
  description: string;
  contact_email: string;
  website: string;
  logo_url: string;
  created_at: string;
  updated_at?: string;
}

export interface B2BProduct {
  id: string;
  supplier_id: string;
  name: string;
  description: string;
  price: number;
  min_quantity: number;
  discount_tiers: {
    quantity: number;
    discount_percent: number;
  }[];
  stock: number;
  images: string[];
  category: string;
  specifications: Record<string, string>;
  created_at: string;
}

export const b2bService = {
  async getSuppliers(filters?: {
    country?: string;
    category?: string;
    verified?: boolean;
    search?: string;
  }): Promise<B2BSupplier[]> {
    try {
      let query = supabase.from('b2b_suppliers').select('*');

      if (filters?.country) {
        query = query.eq('country', filters.country);
      }
      
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters?.verified !== undefined) {
        query = query.eq('verified', filters.verified);
      }
      
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('rating', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching B2B suppliers:', error);
      throw error;
    }
  },

  async getSupplierById(id: string): Promise<B2BSupplier | null> {
    try {
      const { data, error } = await supabase
        .from('b2b_suppliers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching B2B supplier with ID ${id}:`, error);
      throw error;
    }
  },

  async getProducts(filters?: {
    supplier_id?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    search?: string;
  }): Promise<B2BProduct[]> {
    try {
      let query = supabase.from('b2b_products').select('*');

      if (filters?.supplier_id) {
        query = query.eq('supplier_id', filters.supplier_id);
      }
      
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters?.min_price !== undefined) {
        query = query.gte('price', filters.min_price);
      }
      
      if (filters?.max_price !== undefined) {
        query = query.lte('price', filters.max_price);
      }
      
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching B2B products:', error);
      throw error;
    }
  },

  async getProductById(id: string): Promise<B2BProduct | null> {
    try {
      const { data, error } = await supabase
        .from('b2b_products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching B2B product with ID ${id}:`, error);
      throw error;
    }
  },

  async requestQuote(request: {
    supplier_id: string;
    product_ids: string[];
    quantity: number;
    message: string;
    contact_email: string;
    contact_name: string;
  }): Promise<{ id: string }> {
    try {
      const { data, error } = await supabase
        .from('b2b_quote_requests')
        .insert([request])
        .select('id')
        .single();
      
      if (error) throw error;
      return { id: data.id };
    } catch (error) {
      console.error('Error submitting quote request:', error);
      throw error;
    }
  },

  async getCountries(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('b2b_suppliers')
        .select('country')
        .order('country');
      
      if (error) throw error;
      
      // Extract unique countries
      const countries = [...new Set(data?.map(item => item.country))];
      return countries;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('b2b_suppliers')
        .select('category')
        .order('category');
      
      if (error) throw error;
      
      // Extract unique categories
      const categories = [...new Set(data?.map(item => item.category))];
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
};