import { useState } from 'react';
import { aiService } from '../../../services/aiService';

export interface OptimizationOptions {
  title?: boolean;
  description?: boolean;
  seo?: boolean;
  tags?: boolean;
  pricing?: boolean;
}

export function useAiOptimization() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const optimizeProduct = async (
    product: {
      name: string;
      description: string;
      category?: string;
      price?: number;
    },
    options: OptimizationOptions = {
      title: true,
      description: true,
      seo: true,
      tags: true,
      pricing: false
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const optimized: any = {};

      // Only perform optimizations that are enabled
      if (options.title || options.description || options.seo) {
        const result = await aiService.optimizeProduct({
          name: product.name,
          description: product.description,
          category: product.category || ''
        });

        if (options.title) optimized.title = result.title;
        if (options.description) optimized.description = result.description_html;
        if (options.tags) optimized.tags = result.tags;
      }

      // SEO optimization
      if (options.seo) {
        const seoData = await aiService.optimizeForSEO({
          title: optimized.title || product.name,
          description: optimized.description || product.description,
          category: product.category || ''
        });

        optimized.seo = {
          metaTitle: seoData.metaTitle,
          metaDescription: seoData.metaDescription,
          keywords: seoData.keywords
        };
      }

      // Price optimization
      if (options.pricing && product.price) {
        // Simple price optimization logic - in a real app this would be more sophisticated
        optimized.price = Math.round(product.price * 1.15 * 100) / 100;
      }

      return optimized;
    } catch (error) {
      setError(error.message || 'Failed to optimize product');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    optimizeProduct,
    loading,
    error
  };
}