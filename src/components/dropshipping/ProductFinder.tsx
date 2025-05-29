import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, DollarSign, Star, ShoppingBag, Truck, Tag, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/button';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  rating: number;
  sales: number;
  trend: 'rising' | 'stable' | 'falling';
  profit_margin: number;
  shipping_time: string;
  supplier: {
    name: string;
    country: string;
    rating: number;
  };
}

const ProductFinder: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    trend: '',
    minProfit: ''
  });
  const [sortBy, setSortBy] = useState('trending');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch from your API
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProducts: Product[] = Array(20).fill(0).map((_, i) => ({
        id: `prod-${i + 1}`,
        name: `Trending Product ${i + 1}`,
        description: 'High-quality product with excellent features and customer satisfaction.',
        price: Math.floor(Math.random() * 100) + 10,
        images: ['https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg'],
        category: ['Electronics', 'Fashion', 'Home', 'Beauty'][Math.floor(Math.random() * 4)],
        rating: Math.floor(Math.random() * 5) + 1,
        sales: Math.floor(Math.random() * 1000),
        trend: ['rising', 'stable', 'falling'][Math.floor(Math.random() * 3)] as any,
        profit_margin: Math.floor(Math.random() * 50) + 10,
        shipping_time: `${Math.floor(Math.random() * 14) + 3} days`,
        supplier: {
          name: `Supplier ${i + 1}`,
          country: ['US', 'CN', 'UK', 'CA'][Math.floor(Math.random() * 4)],
          rating: Math.floor(Math.random() * 5) + 1
        }
      }));
      
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const filteredProducts = products.filter(product => {
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filters.category && product.category !== filters.category) return false;
    if (filters.minPrice && product.price < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) return false;
    if (filters.minRating && product.rating < parseInt(filters.minRating)) return false;
    if (filters.trend && product.trend !== filters.trend) return false;
    if (filters.minProfit && product.profit_margin < parseInt(filters.minProfit)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'profit':
        return b.profit_margin - a.profit_margin;
      case 'trending':
      default:
        return b.sales - a.sales;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for winning products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="trending">Trending</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="profit">Highest Profit</option>
          </select>
          
          <div className="relative">
            <button
              className="px-3 py-2 border border-gray-300 rounded-md flex items-center"
            >
              <Filter className="h-4 w-4 mr-1" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-medium text-gray-900 mb-4">Filters</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home">Home & Garden</option>
                <option value="Beauty">Beauty & Health</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-md"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
              >
                <option value="">Any Rating</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trend</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={filters.trend}
                onChange={(e) => handleFilterChange('trend', e.target.value)}
              >
                <option value="">All Trends</option>
                <option value="rising">Rising</option>
                <option value="stable">Stable</option>
                <option value="falling">Falling</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Profit Margin</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={filters.minProfit}
                onChange={(e) => handleFilterChange('minProfit', e.target.value)}
              >
                <option value="">Any Margin</option>
                <option value="50">50%+</option>
                <option value="40">40%+</option>
                <option value="30">30%+</option>
                <option value="20">20%+</option>
              </select>
            </div>
            
            <div className="pt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setFilters({
                  category: '',
                  minPrice: '',
                  maxPrice: '',
                  minRating: '',
                  trend: '',
                  minProfit: ''
                })}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-600">
                  Showing {sortedProducts.length} products
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.trend === 'rising' && (
                        <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900 line-clamp-2">{product.name}</h4>
                      
                      <div className="mt-2 flex justify-between">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm">{product.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-1" />
                          <span>{product.category}</span>
                        </div>
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 mr-1" />
                          <span>{product.shipping_time}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center text-green-600">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">{product.profit_margin}% margin</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.sales} sales
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <Button className="w-full">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Import Product
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {sortedProducts.length === 0 && (
                <div className="bg-white p-12 rounded-lg shadow-sm text-center">
                  <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500">
                    Try adjusting your filters or search criteria
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFinder;