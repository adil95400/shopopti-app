import React from 'react';
import { Filter, Star, Shield, MapPin, Clock, Package, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SupplierFiltersProps {
  filters: {
    country: string;
    category: string;
    verified: boolean;
    minRating: number;
    processingTime?: string;
    minOrderValue?: number;
  };
  onFilterChange: (key: string, value: any) => void;
  onReset: () => void;
  onSearch: (query: string) => void;
}

const SupplierFilters: React.FC<SupplierFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  onSearch
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-lg border border-neutral-200 p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-neutral-900">Filters</h3>
        <button
          onClick={onReset}
          className="text-sm text-primary-500 hover:text-primary-600"
        >
          Reset
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          placeholder="Search suppliers..."
          className="input pl-10 w-full"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Minimum Rating
        </label>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => onFilterChange('minRating', rating)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md ${
                filters.minRating === rating
                  ? 'bg-primary-50 text-primary-600'
                  : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Star
                size={14}
                className={filters.minRating === rating ? 'fill-primary-500' : ''}
              />
              <span>{rating}+</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Verification
        </label>
        <button
          onClick={() => onFilterChange('verified', !filters.verified)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md w-full ${
            filters.verified
              ? 'bg-primary-50 text-primary-600'
              : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Shield size={16} />
          <span>Verified Suppliers Only</span>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Processing Time
        </label>
        <select
          className="input w-full"
          value={filters.processingTime}
          onChange={(e) => onFilterChange('processingTime', e.target.value)}
        >
          <option value="">Any</option>
          <option value="1-2">1-2 days</option>
          <option value="3-5">3-5 days</option>
          <option value="5+">5+ days</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Minimum Order Value
        </label>
        <select
          className="input w-full"
          value={filters.minOrderValue}
          onChange={(e) => onFilterChange('minOrderValue', e.target.value)}
        >
          <option value="">Any</option>
          <option value="100">$100+</option>
          <option value="500">$500+</option>
          <option value="1000">$1,000+</option>
          <option value="5000">$5,000+</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Shipping From
        </label>
        <select
          className="input w-full"
          value={filters.country}
          onChange={(e) => onFilterChange('country', e.target.value)}
        >
          <option value="">All Countries</option>
          <option value="US">United States</option>
          <option value="CN">China</option>
          <option value="UK">United Kingdom</option>
          <option value="EU">European Union</option>
        </select>
      </div>
    </motion.div>
  );
};

export default SupplierFilters;