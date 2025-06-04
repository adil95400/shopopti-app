import React, { useState } from 'react';
import { ExternalLink, Check, Globe, DollarSign, AlertTriangle, Loader2 } from 'lucide-react';
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
    products?: number;
    status?: 'active' | 'pending' | 'error';
  };
  onConnect?: (id: string) => Promise<void>;
  onViewDetails?: (id: string) => void;
}

const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  marketplace,
  onConnect,
  onViewDetails
}) => {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!onConnect) return;
    
    try {
      setLoading(true);
      await onConnect(marketplace.id);
    } catch (error) {
      console.error('Error connecting to marketplace:', error);
    } finally {
      setLoading(false);
    }
  };

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
              Connecté
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
            <p className="text-xs text-gray-500">Frais mensuels</p>
            <p className="font-medium">{marketplace.monthly_fee}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-start">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-xs text-gray-600">
              <span className="font-medium">Prérequis:</span>{' '}
              {marketplace.requirements[0]}{marketplace.requirements.length > 1 ? ' et plus...' : ''}
            </p>
          </div>
        </div>
        
        {marketplace.connected ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs text-gray-500">Produits</p>
                <p className="font-medium">{marketplace.products || 0}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs text-gray-500">Statut</p>
                <div className="flex items-center">
                  {marketplace.status === 'active' && (
                    <span className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-1" />
                      Actif
                    </span>
                  )}
                  {marketplace.status === 'pending' && (
                    <span className="flex items-center text-yellow-600">
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      En attente
                    </span>
                  )}
                  {marketplace.status === 'error' && (
                    <span className="flex items-center text-red-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Erreur
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                className="flex-1"
                onClick={() => onViewDetails && onViewDetails(marketplace.id)}
              >
                <Globe className="h-4 w-4 mr-2" />
                Gérer les produits
              </Button>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Informations</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewDetails && onViewDetails(marketplace.id)}
                >
                  Plus de détails
                </Button>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Devise:</span>
                  <span>{marketplace.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Langue:</span>
                  <span>{marketplace.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Commission:</span>
                  <span>{marketplace.commission}</span>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full"
              onClick={handleConnect}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  Connecter
                  <ExternalLink className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceCard;