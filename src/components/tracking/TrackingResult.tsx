import React from 'react';
import { Button } from '@/components/ui/button';
import { TrackingResult as TrackingResultType } from '../../services/trackingService';
import TrackingHistory from './TrackingHistory';
import PackageStatusBadge from './PackageStatusBadge';

interface TrackingResultProps {
  result: TrackingResultType;
}

const TrackingResult: React.FC<TrackingResultProps> = ({ result }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center">
            <h2 className="text-lg font-medium">Colis {result.trackingNumber}</h2>
            <div className="ml-3">
              <PackageStatusBadge status={result.status} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Transporteur: {result.carrier}
          </p>
        </div>
        
        {result.estimatedDelivery && (
          <div className="text-right">
            <p className="text-sm text-gray-500">Livraison estimée</p>
            <p className="font-medium">{result.estimatedDelivery}</p>
          </div>
        )}
      </div>
      
      <TrackingHistory result={result} />
      
      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="flex justify-between">
          <Button variant="outline">
            Imprimer
          </Button>
          <Button>
            Contacter le transporteur
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrackingResult;