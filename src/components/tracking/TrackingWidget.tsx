import React, { useState } from 'react';
import { useTracking } from '../../hooks/useTracking';
import { Package, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface TrackingWidgetProps {
  compact?: boolean;
}

const TrackingWidget: React.FC<TrackingWidgetProps> = ({ compact = false }) => {
  const { t } = useTranslation('tracking');
  const [number, setNumber] = useState('');
  const { trackPackage, isPending } = useTracking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (number.trim()) {
      await trackPackage(number.trim());
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={t('form.trackingNumberPlaceholder')}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="pl-8 py-1 h-9 text-sm"
          />
        </div>
        <Button type="submit" size="sm" disabled={isPending || !number.trim()}>
          {t('form.track')}
        </Button>
      </form>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-4">
        <Package className="h-5 w-5 text-primary mr-2" />
        <h3 className="text-lg font-medium">{t('title')}</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={t('form.trackingNumberPlaceholder')}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isPending || !number.trim()}>
          {isPending ? t('form.searching') : t('form.track')}
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        <Link to="/tracking" className="text-sm text-primary hover:underline">
          {t('info.title')}
        </Link>
      </div>
    </div>
  );
};

export default TrackingWidget;