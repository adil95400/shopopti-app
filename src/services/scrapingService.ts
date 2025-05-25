import axios from 'axios';
import * as cheerio from 'cheerio';
import { importService } from './importService';

interface ScrapingOptions {
  proxy?: boolean;
  timeout?: number;
  retries?: number;
}

export const scrapingService = {
  async scrapeShopify(url: string, options: ScrapingOptions = {}) {
    try {
      // Validate Shopify URL
      const shopifyUrlPattern = /^https?:\/\/(?:.*?)\.myshopify\.com|shopify\.com/i;
      if (!shopifyUrlPattern.test(url)) {
        throw new Error('URL invalide. Veuillez fournir une URL Shopify valide.');
      }

      // Extract product handle from URL
      const handle = url.split('/products/').pop()?.split('?')[0];
      if (!handle) throw new Error('URL de produit invalide');

      // Get product JSON
      const jsonUrl = `${url.split('?')[0]}.json`;
      const { data } = await axios.get(jsonUrl, {
        timeout: options.timeout || 15000
      });

      if (!data.product) {
        throw new Error('Produit non trouvé');
      }

      return {
        title: data.product.title,
        description: data.product.body_html,
        price: data.product.variants[0].price,
        images: data.product.images.map((img: any) => img.src),
        variants: data.product.variants.map((variant: any) => ({
          title: variant.title,
          price: variant.price,
          sku: variant.sku,
          stock: variant.inventory_quantity
        })),
        metadata: {
          source: 'shopify',
          sourceUrl: url,
          vendor: data.product.vendor,
          type: data.product.product_type,
          tags: data.product.tags
        }
      };
    } catch (error: any) {
      console.error('Erreur lors du scraping Shopify:', error);
      throw new Error(
        'Impossible de récupérer le produit. Veuillez vérifier que:\n' +
        '1. L\'URL est correcte\n' +
        '2. Le produit est public\n' +
        '3. La boutique est en ligne'
      );
    }
  },

  async scrapeAliExpress(url: string, options: ScrapingOptions = {}) {
    try {
      // Validate AliExpress URL
      const aliExpressPattern = /^https?:\/\/(?:.*?)\.aliexpress\.com\/item\//i;
      if (!aliExpressPattern.test(url)) {
        throw new Error('URL invalide. Veuillez fournir une URL AliExpress valide.');
      }

      // Use proxy if enabled
      const proxyUrl = options.proxy ? await importService.findWorkingProxy() : '';
      const finalUrl = proxyUrl ? `${proxyUrl}${encodeURIComponent(url)}` : url;

      const { data } = await axios.get(finalUrl, {
        timeout: options.timeout || 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      const $ = cheerio.load(data);

      // Extract product data
      const title = $('.product-title').text().trim();
      const price = parseFloat($('.product-price-value').text().replace(/[^0-9.,]/g, '').replace(',', '.'));
      const images = $('.images-view-item img').map((_, img) => $(img).attr('src')).get();
      const description = $('.product-description').html() || '';

      if (!title || !price) {
        throw new Error('Données du produit introuvables');
      }

      return {
        title,
        description,
        price,
        images,
        metadata: {
          source: 'aliexpress',
          sourceUrl: url
        }
      };
    } catch (error: any) {
      console.error('Erreur lors du scraping AliExpress:', error);
      throw new Error(
        'Impossible de récupérer le produit. Veuillez vérifier que:\n' +
        '1. L\'URL est correcte\n' +
        '2. Le produit est disponible\n' +
        '3. Vous n\'êtes pas bloqué par AliExpress'
      );
    }
  },

  async scrapeTemu(url: string, options: ScrapingOptions = {}) {
    try {
      // Validate Temu URL
      const temuPattern = /^https?:\/\/(?:www\.)?temu\.com\/[a-z]{2}\/[^\/]+\/[0-9]+\.html/i;
      if (!temuPattern.test(url)) {
        throw new Error('URL invalide. Veuillez fournir une URL Temu valide.');
      }

      // Similar implementation to AliExpress...
      throw new Error('Scraping Temu pas encore implémenté');
    } catch (error: any) {
      console.error('Erreur lors du scraping Temu:', error);
      throw error;
    }
  },

  async scrapeShein(url: string, options: ScrapingOptions = {}) {
    try {
      // Validate Shein URL
      const sheinPattern = /^https?:\/\/(?:.*?)\.shein\.com/i;
      if (!sheinPattern.test(url)) {
        throw new Error('URL invalide. Veuillez fournir une URL Shein valide.');
      }

      // Similar implementation to AliExpress...
      throw new Error('Scraping Shein pas encore implémenté');
    } catch (error: any) {
      console.error('Erreur lors du scraping Shein:', error);
      throw error;
    }
  },

  async scrapeByUrl(url: string, options: ScrapingOptions = {}) {
    // Detect platform from URL
    if (url.includes('shopify.com') || url.includes('.myshopify.com')) {
      return this.scrapeShopify(url, options);
    } else if (url.includes('aliexpress.com')) {
      return this.scrapeAliExpress(url, options);
    } else if (url.includes('amazon.com')) {
      return importService.importFromAmazon(url);
    } else if (url.includes('temu.com')) {
      return this.scrapeTemu(url, options);
    } else if (url.includes('shein.com')) {
      return this.scrapeShein(url, options);
    } else {
      throw new Error(
        'Plateforme non supportée. Plateformes disponibles:\n' +
        '- Shopify\n' +
        '- AliExpress\n' +
        '- Amazon\n' +
        '- Temu\n' +
        '- Shein'
      );
    }
  },

  async scrapeCatalog(url: string, options: ScrapingOptions = {}) {
    try {
      // Validate catalog URL
      if (!url.startsWith('http')) {
        throw new Error('URL invalide');
      }

      const { data } = await axios.get(url, {
        timeout: options.timeout || 15000
      });

      const $ = cheerio.load(data);
      const products = [];

      // Extract all product links
      const productLinks = $('a[href*="/products/"], a[href*="/item/"]').map((_, el) => $(el).attr('href')).get();

      // Scrape each product
      for (const link of productLinks) {
        try {
          const product = await this.scrapeByUrl(link, options);
          products.push(product);
        } catch (error) {
          console.warn(`Échec du scraping pour ${link}:`, error);
          continue;
        }
      }

      return products;
    } catch (error: any) {
      console.error('Erreur lors du scraping du catalogue:', error);
      throw new Error(
        'Impossible de récupérer le catalogue. Veuillez vérifier que:\n' +
        '1. L\'URL est correcte\n' +
        '2. La page est accessible\n' +
        '3. Vous avez les permissions nécessaires'
      );
    }
  }
};