import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import axios from 'axios';

type StoreType = 'shopify' | 'woocommerce' | 'etsy' | 'amazon' | 'tiktok';

interface StoreConnection {
  id: string;
  platform: StoreType;
  store_url: string;
  api_key: string;
  api_secret?: string;
  scopes?: string[];
  status: 'active' | 'inactive' | 'error';
  created_at: string;
  last_sync?: string;
}

interface ShopContextType {
  storeId: string | null;
  storeType: StoreType | null;
  isConnected: boolean;
  store: {
    name: string;
    url: string;
    platform: StoreType;
    status: string;
  } | null;
  connections: StoreConnection[];
  connectShopify: (url: string, accessToken: string) => Promise<boolean>;
  connectWooCommerce: (url: string, consumerKey: string, consumerSecret: string) => Promise<boolean>;
  connectEtsy: (apiKey: string, shopId: string) => Promise<boolean>;
  connectAmazon: (sellerId: string, marketplace: string, accessKey: string, secretKey: string) => Promise<boolean>;
  connectTikTok: (accessToken: string, shopId: string) => Promise<boolean>;
  disconnectStore: (connectionId: string) => Promise<void>;
  refreshConnection: (connectionId: string) => Promise<void>;
  stats: { products: number; orders: number };
  setStats: (s: { products: number; orders: number }) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeType, setStoreType] = useState<StoreType | null>(null);
  const [store, setStore] = useState<ShopContextType['store']>(null);
  const [connections, setConnections] = useState<StoreConnection[]>([]);
  const [stats, setStats] = useState({ products: 0, orders: 0 });

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return;
      }
      
      const { data, error } = await supabase
        .from('store_connections')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'active');
        
      if (error) throw error;
      
      setConnections(data || []);
      
      // Si au moins une connexion active existe, définir la première comme boutique principale
      if (data && data.length > 0) {
        const primaryConnection = data[0];
        setStoreId(primaryConnection.id);
        setStoreType(primaryConnection.platform);
        setStore({
          name: getStoreName(primaryConnection.store_url, primaryConnection.platform),
          url: primaryConnection.store_url,
          platform: primaryConnection.platform,
          status: 'active'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des connexions:', error);
    }
  };

  const getStoreName = (url: string, platform: StoreType): string => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      const hostname = urlObj.hostname;
      
      if (platform === 'shopify') {
        return hostname.split('.')[0];
      }
      
      return hostname;
    } catch (error) {
      return url;
    }
  };

  const connectShopify = async (url: string, accessToken: string): Promise<boolean> => {
    try {
      // Vérifier la validité de l'URL et du token
      if (!url || !accessToken) {
        throw new Error('URL et token d\'accès requis');
      }
      
      // Simuler une vérification API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dans une application réelle, vous feriez une requête à l'API Shopify pour vérifier les identifiants
      
      setStoreId('shopify-1');
      setStoreType('shopify');
      setStore({
        name: getStoreName(url, 'shopify'),
        url: url,
        platform: 'shopify',
        status: 'active'
      });
      
      return true;
    } catch (error: any) {
      console.error('Erreur lors de la connexion à Shopify:', error);
      toast.error(`Erreur de connexion: ${error.message}`);
      return false;
    }
  };

  const connectWooCommerce = async (url: string, consumerKey: string, consumerSecret: string): Promise<boolean> => {
    try {
      // Vérifier la validité de l'URL et des clés
      if (!url || !consumerKey || !consumerSecret) {
        throw new Error('URL, clé consommateur et secret consommateur requis');
      }
      
      // Simuler une vérification API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dans une application réelle, vous feriez une requête à l'API WooCommerce pour vérifier les identifiants
      
      setStoreId('woo-1');
      setStoreType('woocommerce');
      setStore({
        name: getStoreName(url, 'woocommerce'),
        url: url,
        platform: 'woocommerce',
        status: 'active'
      });
      
      return true;
    } catch (error: any) {
      console.error('Erreur lors de la connexion à WooCommerce:', error);
      toast.error(`Erreur de connexion: ${error.message}`);
      return false;
    }
  };

  const connectEtsy = async (apiKey: string, shopId: string): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        throw new Error('Utilisateur non authentifié');
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/providers/test`;

      const response = await axios.post(apiUrl, {
        type: 'etsy',
        apiKey,
        shopId
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Validation échouée');
      }

      const { data, error } = await supabase
        .from('store_connections')
        .insert([{ 
          user_id: session.user.id,
          platform: 'etsy',
          store_url: `https://etsy.com/shop/${shopId}`,
          api_key: apiKey,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      setConnections([...connections, data]);
      setStoreId(data.id);
      setStoreType('etsy');
      setStore({
        name: getStoreName(data.store_url, 'etsy'),
        url: data.store_url,
        platform: 'etsy',
        status: 'active'
      });

      toast.success('Connexion à Etsy réussie');
      return true;
    } catch (error: any) {
      console.error('Erreur lors de la connexion à Etsy:', error);
      toast.error(`Erreur de connexion: ${error.message}`);
      return false;
    }
  };

  const connectAmazon = async (sellerId: string, marketplace: string, accessKey: string, secretKey: string): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        throw new Error('Utilisateur non authentifié');
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/providers/test`;

      const response = await axios.post(apiUrl, {
        type: 'amazon',
        apiKey: accessKey,
        apiSecret: secretKey,
        baseUrl: marketplace,
        sellerId
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Validation échouée');
      }

      const { data, error } = await supabase
        .from('store_connections')
        .insert([{ 
          user_id: session.user.id,
          platform: 'amazon',
          store_url: marketplace,
          api_key: accessKey,
          api_secret: secretKey,
          scopes: [sellerId],
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      setConnections([...connections, data]);
      setStoreId(data.id);
      setStoreType('amazon');
      setStore({
        name: getStoreName(data.store_url, 'amazon'),
        url: data.store_url,
        platform: 'amazon',
        status: 'active'
      });

      toast.success('Connexion à Amazon réussie');
      return true;
    } catch (error: any) {
      console.error('Erreur lors de la connexion à Amazon:', error);
      toast.error(`Erreur de connexion: ${error.message}`);
      return false;
    }
  };

  const connectTikTok = async (accessToken: string, shopId: string): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        throw new Error('Utilisateur non authentifié');
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/providers/test`;

      const response = await axios.post(apiUrl, {
        type: 'tiktok',
        apiKey: accessToken,
        shopId
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Validation échouée');
      }

      const { data, error } = await supabase
        .from('store_connections')
        .insert([{ 
          user_id: session.user.id,
          platform: 'tiktok',
          store_url: `https://www.tiktok.com/@${shopId}`,
          api_key: accessToken,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      setConnections([...connections, data]);
      setStoreId(data.id);
      setStoreType('tiktok');
      setStore({
        name: getStoreName(data.store_url, 'tiktok'),
        url: data.store_url,
        platform: 'tiktok',
        status: 'active'
      });

      toast.success('Connexion à TikTok réussie');
      return true;
    } catch (error: any) {
      console.error('Erreur lors de la connexion à TikTok:', error);
      toast.error(`Erreur de connexion: ${error.message}`);
      return false;
    }
  };

  const disconnectStore = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('store_connections')
        .update({ status: 'inactive' })
        .eq('id', connectionId);
        
      if (error) throw error;
      
      // Rafraîchir la liste des connexions
      fetchConnections();
      
      // Si la boutique déconnectée était la boutique principale, réinitialiser
      if (storeId === connectionId) {
        setStoreId(null);
        setStoreType(null);
        setStore(null);
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion de la boutique:', error);
    }
  };

  const refreshConnection = async (connectionId: string) => {
    try {
      const connection = connections.find(c => c.id === connectionId);
      if (!connection) {
        throw new Error('Connexion introuvable');
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Utilisateur non authentifié');
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/providers/test`;

      await axios.post(apiUrl, {
        type: connection.platform,
        apiKey: connection.api_key,
        apiSecret: connection.api_secret,
        baseUrl: connection.store_url
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      toast.success('Connexion rafraîchie avec succès');
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de la connexion:', error);
      toast.error('Erreur lors du rafraîchissement de la connexion');
    }
  };

  return (
    <ShopContext.Provider 
      value={{ 
        storeId, 
        storeType, 
        isConnected: !!storeId, 
        store, 
        connections,
        connectShopify, 
        connectWooCommerce,
        connectEtsy,
        connectAmazon,
        connectTikTok,
        disconnectStore,
        refreshConnection,
        stats,
        setStats
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};