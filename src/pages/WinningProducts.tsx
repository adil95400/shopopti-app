import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Search, 
  Filter, 
  ExternalLink, 
  ShoppingBag,
  Flame,
  Eye,
  DollarSign 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useShop } from '../contexts/ShopContext';

// Mock trending products data
const mockTrendingProducts = [
  {
    id: '1',
    name: 'Smart Water Bottle with Temperature Display',
    image: 'https://images.pexels.com/photos/4065906/pexels-photo-4065906.jpeg?auto=compress&cs=tinysrgb&w=300',
    score: 95,
    trend: 'rising',
    price: { min: 15.99, max: 29.99 },
    category: 'Health & Wellness',
    source: 'aliexpress',
    margin: 68,
    competition: 'Low'
  },
  {
    id: '2',
    name: 'Portable LED Ring Light for Smartphones',
    image: 'https://images.pexels.com/photos/3845162/pexels-photo-3845162.jpeg?auto=compress&cs=tinysrgb&w=300',
    score: 89,
    trend: 'rising',
    price: { min: 9.99, max: 24.99 },
    category: 'Electronics',
    source: 'aliexpress',
    margin: 72,
    competition: 'Medium'
  },
  {
    id: '3',
    name: 'Electric Herb Grinder with USB Charging',
    image: 'https://images.pexels.com/photos/4226896/pexels-photo-4226896.jpeg?auto=compress&cs=tinysrgb&w=300',
    score: 87,
    trend: 'stable',
    price: { min: 18.99, max: 35.99 },
    category: 'Kitchen',
    source: 'aliexpress',
    margin: 65,
    competition: 'Low'
  },
  {
    id: '4',
    name: 'Collapsible Silicone Food Storage Containers',
    image: 'https://images.pexels.com/photos/5765828/pexels-photo-5765828.jpeg?auto=compress&cs=tinysrgb&w=300',
    score: 82,
    trend: 'rising',
    price: { min: 12.99, max: 29.99 },
    category: 'Home & Kitchen',
    source: 'amazon',
    margin: 58,
    competition: 'Medium'
  },
  {
    id: '5',
    name: 'UV Phone Sanitizer and Wireless Charger',
    image: 'https://images.pexels.com/photos/5083400/pexels-photo-5083400.jpeg?auto=compress&cs=tinysrgb&w=300',
    score: 79,
    trend: 'stable',
    price: { min: 24.99, max: 39.99 },
    category: 'Electronics',
    source: 'aliexpress',
    margin: 62,
    competition: 'High'
  },
];

const WinningProducts: React.FC = () => {
  const { isConnected } = useShop();
  const [products] = useState(mockTrendingProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter products based on search query and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories
  const categories = ['All', ...new Set(products.map(product => product.category))];

  const scoreColor = (score: number) => {
    if (score >= 90) return 'text-success-400';
    if (score >= 80) return 'text-primary-400';
    if (score >= 70) return 'text-accent-400';
    return 'text-neutral-500';
  };

  const trendIcon = (trend: string) => {
    switch(trend) {
      case 'rising':
        return <TrendingUp size={16} className="text-success-400" />;
      case 'stable':
        return <Flame size={16} className="text-accent-400" />;
      default:
        return null;
    }
  };

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-neutral-100 p-3">
          <Sparkles size={28} className="text-neutral-400" />
        </div>
        <h2 className="mt-4 text-lg font-medium text-neutral-900">No store connected</h2>
        <p className="mt-1 text-neutral-500">Connect your store to discover winning products</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">Winning Products</h1>
          <p className="text-neutral-500">
            AI-powered product research and trend analysis.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search for products..."
              className="input pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline">
              <Filter size={16} className="mr-2" />
              Filters
            </button>
            <select
              className="input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-lg border border-neutral-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 bg-white/90 m-2 px-2 py-1 rounded-md text-sm font-medium flex items-center space-x-1">
                  <Sparkles size={14} className={scoreColor(product.score)} />
                  <span className={scoreColor(product.score)}>{product.score}% Score</span>
                </div>
                <div className="absolute bottom-0 left-0 bg-black/60 m-2 px-2 py-1 rounded-md text-xs text-white font-medium">
                  {product.source === 'aliexpress' ? 'AliExpress' : 'Amazon'}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-medium text-neutral-900 line-clamp-2">{product.name}</h3>
                <div className="mt-2 flex justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">{product.category}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {trendIcon(product.trend)}
                    <span className="text-sm capitalize">
                      {product.trend === 'rising' ? 'Trending' : 'Stable'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-md bg-neutral-50 p-2 text-center">
                    <div className="flex items-center justify-center text-accent-400 mb-1">
                      <DollarSign size={14} />
                    </div>
                    <p className="text-xs text-neutral-500">Price Range</p>
                    <p className="text-sm font-medium">${product.price.min}-{product.price.max}</p>
                  </div>
                  <div className="rounded-md bg-neutral-50 p-2 text-center">
                    <div className="flex items-center justify-center text-primary-400 mb-1">
                      <Eye size={14} />
                    </div>
                    <p className="text-xs text-neutral-500">Competition</p>
                    <p className="text-sm font-medium">{product.competition}</p>
                  </div>
                  <div className="rounded-md bg-neutral-50 p-2 text-center">
                    <div className="flex items-center justify-center text-success-400 mb-1">
                      <TrendingUp size={14} />
                    </div>
                    <p className="text-xs text-neutral-500">Margin</p>
                    <p className="text-sm font-medium">{product.margin}%</p>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="btn btn-primary flex-1">
                    <ShoppingBag size={16} className="mr-2" />
                    Import
                  </button>
                  <button className="btn btn-outline">
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <div className="flex flex-col items-center">
              <Search className="h-8 w-8 text-neutral-300" />
              <h3 className="mt-2 text-sm font-medium text-neutral-900">No products found</h3>
              <p className="mt-1 text-sm text-neutral-500">Try adjusting your search or filters.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinningProducts;