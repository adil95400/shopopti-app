import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Button } from '../ui/button';

interface PlatformStatusProps {
  platforms: {
    id: string;
    name: string;
    connected: boolean;
    status?: 'active' | 'error' | 'warning' | 'maintenance';
    lastSync?: string;
    metrics?: {
      products: number;
      orders: number;
      inventory: number;
      change?: number;
    };
  }[];
  onRefresh: (platformId: string) => Promise<void>;
}

const PlatformStatus: React.FC<PlatformStatusProps> = ({ platforms, onRefresh }) => {
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'maintenance':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  const connectedPlatforms = platforms.filter(p => p.connected);
  const disconnectedPlatforms = platforms.filter(p => !p.connected);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium mb-6">Platform Status</h3>
        
        {connectedPlatforms.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">No platforms connected</h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Connect at least one platform to see status information.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {connectedPlatforms.map((platform) => (
              <div key={platform.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 bg-gray-50">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-white shadow-sm mr-3">
                      {getStatusIcon(platform.status)}
                    </div>
                    <div>
                      <h4 className="font-medium">{platform.name}</h4>
                      <p className="text-sm text-gray-500">
                        Last synced: {formatDate(platform.lastSync)}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onRefresh(platform.id)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
                
                {platform.metrics && (
                  <div className="grid grid-cols-3 divide-x">
                    <div className="p-4 text-center">
                      <p className="text-sm text-gray-500">Products</p>
                      <p className="text-xl font-bold">{platform.metrics.products}</p>
                    </div>
                    <div className="p-4 text-center">
                      <p className="text-sm text-gray-500">Orders</p>
                      <p className="text-xl font-bold">{platform.metrics.orders}</p>
                    </div>
                    <div className="p-4 text-center">
                      <p className="text-sm text-gray-500">Inventory</p>
                      <div className="flex items-center justify-center">
                        <p className="text-xl font-bold">{platform.metrics.inventory}</p>
                        {platform.metrics.change !== undefined && (
                          <span className={`ml-2 flex items-center text-sm ${
                            platform.metrics.change >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {platform.metrics.change >= 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(platform.metrics.change)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {disconnectedPlatforms.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Disconnected Platforms</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {disconnectedPlatforms.map((platform) => (
                <div key={platform.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-white shadow-sm mr-3">
                      <XCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-medium">{platform.name}</h4>
                      <p className="text-sm text-gray-500">Not connected</p>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                  >
                    Connect
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformStatus;