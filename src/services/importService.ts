import { supabase } from '../lib/supabase';
import Papa from 'papaparse';
import { parseString } from 'xml2js';
import { aiService } from './aiService';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { supplierService } from './supplierService';

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

interface ProductVariant {
  id?: string;
  title: string;
  price: number;
  sku?: string;
  stock?: number;
  options: Record<string, string>;
}

interface ProductReview {
  id?: string;
  rating: number;
  comment: string;
  author: string;
  date: string;
  verified: boolean;
  helpful?: number;
}

// Updated list of reliable CORS proxies
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://corsproxy.io/?',
  'https://proxy.cors.sh/',
  'https://cors-anywhere.herokuapp.com/'
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithExponentialBackoff = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  baseDelay = 1000,
  maxDelay = 10000
): Promise<T> => {
  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      if (i === retries - 1) break;
      
      const delayTime = Math.min(baseDelay * Math.pow(2, i), maxDelay);
      await delay(delayTime);
      
      console.warn(`Retry attempt ${i + 1} failed, retrying in ${delayTime}ms...`);
    }
  }

  throw lastError || new Error('All retry attempts failed');
};

const checkProxyAvailability = async (proxyUrl: string): Promise<boolean> => {
  try {
    const testUrl = 'https://www.amazon.com';
    const response = await axios.get(`${proxyUrl}${encodeURIComponent(testUrl)}`, {
      timeout: 5000,
      validateStatus: (status) => status === 200
    });
    
    // Verify we got actual HTML content
    return response.data && 
           typeof response.data === 'string' && 
           response.data.includes('<!DOCTYPE html>');
  } catch {
    return false;
  }
};

export const findWorkingProxy = async (): Promise<string> => {
  const proxyPromises = CORS_PROXIES.map(async proxy => {
    const isAvailable = await checkProxyAvailability(proxy);
    return isAvailable ? proxy : null;
  });

  const results = await Promise.all(proxyPromises);
  const workingProxy = results.find(proxy => proxy !== null);

  if (!workingProxy) {
    throw new Error(
      'Aucun proxy CORS n\'est disponible actuellement. Veuillez:\n' +
      '1. Vérifier votre connexion internet\n' +
      '2. Désactiver votre bloqueur de publicités si vous en utilisez un\n' +
      '3. Réessayer dans quelques minutes'
    );
  }

  return workingProxy;
};

export const importService = {
  async importFromCSV(file: File): Promise<ProductData[]> {
    return new Promise((resolve, reject) => {
      const config = {
        header: true,
        skipEmptyLines: true,
        transform: (value) => value.trim(),
        chunk: async (results: any, parser: any) => {
          try {
            const products = await Promise.all(
              results.data.map(async (row: any) => {
                const optimizedTitle = await aiService.optimizeProductTitle(row.title || row.name, {
                  category: row.category
                });

                const optimizedDescription = await aiService.generateProductDescription({
                  title: optimizedTitle,
                  category: row.category,
                  features: row.features?.split(',') || []
                });

                return {
                  title: optimizedTitle,
                  description: optimizedDescription,
                  price: parseFloat(row.price),
                  images: (row.images || '').split(',').filter(Boolean),
                  sku: row.sku,
                  stock: parseInt(row.stock, 10) || 0,
                  category: row.category,
                  variants: row.variants ? JSON.parse(row.variants) : undefined,
                  metadata: {
                    source: 'csv',
                    importDate: new Date().toISOString()
                  }
                };
              })
            );

            await this.saveProducts(products);

          } catch (error) {
            parser.abort();
            reject(error);
          }
        },
        complete: () => {
          resolve([]);
        },
        error: (error: any) => {
          reject(error);
        }
      };

      Papa.parse(file, config);
    });
  },

  async importFromAmazon(url: string): Promise<ProductData> {
    try {
      const amazonUrlPattern = /^https?:\/\/(?:www\.)?amazon\.(?:com|ca|co\.uk|de|fr|es|it|co\.jp|com\.au|in)(?:\/.*)?\/(?:dp|gp\/product)\/[A-Z0-9]{10}/i;
      
      if (!amazonUrlPattern.test(url)) {
        throw new Error('URL invalide. Veuillez fournir une URL Amazon valide contenant un identifiant de produit.');
      }

      const workingProxy = await retryWithExponentialBackoff(
        findWorkingProxy,
        3,
        1000
      );

      const proxyUrl = `${workingProxy}${encodeURIComponent(url)}`;
      
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.amazon.com/',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      };

      const response = await retryWithExponentialBackoff(
        async () => {
          const resp = await axios.get(proxyUrl, { 
            headers,
            timeout: 15000,
            validateStatus: (status) => status === 200,
            maxRedirects: 5
          });
          
          if (!resp.data || typeof resp.data !== 'string' || resp.data.length < 1000) {
            throw new Error('Réponse invalide du serveur');
          }
          
          return resp;
        },
        3,
        2000
      );

      if (!response.data) {
        throw new Error('Impossible de récupérer les données du produit');
      }

      const $ = cheerio.load(response.data);

      if ($('form[name="signIn"]').length > 0 || $('input[name="email"]').length > 0) {
        throw new Error('Redirection vers la page de connexion Amazon détectée. Veuillez réessayer plus tard.');
      }

      if ($('#availability').text().toLowerCase().includes('unavailable') || 
          $('#outOfStock').length > 0 || 
          $('.a-color-price').text().includes('Currently unavailable')) {
        throw new Error('Ce produit n\'est plus disponible sur Amazon.');
      }

      let title = '';
      
      const titleSelectors = [
        '#productTitle',
        '.product-title-word-break',
        'h1.a-size-large',
        '#title',
        '.a-size-extra-large',
        '[data-feature-name="title"]'
      ];

      for (const selector of titleSelectors) {
        const element = $(selector);
        if (element.length) {
          title = element.text().trim();
          if (title) break;
        }
      }

      if (!title) {
        $('h1').each((_, element) => {
          const text = $(element).text().trim();
          if (text.length > 10 && !text.toLowerCase().includes('sign in')) {
            title = text;
            return false;
          }
        });

        if (!title) {
          $('[class*="title" i], [id*="title" i], [data-test*="title" i]').each((_, element) => {
            const text = $(element).text().trim();
            if (text.length > 10 && !text.toLowerCase().includes('sign in')) {
              title = text;
              return false;
            }
          });
        }

        if (!title) {
          $('.a-section').each((_, element) => {
            const text = $(element).text().trim();
            if (text.length > 10 && text.length < 200 && !text.toLowerCase().includes('sign in')) {
              title = text;
              return false;
            }
          });
        }
      }

      if (!title) {
        console.error('Title extraction failed for URL:', url);
        console.error('Page content length:', response.data.length);
        throw new Error('Impossible de trouver le titre du produit. Veuillez vérifier que:\n1. L\'URL est correcte\n2. Le produit est toujours disponible\n3. Vous n\'êtes pas redirigé vers une page de connexion');
      }

      const priceSelectors = [
        '#priceblock_ourprice',
        '#price_inside_buybox',
        '.a-price .a-offscreen',
        '.a-price-whole',
        '#price',
        '.price3P',
        '#newBuyBoxPrice',
        '[data-feature-name="price"]',
        '.product-price',
        '.price-value',
        '.selling-price'
      ];

      let priceText = '';
      for (const selector of priceSelectors) {
        const element = $(selector).first();
        if (element.length) {
          priceText = element.text().trim();
          break;
        }
      }

      const price = parseFloat(priceText.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0;
      
      if (!price) {
        throw new Error('Impossible de trouver le prix du produit. Le produit pourrait être indisponible ou l\'URL pourrait être incorrecte.');
      }

      const description = $('#productDescription').text().trim() ||
                         $('#feature-bullets').text().trim() ||
                         $('.a-expander-content').text().trim() ||
                         $('.product-description').text().trim() ||
                         'Description non disponible';

      const imageSelectors = [
        '#landingImage',
        '#imgBlkFront',
        '#main-image',
        '.a-dynamic-image',
        '#prodImage',
        '[data-feature-name="image"]',
        '.product-image img',
        '.item-image img'
      ];

      const images = new Set<string>();

      for (const selector of imageSelectors) {
        const img = $(selector);
        const src = img.attr('src') || img.attr('data-old-hires') || img.attr('data-a-dynamic-image');
        if (src) {
          if (src.startsWith('{')) {
            try {
              const imageUrls = Object.keys(JSON.parse(src));
              imageUrls.forEach(url => images.add(url));
            } catch (e) {
              images.add(src);
            }
          } else {
            images.add(src);
          }
        }
      }

      $('#altImages img, #imageBlock img').each((_, img) => {
        const src = $(img).attr('src') || $(img).attr('data-old-hires');
        if (src && !src.includes('spinner') && !src.includes('overlay')) {
          images.add(src);
        }
      });

      const uniqueImages = Array.from(images)
        .filter(src => src && !src.includes('spinner'))
        .map(src => src.replace(/._[A-Z0-9]+_\./, '.'));

      if (uniqueImages.length === 0) {
        throw new Error('Impossible de trouver les images du produit. Veuillez vérifier que le produit est accessible.');
      }

      const variants = $('#variation_color_name li, #variation_size_name li')
        .map((_, el) => {
          try {
            const $el = $(el);
            const variantTitle = $el.attr('title') || '';
            const variantPrice = parseFloat($el.attr('data-price') || '0');
            const variantImage = $el.find('img').attr('src') || '';

            if (variantTitle) {
              return {
                title: variantTitle,
                price: variantPrice || price,
                options: {
                  [variantTitle.includes('color') ? 'color' : 'size']: variantTitle
                }
              };
            }
          } catch (e) {
            console.warn('Error extracting variant:', e);
          }
          return null;
        })
        .get()
        .filter(Boolean);

      const optimizedTitle = await aiService.optimizeProductTitle(title, {
        category: 'Amazon'
      });

      const optimizedDescription = await aiService.generateProductDescription({
        title: optimizedTitle,
        description,
        features: []
      });

      const reviews = $('.review')
        .map((_, review) => {
          try {
            const $review = $(review);
            const rating = parseInt($review.find('.a-icon-star, .rating').text(), 10) || 0;
            const comment = $review.find('.review-text, .review-text-content').text().trim();
            const author = $review.find('.a-profile-name').text().trim();
            const date = $review.find('.review-date').text().trim();
            const verified = $review.find('.avp-badge, .verified-purchase').length > 0;

            if (rating && comment && author) {
              return { rating, comment, author, date, verified };
            }
          } catch (e) {
            console.warn('Error extracting review:', e);
          }
          return null;
        })
        .get()
        .filter(Boolean);

      return {
        title: optimizedTitle,
        description: optimizedDescription,
        price,
        images: uniqueImages,
        variants: variants.length > 0 ? variants : undefined,
        metadata: {
          source: 'amazon',
          sourceUrl: url,
          importDate: new Date().toISOString()
        },
        reviews: reviews.length > 0 ? reviews : undefined
      };

    } catch (error: any) {
      console.error('Erreur lors de l\'importation depuis Amazon:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error(
            'La requête a expiré. Veuillez:\n' +
            '1. Vérifier votre connexion internet\n' +
            '2. Réessayer dans quelques minutes\n' +
            '3. Si le problème persiste, essayez avec une autre URL de produit'
          );
        }
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          throw new Error(
            'Impossible de se connecter au serveur. Veuillez:\n' +
            '1. Vérifier votre connexion internet\n' +
            '2. Désactiver votre VPN si vous en utilisez un\n' +
            '3. Réessayer dans quelques minutes'
          );
        }
        if (error.response) {
          switch (error.response.status) {
            case 403:
              throw new Error(
                'Accès refusé par Amazon. Veuillez:\n' +
                '1. Vérifier que l\'URL est correcte\n' +
                '2. Désactiver votre bloqueur de publicités\n' +
                '3. Réessayer dans quelques minutes'
              );
            case 404:
              throw new Error(
                'Produit non trouvé sur Amazon. Veuillez:\n' +
                '1. Vérifier que l\'URL est correcte\n' +
                '2. Vérifier que le produit est toujours disponible\n' +
                '3. Essayer avec un autre produit'
              );
            case 429:
              throw new Error(
                'Trop de requêtes vers Amazon. Veuillez:\n' +
                '1. Patienter quelques minutes\n' +
                '2. Réessayer plus tard\n' +
                '3. Limiter le nombre de produits importés simultanément'
              );
            case 500:
            case 502:
            case 503:
            case 504:
              throw new Error(
                'Le service Amazon est temporairement indisponible. Veuillez:\n' +
                '1. Patienter quelques minutes\n' +
                '2. Réessayer plus tard\n' +
                '3. Si le problème persiste, essayez avec un autre produit'
              );
            default:
              throw new Error(
                `Erreur réseau (${error.response.status}). Veuillez:\n` +
                '1. Vérifier votre connexion internet\n' +
                '2. Réessayer dans quelques minutes\n' +
                '3. Si le problème persiste, contactez le support'
              );
          }
        }
      }

      throw new Error(
        'Une erreur est survenue lors de l\'importation du produit. Veuillez:\n' +
        '1. Vérifier votre connexion internet\n' +
        '2. Vous assurer que l\'URL du produit est correcte\n' +
        '3. Désactiver votre bloqueur de publicités\n' +
        '4. Réessayer dans quelques minutes'
      );
    }
  },

  async saveProducts(products: ProductData[]): Promise<void> {
    try {
      const batchSize = 50;
      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        
        const optimizedBatch = await Promise.all(
          batch.map(async (product) => {
            const seoData = await aiService.optimizeForSEO({
              title: product.title,
              description: product.description,
              category: product.category || ''
            });

            return {
              ...product,
              seo: seoData
            };
          })
        );

        const { error } = await supabase
          .from('products')
          .insert(optimizedBatch);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des produits:', error);
      throw new Error('Erreur lors de la sauvegarde des produits');
    }
  },

  async importFromSupplier(supplierId: string, productIds: string[]): Promise<ProductData[]> {
    try {
      // Récupérer les informations du fournisseur
      const supplier = await supplierService.getSupplierById(supplierId);
      
      // Récupérer les produits du fournisseur
      const products = await supplierService.getProductsByIds(supplierId, productIds);
      
      // Transformer les produits au format Shopopti+
      const transformedProducts = products.map(product => ({
        title: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
        sku: product.sku,
        stock: product.stock,
        category: product.category,
        variants: product.variants,
        metadata: {
          source: supplier.type,
          sourceId: product.id,
          importDate: new Date().toISOString()
        }
      }));
      
      // Optimiser les produits avec l'IA
      const optimizedProducts = await Promise.all(
        transformedProducts.map(async product => {
          const optimized = await aiService.optimizeProduct({
            name: product.title,
            description: product.description,
            category: product.category || ''
          });
          
          return {
            ...product,
            title: optimized.title,
            description: optimized.description_html,
            tags: optimized.tags
          };
        })
      );
      
      // Sauvegarder les produits dans la base de données
      await this.saveProducts(optimizedProducts);
      
      return optimizedProducts;
    } catch (error) {
      console.error('Error importing from supplier:', error);
      throw error;
    }
  }
};