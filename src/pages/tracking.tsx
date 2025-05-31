import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Package, Truck, MapPin, Calendar, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { trackingService, TrackingResult } from '../services/trackingService';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import TrackingForm from '../components/tracking/TrackingForm';
import TrackingResult from '../components/tracking/TrackingResult';
import RecentTrackings from '../components/tracking/RecentTrackings';
import BulkTrackingForm from '../components/tracking/BulkTrackingForm';

export default function TrackingPage() {
  const { t } = useTranslation('tracking');
  const [searchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bulkResults, setBulkResults] = useState<TrackingResult[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Check for tracking number in URL params
  useEffect(() => {
    const number = searchParams.get('number');
    if (number) {
      setTrackingNumber(number);
      handleSearch(number);
    }
  }, [searchParams]);

  const handleSearch = async (number?: string) => {
    const trackingToUse = number || trackingNumber;
    
    if (!trackingToUse.trim()) {
      setError(t('error.invalidNumber'));
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const trackingResult = await trackingService.trackPackage(
        trackingToUse, 
        { carrier: carrier !== 'auto' ? carrier : undefined }
      );
      
      setResult(trackingResult);
      toast.success('Informations de suivi récupérées avec succès');
    } catch (err: any) {
      console.error('Erreur de suivi:', err);
      setError(err.message || t('error.generic'));
      setResult(null);
      toast.error(err.message || t('error.generic'));
    } finally {
      setLoading(false);
    }
  };

  const handleBulkTracking = async (trackingNumbers: string[]) => {
    if (trackingNumbers.length === 0) return;
    
    // Limit to 10 tracking numbers
    const limitedNumbers = trackingNumbers.slice(0, 10);
    
    setBulkLoading(true);
    setBulkResults([]);
    
    try {
      const results = await Promise.all(
        limitedNumbers.map(number => 
          trackingService.trackPackage(number)
            .catch(error => {
              console.error(`Error tracking ${number}:`, error);
              return null;
            })
        )
      );
      
      // Filter out failed results
      const successfulResults = results.filter(Boolean) as TrackingResult[];
      setBulkResults(successfulResults);
      
      if (successfulResults.length > 0) {
        toast.success(`${successfulResults.length} colis suivis avec succès`);
      } else {
        toast.error('Aucun colis n\'a pu être suivi');
      }
    } catch (error) {
      console.error('Error in bulk tracking:', error);
      toast.error('Une erreur est survenue lors du suivi en masse');
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <div className="text-sm text-gray-500">{t('subtitle')}</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <TrackingForm 
          onSubmit={(number, selectedCarrier) => {
            setTrackingNumber(number);
            setCarrier(selectedCarrier);
            handleSearch(number);
          }}
          loading={loading}
        />
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{t('error.title')}</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <TrackingResult result={result} />
      )}

      <RecentTrackings />

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium mb-4">{t('bulk.title')}</h2>
        <BulkTrackingForm 
          onSubmit={handleBulkTracking}
          loading={bulkLoading}
        />
      </div>

      {bulkResults.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-lg font-medium">Résultats du suivi en masse</h2>
          {bulkResults.map((result, index) => (
            <TrackingResult key={index} result={result} />
          ))}
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <Package className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">{t('info.title')}</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>{t('info.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}