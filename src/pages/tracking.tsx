import React from 'react';
import { Package, AlertTriangle } from 'lucide-react';
import { useTracking } from '../hooks/useTracking';
import TrackingForm from '../components/tracking/TrackingForm';
import TrackingResult from '../components/tracking/TrackingResult';
import { useTranslation } from 'react-i18next';

export default function TrackingPage() {
  const { t } = useTranslation();
  const { 
    trackingNumber, 
    setTrackingNumber, 
    carrier, 
    setCarrier, 
    loading, 
    result, 
    error, 
    trackPackage 
  } = useTracking();

  const handleSubmit = (trackingNumber: string, carrier: string) => {
    trackPackage(trackingNumber, carrier);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Suivi de livraison</h1>
        <div className="text-sm text-gray-500">Suivi multi-transporteurs</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <TrackingForm onSubmit={handleSubmit} loading={loading} />
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur de suivi</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {result && <TrackingResult result={result} />}

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <Package className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Suivi multi-transporteurs</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Notre système prend en charge le suivi de colis pour plus de 600 transporteurs dans le monde entier, dont FedEx, UPS, DHL, La Poste, Colissimo, et bien d'autres.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}