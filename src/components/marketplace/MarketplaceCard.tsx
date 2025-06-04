import React from 'react';
import { ExternalLink, Check, Globe, DollarSign, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

interface MarketplaceCardProps {
  marketplace: {
    id: string;
    name: string;
    region: string;
    logo: string;
    description: string;
    commission: string;
    monthly_fee: string;
    setup_fee: string;
    requirements: string[];
    pros: string[];
    cons: string[];
    connected?: boolean;
  };
  onConnect?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  marketplace,
  onConnect,
  onViewDetails
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img 
              src={marketplace.logo} 
              alt={marketplace.name}
              className="w-12 h-12 object-contain rounded-lg mr-3"
            />
            <div>
              <h3 className="font-medium text-gray-900">{marketplace.name}</h3>
              <p className="text-sm text-gray-500">{marketplace.region}</p>
            </div>
          </div>
          {marketplace.connected && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" />
              Connected
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{marketplace.description}</p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-xs text-gray-500">Commission</p>
            <p className="font-medium">{marketplace.commission}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-xs text-gray-500">Monthly Fee</p>
            <p className="font-medium">{marketplace.monthly_fee}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-start">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-xs text-gray-600">
              <span className="font-medium">Requirements:</span>{' '}
              {marketplace.requirements[0]}{marketplace.requirements.length > 1 ? ' and more...' : ''}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails && onViewDetails(marketplace.id)}
          >
            <Globe className="h-4 w-4 mr-2" />
            Details
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onConnect && onConnect(marketplace.id)}
          >
            Connect
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceCard;