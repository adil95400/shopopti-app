import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { 
  Save, 
  Plus, 
  Trash2, 
  Loader2,
  RefreshCw
} from 'lucide-react';

interface CategoryMappingProps {
  platforms: {
    id: string;
    name: string;
    connected: boolean;
  }[];
  onSaveMapping: (mapping: CategoryMapping[]) => Promise<void>;
  onRefreshCategories: () => Promise<void>;
}

export interface CategoryMapping {
  id: string;
  primaryCategory: string;
  mappings: {
    platformId: string;
    categoryId: string;
    categoryName: string;
  }[];
}

const CategoryMapping: React.FC<CategoryMappingProps> = ({ 
  platforms, 
  onSaveMapping,
  onRefreshCategories
}) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [mappings, setMappings] = useState<CategoryMapping[]>([
    {
      id: '1',
      primaryCategory: 'Electronics',
      mappings: [
        { platformId: 'shopify', categoryId: 'electronics', categoryName: 'Electronics' },
        { platformId: 'amazon', categoryId: 'electronics', categoryName: 'Electronics & Computers' },
        { platformId: 'woocommerce', categoryId: 'electronics', categoryName: 'Electronics' }
      ]
    },
    {
      id: '2',
      primaryCategory: 'Clothing',
      mappings: [
        { platformId: 'shopify', categoryId: 'clothing', categoryName: 'Clothing' },
        { platformId: 'amazon', categoryId: 'fashion', categoryName: 'Clothing & Fashion' },
        { platformId: 'woocommerce', categoryId: 'apparel', categoryName: 'Apparel' }
      ]
    }
  ]);

  // Platform categories (would be fetched from each platform in a real implementation)
  const [platformCategories, setPlatformCategories] = useState<Record<string, { id: string, name: string }[]>>({
    shopify: [
      { id: 'electronics', name: 'Electronics' },
      { id: 'clothing', name: 'Clothing' },
      { id: 'home', name: 'Home & Garden' },
      { id: 'beauty', name: 'Beauty & Personal Care' }
    ],
    amazon: [
      { id: 'electronics', name: 'Electronics & Computers' },
      { id: 'fashion', name: 'Clothing & Fashion' },
      { id: 'home', name: 'Home & Kitchen' },
      { id: 'beauty', name: 'Beauty & Health' }
    ],
    woocommerce: [
      { id: 'electronics', name: 'Electronics' },
      { id: 'apparel', name: 'Apparel' },
      { id: 'home-garden', name: 'Home & Garden' },
      { id: 'health-beauty', name: 'Health & Beauty' }
    ],
    etsy: [
      { id: 'electronics', name: 'Electronics & Accessories' },
      { id: 'clothing', name: 'Clothing' },
      { id: 'home', name: 'Home & Living' },
      { id: 'beauty', name: 'Bath & Beauty' }
    ],
    bigcommerce: [
      { id: 'electronics', name: 'Electronics' },
      { id: 'apparel', name: 'Apparel' },
      { id: 'home', name: 'Home & Garden' },
      { id: 'health', name: 'Health & Beauty' }
    ],
    squarespace: [
      { id: 'electronics', name: 'Electronics' },
      { id: 'clothing', name: 'Clothing' },
      { id: 'home', name: 'Home' },
      { id: 'beauty', name: 'Beauty' }
    ]
  });

  const connectedPlatforms = platforms.filter(p => p.connected);

  const handleAddMapping = () => {
    const newMapping: CategoryMapping = {
      id: Date.now().toString(),
      primaryCategory: '',
      mappings: connectedPlatforms.map(platform => ({
        platformId: platform.id,
        categoryId: '',
        categoryName: ''
      }))
    };
    
    setMappings([...mappings, newMapping]);
  };

  const handleRemoveMapping = (id: string) => {
    setMappings(mappings.filter(mapping => mapping.id !== id));
  };

  const handlePrimaryCategoryChange = (id: string, value: string) => {
    setMappings(mappings.map(mapping => 
      mapping.id === id ? { ...mapping, primaryCategory: value } : mapping
    ));
  };

  const handleCategoryMappingChange = (mappingId: string, platformId: string, categoryId: string) => {
    setMappings(mappings.map(mapping => {
      if (mapping.id === mappingId) {
        const platformCategories = platformCategories[platformId] || [];
        const category = platformCategories.find(c => c.id === categoryId);
        
        return {
          ...mapping,
          mappings: mapping.mappings.map(m => 
            m.platformId === platformId ? {
              ...m,
              categoryId,
              categoryName: category ? category.name : ''
            } : m
          )
        };
      }
      return mapping;
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSaveMapping(mappings);
      toast.success('Category mappings saved successfully');
    } catch (error: any) {
      toast.error(`Failed to save mappings: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefreshCategories();
      toast.success('Categories refreshed successfully');
    } catch (error: any) {
      toast.error(`Failed to refresh categories: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Category Mapping</h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={refreshing || connectedPlatforms.length === 0}
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {refreshing ? 'Refreshing...' : 'Refresh Categories'}
            </Button>
            <Button 
              onClick={handleSave}
              disabled={loading || mappings.length === 0}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Saving...' : 'Save Mappings'}
            </Button>
          </div>
        </div>

        {connectedPlatforms.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">No platforms connected</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Connect at least one platform to create category mappings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {mappings.map((mapping) => (
              <div key={mapping.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-full max-w-xs">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Category
                    </label>
                    <input
                      type="text"
                      value={mapping.primaryCategory}
                      onChange={(e) => handlePrimaryCategoryChange(mapping.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Electronics"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveMapping(mapping.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {connectedPlatforms.map((platform) => {
                    const platformMapping = mapping.mappings.find(m => m.platformId === platform.id);
                    
                    return (
                      <div key={platform.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {platform.name}
                        </label>
                        <select
                          value={platformMapping?.categoryId || ''}
                          onChange={(e) => handleCategoryMappingChange(mapping.id, platform.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select category</option>
                          {platformCategories[platform.id]?.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              onClick={handleAddMapping}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category Mapping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryMapping;

export { CategoryMapping }