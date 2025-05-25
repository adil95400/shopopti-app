import { init } from '@canva/app-sdk';

let canvaApp: any = null;

export const canvaService = {
  async initialize() {
    try {
      canvaApp = await init();
    } catch (error) {
      console.error('Error initializing Canva:', error);
      throw error;
    }
  },

  async createDesign(template: string, data: any) {
    if (!canvaApp) {
      throw new Error('Canva not initialized');
    }

    try {
      const design = await canvaApp.createDesign({
        template,
        data
      });
      return design;
    } catch (error) {
      console.error('Error creating design:', error);
      throw error;
    }
  },

  async exportDesign(designId: string, format: 'png' | 'jpg' | 'pdf' = 'png') {
    if (!canvaApp) {
      throw new Error('Canva not initialized');
    }

    try {
      const exportUrl = await canvaApp.exportDesign(designId, { format });
      return exportUrl;
    } catch (error) {
      console.error('Error exporting design:', error);
      throw error;
    }
  },

  async createProductImage(product: {
    title: string;
    price: number;
    images: string[];
    features: string[];
    style?: 'minimal' | 'modern' | 'luxury' | 'playful';
    highlight?: string;
    badgeText?: string;
  }) {
    if (!canvaApp) {
      throw new Error('Canva not initialized');
    }

    try {
      const template = `product-template-${product.style || 'modern'}`;
      const design = await this.createDesign(template, {
        title: product.title,
        price: `$${product.price.toFixed(2)}`,
        image: product.images[0],
        features: product.features,
        highlight: product.highlight,
        badge: product.badgeText,
        style: {
          colors: this.getStyleColors(product.style),
          typography: this.getStyleTypography(product.style)
        }
      });
      return design;
    } catch (error) {
      console.error('Error creating product image:', error);
      throw error;
    }
  },

  async createSocialMediaPost(product: {
    title: string;
    description: string;
    price: number;
    images: string[];
    platform: 'instagram' | 'facebook' | 'twitter';
    style?: 'minimal' | 'modern' | 'luxury' | 'playful';
    callToAction?: string;
    hashtags?: string[];
  }) {
    if (!canvaApp) {
      throw new Error('Canva not initialized');
    }

    try {
      const template = `social-media-${product.platform}-template`;
      const design = await this.createDesign(template, {
        title: product.title,
        description: product.description,
        price: `$${product.price.toFixed(2)}`,
        image: product.images[0],
        callToAction: product.callToAction || 'Shop Now',
        hashtags: product.hashtags || [],
        style: {
          colors: this.getStyleColors(product.style),
          typography: this.getStyleTypography(product.style),
          layout: this.getPlatformLayout(product.platform)
        }
      });
      return design;
    } catch (error) {
      console.error('Error creating social media post:', error);
      throw error;
    }
  },

  async createPromotionalBanner(promotion: {
    title: string;
    discount: number;
    originalPrice: number;
    salePrice: number;
    images: string[];
    style?: 'minimal' | 'modern' | 'luxury' | 'playful';
    validUntil?: string;
    urgencyText?: string;
  }) {
    if (!canvaApp) {
      throw new Error('Canva not initialized');
    }

    try {
      const template = `promotional-banner-${promotion.style || 'modern'}-template`;
      const design = await this.createDesign(template, {
        title: promotion.title,
        discount: `${promotion.discount}% OFF`,
        originalPrice: `$${promotion.originalPrice.toFixed(2)}`,
        salePrice: `$${promotion.salePrice.toFixed(2)}`,
        image: promotion.images[0],
        validUntil: promotion.validUntil,
        urgencyText: promotion.urgencyText,
        style: {
          colors: this.getStyleColors(promotion.style),
          typography: this.getStyleTypography(promotion.style)
        }
      });
      return design;
    } catch (error) {
      console.error('Error creating promotional banner:', error);
      throw error;
    }
  },

  async createCollectionCover(collection: {
    name: string;
    description: string;
    products: Array<{
      image: string;
      title: string;
      price: number;
    }>;
    style?: 'minimal' | 'modern' | 'luxury' | 'playful';
    theme?: string;
    season?: string;
  }) {
    if (!canvaApp) {
      throw new Error('Canva not initialized');
    }

    try {
      const template = `collection-cover-${collection.style || 'modern'}-template`;
      const design = await this.createDesign(template, {
        name: collection.name,
        description: collection.description,
        products: collection.products.slice(0, 4).map(product => ({
          image: product.image,
          title: product.title,
          price: `$${product.price.toFixed(2)}`
        })),
        theme: collection.theme,
        season: collection.season,
        style: {
          colors: this.getStyleColors(collection.style),
          typography: this.getStyleTypography(collection.style)
        }
      });
      return design;
    } catch (error) {
      console.error('Error creating collection cover:', error);
      throw error;
    }
  },

  private getStyleColors(style?: string) {
    const styleColors = {
      minimal: {
        primary: '#000000',
        secondary: '#FFFFFF',
        accent: '#CCCCCC'
      },
      modern: {
        primary: '#2D3436',
        secondary: '#DFE6E9',
        accent: '#0984E3'
      },
      luxury: {
        primary: '#2C3E50',
        secondary: '#F1C40F',
        accent: '#ECF0F1'
      },
      playful: {
        primary: '#6C5CE7',
        secondary: '#FD79A8',
        accent: '#FFEAA7'
      }
    };
    return styleColors[style || 'modern'];
  },

  private getStyleTypography(style?: string) {
    const styleTypography = {
      minimal: {
        heading: 'Helvetica Neue',
        body: 'Arial'
      },
      modern: {
        heading: 'Inter',
        body: 'Inter'
      },
      luxury: {
        heading: 'Playfair Display',
        body: 'Lato'
      },
      playful: {
        heading: 'Poppins',
        body: 'Open Sans'
      }
    };
    return styleTypography[style || 'modern'];
  },

  private getPlatformLayout(platform: string) {
    const platformLayouts = {
      instagram: {
        aspectRatio: '1:1',
        maxHashtags: 30
      },
      facebook: {
        aspectRatio: '16:9',
        maxHashtags: 10
      },
      twitter: {
        aspectRatio: '16:9',
        maxHashtags: 5
      }
    };
    return platformLayouts[platform];
  }
};