import React, { useState } from 'react';
import { Sparkles, Check, Loader2, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

interface ProductOptimizerProps {
  product: {
    title: string;
    description: string;
    price: number;
    category?: string;
    tags?: string[];
  };
  onOptimize: (optimizedProduct: any) => void;
}

const ProductOptimizer: React.FC<ProductOptimizerProps> = ({ product, onOptimize }) => {
  const [loading, setLoading] = useState(false);
  const [optimizationOptions, setOptimizationOptions] = useState({
    title: true,
    description: true,
    seo: true,
    tags: true,
    pricing: false
  });
  const [optimizedProduct, setOptimizedProduct] = useState<any>(null);

  const handleOptimize = async () => {
    try {
      setLoading(true);
      
      // Simulate API call to AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const optimized = {
        title: optimizationOptions.title 
          ? `Premium ${product.title} - Professional Grade` 
          : product.title,
        description: optimizationOptions.description 
          ? `${product.description}\n\nThis high-quality product offers exceptional performance and durability. Perfect for both professional and personal use, it features premium materials and expert craftsmanship.` 
          : product.description,
        price: optimizationOptions.pricing 
          ? Math.round(product.price * 1.15 * 100) / 100 
          : product.price,
        seo: optimizationOptions.seo 
          ? {
              title: `Buy ${product.title} | Best Quality | Fast Shipping`,
              description: `Shop for the best ${product.title} with premium features. Free shipping, 30-day returns, and exceptional customer service.`,
              keywords: ['premium', 'high-quality', product.category || '', 'best seller']
            } 
          : null,
        tags: optimizationOptions.tags 
          ? [...(product.tags || []), 'trending', 'best-seller', 'premium'] 
          : product.tags
      };
      
      setOptimizedProduct(optimized);
    } catch (error) {
      console.error('Error optimizing product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (optimizedProduct) {
      onOptimize(optimizedProduct);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-blue-100 rounded-full mr-3">
          <Sparkles className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium">AI Product Optimizer</h3>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600">
          Use AI to optimize your product listing for better visibility and conversion rates.
        </p>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium text-gray-700">Optimize Title</label>
            <p className="text-sm text-gray-500">Improve product title for better SEO</p>
          </div>
          <div className="relative inline-block w-12 align-middle select-none">
            <input
              type="checkbox"
              id="toggle-title"
              checked={optimizationOptions.title}
              onChange={() => setOptimizationOptions({
                ...optimizationOptions,
                title: !optimizationOptions.title
              })}
              className="sr-only"
            />
            <label
              htmlFor="toggle-title"
              className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                optimizationOptions.title ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                  optimizationOptions.title ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></span>
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium text-gray-700">Enhance Description</label>
            <p className="text-sm text-gray-500">Add compelling details and features</p>
          </div>
          <div className="relative inline-block w-12 align-middle select-none">
            <input
              type="checkbox"
              id="toggle-description"
              checked={optimizationOptions.description}
              onChange={() => setOptimizationOptions({
                ...optimizationOptions,
                description: !optimizationOptions.description
              })}
              className="sr-only"
            />
            <label
              htmlFor="toggle-description"
              className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                optimizationOptions.description ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                  optimizationOptions.description ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></span>
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium text-gray-700">Generate SEO Metadata</label>
            <p className="text-sm text-gray-500">Create SEO-friendly meta tags</p>
          </div>
          <div className="relative inline-block w-12 align-middle select-none">
            <input
              type="checkbox"
              id="toggle-seo"
              checked={optimizationOptions.seo}
              onChange={() => setOptimizationOptions({
                ...optimizationOptions,
                seo: !optimizationOptions.seo
              })}
              className="sr-only"
            />
            <label
              htmlFor="toggle-seo"
              className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                optimizationOptions.seo ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                  optimizationOptions.seo ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></span>
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium text-gray-700">Suggest Tags</label>
            <p className="text-sm text-gray-500">Add relevant tags for better discoverability</p>
          </div>
          <div className="relative inline-block w-12 align-middle select-none">
            <input
              type="checkbox"
              id="toggle-tags"
              checked={optimizationOptions.tags}
              onChange={() => setOptimizationOptions({
                ...optimizationOptions,
                tags: !optimizationOptions.tags
              })}
              className="sr-only"
            />
            <label
              htmlFor="toggle-tags"
              className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                optimizationOptions.tags ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                  optimizationOptions.tags ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></span>
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium text-gray-700">Optimize Pricing</label>
            <p className="text-sm text-gray-500">Suggest optimal price based on market data</p>
          </div>
          <div className="relative inline-block w-12 align-middle select-none">
            <input
              type="checkbox"
              id="toggle-pricing"
              checked={optimizationOptions.pricing}
              onChange={() => setOptimizationOptions({
                ...optimizationOptions,
                pricing: !optimizationOptions.pricing
              })}
              className="sr-only"
            />
            <label
              htmlFor="toggle-pricing"
              className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                optimizationOptions.pricing ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                  optimizationOptions.pricing ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></span>
            </label>
          </div>
        </div>
      </div>
      
      {!optimizedProduct ? (
        <Button 
          onClick={handleOptimize} 
          disabled={loading || (!optimizationOptions.title && !optimizationOptions.description && !optimizationOptions.seo && !optimizationOptions.tags && !optimizationOptions.pricing)}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Optimize with AI
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-md">
            <div className="flex items-center mb-2">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-medium text-green-800">Optimization Complete</h4>
            </div>
            <p className="text-sm text-green-700">
              Your product has been optimized for better performance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleApply} className="w-full">
              <Check className="h-4 w-4 mr-2" />
              Apply Changes
            </Button>
            <Button variant="outline" onClick={() => setOptimizedProduct(null)} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Start Over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductOptimizer;