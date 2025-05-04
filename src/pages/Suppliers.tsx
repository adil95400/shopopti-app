import React, { useState, useEffect } from 'react';
import { Building, Search, Filter, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShopContext } from '../contexts/ShopContext';
import { supplierService, Supplier } from '../services/supplierService';
import SupplierList from '../components/suppliers/SupplierList';
import SupplierFilters from '../components/suppliers/SupplierFilters';

const Suppliers: React.FC = () => {
  const { isConnected } = useShopContext();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    country: '',
    category: '',
    verified: false,
    minRating: 0,
    dropshippingOnly: true
  });

  useEffect(() => {
    loadSuppliers();
  }, [filters]);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const data = await supplierService.getDropshippingSuppliers(filters);
      setSuppliers(data);
    } catch (err) {
      setError('Failed to load suppliers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSupplierClick = async (supplier: Supplier) => {
    try {
      const products = await supplierService.getSupplierProducts(supplier.id);
      // Handle displaying products...
    } catch (err) {
      console.error('Failed to load supplier products:', err);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-neutral-100 p-3">
          <Building size={28} className="text-neutral-400" />
        </div>
        <h2 className="mt-4 text-lg font-medium text-neutral-900">No store connected</h2>
        <p className="mt-1 text-neutral-500">Connect your store to browse suppliers</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">Dropshipping Suppliers</h1>
          <p className="text-neutral-500">
            Find and connect with verified dropshipping suppliers worldwide
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <SupplierFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={() => setFilters({
              country: '',
              category: '',
              verified: false,
              minRating: 0,
              dropshippingOnly: true
            })}
          />
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <div className="rounded-lg bg-error-50 p-4 text-error-500">
              {error}
            </div>
          ) : (
            <SupplierList
              suppliers={suppliers}
              onSupplierClick={handleSupplierClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Suppliers;