import React, { useState, useEffect } from 'react';
import { Package, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PackageStatusBadge from './PackageStatusBadge';

interface RecentTracking {
  id: string;
  trackingNumber: string;
  carrier: string;
  status: {
    code: 'delivered' | 'in_transit' | 'out_for_delivery' | 'pending' | 'exception';
    label: string;
    color: 'success' | 'primary' | 'warning' | 'error';
  };
  lastChecked: string;
}

const RecentTrackings: React.FC = () => {
  const [recentTrackings, setRecentTrackings] = useState<RecentTracking[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from localStorage or a database
    const storedTrackings = localStorage.getItem('recentTrackings');
    if (storedTrackings) {
      setRecentTrackings(JSON.parse(storedTrackings));
    }
  }, []);

  if (recentTrackings.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
      <h2 className="text-lg font-medium mb-4">Suivis récents</h2>
      <div className="space-y-3">
        {recentTrackings.map((tracking) => (
          <div key={tracking.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
            <div className="flex items-center">
              <Package className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="flex items-center">
                  <span className="font-medium">{tracking.trackingNumber}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{tracking.carrier}</span>
                </div>
                <div className="flex items-center mt-1">
                  <PackageStatusBadge status={tracking.status} />
                  <span className="ml-2 text-xs text-gray-500">
                    Dernière vérification: {new Date(tracking.lastChecked).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={`/tracking?number=${tracking.trackingNumber}`}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Suivre
              </a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTrackings;