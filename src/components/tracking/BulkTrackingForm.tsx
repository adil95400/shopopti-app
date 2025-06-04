import React, { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BulkTrackingFormProps {
  onSubmit: (trackingNumbers: string[]) => void;
  loading: boolean;
}

const BulkTrackingForm: React.FC<BulkTrackingFormProps> = ({ onSubmit, loading }) => {
  const { t } = useTranslation('tracking');
  const [trackingNumbers, setTrackingNumbers] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumbers.trim()) {
      startTransition(() => {
        // Split by newlines, commas, or spaces and filter out empty strings
        const numbers = trackingNumbers
          .split(/[\n,\s]+/)
          .map(n => n.trim())
          .filter(Boolean);
        
        if (numbers.length > 0) {
          onSubmit(numbers);
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('bulk.title')}
        </label>
        <Textarea
          placeholder={t('bulk.description')}
          value={trackingNumbers}
          onChange={(e) => setTrackingNumbers(e.target.value)}
          rows={5}
        />
        <p className="mt-1 text-xs text-gray-500">
          {t('bulk.limit')}
        </p>
      </div>
      
      <Button type="submit" disabled={loading || isPending || !trackingNumbers.trim()}>
        {loading || isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('form.searching')}
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            {t('bulk.process')}
          </>
        )}
      </Button>
    </form>
  );
};

export default BulkTrackingForm;