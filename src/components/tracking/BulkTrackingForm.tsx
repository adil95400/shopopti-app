import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload } from 'lucide-react';

interface BulkTrackingFormProps {
  onSubmit: (trackingNumbers: string[]) => void;
  loading: boolean;
}

const BulkTrackingForm: React.FC<BulkTrackingFormProps> = ({ onSubmit, loading }) => {
  const [trackingNumbers, setTrackingNumbers] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumbers.trim()) {
      // Split by newlines, commas, or spaces and filter out empty strings
      const numbers = trackingNumbers
        .split(/[\n,\s]+/)
        .map(n => n.trim())
        .filter(Boolean);
      
      if (numbers.length > 0) {
        onSubmit(numbers);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Suivi en masse
        </label>
        <Textarea
          placeholder="Entrez plusieurs numéros de suivi (un par ligne ou séparés par des virgules)"
          value={trackingNumbers}
          onChange={(e) => setTrackingNumbers(e.target.value)}
          rows={5}
        />
        <p className="mt-1 text-xs text-gray-500">
          Vous pouvez suivre jusqu'à 10 colis à la fois
        </p>
      </div>
      
      <Button type="submit" disabled={loading || !trackingNumbers.trim()}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Suivre en masse
          </>
        )}
      </Button>
    </form>
  );
};

export default BulkTrackingForm;