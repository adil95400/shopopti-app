import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, MapPin, Truck, DollarSign, Star } from 'lucide-react';

export default function FournisseurCard({ data }: { data: any }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">{data.name}</h2>
        {data.verified && (
          <span className="text-green-600 text-sm flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            Vérifié
          </span>
        )}
      </div>
      
      <div className="flex items-center text-gray-600 text-sm">
        <MapPin className="h-4 w-4 mr-1" />
        <span>{data.country}</span>
        <span className="mx-2">•</span>
        <span>{data.category}</span>
      </div>
      
      <div className="flex items-center text-gray-600 text-sm">
        <Truck className="h-4 w-4 mr-1" />
        <span>Délai : {data.delivery_delay}</span>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-600">
          <DollarSign className="h-4 w-4 mr-1" />
          <span>Min : {data.min_order}€</span>
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
          <span className="font-medium">{data.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <Button variant="default" className="w-full mt-2">
        Voir les produits
      </Button>
    </div>
  );
}