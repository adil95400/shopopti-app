import { supabase } from '../lib/supabase';
import { aiService } from './aiService';

export interface Review {
  id?: string;
  productId: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
  verified: boolean;
  helpful: number;
  source?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  language?: string;
  response?: string;
}

export const reviewService = {
  async getReviews(productId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addReview(review: Omit<Review, 'id' | 'date'>): Promise<Review> {
    // Analyze sentiment using AI
    const sentiment = await aiService.analyzeSentiment(review.comment);

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        ...review,
        date: new Date().toISOString(),
        sentiment: sentiment
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async importReviews(productId: string, source: 'aliexpress' | 'amazon'): Promise<void> {
    try {
      let reviews: Review[] = [];

      if (source === 'aliexpress') {
        const response = await fetch(
          `https://api.aliexpress.com/v2/reviews/${productId}`,
          {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_ALIEXPRESS_API_KEY}`
            }
          }
        );
        const data = await response.json();
        reviews = data.reviews.map((review: any) => ({
          productId,
          rating: review.rating,
          comment: review.comment,
          author: review.author,
          date: review.date,
          verified: review.verified,
          helpful: review.helpful || 0,
          source: 'aliexpress'
        }));
      } else if (source === 'amazon') {
        // Implement Amazon reviews import
      }

      // Process reviews in batches
      const batchSize = 50;
      for (let i = 0; i < reviews.length; i += batchSize) {
        const batch = reviews.slice(i, i + batchSize);
        const { error } = await supabase
          .from('reviews')
          .insert(batch);

        if (error) throw error;
      }
    } catch (error) {
      console.error(`Failed to import reviews from ${source}:`, error);
      throw new Error(`Failed to import reviews from ${source}`);
    }
  },

  async generateReviewResponse(review: Review): Promise<string> {
    try {
      const response = await aiService.generateResponse({
        review: review.comment,
        rating: review.rating,
        sentiment: review.sentiment,
        verified: review.verified
      });
      return response;
    } catch (error) {
      console.error('Failed to generate review response:', error);
      throw error;
    }
  },

  async markHelpful(reviewId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_helpful', {
      review_id: reviewId
    });

    if (error) throw error;
  }
};