import React, { useState } from 'react';
import { useTracking } from '../../hooks/useTracking';
import { Package, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TrackingWidgetProps {
  compact?: boolean;
}

const TrackingWidget: React.FC<TrackingWidgetProps> = ({ compact = false }) => {
  const [number, setNumber] = useState('');
  const { trackPackage, loading } = useTracking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (number.trim()) {
      trackPackage(number);
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Numéro de suivi"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="pl-8 py-1 h-9 text-sm"
          />
        </div>
        <Button type="submit" size="sm" disabled={loading || !number.trim()}>
          Suivre
        </Button>
      </form>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-4">
        <Package className="h-5 w-5 text-primary mr-2" />
        <h3 className="text-lg font-medium">Suivi de colis</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Entrez votre numéro de suivi"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={loading || !number.trim()}>
          Suivre mon colis
        </Button>
      </form>
    </div>
  );
};

export default TrackingWidget;