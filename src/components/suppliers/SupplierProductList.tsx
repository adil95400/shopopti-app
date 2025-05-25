import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, Truck, Clock, Star, ShoppingBag, Check, Search, Filter } from 'lucide-react';
import { Supplier } from '../../services/supplierService';
import { supplierService } from '../../services/supplierService';

interface SupplierProductListProps {
  supplier: Supplier;
  onBack: () => void;
}

const SupplierProductList: React.FC<SupplierProductListProps> = ({ supplier, onBack }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, [supplier.id]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await supplierService.getSupplierProducts(supplier.id);
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="input w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline">
            <Filter size={16} className="mr-2" />
            Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-error-400/10 p-4 text-error-400">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="aspect-w-4 aspect-h-3 mb-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              <h3 className="font-medium text-white line-clamp-2">
                {product.name}
              </h3>

              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-lg font-bold text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.msrp && (
                  <>
                    <span className="text-sm text-accent-200 line-through">
                      ${product.msrp.toFixed(2)}
                    </span>
                    <span className="text-sm text-success-400">
                      {Math.round(((product.msrp - product.price) / product.msrp) * 100)}% margin
                    </span>
                  </>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-md bg-secondary-400 p-2">
                  <div className="flex items-center text-accent-200">
                    <Package size={14} className="mr-1" />
                    <span className="text-xs">MOQ</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-white">{product.moq} units</p>
                </div>
                <div className="rounded-md bg-secondary-400 p-2">
                  <div className="flex items-center text-accent-200">
                    <Clock size={14} className="mr-1" />
                    <span className="text-xs">Processing</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-white">{product.processing_time}</p>
                </div>
              </div>

              {product.customization?.available && (
                <div className="mt-3 p-2 bg-primary-400/10 rounded-md">
                  <p className="text-sm text-primary-400">
                    Customization available ({product.customization.options?.length} options)
                  </p>
                  {product.customization.min_quantity && (
                    <p className="text-xs text-primary-400 mt-1">
                      Min. quantity: {product.customization.min_quantity} units
                    </p>
                  )}
                </div>
              )}

              {product.certifications?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {product.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-secondary-400 text-accent-200 rounded-md"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              )}

              <button className="btn btn-primary w-full mt-4">
                <ShoppingBag size={16} className="mr-2" />
                Import Product
              </button>
            </motion.div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Package className="h-12 w-12 text-accent-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-white">No products found</h3>
              <p className="mt-2 text-accent-200">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SupplierProductList;