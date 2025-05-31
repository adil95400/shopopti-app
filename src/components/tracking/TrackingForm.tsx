import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';

interface TrackingFormProps {
  onSubmit: (trackingNumber: string, carrier: string) => void;
  loading: boolean;
}

const TrackingForm: React.FC<TrackingFormProps> = ({ onSubmit, loading }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('auto');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      onSubmit(trackingNumber, carrier);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Numéro de suivi
        </label>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Entrez votre numéro de suivi"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <Button type="submit" disabled={loading || !trackingNumber.trim()}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recherche...
              </>
            ) : (
              'Suivre'
            )}
          </Button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Transporteur (optionnel)
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={carrier}
          onChange={(e) => setCarrier(e.target.value)}
        >
          <option value="auto">Détection automatique</option>
          <option value="fedex">FedEx</option>
          <option value="ups">UPS</option>
          <option value="dhl">DHL</option>
          <option value="laposte">La Poste</option>
          <option value="colissimo">Colissimo</option>
          <option value="chronopost">Chronopost</option>
          <option value="dpd">DPD</option>
          <option value="gls">GLS</option>
          <option value="tnt">TNT</option>
        </select>
      </div>
    </form>
  );
};

export default TrackingForm;