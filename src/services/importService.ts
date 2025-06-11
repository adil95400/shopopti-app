import { supabase } from '../lib/supabase';
import { aiService } from './aiService';
import { supplierService } from './supplierService';
import { csvService } from './csvService';
import { amazonService } from './amazonService';
import { ProductData } from '../types/product';

export const importService = {
  async importFromCSV(file: File): Promise<ProductData[]> {
    const products = await csvService.parseProducts(file);
    await this.saveProducts(products);
    return products;
  },

  async importFromAmazon(url: string): Promise<ProductData> {
    return amazonService.importFromAmazon(url);
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

        const { error } = await supabase.from('products').insert(optimizedBatch);
        if (error) throw error;
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des produits:', error);
      throw new Error('Erreur lors de la sauvegarde des produits');
    }
  },

  async importFromSupplier(supplierId: string, productIds: string[]): Promise<ProductData[]> {
    try {
      const supplier = await supplierService.getSupplierById(supplierId);
      const products = await supplierService.getProductsByIds(supplierId, productIds);
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

      await this.saveProducts(optimizedProducts);
      return optimizedProducts;
    } catch (error) {
      console.error('Error importing from supplier:', error);
      throw error;
    }
  }
};
