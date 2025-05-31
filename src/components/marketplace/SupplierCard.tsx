import React from 'react';
import { B2BSupplier } from '@/services/b2bService';
import { Building, MapPin, Star, Truck, DollarSign, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SupplierCardProps {
  supplier: B2BSupplier;
  onClick: (supplier: B2BSupplier) => void;
}

const SupplierCard: React.FC<SupplierCardProps> = ({ supplier, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(supplier)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            {supplier.logo_url ? (
              <img
                src={supplier.logo_url}
                alt={supplier.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                <Building className="h-6 w-6 text-gray-400" />
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
              <CheckCircle size={16} />
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {supplier.description}
        </p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-xs text-gray-500">Catégorie</p>
            <p className="font-medium">{supplier.category}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-xs text-gray-500">Note</p>
            <div className="flex items-center">
              <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
              <span className="font-medium">{supplier.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-xs text-gray-500">Délai</p>
            <div className="flex items-center">
              <Truck size={14} className="text-gray-400 mr-1" />
              <p className="font-medium">{supplier.delivery_delay}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-xs text-gray-500">Commande min.</p>
            <div className="flex items-center">
              <DollarSign size={14} className="text-gray-400 mr-1" />
              <p className="font-medium">{supplier.min_order}€</p>
            </div>
          </div>
        </div>
        
        <Button className="w-full">
          Voir les produits
        </Button>
      </div>
    </div>
  );
};

export default SupplierCard;