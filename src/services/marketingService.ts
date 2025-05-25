import { supabase } from '../lib/supabase';
import { aiService } from './aiService';
import { canvaService } from './canvaService';

export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  author: string;
  publishDate: string;
  status: 'draft' | 'published' | 'scheduled';
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  featuredImage?: string;
  readTime?: number;
}

export interface SocialMediaPost {
  id?: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  content: string;
  images?: string[];
  scheduledFor?: string;
  status: 'draft' | 'scheduled' | 'published';
  productId?: string;
  campaignId?: string;
  hashtags?: string[];
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface MarketingCampaign {
  id?: string;
  name: string;
  type: 'product_launch' | 'sale' | 'seasonal' | 'brand';
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed';
  budget?: number;
  targets: {
    audience: string[];
    platforms: string[];
    goals: {
      reach?: number;
      conversions?: number;
      revenue?: number;
    };
  };
  content: {
    blogPosts?: string[];
    socialPosts?: string[];
    emailTemplates?: string[];
  };
  results?: {
    reach: number;
    engagement: number;
    conversions: number;
    revenue: number;
  };
}

export const marketingService = {
  async generateBlogPost(topic: {
    title: string;
    keywords: string[];
    type: 'how_to' | 'product_review' | 'industry_news' | 'buying_guide';
    targetAudience: string;
    tone: 'professional' | 'casual' | 'technical';
    wordCount: number;
  }): Promise<BlogPost> {
    try {
      const content = await aiService.generateBlogContent({
        ...topic,
        structure: [
          'introduction',
          'main_points',
          'examples',
          'conclusion'
        ]
      });

      const seoOptimized = await aiService.optimizeForSEO({
        title: topic.title,
        content,
        keywords: topic.keywords
      });

      const slug = topic.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      return {
        title: seoOptimized.title,
        content: seoOptimized.content,
        excerpt: seoOptimized.excerpt,
        slug,
        author: 'AI Content Team',
        publishDate: new Date().toISOString(),
        status: 'draft',
        tags: topic.keywords,
        seoTitle: seoOptimized.seoTitle,
        seoDescription: seoOptimized.seoDescription,
        readTime: Math.ceil(content.split(' ').length / 200)
      };
    } catch (error) {
      console.error('Failed to generate blog post:', error);
      throw error;
    }
  },

  async generateSocialMediaCampaign(campaign: {
    product: {
      title: string;
      description: string;
      price: number;
      images: string[];
      features: string[];
    };
    platforms: ('facebook' | 'instagram' | 'twitter' | 'linkedin')[];
    duration: number;
    postsPerPlatform: number;
    style: 'professional' | 'casual' | 'luxury';
  }): Promise<SocialMediaPost[]> {
    try {
      const posts: SocialMediaPost[] = [];

      for (const platform of campaign.platforms) {
        for (let i = 0; i < campaign.postsPerPlatform; i++) {
          const content = await aiService.generateSocialMediaPost({
            ...campaign.product,
            platform,
            style: campaign.style
          });

          const image = await canvaService.createSocialMediaPost({
            title: campaign.product.title,
            description: content,
            price: campaign.product.price,
            images: campaign.product.images,
            platform,
            style: campaign.style
          });

          posts.push({
            platform,
            content,
            images: [image],
            status: 'draft',
            hashtags: await aiService.generateHashtags({
              product: campaign.product.title,
              platform,
              count: platform === 'instagram' ? 25 : 5
            })
          });
        }
      }

      return posts;
    } catch (error) {
      console.error('Failed to generate social media campaign:', error);
      throw error;
    }
  },

  async createMarketingCampaign(campaign: Omit<MarketingCampaign, 'id'>): Promise<MarketingCampaign> {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .insert(campaign)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create marketing campaign:', error);
      throw error;
    }
  },

  async scheduleSocialPosts(posts: SocialMediaPost[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('social_media_posts')
        .insert(posts);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to schedule social posts:', error);
      throw error;
    }
  },

  async publishBlogPost(post: BlogPost): Promise<void> {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert(post);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to publish blog post:', error);
      throw error;
    }
  },

  async analyzeCampaignPerformance(campaignId: string): Promise<{
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
      const { data: campaign } = await supabase
        .from('marketing_campaigns')
        .select('*, blog_posts(*), social_media_posts(*)')
        .eq('id', campaignId)
        .single();

      const analysis = await aiService.analyzeCampaignPerformance({
        campaign,
        metrics: {
          reach: campaign.results?.reach || 0,
          engagement: campaign.results?.engagement || 0,
          conversions: campaign.results?.conversions || 0,
          revenue: campaign.results?.revenue || 0
        },
        goals: campaign.targets.goals
      });

      return analysis;
    } catch (error) {
      console.error('Failed to analyze campaign performance:', error);
      throw error;
    }
  }
};