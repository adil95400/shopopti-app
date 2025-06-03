import { supabase } from '../../lib/supabase';

export interface ABTest {
  id?: string;
  name: string;
  description?: string;
  status: 'draft' | 'running' | 'completed' | 'archived';
  startDate?: Date;
  endDate?: Date;
  targetAudience?: 'all' | 'new_visitors' | 'returning_visitors' | 'specific_segment';
  audienceSegmentId?: string;
  variants: ABTestVariant[];
  winningVariantId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ABTestVariant {
  id?: string;
  testId?: string;
  name: string;
  type: 'product_title' | 'product_description' | 'product_price' | 'product_image' | 'landing_page' | 'email_subject' | 'email_content' | 'custom';
  content: any;
  trafficAllocation: number; // Percentage (0-100)
}

export interface ABTestResult {
  testId: string;
  variantId: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  clickThroughRate: number;
  conversionRate: number;
  averageOrderValue: number;
}

export const abTestingService = {
  async getTests(filters?: {
    status?: 'draft' | 'running' | 'completed' | 'archived';
    type?: string;
  }): Promise<ABTest[]> {
    try {
      let query = supabase
        .from('ab_tests')
        .select('*, ab_test_variants(*)')
        .order('created_at', { ascending: false });
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.type) {
        query = query.eq('ab_test_variants.type', filters.type);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data || []).map(test => ({
        id: test.id,
        name: test.name,
        description: test.description,
        status: test.status,
        startDate: test.start_date ? new Date(test.start_date) : undefined,
        endDate: test.end_date ? new Date(test.end_date) : undefined,
        targetAudience: test.target_audience,
        audienceSegmentId: test.audience_segment_id,
        variants: test.ab_test_variants.map((variant: any) => ({
          id: variant.id,
          testId: variant.test_id,
          name: variant.name,
          type: variant.type,
          content: variant.content,
          trafficAllocation: variant.traffic_allocation
        })),
        winningVariantId: test.winning_variant_id,
        createdAt: new Date(test.created_at),
        updatedAt: new Date(test.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching AB tests:', error);
      throw error;
    }
  },

  async getTest(id: string): Promise<ABTest> {
    try {
      const { data, error } = await supabase
        .from('ab_tests')
        .select('*, ab_test_variants(*)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status,
        startDate: data.start_date ? new Date(data.start_date) : undefined,
        endDate: data.end_date ? new Date(data.end_date) : undefined,
        targetAudience: data.target_audience,
        audienceSegmentId: data.audience_segment_id,
        variants: data.ab_test_variants.map((variant: any) => ({
          id: variant.id,
          testId: variant.test_id,
          name: variant.name,
          type: variant.type,
          content: variant.content,
          trafficAllocation: variant.traffic_allocation
        })),
        winningVariantId: data.winning_variant_id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error fetching AB test:', error);
      throw error;
    }
  },

  async createTest(test: Omit<ABTest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ABTest> {
    try {
      // Validate that traffic allocations sum to 100%
      const totalAllocation = test.variants.reduce((sum, variant) => sum + variant.trafficAllocation, 0);
      if (Math.abs(totalAllocation - 100) > 0.01) {
        throw new Error('Traffic allocations must sum to 100%');
      }
      
      // Insert the test
      const { data, error } = await supabase
        .from('ab_tests')
        .insert([{
          name: test.name,
          description: test.description,
          status: test.status,
          start_date: test.startDate?.toISOString(),
          end_date: test.endDate?.toISOString(),
          target_audience: test.targetAudience,
          audience_segment_id: test.audienceSegmentId,
          winning_variant_id: test.winningVariantId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Insert variants
      const variants = test.variants.map(variant => ({
        test_id: data.id,
        name: variant.name,
        type: variant.type,
        content: variant.content,
        traffic_allocation: variant.trafficAllocation
      }));
      
      const { error: variantsError } = await supabase
        .from('ab_test_variants')
        .insert(variants);
      
      if (variantsError) throw variantsError;
      
      // Get the complete test with variants
      return this.getTest(data.id);
    } catch (error) {
      console.error('Error creating AB test:', error);
      throw error;
    }
  },

  async updateTest(id: string, updates: Partial<Omit<ABTest, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ABTest> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      if (updates.name) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.status) updateData.status = updates.status;
      if (updates.startDate) updateData.start_date = updates.startDate.toISOString();
      if (updates.endDate) updateData.end_date = updates.endDate.toISOString();
      if (updates.targetAudience) updateData.target_audience = updates.targetAudience;
      if (updates.audienceSegmentId !== undefined) updateData.audience_segment_id = updates.audienceSegmentId;
      if (updates.winningVariantId !== undefined) updateData.winning_variant_id = updates.winningVariantId;
      
      const { error } = await supabase
        .from('ab_tests')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      // If variants are provided, update them
      if (updates.variants) {
        // Validate that traffic allocations sum to 100%
        const totalAllocation = updates.variants.reduce((sum, variant) => sum + variant.trafficAllocation, 0);
        if (Math.abs(totalAllocation - 100) > 0.01) {
          throw new Error('Traffic allocations must sum to 100%');
        }
        
        // First, delete existing variants
        const { error: deleteError } = await supabase
          .from('ab_test_variants')
          .delete()
          .eq('test_id', id);
        
        if (deleteError) throw deleteError;
        
        // Then, insert new variants
        const variants = updates.variants.map(variant => ({
          test_id: id,
          name: variant.name,
          type: variant.type,
          content: variant.content,
          traffic_allocation: variant.trafficAllocation
        }));
        
        const { error: variantsError } = await supabase
          .from('ab_test_variants')
          .insert(variants);
        
        if (variantsError) throw variantsError;
      }
      
      // Get the updated test
      return this.getTest(id);
    } catch (error) {
      console.error('Error updating AB test:', error);
      throw error;
    }
  },

  async deleteTest(id: string): Promise<void> {
    try {
      // Delete variants first (due to foreign key constraint)
      const { error: variantsError } = await supabase
        .from('ab_test_variants')
        .delete()
        .eq('test_id', id);
      
      if (variantsError) throw variantsError;
      
      // Then delete the test
      const { error } = await supabase
        .from('ab_tests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting AB test:', error);
      throw error;
    }
  },

  async startTest(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('ab_tests')
        .update({
          status: 'running',
          start_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error starting AB test:', error);
      throw error;
    }
  },

  async stopTest(id: string, winningVariantId?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('ab_tests')
        .update({
          status: 'completed',
          end_date: new Date().toISOString(),
          winning_variant_id: winningVariantId,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error stopping AB test:', error);
      throw error;
    }
  },

  async getTestResults(id: string): Promise<ABTestResult[]> {
    try {
      // Get the test to get variant information
      const test = await this.getTest(id);
      
      // Get analytics data
      const { data, error } = await supabase
        .from('ab_test_analytics')
        .select('*')
        .eq('test_id', id);
      
      if (error) throw error;
      
      // Calculate results for each variant
      return test.variants.map(variant => {
        const variantData = data.filter(entry => entry.variant_id === variant.id);
        
        const impressions = variantData.filter(entry => entry.event_type === 'impression').length;
        const clicks = variantData.filter(entry => entry.event_type === 'click').length;
        const conversions = variantData.filter(entry => entry.event_type === 'conversion').length;
        
        const revenue = variantData
          .filter(entry => entry.event_type === 'conversion')
          .reduce((sum, entry) => sum + (entry.revenue || 0), 0);
        
        const clickThroughRate = impressions > 0 ? (clicks / impressions) * 100 : 0;
        const conversionRate = impressions > 0 ? (conversions / impressions) * 100 : 0;
        const averageOrderValue = conversions > 0 ? revenue / conversions : 0;
        
        return {
          testId: id,
          variantId: variant.id!,
          impressions,
          clicks,
          conversions,
          revenue,
          clickThroughRate,
          conversionRate,
          averageOrderValue
        };
      });
    } catch (error) {
      console.error('Error getting AB test results:', error);
      throw error;
    }
  },

  async trackTestEvent(event: {
    testId: string;
    variantId: string;
    userId?: string;
    sessionId: string;
    eventType: 'impression' | 'click' | 'conversion';
    revenue?: number;
    metadata?: Record<string, any>;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('ab_test_analytics')
        .insert([{
          test_id: event.testId,
          variant_id: event.variantId,
          user_id: event.userId,
          session_id: event.sessionId,
          event_type: event.eventType,
          revenue: event.revenue,
          metadata: event.metadata,
          timestamp: new Date().toISOString()
        }]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error tracking AB test event:', error);
      throw error;
    }
  },

  async getVariantForUser(testId: string, userId: string): Promise<ABTestVariant> {
    try {
      // Check if the user has already been assigned a variant
      const { data: existingAssignment, error: assignmentError } = await supabase
        .from('ab_test_assignments')
        .select('variant_id')
        .eq('test_id', testId)
        .eq('user_id', userId)
        .single();
      
      if (!assignmentError && existingAssignment) {
        // User already has an assignment, get the variant
        const { data: variant, error: variantError } = await supabase
          .from('ab_test_variants')
          .select('*')
          .eq('id', existingAssignment.variant_id)
          .single();
        
        if (variantError) throw variantError;
        
        return {
          id: variant.id,
          testId: variant.test_id,
          name: variant.name,
          type: variant.type,
          content: variant.content,
          trafficAllocation: variant.traffic_allocation
        };
      }
      
      // User doesn't have an assignment yet, get the test and variants
      const test = await this.getTest(testId);
      
      if (test.status !== 'running') {
        throw new Error('Test is not running');
      }
      
      // Assign a variant based on traffic allocation
      const random = Math.random() * 100;
      let cumulativeAllocation = 0;
      let selectedVariant: ABTestVariant | null = null;
      
      for (const variant of test.variants) {
        cumulativeAllocation += variant.trafficAllocation;
        if (random <= cumulativeAllocation) {
          selectedVariant = variant;
          break;
        }
      }
      
      if (!selectedVariant) {
        // Fallback to the first variant if something went wrong
        selectedVariant = test.variants[0];
      }
      
      // Save the assignment
      const { error } = await supabase
        .from('ab_test_assignments')
        .insert([{
          test_id: testId,
          user_id: userId,
          variant_id: selectedVariant.id,
          created_at: new Date().toISOString()
        }]);
      
      if (error) throw error;
      
      return selectedVariant;
    } catch (error) {
      console.error('Error getting variant for user:', error);
      throw error;
    }
  }
};