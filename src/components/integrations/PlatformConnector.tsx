import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  ShoppingBag, 
  Store, 
  Globe, 
  Check, 
  Loader2, 
  AlertCircle,
  Key,
  Lock,
  Link as LinkIcon
} from 'lucide-react';

interface PlatformConnectorProps {
  platform: {
    id: string;
    name: string;
    logo: string;
    type: 'marketplace' | 'webstore' | 'social';
    connected: boolean;
  };
  onConnect: (platform: string, credentials: any) => Promise<boolean>;
  onDisconnect: (platform: string) => Promise<boolean>;
}

const PlatformConnector: React.FC<PlatformConnectorProps> = ({ 
  platform, 
  onConnect, 
  onDisconnect 
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [credentials, setCredentials] = useState({
    apiKey: '',
    apiSecret: '',
    storeUrl: '',
    accessToken: ''
  });
  const [error, setError] = useState<string | null>(null);

  const getFormFields = () => {
    switch (platform.id) {
      case 'shopify':
        return [
          { name: 'storeUrl', label: 'Store URL', placeholder: 'your-store.myshopify.com', icon: <Globe className="h-5 w-5 text-gray-400" /> },
          { name: 'accessToken', label: 'Access Token', placeholder: 'shpat_...', icon: <Key className="h-5 w-5 text-gray-400" /> }
        ];
      case 'woocommerce':
        return [
          { name: 'storeUrl', label: 'Store URL', placeholder: 'https://your-store.com', icon: <Globe className="h-5 w-5 text-gray-400" /> },
          { name: 'apiKey', label: 'Consumer Key', placeholder: 'ck_...', icon: <Key className="h-5 w-5 text-gray-400" /> },
          { name: 'apiSecret', label: 'Consumer Secret', placeholder: 'cs_...', icon: <Lock className="h-5 w-5 text-gray-400" /> }
        ];
      case 'amazon':
        return [
          { name: 'storeUrl', label: 'Marketplace', placeholder: 'amazon.com', icon: <Globe className="h-5 w-5 text-gray-400" /> },
          { name: 'apiKey', label: 'API Key', placeholder: 'AKIA...', icon: <Key className="h-5 w-5 text-gray-400" /> },
          { name: 'apiSecret', label: 'API Secret', placeholder: 'Your API Secret', icon: <Lock className="h-5 w-5 text-gray-400" /> }
        ];
      case 'etsy':
        return [
          { name: 'apiKey', label: 'API Key', placeholder: 'Your Etsy API Key', icon: <Key className="h-5 w-5 text-gray-400" /> },
          { name: 'storeUrl', label: 'Shop ID', placeholder: 'Your Etsy Shop ID', icon: <Store className="h-5 w-5 text-gray-400" /> }
        ];
      case 'bigcommerce':
        return [
          { name: 'storeUrl', label: 'Store URL', placeholder: 'store-xxxx.mybigcommerce.com', icon: <Globe className="h-5 w-5 text-gray-400" /> },
          { name: 'apiKey', label: 'API Key', placeholder: 'Your BigCommerce API Key', icon: <Key className="h-5 w-5 text-gray-400" /> },
          { name: 'accessToken', label: 'Access Token', placeholder: 'Your BigCommerce Access Token', icon: <Key className="h-5 w-5 text-gray-400" /> }
        ];
      case 'squarespace':
        return [
          { name: 'storeUrl', label: 'Store URL', placeholder: 'your-store.squarespace.com', icon: <Globe className="h-5 w-5 text-gray-400" /> },
          { name: 'apiKey', label: 'API Key', placeholder: 'Your Squarespace API Key', icon: <Key className="h-5 w-5 text-gray-400" /> }
        ];
      default:
        return [
          { name: 'storeUrl', label: 'Store URL', placeholder: 'https://your-store.com', icon: <Globe className="h-5 w-5 text-gray-400" /> },
          { name: 'apiKey', label: 'API Key', placeholder: 'Your API Key', icon: <Key className="h-5 w-5 text-gray-400" /> }
        ];
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsConnecting(true);

    try {
      // Validate required fields
      const fields = getFormFields();
      for (const field of fields) {
        if (!credentials[field.name as keyof typeof credentials]) {
          throw new Error(`${field.label} is required`);
        }
      }

      const success = await onConnect(platform.id, credentials);
      
      if (success) {
        toast.success(`${platform.name} connected successfully`);
        setShowForm(false);
      } else {
        throw new Error(`Failed to connect to ${platform.name}`);
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    
    try {
      const success = await onDisconnect(platform.id);
      
      if (success) {
        toast.success(`${platform.name} disconnected successfully`);
      } else {
        throw new Error(`Failed to disconnect from ${platform.name}`);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const getPlatformIcon = () => {
    switch (platform.type) {
      case 'marketplace':
        return <ShoppingBag className="h-5 w-5" />;
      case 'webstore':
        return <Store className="h-5 w-5" />;
      case 'social':
        return <Globe className="h-5 w-5" />;
      default:
        return <Store className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {platform.logo ? (
            <img 
              src={platform.logo} 
              alt={platform.name} 
              className="h-10 w-10 object-contain mr-3"
            />
          ) : (
            <div className={`p-2 rounded-full ${
              platform.type === 'marketplace' ? 'bg-blue-100' : 
              platform.type === 'webstore' ? 'bg-green-100' : 'bg-purple-100'
            }`}>
              {getPlatformIcon()}
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900">{platform.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{platform.type}</p>
          </div>
        </div>
        {platform.connected ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            Connected
          </span>
        ) : null}
      </div>

      {showForm && !platform.connected ? (
        <form onSubmit={handleConnect} className="space-y-4 mt-4 border-t pt-4">
          {getFormFields().map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {field.icon}
                </div>
                <Input
                  type={field.name.includes('secret') || field.name.includes('token') || field.name.includes('password') ? 'password' : 'text'}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={credentials[field.name as keyof typeof credentials] || ''}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>
          ))}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowForm(false)}
              disabled={isConnecting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect'
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-4">
          {platform.connected ? (
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`https://${platform.id}.com/admin`, '_blank')}
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Open Dashboard
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDisconnect}
                disabled={isDisconnecting}
              >
                {isDisconnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Disconnect'
                )}
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => setShowForm(true)}
              className="w-full"
            >
              Connect
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PlatformConnector;