import React, { useState, useEffect, useTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import { trackingService, TrackingResult } from '../services/trackingService';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import TrackingForm from '../components/tracking/TrackingForm';
import TrackingResultComponent from '../components/tracking/TrackingResult';
import RecentTrackings from '../components/tracking/RecentTrackings';
import BulkTrackingForm from '../components/tracking/BulkTrackingForm';
import { Package, AlertTriangle } from 'lucide-react';
import MainNavbar from '../components/layout/MainNavbar';
import Footer from '../components/layout/Footer';

export default function TrackingPage() {
  const { t } = useTranslation('tracking');
  const [searchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('auto');
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bulkResults, setBulkResults] = useState<TrackingResult[]>([]);
  const [isPending, startTransition] = useTransition();

  const performTracking = async (number: string, selectedCarrier: string = 'auto') => {
    if (!number.trim()) {
      throw new Error(t('error.invalidNumber'));
    }

    return await trackingService.trackPackage(
      number,
      { carrier: selectedCarrier !== 'auto' ? selectedCarrier : undefined }
    );
  };

  useEffect(() => {
    const number = searchParams.get('number');
    if (number) {
      startTransition(async () => {
        try {
          setTrackingNumber(number);
          setError(null);
          
          const trackingResult = await performTracking(number, carrier);
          setResult(trackingResult);
          toast.success('Informations de suivi récupérées avec succès');
        } catch (err: any) {
          console.error('Erreur de suivi:', err);
          setError(err.message || t('error.generic'));
          setResult(null);
          toast.error(err.message || t('error.generic'));
        }
      });
    }
  }, [searchParams, carrier, t]);

  const handleSearch = async (number: string, selectedCarrier: string) => {
    startTransition(async () => {
      try {
        setError(null);
        
        const trackingResult = await performTracking(number, selectedCarrier);
        setResult(trackingResult);
        toast.success('Informations de suivi récupérées avec succès');
      } catch (err: any) {
        console.error('Erreur de suivi:', err);
        setError(err.message || t('error.generic'));
        setResult(null);
        toast.error(err.message || t('error.generic'));
      }
    });
  };

  const handleBulkTracking = async (trackingNumbers: string[]) => {
    if (trackingNumbers.length === 0) return;

    const limitedNumbers = trackingNumbers.slice(0, 10);

    startTransition(async () => {
      try {
        setBulkResults([]);

        const results = await Promise.all(
          limitedNumbers.map(number =>
            performTracking(number).catch(error => {
              console.error(`Error tracking ${number}:`, error);
              return null;
            })
          )
        );

        const successfulResults = results.filter(Boolean) as TrackingResult[];
        setBulkResults(successfulResults);

        if (successfulResults.length > 0) {
          toast.success(`${successfulResults.length} colis suivis avec succès`);
        } else {
          toast.error("Aucun colis n'a pu être suivi");
        }
      } catch (error) {
        console.error('Error in bulk tracking:', error);
        toast.error('Une erreur est survenue lors du suivi en masse');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <div className="text-sm text-gray-500">{t('subtitle')}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <TrackingForm 
            onSubmit={(number, selectedCarrier) => {
              setTrackingNumber(number);
              setCarrier(selectedCarrier);
              handleSearch(number, selectedCarrier);
            }}
            loading={isPending}
          />
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
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
          <div className="mb-6">
            <TrackingResultComponent result={result} />
          </div>
        )}

        <RecentTrackings />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-medium mb-4">{t('bulk.title')}</h2>
          <BulkTrackingForm 
            onSubmit={handleBulkTracking}
            loading={isPending}
          />
        </div>

        {bulkResults.length > 0 && (
          <div className="space-y-6 mb-6">
            <h2 className="text-lg font-medium">Résultats du suivi en masse</h2>
            {bulkResults.map((result, index) => (
              <TrackingResultComponent key={index} result={result} />
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
      <Footer />
    </div>
  );
}