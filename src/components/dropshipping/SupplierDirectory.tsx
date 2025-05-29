import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Globe, TrendingUp, Check, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { supabase } from '../../lib/supabase';

interface Supplier {
  id: string;
  name: string;
  country: string;
  description: string;
  logo?: string;
  categories: string[];
  products_count: number;
  processing_time: string;
  shipping_time: string;
  minimum_order: number;
  verified: boolean;
  rating: number;
  performance: {
    on_time_delivery: number;
    quality_rating: number;
    response_rate: number;
    response_time: string;
  };
}

const SupplierDirectory: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    country: '',
    category: '',
    verified: false,
    minRating: 0
  });
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('rating', { ascending: false });
      
      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    if (searchTerm && !supplier.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filters.country && supplier.country !== filters.country) return false;
    if (filters.category && !supplier.categories.includes(filters.category)) return false;
    if (filters.verified && !supplier.verified) return false;
    if (filters.minRating > 0 && supplier.rating < filters.minRating) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
          >
            <option value="">All Countries</option>
            <option value="US">United States</option>
            <option value="CN">China</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
          </select>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home">Home & Garden</option>
            <option value="Beauty">Beauty & Health</option>
          </select>
          
          <div className="relative">
            <button
              className="px-3 py-2 border border-gray-300 rounded-md flex items-center"
            >
              <Filter className="h-4 w-4 mr-1" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 overflow-x-auto py-2">
        <button
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            filters.verified
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
          onClick={() => handleFilterChange('verified', !filters.verified)}
        >
          Verified Only
        </button>
        
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
              filters.minRating === rating
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => handleFilterChange('minRating', filters.minRating === rating ? 0 : rating)}
          >
            <Star className="h-3 w-3 mr-1" />
            {rating}+
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map(supplier => (
            <div
              key={supplier.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {supplier.logo ? (
                      <img
                        src={supplier.logo}
                        alt={supplier.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Globe className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900">{supplier.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{supplier.country}</span>
                      </div>
                    </div>
                  </div>
                  {supplier.verified && (
                    <div className="bg-green-100 p-1 rounded-md">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{supplier.description}</p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 p-2 rounded-md">
                    <p className="text-xs text-gray-500">Products</p>
                    <p className="font-medium">{supplier.products_count.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <p className="text-xs text-gray-500">Rating</p>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="font-medium">{supplier.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <p className="text-xs text-gray-500">Processing</p>
                    <p className="font-medium">{supplier.processing_time}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <p className="text-xs text-gray-500">Min. Order</p>
                    <p className="font-medium">${supplier.minimum_order}</p>
                  </div>
                </div>
                
                {supplier.performance && (
                  <div className="bg-green-50 p-3 rounded-md mb-4">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-800">Performance Metrics</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center">
                        <Check className="h-3 w-3 text-green-600 mr-1" />
                        <span>On-time: {supplier.performance.on_time_delivery}%</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-3 w-3 text-green-600 mr-1" />
                        <span>Quality: {supplier.performance.quality_rating}%</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button
                    className="flex-1"
                    onClick={() => setSelectedSupplier(supplier)}
                  >
                    View Products
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`/suppliers/${supplier.id}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredSuppliers.length === 0 && (
            <div className="col-span-full bg-white p-12 rounded-lg shadow-sm text-center">
              <Globe className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
              <p className="text-gray-500">
                Try adjusting your filters or search criteria
              </p>
            </div>
          )}
        </div>
      )}
      
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  {selectedSupplier.logo ? (
                    <img
                      src={selectedSupplier.logo}
                      alt={selectedSupplier.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="ml-3">
                    <h3 className="text-xl font-medium text-gray-900">{selectedSupplier.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{selectedSupplier.country}</span>
                      {selectedSupplier.verified && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="flex items-center text-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            Verified
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">About</h4>
                <p className="text-gray-600">{selectedSupplier.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h5 className="font-medium text-gray-900 mb-2">Categories</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedSupplier.categories.map((category, index) => (
                      <span key={index} className="bg-gray-200 px-2 py-1 rounded-md text-xs">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h5 className="font-medium text-gray-900 mb-2">Shipping</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Time:</span>
                      <span className="font-medium">{selectedSupplier.processing_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping Time:</span>
                      <span className="font-medium">{selectedSupplier.shipping_time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h5 className="font-medium text-gray-900 mb-2">Performance</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">On-time Delivery:</span>
                      <span className="font-medium">{selectedSupplier.performance.on_time_delivery}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quality Rating:</span>
                      <span className="font-medium">{selectedSupplier.performance.quality_rating}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Rate:</span>
                      <span className="font-medium">{selectedSupplier.performance.response_rate}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-4">Products</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* This would be populated with actual products in a real app */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg overflow-hidden">
                      <div className="h-40 bg-gray-200"></div>
                      <div className="p-3">
                        <h5 className="font-medium text-gray-900">Sample Product {i}</h5>
                        <p className="text-sm text-gray-500">$29.99</p>
                        <Button className="w-full mt-2" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline">
                    View All Products
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button>
                  Connect with Supplier
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierDirectory;