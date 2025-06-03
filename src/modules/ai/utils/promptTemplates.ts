/**
 * Collection of prompt templates for different AI tasks
 */

export const promptTemplates = {
  productDescription: (product: {
    title: string;
    category: string;
    features: string[];
    targetAudience?: string;
    style?: 'professional' | 'casual' | 'luxury' | 'technical';
  }) => `
Write a compelling product description for: ${product.title} 
Category: ${product.category}
Key features: ${product.features.join(', ')}
Target audience: ${product.targetAudience || 'general'}
Style: ${product.style || 'professional'}

Make it engaging, SEO-friendly, and highlight the value proposition.
`,

  seoOptimization: (content: {
    title: string;
    description: string;
    category: string;
  }) => `
Optimize this product for SEO:
Title: ${content.title}
Description: ${content.description}
Category: ${content.category}

Return a JSON with:
- optimized title (max 60 chars)
- optimized description (max 160 chars)
- keywords array (5-10 relevant keywords)
- meta title
- meta description
`,

  blogPost: (topic: {
    title: string;
    keywords: string[];
    type: string;
    targetAudience: string;
    tone: string;
    wordCount: number;
  }) => `
Write a blog post about: ${topic.title}
Keywords: ${topic.keywords.join(', ')}
Type: ${topic.type}
Target audience: ${topic.targetAudience}
Tone: ${topic.tone}
Word count: approximately ${topic.wordCount}

Make it engaging, informative, and SEO-friendly.
`,

  socialMediaPost: (product: {
    name: string;
    description: string;
    price: number;
    platform: string;
  }) => `
Create a social media post for ${product.platform} about:
Product: ${product.name}
Price: $${product.price}
Description: ${product.description}

Make it engaging, concise, and include a call to action.
`
};