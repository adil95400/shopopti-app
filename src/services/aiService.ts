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
        model: "gpt-3.5-turbo",
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
        model: "gpt-3.5-turbo",
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
        model: "gpt-3.5-turbo",
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
        model: "gpt-3.5-turbo",
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
  },

  async optimizeForSEO({
    title,
    description,
    category
  }: {
    title: string;
    description: string;
    category: string;
  }): Promise<{
    title: string;
    description: string;
    keywords: string[];
    metaTitle: string;
    metaDescription: string;
  }> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an SEO expert specializing in e-commerce."
          },
          {
            role: "user",
            content: `Optimize this product for SEO:
                     Title: ${title}
                     Description: ${description}
                     Category: ${category}
                     
                     Return a JSON with:
                     - optimized title
                     - optimized description
                     - keywords array
                     - meta title (max 60 chars)
                     - meta description (max 160 chars)`
          }
        ]
      });

      const content = completion.choices[0].message.content || "{}";
      return JSON.parse(content);
    } catch (error) {
      console.error('Error optimizing for SEO:', error);
      throw new Error('Failed to optimize for SEO');
    }
  },

  async generateBlogContent({
    title,
    keywords,
    type,
    targetAudience,
    tone,
    wordCount,
    structure
  }: {
    title: string;
    keywords: string[];
    type: string;
    targetAudience: string;
    tone: string;
    wordCount: number;
    structure: string[];
  }): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a professional content writer specializing in ${type} articles with a ${tone} tone.`
          },
          {
            role: "user",
            content: `Write a blog post about: ${title}
                     Keywords: ${keywords.join(', ')}
                     Target audience: ${targetAudience}
                     Structure: ${structure.join(', ')}
                     Approximate word count: ${wordCount}
                     Make it engaging, informative, and SEO-friendly.`
          }
        ]
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error('Error generating blog content:', error);
      throw new Error('Failed to generate blog content');
    }
  },

  async generateHashtags({
    product,
    platform,
    count
  }: {
    product: string;
    platform: string;
    count: number;
  }): Promise<string[]> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a social media expert specializing in ${platform} marketing.`
          },
          {
            role: "user",
            content: `Generate ${count} effective hashtags for this product: ${product}
                     Platform: ${platform}
                     Return only the hashtags as a comma-separated list without the # symbol.`
          }
        ]
      });

      const content = completion.choices[0].message.content || '';
      return content.split(',').map(tag => tag.trim());
    } catch (error) {
      console.error('Error generating hashtags:', error);
      return [];
    }
  },

  async analyzeSentiment(text: string): Promise<'positive' | 'negative' | 'neutral'> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Analyze the sentiment of the following text and respond with only 'positive', 'negative', or 'neutral'."
          },
          {
            role: "user",
            content: text
          }
        ]
      });

      const sentiment = completion.choices[0].message.content?.toLowerCase().trim() || 'neutral';
      
      if (sentiment.includes('positive')) return 'positive';
      if (sentiment.includes('negative')) return 'negative';
      return 'neutral';
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return 'neutral';
    }
  },

  async generateResponse({
    review,
    rating,
    sentiment,
    verified
  }: {
    review: string;
    rating: number;
    sentiment?: 'positive' | 'negative' | 'neutral';
    verified?: boolean;
  }): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional customer service representative. Generate a response to this customer review."
          },
          {
            role: "user",
            content: `Customer review: "${review}"
                     Rating: ${rating}/5
                     Sentiment: ${sentiment || 'unknown'}
                     Verified purchase: ${verified ? 'Yes' : 'No'}
                     
                     Write a professional, empathetic response that addresses the customer's feedback.
                     If positive, express gratitude.
                     If negative, apologize and offer a solution.
                     Keep it concise and authentic.`
          }
        ]
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error('Error generating response:', error);
      return 'Merci pour votre avis. Nous apprécions vos commentaires.';
    }
  },

  async analyzeCampaignPerformance({
    campaign,
    metrics,
    goals
  }: {
    campaign: any;
    metrics: {
      reach: number;
      engagement: number;
      conversions: number;
      revenue: number;
    };
    goals: any;
  }): Promise<{
    metrics: {
      reach: number;
      engagement: number;
      conversions: number;
      revenue: number;
    };
    insights: string[];
    recommendations: string[];
  }> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a marketing analytics expert. Analyze this campaign performance data."
          },
          {
            role: "user",
            content: `Campaign: ${JSON.stringify(campaign)}
                     Metrics: ${JSON.stringify(metrics)}
                     Goals: ${JSON.stringify(goals)}
                     
                     Provide insights and recommendations based on this data.
                     Return a JSON with:
                     - metrics (the same metrics passed in)
                     - insights (array of strings)
                     - recommendations (array of strings)`
          }
        ]
      });

      const content = completion.choices[0].message.content || "{}";
      return JSON.parse(content);
    } catch (error) {
      console.error('Error analyzing campaign performance:', error);
      return {
        metrics,
        insights: ['Analyse non disponible en ce moment.'],
        recommendations: ['Réessayez plus tard.']
      };
    }
  }
};