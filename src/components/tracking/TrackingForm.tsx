import React, { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TrackingFormProps {
  onSubmit: (trackingNumber: string, carrier: string) => void;
  loading: boolean;
}

const TrackingForm: React.FC<TrackingFormProps> = ({ onSubmit, loading }) => {
  const { t } = useTranslation('tracking');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('auto');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      startTransition(() => {
        onSubmit(trackingNumber, carrier);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('form.trackingNumber')}
        </label>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={t('form.trackingNumberPlaceholder')}
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <Button type="submit" disabled={loading || isPending || !trackingNumber.trim()}>
            {loading || isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('form.searching')}
              </>
            ) : (
              <>
                <Package className="mr-2 h-4 w-4" />
                {t('form.track')}
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('form.carrier')}
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={carrier}
          onChange={(e) => setCarrier(e.target.value)}
        >
          <option value="auto">{t('form.autoDetect')}</option>
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