import React, { useState, useEffect } from 'react';
import { Search, Filter, Tag, DollarSign, Truck, Star, ShoppingBag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';

interface Supplier {
  id: string;
  name: string;
  country: string;
  logo?: string;
  rating: number;
  verified: boolean;
  categories: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  retail_price: number;
  images: string[];
  category: string;
  moq: number;
  processing_time: string;
}

const SupplierCatalogImporter: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    country: '',
    verifiedOnly: false
  });
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (selectedSupplier) {
      fetchProducts(selectedSupplier);
    }
  }, [selectedSupplier]);

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

  const fetchProducts = async (supplierId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('supplier_products')
        .select('*')
        .eq('supplier_id', supplierId);
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportSelected = async () => {
    if (selectedProducts.length === 0) return;
    
    try {
      setLoading(true);
      
      // In a real app, you would import these products to your store
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Successfully imported ${selectedProducts.length} products`);
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error importing products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    if (filters.verifiedOnly && !supplier.verified) return false;
    if (filters.country && !supplier.country.toLowerCase().includes(filters.country.toLowerCase())) return false;
    if (searchTerm && !supplier.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const filteredProducts = products.filter(product => {
    if (filters.category && !product.category.toLowerCase().includes(filters.category.toLowerCase())) return false;
    if (filters.minPrice && product.base_price < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && product.base_price > parseFloat(filters.maxPrice)) return false;
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Suppliers</h3>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search suppliers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Filters</h4>
              <button
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() => setFilters({
                  category: '',
                  minPrice: '',
                  maxPrice: '',
                  country: '',
                  verifiedOnly: false
                })}
              >
                Reset
              </button>
            </div>
            
            <div className="mt-2 space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Country</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={filters.country}
                  onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                >
                  <option value="">All Countries</option>
                  <option value="US">United States</option>
                  <option value="CN">China</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="verified-only"
                  checked={filters.verifiedOnly}
                  onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="verified-only" className="ml-2 block text-sm text-gray-600">
                  Verified suppliers only
                </label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loading && !selectedSupplier ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              filteredSuppliers.map(supplier => (
                <div
                  key={supplier.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSupplier === supplier.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-gray-200'
                  }`}
                  onClick={() => setSelectedSupplier(supplier.id)}
                >
                  <div className="flex items-center">
                    {supplier.logo ? (
                      <img
                        src={supplier.logo}
                        alt={supplier.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {supplier.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="ml-3">
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-900">{supplier.name}</h4>
                        {supplier.verified && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{supplier.country}</span>
                        <span className="mx-1">•</span>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 mr-1" />
                          <span>{supplier.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {filteredSuppliers.length === 0 && !loading && (
              <div className="text-center py-4 text-gray-500">
                No suppliers found matching your criteria
              </div>
            )}
          </div>
        </div>
        
        <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {selectedSupplier
                ? `Products from ${suppliers.find(s => s.id === selectedSupplier)?.name || 'Supplier'}`
                : 'Select a supplier to view products'}
            </h3>
            
            {selectedProducts.length > 0 && (
              <Button onClick={handleImportSelected}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Import Selected ({selectedProducts.length})
              </Button>
            )}
          </div>
          
          {selectedSupplier && (
            <div className="mb-4 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
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
                    <span>Filters</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {loading && selectedSupplier ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : selectedSupplier ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className={`border rounded-lg overflow-hidden ${
                    selectedProducts.includes(product.id)
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="relative h-48">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/300x200'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 line-clamp-2">{product.name}</h4>
                    
                    <div className="mt-2 flex justify-between">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">${product.base_price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">{product.category}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-1" />
                        <span>{product.processing_time}</span>
                      </div>
                      <div>MOQ: {product.moq}</div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <Button
                        onClick={() => toggleProductSelection(product.id)}
                        variant={selectedProducts.includes(product.id) ? 'outline' : 'default'}
                        className="w-full"
                      >
                        {selectedProducts.includes(product.id) ? 'Selected' : 'Select Product'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredProducts.length === 0 && (
                <div className="col-span-2 text-center py-12 text-gray-500">
                  No products found matching your criteria
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <ShoppingBag className="h-12 w-12 mb-4 text-gray-300" />
              <p>Select a supplier to view their products</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierCatalogImporter;