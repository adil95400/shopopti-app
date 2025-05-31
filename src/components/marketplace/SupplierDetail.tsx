import React from 'react';
import { B2BSupplier } from '@/services/b2bService';
import { Building, MapPin, Star, Truck, DollarSign, CheckCircle, Globe, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SupplierDetailProps {
  supplier: B2BSupplier;
  onBack: () => void;
  onRequestQuote: () => void;
}

const SupplierDetail: React.FC<SupplierDetailProps> = ({ supplier, onBack, onRequestQuote }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            {supplier.logo_url ? (
              <img
                src={supplier.logo_url}
                alt={supplier.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                <Building className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900">{supplier.name}</h2>
              <div className="flex items-center mt-1">
                <MapPin size={14} className="text-gray-400 mr-1" />
                <span className="text-sm text-gray-500">{supplier.country}</span>
                {supplier.verified && (
                  <>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="flex items-center text-green-600">
                      <CheckCircle size={14} className="mr-1" />
                      Vérifié
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button onClick={onRequestQuote}>
            Demander un devis
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-900 mb-2">Catégorie</h3>
            <p className="text-gray-600">{supplier.category}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-900 mb-2">Délai de livraison</h3>
            <div className="flex items-center">
              <Truck size={16} className="text-gray-400 mr-2" />
              <p className="text-gray-600">{supplier.delivery_delay}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-900 mb-2">Commande minimum</h3>
            <div className="flex items-center">
              <DollarSign size={16} className="text-gray-400 mr-2" />
              <p className="text-gray-600">{supplier.min_order}€</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-2">À propos</h3>
          <p className="text-gray-600">{supplier.description}</p>
        </div>
        
        <div className="pt-6 border-t border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Mail size={16} className="text-gray-400 mr-2" />
              <a href={`mailto:${supplier.contact_email}`} className="text-primary hover:underline">
                {supplier.contact_email}
              </a>
            </div>
            {supplier.website && (
              <div className="flex items-center">
                <Globe size={16} className="text-gray-400 mr-2" />
                <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {supplier.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Retour aux fournisseurs
        </Button>
        <Button onClick={onRequestQuote}>
          Demander un devis
        </Button>
      </div>
    </div>
  );
};

export default SupplierDetail;