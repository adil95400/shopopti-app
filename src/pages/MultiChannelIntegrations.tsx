import React, { useState } from 'react';
import IntegrationCard from '../components/integrations/IntegrationCard';
import { Badge } from '../components/ui/badge';
import { ShoppingBag } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  logo: string;
  compatibility: 'API' | 'CSV';
  connected: boolean;
}

const MultiChannelIntegrations: React.FC = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: 'shopify',
      name: 'Shopify',
      logo:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/2560px-Shopify_logo_2018.svg.png',
      compatibility: 'API',
      connected: false
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce',
      logo:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Woocommerce_logo.svg/2560px-Woocommerce_logo.svg.png',
      compatibility: 'API',
      connected: false
    },
    {
      id: 'amazon',
      name: 'Amazon',
      logo:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png',
      compatibility: 'API',
      connected: false
    },
    {
      id: 'etsy',
      name: 'Etsy',
      logo:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Etsy_logo.svg/2560px-Etsy_logo.svg.png',
      compatibility: 'CSV',
      connected: false
    },
    {
      id: 'bigcommerce',
      name: 'BigCommerce',
      logo:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Bigcommerce_logo.svg/1280px-Bigcommerce_logo.svg.png',
      compatibility: 'API',
      connected: false
    },
    {
      id: 'squarespace',
      name: 'Squarespace',
      logo:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Squarespace_logo.svg/1280px-Squarespace_logo.svg.png',
      compatibility: 'CSV',
      connected: false
    }
  ]);

  const handleConnect = async (id: string) => {
    // Here you would call your API to connect the platform
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPlatforms(prev => prev.map(p => (p.id === id ? { ...p, connected: true } : p)));
  };

  const handleDisconnect = async (id: string) => {
    // Here you would call your API to disconnect the platform
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPlatforms(prev => prev.map(p => (p.id === id ? { ...p, connected: false } : p)));
  };

  const handleConfigure = (id: string) => {
    console.log(`Configure ${id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Multi-Channel Integrations</h1>
        <p className="text-gray-600">
          Connect your store with multiple sales channels to synchronize products and orders.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {platforms.map(platform => (
          <div key={platform.id} className="relative">
            <Badge className="absolute top-2 right-2">{platform.compatibility}</Badge>
            <IntegrationCard
              integration={{
                id: platform.id,
                name: platform.name,
                description: '',
                icon: <ShoppingBag className="h-5 w-5" />,
                connected: platform.connected,
                category: 'marketplace',
                logo: platform.logo
              }}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onConfigure={handleConfigure}
              connectLabel="Se connecter"
              disconnectLabel="Se déconnecter"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiChannelIntegrations;
