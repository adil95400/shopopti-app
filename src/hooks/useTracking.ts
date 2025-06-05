import { useState, useTransition } from 'react';
import { trackingService, TrackingResult } from '../services/trackingService';
import { toast } from 'sonner';

export function useTracking() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('auto');
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const trackPackage = async (number?: string, selectedCarrier?: string) => {
    const trackingToUse = number || trackingNumber;
    const carrierToUse = selectedCarrier || carrier;
    
    if (!trackingToUse.trim()) {
      setError("Veuillez entrer un numéro de suivi");
      return;
    }

    startTransition(async () => {
      setError(null);
      
      try {
        const trackingResult = await trackingService.trackPackage(
          trackingToUse, 
          { carrier: carrierToUse !== 'auto' ? carrierToUse : undefined }
        );
        
        setResult(trackingResult);
        toast.success('Informations de suivi récupérées avec succès');
      } catch (err: any) {
        console.error('Erreur de suivi:', err);
        setError(err.message || "Une erreur est survenue lors du suivi du colis");
        setResult(null);
        toast.error(err.message || "Une erreur est survenue lors du suivi du colis");
      }
    });
  };

  return {
    trackingNumber,
    setTrackingNumber,
    carrier,
    setCarrier,
    isPending,
    result,
    error,
    trackPackage
  };
}