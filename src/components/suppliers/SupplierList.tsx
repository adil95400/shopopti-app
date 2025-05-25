import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Package, Clock, Shield, ExternalLink, Globe, TrendingUp, DollarSign, Check } from 'lucide-react';
import { Supplier } from '../../services/supplierService';

interface SupplierListProps {
  suppliers: Supplier[];
  onSupplierClick: (supplier: Supplier) => void;
}

const SupplierList: React.FC<SupplierListProps> = ({ suppliers, onSupplierClick }) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {suppliers.map((supplier) => (
        <motion.div
          key={supplier.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="card hover:shadow-md transition-shadow cursor-pointer group"
          onClick={() => onSupplierClick(supplier)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {supplier.logo ? (
                <img 
                  src={supplier.logo} 
                  alt={supplier.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-primary-400/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary-400" />
                </div>
              )}
              <div>
                <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                  {supplier.name}
                </h3>
                <div className="flex items-center mt-1">
                  <MapPin size={14} className="text-accent-400 mr-1" />
                  <span className="text-sm text-accent-200">{supplier.country}</span>
                </div>
              </div>
            </div>
            {supplier.verified && (
              <div className="bg-primary-400/10 text-primary-400 p-1.5 rounded-md">
                <Shield size={16} />
              </div>
            )}
          </div>

          {supplier.description && (
            <p className="mt-3 text-sm text-accent-200 line-clamp-2">
              {supplier.description}
            </p>
          )}

          <div className="mt-4 flex items-center space-x-4">
            <div className="flex items-center">
              <Star size={14} className="text-warning-400 fill-warning-400" />
              <span className="ml-1 text-sm font-medium text-white">{supplier.rating.toFixed(1)}</span>
            </div>
            <span className="text-accent-400">•</span>
            <div className="flex items-center">
              <Package size={14} className="text-accent-400 mr-1" />
              <span className="text-sm text-accent-200">{supplier.products_count.toLocaleString()} products</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-md bg-secondary-400 p-2">
              <p className="text-xs text-accent-200">Processing Time</p>
              <div className="mt-1 flex items-center">
                <Clock size={14} className="text-accent-400 mr-1" />
                <p className="text-sm font-medium text-white">{supplier.processing_time}</p>
              </div>
            </div>
            <div className="rounded-md bg-secondary-400 p-2">
              <p className="text-xs text-accent-200">Min. Order</p>
              <div className="mt-1 flex items-center">
                <DollarSign size={14} className="text-accent-400 mr-1" />
                <p className="text-sm font-medium text-white">${supplier.minimum_order}</p>
              </div>
            </div>
          </div>

          {supplier.performance && (
            <div className="mt-4 p-3 bg-success-400/10 rounded-md">
              <div className="flex items-center text-success-400">
                <TrendingUp size={14} className="mr-1" />
                <span className="text-sm font-medium">High Performance Supplier</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-success-400">
                <div className="flex items-center">
                  <Check size={12} className="mr-1" />
                  On-time: {supplier.performance.on_time_delivery}%
                </div>
                <div className="flex items-center">
                  <Check size={12} className="mr-1" />
                  Quality: {supplier.performance.quality_rating}%
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex space-x-2">
            <button 
              className="btn btn-primary flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onSupplierClick(supplier);
              }}
            >
              View Products
            </button>
            <button 
              className="btn btn-outline"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`/suppliers/${supplier.id}`, '_blank');
              }}
            >
              <ExternalLink size={16} />
            </button>
          </div>
        </motion.div>
      ))}

      {suppliers.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="flex flex-col items-center">
            <Package className="h-12 w-12 text-accent-400" />
            <h3 className="mt-4 text-lg font-medium text-white">No suppliers found</h3>
            <p className="mt-2 text-accent-200">Try adjusting your filters or search criteria</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierList;