import Papa from 'papaparse';
import { aiService } from './aiService';
import { ProductData } from '../types/product';

export const csvService = {
  async parseProducts(file: File): Promise<ProductData[]> {
    return new Promise((resolve, reject) => {
      const products: ProductData[] = [];
      const config = {
        header: true,
        skipEmptyLines: true,
        transform: (value: string) => value.trim(),
        chunk: async (results: any, parser: any) => {
          try {
            const chunkProducts = await Promise.all(
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
                } as ProductData;
              })
            );
            products.push(...chunkProducts);
          } catch (error) {
            parser.abort();
            reject(error);
          }
        },
        complete: () => {
          resolve(products);
        },
        error: (error: any) => {
          reject(error);
        }
      } as Papa.ParseConfig<unknown>;

      Papa.parse(file, config);
    });
  }
};
