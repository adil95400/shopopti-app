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
  }
};