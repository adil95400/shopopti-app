import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Store, Globe, Check, RefreshCw, Loader2, Settings, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface StoreIntegrationCardProps {
  connection: {
    id: string;
    platform: string;
    store_url: string;
    status: string;
    created_at: string;
    last_sync?: string;
  };
  onRefresh: (id: string) => Promise<void>;
  onDisconnect: (id: string) => Promise<void>;
  onConfigure: (id: string) => void;
}

const StoreIntegrationCard: React.FC<StoreIntegrationCardProps> = ({
  connection,
  onRefresh,
  onDisconnect,
  onConfigure
}) => {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      await onRefresh(connection.id);
      toast.success('Connexion rafraîchie avec succès');
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
      toast.error('Erreur lors du rafraîchissement de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir déconnecter cette boutique ?')) {
      try {
        setLoading(true);
        await onDisconnect(connection.id);
        toast.success('Boutique déconnectée avec succès');
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        toast.error('Erreur lors de la déconnexion de la boutique');
      } finally {
        setLoading(false);
      }
    }
  };

  const getPlatformIcon = () => {
    switch (connection.platform) {
      case 'shopify':
        return <ShoppingBag className="h-6 w-6" />;
      case 'woocommerce':
        return <Store className="h-6 w-6" />;
      default:
        return <Globe className="h-6 w-6" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary mr-4">
            {getPlatformIcon()}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 capitalize">{connection.platform}</h3>
            <p className="text-sm text-gray-600">{connection.store_url}</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <Check size={12} className="mr-1" />
            Actif
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs text-gray-500">Connecté le</p>
          <p className="font-medium">{formatDate(connection.created_at)}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs text-gray-500">Dernière synchronisation</p>
          <p className="font-medium">{connection.last_sync ? formatDate(connection.last_sync) : 'Jamais'}</p>
        </div>
      </div>

      <div className="mt-6 flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onConfigure(connection.id)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Configurer
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(connection.store_url, '_blank')}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full"
          onClick={handleDisconnect}
          disabled={loading}
        >
          Déconnecter cette boutique
        </Button>
      </div>
    </motion.div>
  );
};

export default StoreIntegrationCard;