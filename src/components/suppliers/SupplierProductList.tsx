import React from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, Truck, Clock, Star, ShoppingBag } from 'lucide-react';
import { SupplierProduct } from '../../services/supplierService';

interface SupplierProductListProps {
  products: SupplierProduct[];
  onImport: (product: SupplierProduct) => void;
}

const SupplierProductList: React.FC<SupplierProductListProps> = ({
  products,
  onImport
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
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
              alt={product.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          <h3 className="font-medium text-neutral-900 line-clamp-2">
            {product.title}
          </h3>

          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-lg font-bold text-neutral-900">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-neutral-500 line-through">
              ${product.msrp.toFixed(2)}
            </span>
            <span className="text-sm text-success-400">
              {Math.round(((product.msrp - product.price) / product.msrp) * 100)}% margin
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-md bg-neutral-50 p-2">
              <div className="flex items-center text-neutral-600">
                <Package size={14} className="mr-1" />
                <span className="text-xs">MOQ</span>
              </div>
              <p className="mt-1 text-sm font-medium">{product.moq} units</p>
            </div>
            <div className="rounded-md bg-neutral-50 p-2">
              <div className="flex items-center text-neutral-600">
                <Clock size={14} className="mr-1" />
                <span className="text-xs">Processing</span>
              </div>
              <p className="mt-1 text-sm font-medium">{product.lead_time}</p>
            </div>
          </div>

          {product.customization?.available && (
            <div className="mt-3 p-2 bg-primary-50 rounded-md">
              <p className="text-sm text-primary-600">
                Customization available ({product.customization.options?.length} options)
              </p>
              {product.customization.min_quantity && (
                <p className="text-xs text-primary-500 mt-1">
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
                  className="px-2 py-1 text-xs bg-neutral-100 text-neutral-600 rounded-md"
                >
                  {cert}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={() => onImport(product)}
            className="btn btn-primary w-full mt-4"
          >
            <ShoppingBag size={16} className="mr-2" />
            Import Product
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default SupplierProductList;