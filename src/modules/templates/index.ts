import { supabase } from '../../lib/supabase';
import { aiService } from '../ai';

export interface Template {
  id?: string;
  name: string;
  description?: string;
  type: 'product' | 'landing' | 'email' | 'blog' | 'social';
  content: string;
  thumbnail?: string;
  tags: string[];
  isPublic: boolean;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'image' | 'number' | 'boolean' | 'color' | 'select';
  defaultValue?: any;
  options?: string[]; // For select type
  required: boolean;
  description?: string;
}

export const templateService = {
  async getTemplates(filters?: {
    type?: 'product' | 'landing' | 'email' | 'blog' | 'social';
    tags?: string[];
    isPublic?: boolean;
    createdBy?: string;
  }): Promise<Template[]> {
    try {
      let query = supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      
      if (filters?.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
      }
      
      if (filters?.isPublic !== undefined) {
        query = query.eq('is_public', filters.isPublic);
      }
      
      if (filters?.createdBy) {
        query = query.eq('created_by', filters.createdBy);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data || []).map(template => ({
        id: template.id,
        name: template.name,
        description: template.description,
        type: template.type,
        content: template.content,
        thumbnail: template.thumbnail,
        tags: template.tags,
        isPublic: template.is_public,
        createdBy: template.created_by,
        createdAt: new Date(template.created_at),
        updatedAt: new Date(template.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  },

  async getTemplate(id: string): Promise<Template> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        type: data.type,
        content: data.content,
        thumbnail: data.thumbnail,
        tags: data.tags,
        isPublic: data.is_public,
        createdBy: data.created_by,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  },

  async createTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .insert([{
          name: template.name,
          description: template.description,
          type: template.type,
          content: template.content,
          thumbnail: template.thumbnail,
          tags: template.tags,
          is_public: template.isPublic,
          created_by: template.createdBy,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        type: data.type,
        content: data.content,
        thumbnail: data.thumbnail,
        tags: data.tags,
        isPublic: data.is_public,
        createdBy: data.created_by,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  async updateTemplate(id: string, updates: Partial<Omit<Template, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Template> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      if (updates.name) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.type) updateData.type = updates.type;
      if (updates.content) updateData.content = updates.content;
      if (updates.thumbnail !== undefined) updateData.thumbnail = updates.thumbnail;
      if (updates.tags) updateData.tags = updates.tags;
      if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic;
      
      const { data, error } = await supabase
        .from('templates')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        type: data.type,
        content: data.content,
        thumbnail: data.thumbnail,
        tags: data.tags,
        isPublic: data.is_public,
        createdBy: data.created_by,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  },

  async deleteTemplate(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  },

  async generateTemplateWithAI(params: {
    type: 'product' | 'landing' | 'email' | 'blog' | 'social';
    name: string;
    description?: string;
    product?: {
      title: string;
      description: string;
      price: number;
      features: string[];
      images: string[];
    };
    style?: 'minimal' | 'modern' | 'luxury' | 'playful';
    tone?: 'professional' | 'casual' | 'enthusiastic' | 'technical';
  }): Promise<Template> {
    try {
      let prompt = '';
      let content = '';
      
      switch (params.type) {
        case 'product':
          prompt = `
            Create an HTML template for a product page with the following details:
            Product: ${params.product?.title}
            Description: ${params.product?.description}
            Price: ${params.product?.price}
            Features: ${params.product?.features?.join(', ')}
            Style: ${params.style || 'modern'}
            
            The template should include:
            - A responsive layout with Tailwind CSS
            - Product image gallery
            - Add to cart button
            - Product details section
            - Related products section
            - Customer reviews section
            
            Return only the HTML code without any explanation.
          `;
          break;
          
        case 'landing':
          prompt = `
            Create an HTML template for a landing page with the following details:
            Product: ${params.product?.title}
            Description: ${params.product?.description}
            Style: ${params.style || 'modern'}
            Tone: ${params.tone || 'professional'}
            
            The template should include:
            - A responsive layout with Tailwind CSS
            - Hero section with headline and call to action
            - Features section
            - Benefits section
            - Testimonials section
            - FAQ section
            - Call to action section
            
            Return only the HTML code without any explanation.
          `;
          break;
          
        case 'email':
          prompt = `
            Create an HTML email template with the following details:
            Subject: ${params.name}
            Description: ${params.description}
            Style: ${params.style || 'modern'}
            Tone: ${params.tone || 'professional'}
            
            The template should include:
            - A responsive layout that works in email clients
            - Header with logo
            - Main content section
            - Call to action button
            - Footer with unsubscribe link
            
            Return only the HTML code without any explanation.
          `;
          break;
          
        case 'blog':
          prompt = `
            Create an HTML template for a blog post with the following details:
            Title: ${params.name}
            Description: ${params.description}
            Style: ${params.style || 'modern'}
            Tone: ${params.tone || 'professional'}
            
            The template should include:
            - A responsive layout with Tailwind CSS
            - Header with featured image
            - Article content with proper typography
            - Author section
            - Related posts section
            - Comments section
            
            Return only the HTML code without any explanation.
          `;
          break;
          
        case 'social':
          prompt = `
            Create HTML and CSS for a social media post template with the following details:
            Title: ${params.name}
            Description: ${params.description}
            Style: ${params.style || 'modern'}
            Tone: ${params.tone || 'professional'}
            
            The template should include:
            - A responsive layout with Tailwind CSS
            - Image container
            - Text overlay
            - Call to action button
            
            Return only the HTML code without any explanation.
          `;
          break;
      }
      
      // Generate content using AI
      content = await aiService.generateBlogContent({
        title: params.name,
        keywords: [],
        type: params.type,
        targetAudience: 'e-commerce businesses',
        tone: params.tone || 'professional',
        wordCount: 500,
        structure: []
      });
      
      // Create the template
      return this.createTemplate({
        name: params.name,
        description: params.description,
        type: params.type,
        content,
        tags: [params.type, params.style || 'modern', params.tone || 'professional'],
        isPublic: false,
        createdBy: 'ai'
      });
    } catch (error) {
      console.error('Error generating template with AI:', error);
      throw error;
    }
  },

  async renderTemplate(templateId: string, variables: Record<string, any>): Promise<string> {
    try {
      // Get the template
      const template = await this.getTemplate(templateId);
      
      // Simple template rendering with variable substitution
      let renderedContent = template.content;
      
      // Replace variables in the format {{variable_name}}
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        renderedContent = renderedContent.replace(regex, String(value));
      });
      
      return renderedContent;
    } catch (error) {
      console.error('Error rendering template:', error);
      throw error;
    }
  }
};