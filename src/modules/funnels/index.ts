import { supabase } from '../../lib/supabase';

export interface Funnel {
  id?: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  steps: FunnelStep[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FunnelStep {
  id?: string;
  funnelId?: string;
  name: string;
  type: 'landing' | 'product' | 'upsell' | 'downsell' | 'checkout' | 'thank_you';
  content: {
    title: string;
    description?: string;
    imageUrl?: string;
    buttonText?: string;
    productId?: string;
    price?: number;
    template?: string;
    customHtml?: string;
    customCss?: string;
  };
  settings: {
    showHeader: boolean;
    showFooter: boolean;
    redirectUrl?: string;
    timerEnabled?: boolean;
    timerDuration?: number;
  };
  position: number;
  nextSteps: {
    default?: string;
    conditions?: {
      condition: string;
      value: any;
      nextStepId: string;
    }[];
  };
}

export interface FunnelStats {
  views: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  averageOrderValue: number;
  stepStats: {
    stepId: string;
    views: number;
    conversions: number;
    conversionRate: number;
    dropOff: number;
  }[];
}

export const funnelService = {
  async getFunnels(): Promise<Funnel[]> {
    try {
      const { data, error } = await supabase
        .from('funnels')
        .select('*, funnel_steps(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(funnel => ({
        id: funnel.id,
        name: funnel.name,
        description: funnel.description,
        status: funnel.status,
        steps: funnel.funnel_steps.map((step: any) => ({
          id: step.id,
          funnelId: step.funnel_id,
          name: step.name,
          type: step.type,
          content: step.content,
          settings: step.settings,
          position: step.position,
          nextSteps: step.next_steps
        })).sort((a: any, b: any) => a.position - b.position),
        createdAt: new Date(funnel.created_at),
        updatedAt: new Date(funnel.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching funnels:', error);
      throw error;
    }
  },

  async getFunnel(id: string): Promise<Funnel> {
    try {
      const { data, error } = await supabase
        .from('funnels')
        .select('*, funnel_steps(*)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status,
        steps: data.funnel_steps.map((step: any) => ({
          id: step.id,
          funnelId: step.funnel_id,
          name: step.name,
          type: step.type,
          content: step.content,
          settings: step.settings,
          position: step.position,
          nextSteps: step.next_steps
        })).sort((a: any, b: any) => a.position - b.position),
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error fetching funnel:', error);
      throw error;
    }
  },

  async createFunnel(funnel: Omit<Funnel, 'id' | 'createdAt' | 'updatedAt'>): Promise<Funnel> {
    try {
      // Insert the funnel
      const { data, error } = await supabase
        .from('funnels')
        .insert([{
          name: funnel.name,
          description: funnel.description,
          status: funnel.status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Insert funnel steps
      const steps = funnel.steps.map((step, index) => ({
        funnel_id: data.id,
        name: step.name,
        type: step.type,
        content: step.content,
        settings: step.settings,
        position: step.position || index,
        next_steps: step.nextSteps
      }));
      
      if (steps.length > 0) {
        const { error: stepsError } = await supabase
          .from('funnel_steps')
          .insert(steps);
        
        if (stepsError) throw stepsError;
      }
      
      // Get the complete funnel with steps
      return this.getFunnel(data.id);
    } catch (error) {
      console.error('Error creating funnel:', error);
      throw error;
    }
  },

  async updateFunnel(id: string, updates: Partial<Omit<Funnel, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Funnel> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      if (updates.name) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.status) updateData.status = updates.status;
      
      const { error } = await supabase
        .from('funnels')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      // If steps are provided, update them
      if (updates.steps) {
        // First, delete existing steps
        const { error: deleteError } = await supabase
          .from('funnel_steps')
          .delete()
          .eq('funnel_id', id);
        
        if (deleteError) throw deleteError;
        
        // Then, insert new steps
        const steps = updates.steps.map((step, index) => ({
          funnel_id: id,
          name: step.name,
          type: step.type,
          content: step.content,
          settings: step.settings,
          position: step.position || index,
          next_steps: step.nextSteps
        }));
        
        if (steps.length > 0) {
          const { error: stepsError } = await supabase
            .from('funnel_steps')
            .insert(steps);
          
          if (stepsError) throw stepsError;
        }
      }
      
      // Get the updated funnel
      return this.getFunnel(id);
    } catch (error) {
      console.error('Error updating funnel:', error);
      throw error;
    }
  },

  async deleteFunnel(id: string): Promise<void> {
    try {
      // Delete funnel steps first (due to foreign key constraint)
      const { error: stepsError } = await supabase
        .from('funnel_steps')
        .delete()
        .eq('funnel_id', id);
      
      if (stepsError) throw stepsError;
      
      // Then delete the funnel
      const { error } = await supabase
        .from('funnels')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting funnel:', error);
      throw error;
    }
  },

  async getFunnelStats(id: string, period?: { start: Date; end: Date }): Promise<FunnelStats> {
    try {
      let query = supabase
        .from('funnel_analytics')
        .select('*')
        .eq('funnel_id', id);
      
      if (period) {
        query = query
          .gte('timestamp', period.start.toISOString())
          .lte('timestamp', period.end.toISOString());
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Get the funnel to get step information
      const funnel = await this.getFunnel(id);
      
      // Calculate stats
      const views = data.filter(entry => entry.event_type === 'view').length;
      const conversions = data.filter(entry => entry.event_type === 'conversion').length;
      const conversionRate = views > 0 ? (conversions / views) * 100 : 0;
      
      // Calculate revenue
      const revenue = data
        .filter(entry => entry.event_type === 'conversion')
        .reduce((sum, entry) => sum + (entry.revenue || 0), 0);
      
      // Calculate average order value
      const averageOrderValue = conversions > 0 ? revenue / conversions : 0;
      
      // Calculate step stats
      const stepStats = funnel.steps.map(step => {
        const stepViews = data.filter(entry => entry.step_id === step.id && entry.event_type === 'view').length;
        const stepConversions = data.filter(entry => entry.step_id === step.id && entry.event_type === 'conversion').length;
        const stepConversionRate = stepViews > 0 ? (stepConversions / stepViews) * 100 : 0;
        
        // Calculate drop-off (percentage of users who viewed this step but didn't proceed to the next step)
        const nextStepId = step.nextSteps.default;
        let dropOff = 0;
        
        if (nextStepId) {
          const nextStepViews = data.filter(entry => entry.step_id === nextStepId && entry.event_type === 'view').length;
          dropOff = stepViews > 0 ? ((stepViews - nextStepViews) / stepViews) * 100 : 0;
        }
        
        return {
          stepId: step.id!,
          views: stepViews,
          conversions: stepConversions,
          conversionRate: stepConversionRate,
          dropOff
        };
      });
      
      return {
        views,
        conversions,
        conversionRate,
        revenue,
        averageOrderValue,
        stepStats
      };
    } catch (error) {
      console.error('Error fetching funnel stats:', error);
      throw error;
    }
  },

  async trackFunnelEvent(event: {
    funnelId: string;
    stepId: string;
    userId?: string;
    sessionId: string;
    eventType: 'view' | 'conversion' | 'click' | 'exit';
    revenue?: number;
    metadata?: Record<string, any>;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('funnel_analytics')
        .insert([{
          funnel_id: event.funnelId,
          step_id: event.stepId,
          user_id: event.userId,
          session_id: event.sessionId,
          event_type: event.eventType,
          revenue: event.revenue,
          metadata: event.metadata,
          timestamp: new Date().toISOString()
        }]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error tracking funnel event:', error);
      throw error;
    }
  }
};