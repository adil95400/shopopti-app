import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const aiService = {
  async generateProductDescription(product: {
    title: string;
    category: string;
    features: string[];
    targetAudience?: string;
    style?: 'professional' | 'casual' | 'luxury' | 'technical';
  }): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a professional e-commerce copywriter specializing in ${product.style || 'professional'} product descriptions.
                     Target audience: ${product.targetAudience || 'general'}`
          },
          {
            role: "user",
            content: `Write a compelling product description for: ${product.title} 
                     Category: ${product.category}
                     Key features: ${product.features.join(', ')}
                     Make it engaging, SEO-friendly, and highlight the value proposition.`
          }
        ]
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error('Error generating description:', error);
      throw error;
    }
  },

  async optimizeProductTitle(title: string, {
    category,
    keywords,
    maxLength = 70
  }: {
    category: string;
    keywords?: string[];
    maxLength?: number;
  }): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an SEO expert specializing in e-commerce product titles."
          },
          {
            role: "user",
            content: `Optimize this product title for SEO and conversions:
                     Title: ${title}
                     Category: ${category}
                     Target keywords: ${keywords?.join(', ') || 'none provided'}
                     Maximum length: ${maxLength} characters
                     Make it clear, compelling, and keyword-rich while maintaining readability.`
          }
        ]
      });

      return completion.choices[0].message.content || title;
    } catch (error) {
      console.error('Error optimizing title:', error);
      throw error;
    }
  },

  async optimizeProduct(product: {
    name: string;
    description: string;
    category: string;
  }): Promise<{
    title: string;
    description_html: string;
    tags: string[];
  }> {
    try {
      // Optimize the title
      const optimizedTitle = await this.optimizeProductTitle(product.name, {
        category: product.category
      });

      // Generate enhanced description with HTML formatting
      const descriptionCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an e-commerce content expert. Format the description in HTML with proper tags for structure and emphasis."
          },
          {
            role: "user",
            content: `Enhance this product description with HTML formatting:
                     Product: ${product.name}
                     Category: ${product.category}
                     Current description: ${product.description}`
          }
        ]
      });

      // Generate relevant tags
      const tagsCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Generate relevant SEO tags for this product. Return only comma-separated tags."
          },
          {
            role: "user",
            content: `Product: ${product.name}
                     Category: ${product.category}
                     Description: ${product.description}`
          }
        ]
      });

      const tags = tagsCompletion.choices[0].message.content?.split(',').map(tag => tag.trim()) || [];

      return {
        title: optimizedTitle,
        description_html: descriptionCompletion.choices[0].message.content || product.description,
        tags
      };
    } catch (error) {
      console.error('Error optimizing product:', error);
      throw error;
    }
  }
};