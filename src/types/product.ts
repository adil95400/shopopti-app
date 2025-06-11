export interface ProductData {
  id?: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  variants?: ProductVariant[];
  sku?: string;
  stock?: number;
  category?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  metadata?: Record<string, any>;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  reviews?: ProductReview[];
}

export interface ProductVariant {
  id?: string;
  title: string;
  price: number;
  sku?: string;
  stock?: number;
  options: Record<string, string>;
}

export interface ProductReview {
  id?: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
  verified: boolean;
  helpful?: number;
}
