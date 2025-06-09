import React, { useState } from 'react';
import { ExternalLink, Check, X, Settings, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

interface IntegrationCardProps {
  integration: {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    connected: boolean;
    category: 'marketplace' | 'payment' | 'shipping' | 'marketing' | 'analytics';
    url?: string;
    logo?: string;
  };
  onConnect: (id: string) => Promise<void>;
  onDisconnect: (id: string) => Promise<void>;
  onConfigure: (id: string) => void;
  connectLabel?: string;
  disconnectLabel?: string;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onConnect,
  onDisconnect,
  onConfigure,
  connectLabel = 'Connect',
  disconnectLabel = 'Disconnect'
}) => {
  const [loading, setLoading] = useState(false);
  
  const handleConnect = async () => {
    try {
      setLoading(true);
      await onConnect(integration.id);
    } catch (error) {
      console.error(`Error connecting to ${integration.name}:`, error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDisconnect = async () => {
    try {
      setLoading(true);
      await onDisconnect(integration.id);
    } catch (error) {
      console.error(`Error disconnecting from ${integration.name}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {integration.logo ? (
            <img 
              src={integration.logo} 
              alt={integration.name} 
              className="h-10 w-10 object-contain mr-3"
            />
          ) : (
            <div className="p-2 bg-gray-100 rounded-lg mr-3">
              {integration.icon}
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900">{integration.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{integration.category}</p>
          </div>
        </div>
        {integration.connected && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            Connected
          </span>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-6">{integration.description}</p>
      
      <div className="flex space-x-2">
        {integration.connected ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onConfigure(integration.id)}
              className="flex-1"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <X className="h-4 w-4 mr-2" />
                  {disconnectLabel}
                </>
              )}
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            onClick={handleConnect}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              connectLabel
            )}
          </Button>
        )}
      </div>
      
      {integration.url && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <a
            href={integration.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            Learn more
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      )}
    </div>
  );
};

export default IntegrationCard;