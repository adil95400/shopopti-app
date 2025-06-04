import React from 'react';
import { Button } from '@/components/ui/button';
import { TrackingResult as TrackingResultType } from '../../services/trackingService';
import TrackingHistory from './TrackingHistory';
import PackageStatusBadge from './PackageStatusBadge';
import { useTranslation } from 'react-i18next';
import { Printer, Phone } from 'lucide-react';

interface TrackingResultProps {
  result: TrackingResultType;
}

const TrackingResult: React.FC<TrackingResultProps> = ({ result }) => {
  const { t } = useTranslation('tracking');
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center">
            <h2 className="text-lg font-medium">{t('result.package')} {result.trackingNumber}</h2>
            <div className="ml-3">
              <PackageStatusBadge status={result.status} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {t('result.carrier')}: {result.carrier}
          </p>
        </div>
        
        {result.estimatedDelivery && (
          <div className="text-right">
            <p className="text-sm text-gray-500">{t('result.estimatedDelivery')}</p>
            <p className="font-medium">{result.estimatedDelivery}</p>
          </div>
        )}
      </div>
      
      <TrackingHistory result={result} />
      
      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="flex justify-between">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            {t('result.print')}
          </Button>
          <Button>
            <Phone className="h-4 w-4 mr-2" />
            {t('result.contactCarrier')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrackingResult;