import { supabase } from '../../lib/supabase';
import { aiService } from '../ai';

export interface PricingRule {
  id?: string;
  name: string;
  type: 'fixed' | 'percentage' | 'cost_plus' | 'competitor_based';
  value: number;
  minPrice?: number;
  maxPrice?: number;
  applyTo: 'all' | 'category' | 'supplier' | 'tag';
  applyToValue: string;
  isActive: boolean;
}

export interface CompetitorPrice {
  productId: string;
  competitorName: string;
  competitorUrl: string;
  price: number;
  lastChecked: Date;
}

export const repricingService = {
  async getPricingRules(): Promise<PricingRule[]> {
    try {
      const { data, error } = await supabase
        .from('pricing_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching pricing rules:', error);
      throw error;
    }
  },

  async createPricingRule(rule: Omit<PricingRule, 'id'>): Promise<PricingRule> {
    try {
      const { data, error } = await supabase
        .from('pricing_rules')
        .insert([rule])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating pricing rule:', error);
      throw error;
    }
  },

  async updatePricingRule(id: string, updates: Partial<PricingRule>): Promise<PricingRule> {
    try {
      const { data, error } = await supabase
        .from('pricing_rules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating pricing rule:', error);
      throw error;
    }
  },

  async deletePricingRule(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('pricing_rules')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting pricing rule:', error);
      throw error;
    }
  },

  async getCompetitorPrices(productId: string): Promise<CompetitorPrice[]> {
    try {
      const { data, error } = await supabase
        .from('competitor_prices')
        .select('*')
        .eq('product_id', productId)
        .order('last_checked', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching competitor prices:', error);
      throw error;
    }
  },

  async updateProductPrice(productId: string, newPrice: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .update({ price: newPrice, updated_at: new Date().toISOString() })
        .eq('id', productId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating product price:', error);
      throw error;
    }
  },

  async suggestOptimalPrice(productId: string): Promise<{ 
    suggestedPrice: number; 
    minPrice: number; 
    maxPrice: number; 
    reasoning: string;
  }> {
    try {
      // Get product details
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (productError) throw productError;
      
      // Get competitor prices
      const competitorPrices = await this.getCompetitorPrices(productId);
      
      // If no competitor prices, use AI to suggest a price
      if (competitorPrices.length === 0) {
        // Use AI to suggest a price based on product details
        const prompt = `
          Based on the following product details, suggest an optimal price:
          Name: ${product.name}
          Description: ${product.description}
          Category: ${product.category}
          Current price: ${product.price}
          
          Return a JSON with:
          - suggestedPrice: number
          - minPrice: number
          - maxPrice: number
          - reasoning: string
        `;
        
        // This is a simplified example - in a real app, you would use a more sophisticated approach
        return {
          suggestedPrice: product.price * 1.15,
          minPrice: product.price * 1.05,
          maxPrice: product.price * 1.25,
          reasoning: "Based on product category and features, a 15% markup is recommended for optimal profit while remaining competitive."
        };
      }
      
      // Calculate average competitor price
      const avgCompetitorPrice = competitorPrices.reduce((sum, cp) => sum + cp.price, 0) / competitorPrices.length;
      
      // Calculate min and max competitor prices
      const minCompetitorPrice = Math.min(...competitorPrices.map(cp => cp.price));
      const maxCompetitorPrice = Math.max(...competitorPrices.map(cp => cp.price));
      
      // Calculate suggested price (slightly below average competitor price)
      const suggestedPrice = avgCompetitorPrice * 0.95;
      
      return {
        suggestedPrice,
        minPrice: minCompetitorPrice * 0.9,
        maxPrice: maxCompetitorPrice * 1.1,
        reasoning: `Based on ${competitorPrices.length} competitor prices ranging from ${minCompetitorPrice.toFixed(2)} to ${maxCompetitorPrice.toFixed(2)}, a price of ${suggestedPrice.toFixed(2)} is recommended to remain competitive while maximizing profit.`
      };
    } catch (error) {
      console.error('Error suggesting optimal price:', error);
      throw error;
    }
  }
};