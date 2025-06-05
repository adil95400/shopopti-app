import React, { useState, useEffect } from 'react';
import { supplierService } from '../services/supplierService';
import { ExternalSupplier, SupplierProduct, ImportFilter } from '../types/supplier';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Loader2, 
  CheckCircle, 
  ShoppingBag, 
  ArrowRight, 
  Download,
  Plus,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface SupplierImporterProps {
  onImportComplete?: (products: SupplierProduct[]) => void;
}

const SupplierImporter: React.FC<SupplierImporterProps> = ({ onImportComplete }) => {
  const [suppliers, setSuppliers] = useState<ExternalSupplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<ExternalSupplier | null>(null);
  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [filters, setFilters] = useState<ImportFilter>({
    search: '',
    minPrice: undefined,
    maxPrice: undefined,
    minStock: undefined,
    category: undefined,
    page: 1,
    limit: 20
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const fetchedSuppliers = await supplierService.getSuppliers();
      setSuppliers(fetchedSuppliers);
      
      // If there are suppliers, select the first one
      if (fetchedSuppliers.length > 0) {
        setSelectedSupplier(fetchedSuppliers[0]);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    if (!selectedSupplier) return;
    
    try {
      setProductLoading(true);
      const fetchedProducts = await supplierService.getProducts(selectedSupplier.id, filters);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSupplier) {
      fetchProducts();
    }
  }, [selectedSupplier, filters]);

  const handleProductSelect = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleImportFromSupplier = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select at least one product to import');
      return;
    }
    
    if (!selectedSupplier) {
      toast.error('No supplier selected');
      return;
    }
    
    try {
      setImportLoading(true);
      
      // Get the external IDs of the selected products
      const productIds = products
        .filter(p => selectedProducts.includes(p.id))
        .map(p => p.externalId);
      
      // Import from supplier
      const result = await supplierService.importProducts(selectedSupplier.id, productIds);
      
      if (result.success) {
        toast.success(`Successfully imported ${result.importedCount} products from ${selectedSupplier.name}`);
        
        // Get the imported products
        const importedProducts = products.filter(p => selectedProducts.includes(p.id));
        
        // Call the onImportComplete callback if provided
        if (onImportComplete) {
          onImportComplete(importedProducts);
        }
        
        setSelectedProducts([]);
      } else {
        toast.error(`Failed to import products: ${result.message}`);
      }
    } catch (error) {
      console.error('Error importing products from supplier:', error);
      toast.error('Failed to import products from supplier');
    } finally {
      setImportLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ImportFilter, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="space-y-4">
      {loading && suppliers.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium mb-4">Select Supplier</h2>
            
            {suppliers.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No suppliers available</h3>
                <p className="text-gray-500 mb-4">
                  Please contact your administrator to add suppliers
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {suppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedSupplier?.id === supplier.id
                        ? 'border-primary bg-primary-50'
                        : 'border-gray-200 hover:border-primary-200'
                    }`}
                    onClick={() => setSelectedSupplier(supplier)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-2 rounded-full mb-2 ${
                        selectedSupplier?.id === supplier.id
                          ? 'bg-primary-100'
                          : 'bg-gray-100'
                      }`}>
                        <ShoppingBag className={`h-5 w-5 ${
                          selectedSupplier?.id === supplier.id
                            ? 'text-primary'
                            : 'text-gray-500'
                        }`} />
                      </div>
                      <span className="font-medium">{supplier.name}</span>
                      <span className="text-xs text-gray-500 capitalize">{supplier.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedSupplier && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">
                  Products from {selectedSupplier.name}
                </h2>
                
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={fetchProducts}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
              
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home & Garden</option>
                    <option value="beauty">Beauty & Health</option>
                  </select>
                  <Button type="submit">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </form>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="select-all"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    onChange={handleSelectAll}
                    checked={selectedProducts.length > 0 && selectedProducts.length === products.length}
                  />
                  <label htmlFor="select-all" className="ml-2 text-sm text-gray-700">
                    Select All
                  </label>
                </div>
                
                {selectedProducts.length > 0 && (
                  <div className="flex space-x-2">
                    <Button onClick={handleImportFromSupplier} disabled={importLoading}>
                      {importLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Import Selected ({selectedProducts.length})
                    </Button>
                  </div>
                )}
              </div>
              
              {productLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Button onClick={() => setFilters({
                    search: '',
                    minPrice: undefined,
                    maxPrice: undefined,
                    minStock: undefined,
                    category: undefined,
                    page: 1,
                    limit: 20
                  })}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={`border rounded-lg overflow-hidden ${
                        selectedProducts.includes(product.id)
                          ? 'border-primary ring-1 ring-primary'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="relative h-48 bg-gray-100">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-12 w-12 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleProductSelect(product.id)}
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                        
                        <div className="mt-2 flex justify-between">
                          <div>
                            <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                            {product.msrp && product.msrp > product.price && (
                              <p className="text-sm text-gray-500 line-through">${product.msrp.toFixed(2)}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                            {product.sku && (
                              <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <Button
                            variant={selectedProducts.includes(product.id) ? "default" : "outline"}
                            className="w-full"
                            onClick={() => handleProductSelect(product.id)}
                          >
                            {selectedProducts.includes(product.id) ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Selected
                              </>
                            ) : (
                              <>
                                Select
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {products.length > 0 && (
                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Showing {products.length} products
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFilterChange('page', Math.max(1, (filters.page || 1) - 1))}
                      disabled={(filters.page || 1) <= 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SupplierImporter;