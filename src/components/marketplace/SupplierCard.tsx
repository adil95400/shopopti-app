import React from 'react';
import { MapPin, Star, Truck, DollarSign, Check, Globe } from 'lucide-react';
import { Button } from '../ui/button';

interface SupplierCardProps {
  supplier: {
    id: string;
    name: string;
    country: string;
    logo?: string;
    description: string;
    category: string;
    rating: number;
    processing_time: string;
    minimum_order: number;
    verified: boolean;
    performance?: {
      on_time_delivery: number;
      quality_rating: number;
      response_rate: number;
      response_time: string;
    };
  };
  onClick?: (id: string) => void;
}

const SupplierCard: React.FC<SupplierCardProps> = ({ supplier, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick && onClick(supplier.id)}
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
              <div className="flex items-center mt-1">
                <MapPin size={14} className="text-gray-400 mr-1" />
                <span className="text-sm text-gray-500">{supplier.country}</span>
              </div>
            </div>
          </div>
          {supplier.verified && (
            <div className="bg-green-100 text-green-800 p-1.5 rounded-md">
              <Check size={16} />
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{supplier.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-xs text-gray-500">Rating</p>
            <div className="flex items-center">
              <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
              <span className="font-medium">{supplier.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-xs text-gray-500">Category</p>
            <p className="font-medium">{supplier.category}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-xs text-gray-500">Processing Time</p>
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
              <Check className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm font-medium text-green-800">Performance Metrics</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <Truck className="h-3 w-3 text-green-600 mr-1" />
                <span>On-time: {supplier.performance.on_time_delivery}%</span>
              </div>
              <div className="flex items-center">
                <Star className="h-3 w-3 text-green-600 mr-1" />
                <span>Quality: {supplier.performance.quality_rating}%</span>
              </div>
            </div>
          </div>
        )}

        <Button className="w-full">
          View Products
        </Button>
      </div>
    </div>
  );
};

export default SupplierCard;