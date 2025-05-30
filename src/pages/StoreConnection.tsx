import React, { useState, useEffect } from 'react';
import { useShop } from '../contexts/ShopContext';
import { ShoppingBag, ArrowRight, Store, Check, AlertCircle, Key, Globe, Lock, RefreshCw, Loader2, Copy, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

const StoreConnection: React.FC = () => {
  const { isConnected, store, connectShopify, connectWooCommerce } = useShop();
  const [activeTab, setActiveTab] = useState<'shopify' | 'woocommerce' | 'etsy' | 'amazon' | 'tiktok'>('shopify');
  const [shopifyUrl, setShopifyUrl] = useState('');
  const [shopifyApiKey, setShopifyApiKey] = useState('');
  const [shopifyApiSecret, setShopifyApiSecret] = useState('');
  const [shopifyAccessScopes, setShopifyAccessScopes] = useState([
    'read_products', 'write_products',
    'read_orders', 'write_orders',
    'read_inventory', 'write_inventory',
    'read_customers', 'write_customers'
  ]);
  
  const [woocommerceUrl, setWoocommerceUrl] = useState('');
  const [woocommerceKey, setWoocommerceKey] = useState('');
  const [woocommerceSecret, setWoocommerceSecret] = useState('');
  
  const [etsyApiKey, setEtsyApiKey] = useState('');
  const [etsyShopId, setEtsyShopId] = useState('');
  
  const [amazonSellerId, setAmazonSellerId] = useState('');
  const [amazonMarketplace, setAmazonMarketplace] = useState('US');
  const [amazonAccessKey, setAmazonAccessKey] = useState('');
  const [amazonSecretKey, setAmazonSecretKey] = useState('');
  
  const [tiktokAccessToken, setTiktokAccessToken] = useState('');
  const [tiktokShopId, setTiktokShopId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [storeConnections, setStoreConnections] = useState<any[]>([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchStoreConnections();
  }, []);

  const fetchStoreConnections = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return;
      }
      
      const { data, error } = await supabase
        .from('store_connections')
        .select('*')
        .eq('user_id', session.user.id);
        
      if (error) throw error;
      
      setStoreConnections(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des connexions:', error);
    }
  };

  const handleConnectShopify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      if (!shopifyUrl) {
        throw new Error('L\'URL de la boutique est requise');
      }
      
      if (!shopifyApiKey) {
        throw new Error('La clé API est requise');
      }
      
      // Vérifier le format de l'URL Shopify
      const shopifyUrlPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/;
      if (!shopifyUrlPattern.test(shopifyUrl)) {
        throw new Error('Format d\'URL Shopify invalide. Utilisez le format: votre-boutique.myshopify.com');
      }
      
      // Vérifier le format de la clé API Shopify
      const shopifyApiKeyPattern = /^shpat_[a-zA-Z0-9]{32,}$/;
      if (!shopifyApiKeyPattern.test(shopifyApiKey)) {
        throw new Error('Format de clé API Shopify invalide. La clé doit commencer par "shpat_"');
      }
      
      const success = await connectShopify(shopifyUrl, shopifyApiKey);
      
      if (success) {
        // Enregistrer la connexion dans la base de données
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { error: insertError } = await supabase
            .from('store_connections')
            .insert([
              {
                user_id: session.user.id,
                platform: 'shopify',
                store_url: shopifyUrl,
                api_key: shopifyApiKey,
                api_secret: shopifyApiSecret,
                scopes: shopifyAccessScopes,
                status: 'active',
                created_at: new Date().toISOString()
              }
            ]);
            
          if (insertError) throw insertError;
        }
        
        setSuccess('Boutique Shopify connectée avec succès!');
        toast.success('Boutique Shopify connectée avec succès!');
        
        // Rafraîchir la liste des connexions
        fetchStoreConnections();
        
        setTimeout(() => {
          navigate('/app/dashboard');
        }, 2000);
      } else {
        throw new Error('Échec de la connexion à Shopify. Veuillez vérifier vos identifiants.');
      }
    } catch (err: any) {
      console.error('Erreur de connexion:', err);
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
      toast.error(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWooCommerce = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      if (!woocommerceUrl) {
        throw new Error('L\'URL de la boutique est requise');
      }
      
      if (!woocommerceKey || !woocommerceSecret) {
        throw new Error('La clé consommateur et le secret consommateur sont requis');
      }
      
      // Vérifier le format de l'URL WooCommerce
      const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}(\/.*)?$/;
      if (!urlPattern.test(woocommerceUrl)) {
        throw new Error('Format d\'URL invalide. Utilisez le format: https://votre-boutique.com');
      }
      
      const success = await connectWooCommerce(woocommerceUrl, woocommerceKey, woocommerceSecret);
      
      if (success) {
        // Enregistrer la connexion dans la base de données
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { error: insertError } = await supabase
            .from('store_connections')
            .insert([
              {
                user_id: session.user.id,
                platform: 'woocommerce',
                store_url: woocommerceUrl,
                api_key: woocommerceKey,
                api_secret: woocommerceSecret,
                status: 'active',
                created_at: new Date().toISOString()
              }
            ]);
            
          if (insertError) throw insertError;
        }
        
        setSuccess('Boutique WooCommerce connectée avec succès!');
        toast.success('Boutique WooCommerce connectée avec succès!');
        
        // Rafraîchir la liste des connexions
        fetchStoreConnections();
        
        setTimeout(() => {
          navigate('/app/dashboard');
        }, 2000);
      } else {
        throw new Error('Échec de la connexion à WooCommerce. Veuillez vérifier vos identifiants.');
      }
    } catch (err: any) {
      console.error('Erreur de connexion:', err);
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
      toast.error(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectEtsy = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Logique de connexion Etsy
      setError('La connexion Etsy sera disponible prochainement.');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAmazon = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Logique de connexion Amazon
      setError('La connexion Amazon sera disponible prochainement.');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectTikTok = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Logique de connexion TikTok
      setError('La connexion TikTok sera disponible prochainement.');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const disconnectStore = async (connectionId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('store_connections')
        .update({ status: 'inactive' })
        .eq('id', connectionId);
        
      if (error) throw error;
      
      toast.success('Boutique déconnectée avec succès');
      
      // Rafraîchir la liste des connexions
      fetchStoreConnections();
    } catch (error) {
      console.error('Erreur lors de la déconnexion de la boutique:', error);
      toast.error('Erreur lors de la déconnexion de la boutique');
    } finally {
      setLoading(false);
    }
  };

  const refreshConnection = async (connectionId: string) => {
    try {
      setLoading(true);
      
      // Simuler un rafraîchissement de la connexion
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Connexion rafraîchie avec succès');
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de la connexion:', error);
      toast.error('Erreur lors du rafraîchissement de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const activeConnections = storeConnections.filter(conn => conn.status === 'active');

  if (isConnected && store) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Connexion de boutique</h1>
          <p className="text-gray-600">
            Gérez vos connexions de boutiques e-commerce.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          layout
        >
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
              {store.platform === 'shopify' ? (
                <ShoppingBag className="h-7 w-7" />
              ) : (
                <Store className="h-7 w-7" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{store.name}</h2>
              <div className="flex items-center mt-1">
                <span className="text-sm capitalize text-gray-600">{store.platform}</span>
                <span className="mx-2 text-gray-400">•</span>
                <div className="flex items-center text-green-600">
                  <Check size={14} className="mr-1" />
                  <span className="text-sm">Connecté</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="font-medium text-gray-900">Informations de la boutique</h3>
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-600">URL de la boutique</p>
                <p className="font-medium text-gray-900">{store.url}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Statut</p>
                <div className="flex items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="ml-2 font-medium capitalize text-gray-900">{store.status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="font-medium text-gray-900">Prochaines étapes</h3>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-md bg-blue-50 p-3">
                <h4 className="font-medium text-blue-800">Importer des produits</h4>
                <p className="mt-1 text-sm text-blue-700">Importez vos produits existants ou ajoutez-en de nouveaux.</p>
              </div>
              <div className="rounded-md bg-green-50 p-3">
                <h4 className="font-medium text-green-800">Optimiser le contenu</h4>
                <p className="mt-1 text-sm text-green-700">Laissez l'IA optimiser vos descriptions et votre SEO.</p>
              </div>
              <div className="rounded-md bg-purple-50 p-3">
                <h4 className="font-medium text-purple-800">Publier sur les canaux</h4>
                <p className="mt-1 text-sm text-purple-700">Publiez vos produits sur Google, Facebook et TikTok.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {activeConnections.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium mb-4">Boutiques connectées</h2>
            <div className="space-y-4">
              {activeConnections.map((connection) => (
                <div key={connection.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary mr-3">
                        {connection.platform === 'shopify' ? (
                          <ShoppingBag className="h-6 w-6" />
                        ) : connection.platform === 'woocommerce' ? (
                          <Store className="h-6 w-6" />
                        ) : (
                          <Globe className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 capitalize">{connection.platform}</h3>
                        <p className="text-sm text-gray-600">{connection.store_url}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => refreshConnection(connection.id)}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                        title="Rafraîchir la connexion"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button
                        onClick={() => disconnectStore(connection.id)}
                        className="p-2 text-red-500 hover:text-red-700 rounded-md hover:bg-red-50"
                        title="Déconnecter la boutique"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18"></path>
                          <path d="m6 6 12 12"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Key size={14} className="text-gray-500 mr-1" />
                        <span className="text-sm text-gray-600">Connecté le {new Date(connection.created_at).toLocaleDateString()}</span>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        <Check size={12} className="mr-1" />
                        Actif
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium mb-4">Ajouter une nouvelle boutique</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <button
              onClick={() => setActiveTab('shopify')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                activeTab === 'shopify' ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <ShoppingBag className={`h-8 w-8 mb-2 ${activeTab === 'shopify' ? 'text-primary' : 'text-gray-500'}`} />
              <span className={`font-medium ${activeTab === 'shopify' ? 'text-primary' : 'text-gray-700'}`}>Shopify</span>
            </button>
            
            <button
              onClick={() => setActiveTab('woocommerce')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                activeTab === 'woocommerce' ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Store className={`h-8 w-8 mb-2 ${activeTab === 'woocommerce' ? 'text-primary' : 'text-gray-500'}`} />
              <span className={`font-medium ${activeTab === 'woocommerce' ? 'text-primary' : 'text-gray-700'}`}>WooCommerce</span>
            </button>
            
            <button
              onClick={() => setActiveTab('etsy')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                activeTab === 'etsy' ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <svg className={`h-8 w-8 mb-2 ${activeTab === 'etsy' ? 'text-primary' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.56 21.5h6.89c3.37 0 4.09-1.3 4.09-3.95V6.45c0-2.65-.72-3.95-4.09-3.95H8.56c-3.37 0-4.09 1.3-4.09 3.95v11.1c0 2.65.72 3.95 4.09 3.95z" />
              </svg>
              <span className={`font-medium ${activeTab === 'etsy' ? 'text-primary' : 'text-gray-700'}`}>Etsy</span>
            </button>
            
            <button
              onClick={() => setActiveTab('amazon')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                activeTab === 'amazon' ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <svg className={`h-8 w-8 mb-2 ${activeTab === 'amazon' ? 'text-primary' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.93 11.9c-.1 0-.19.02-.27.06-.08.04-.15.1-.2.18-.05.08-.09.16-.11.26-.03.1-.04.2-.04.3v.33c0 .1.01.2.04.3.02.1.06.18.11.26.05.08.12.14.2.18.08.04.17.06.27.06.1 0 .19-.02.27-.06.08-.04.15-.1.2-.18.05-.08.09-.16.11-.26.03-.1.04-.2.04-.3v-.33c0-.1-.01-.2-.04-.3-.02-.1-.06-.18-.11-.26-.05-.08-.12-.14-.2-.18-.08-.04-.17-.06-.27-.06zm-11.93.44c0 .32.03.64.08.95.05.31.13.6.23.88.1.28.23.53.38.77.15.24.33.45.53.63.2.18.42.33.67.45.25.12.52.21.81.27.29.06.6.09.92.09.32 0 .63-.03.92-.09.29-.06.56-.15.81-.27.25-.12.47-.27.67-.45.2-.18.38-.39.53-.63.15-.24.28-.49.38-.77.1-.28.18-.57.23-.88.05-.31.08-.63.08-.95 0-.32-.03-.64-.08-.95-.05-.31-.13-.6-.23-.88-.1-.28-.23-.53-.38-.77-.15-.24-.33-.45-.53-.63-.2-.18-.42-.33-.67-.45-.25-.12-.52-.21-.81-.27-.29-.06-.6-.09-.92-.09-.32 0-.63.03-.92.09-.29.06-.56.15-.81.27-.25.12-.47.27-.67.45-.2.18-.38.39-.53.63-.15.24-.28.49-.38.77-.1.28-.18.57-.23.88-.05.31-.08.63-.08.95zm2.27-2.09c.28 0 .54.05.78.16.24.11.45.26.63.45.18.19.32.42.42.69.1.27.15.56.15.88 0 .32-.05.61-.15.88-.1.27-.24.5-.42.69-.18.19-.39.34-.63.45-.24.11-.5.16-.78.16-.28 0-.54-.05-.78-.16-.24-.11-.45-.26-.63-.45-.18-.19-.32-.42-.42-.69-.1-.27-.15-.56-.15-.88 0-.32.05-.61.15-.88.1-.27.24-.5.42-.69.18-.19.39-.34.63-.45.24-.11.5-.16.78-.16zm5.66 2.09c0 .32.03.64.08.95.05.31.13.6.23.88.1.28.23.53.38.77.15.24.33.45.53.63.2.18.42.33.67.45.25.12.52.21.81.27.29.06.6.09.92.09.32 0 .63-.03.92-.09.29-.06.56-.15.81-.27.25-.12.47-.27.67-.45.2-.18.38-.39.53-.63.15-.24.28-.49.38-.77.1-.28.18-.57.23-.88.05-.31.08-.63.08-.95 0-.32-.03-.64-.08-.95-.05-.31-.13-.6-.23-.88-.1-.28-.23-.53-.38-.77-.15-.24-.33-.45-.53-.63-.2-.18-.42-.33-.67-.45-.25-.12-.52-.21-.81-.27-.29-.06-.6-.09-.92-.09-.32 0-.63.03-.92.09-.29.06-.56.15-.81.27-.25.12-.47.27-.67.45-.2.18-.38.39-.53.63-.15.24-.28.49-.38.77-.1.28-.18.57-.23.88-.05.31-.08.63-.08.95zm2.27-2.09c.28 0 .54.05.78.16.24.11.45.26.63.45.18.19.32.42.42.69.1.27.15.56.15.88 0 .32-.05.61-.15.88-.1.27-.24.5-.42.69-.18.19-.39.34-.63.45-.24.11-.5.16-.78.16-.28 0-.54-.05-.78-.16-.24-.11-.45-.26-.63-.45-.18-.19-.32-.42-.42-.69-.1-.27-.15-.56-.15-.88 0-.32.05-.61.15-.88.1-.27.24-.5.42-.69.18-.19.39-.34.63-.45.24-.11.5-.16.78-.16z" />
              </svg>
              <span className={`font-medium ${activeTab === 'amazon' ? 'text-primary' : 'text-gray-700'}`}>Amazon</span>
            </button>
            
            <button
              onClick={() => setActiveTab('tiktok')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-colors ${
                activeTab === 'tiktok' ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <svg className={`h-8 w-8 mb-2 ${activeTab === 'tiktok' ? 'text-primary' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
              <span className={`font-medium ${activeTab === 'tiktok' ? 'text-primary' : 'text-gray-700'}`}>TikTok</span>
            </button>
          </div>
          
          <div className="mt-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 rounded-md bg-red-50 p-4"
                >
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Erreur de connexion</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 rounded-md bg-green-50 p-4"
                >
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Connexion réussie</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>{success}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'shopify' && (
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Connecter votre boutique Shopify</h3>
                    
                    <form onSubmit={handleConnectShopify} className="space-y-4">
                      <div>
                        <label htmlFor="shopifyUrl" className="block text-sm font-medium text-gray-700 mb-1">
                          URL de la boutique Shopify
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            id="shopifyUrl"
                            type="text"
                            value={shopifyUrl}
                            onChange={(e) => setShopifyUrl(e.target.value)}
                            placeholder="votre-boutique.myshopify.com"
                            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="shopifyApiKey" className="block text-sm font-medium text-gray-700 mb-1">
                          Clé API Shopify (Access Token)
                        </label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            id="shopifyApiKey"
                            type="text"
                            value={shopifyApiKey}
                            onChange={(e) => setShopifyApiKey(e.target.value)}
                            placeholder="shpat_..."
                            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Vous pouvez trouver ceci dans votre admin Shopify sous Paramètres → Applications et canaux de vente → Développer des applications → Créer une application personnelle
                        </p>
                      </div>
                      
                      <div>
                        <label htmlFor="shopifyApiSecret" className="block text-sm font-medium text-gray-700 mb-1">
                          Secret API Shopify (optionnel)
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            id="shopifyApiSecret"
                            type={showApiSecret ? "text" : "password"}
                            value={shopifyApiSecret}
                            onChange={(e) => setShopifyApiSecret(e.target.value)}
                            placeholder="shpss_..."
                            className="w-full rounded-md border border-gray-300 pl-10 pr-10 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiSecret(!showApiSecret)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showApiSecret ? (
                              <svg xmlns="http://www.w3.org/2000/svg\" width="20\" height="20\" viewBox="0 0 24 24\" fill="none\" stroke="currentColor\" strokeWidth="2\" strokeLinecap="round\" strokeLinejoin="round">
                                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                <line x1="2" x2="22" y1="2" y2="22"></line>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Autorisations requises
                        </label>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {shopifyAccessScopes.map((scope) => (
                              <div key={scope} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`scope-${scope}`}
                                  checked={true}
                                  disabled
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor={`scope-${scope}`} className="ml-2 block text-sm text-gray-700">
                                  {scope.replace('_', ' ')}
                                </label>
                              </div>
                            ))}
                          </div>
                          <p className="mt-2 text-xs text-gray-500">
                            Ces autorisations sont nécessaires pour que Shopopti+ puisse gérer vos produits, commandes et inventaire.
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Connexion en cours...
                            </>
                          ) : (
                            <>
                              Connecter la boutique Shopify
                              <ArrowRight size={16} className="ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                    
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-700">Comment obtenir votre clé API Shopify ?</h4>
                      <ol className="mt-2 list-decimal list-inside text-sm text-gray-600 space-y-1">
                        <li>Connectez-vous à votre admin Shopify</li>
                        <li>Allez dans Paramètres → Applications et canaux de vente</li>
                        <li>Cliquez sur "Développer des applications"</li>
                        <li>Cliquez sur "Créer une application"</li>
                        <li>Donnez un nom à votre application (ex: "Shopopti+")</li>
                        <li>Dans la section "Configuration de l'API Admin", sélectionnez les autorisations nécessaires</li>
                        <li>Cliquez sur "Installer l'application"</li>
                        <li>Copiez le "Access Token" généré</li>
                      </ol>
                    </div>
                  </div>
                )}
                
                {activeTab === 'woocommerce' && (
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Connecter votre boutique WooCommerce</h3>
                    
                    <form onSubmit={handleConnectWooCommerce} className="space-y-4">
                      <div>
                        <label htmlFor="woocommerceUrl" className="block text-sm font-medium text-gray-700 mb-1">
                          URL de la boutique WooCommerce
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            id="woocommerceUrl"
                            type="text"
                            value={woocommerceUrl}
                            onChange={(e) => setWoocommerceUrl(e.target.value)}
                            placeholder="https://votre-boutique.com"
                            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="woocommerceKey" className="block text-sm font-medium text-gray-700 mb-1">
                          Clé consommateur
                        </label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            id="woocommerceKey"
                            type="text"
                            value={woocommerceKey}
                            onChange={(e) => setWoocommerceKey(e.target.value)}
                            placeholder="ck_..."
                            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="woocommerceSecret" className="block text-sm font-medium text-gray-700 mb-1">
                          Secret consommateur
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            id="woocommerceSecret"
                            type={showApiSecret ? "text" : "password"}
                            value={woocommerceSecret}
                            onChange={(e) => setWoocommerceSecret(e.target.value)}
                            placeholder="cs_..."
                            className="w-full rounded-md border border-gray-300 pl-10 pr-10 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiSecret(!showApiSecret)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showApiSecret ? (
                              <svg xmlns="http://www.w3.org/2000/svg\" width="20\" height="20\" viewBox="0 0 24 24\" fill="none\" stroke="currentColor\" strokeWidth="2\" strokeLinecap="round\" strokeLinejoin="round">
                                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                <line x1="2" x2="22" y1="2" y2="22"></line>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            )}
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Vous pouvez trouver ces informations dans votre admin WooCommerce sous WooCommerce → Réglages → Avancé → API REST
                        </p>
                      </div>
                      
                      <div className="pt-4">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Connexion en cours...
                            </>
                          ) : (
                            <>
                              Connecter la boutique WooCommerce
                              <ArrowRight size={16} className="ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                    
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-700">Comment créer des clés API WooCommerce ?</h4>
                      <ol className="mt-2 list-decimal list-inside text-sm text-gray-600 space-y-1">
                        <li>Connectez-vous à votre admin WordPress</li>
                        <li>Allez dans WooCommerce → Réglages → Avancé</li>
                        <li>Cliquez sur l'onglet "API REST"</li>
                        <li>Cliquez sur "Ajouter une clé"</li>
                        <li>Donnez un nom à la clé (ex: "Shopopti+")</li>
                        <li>Sélectionnez "Lecture/Écriture" comme niveau d'autorisation</li>
                        <li>Cliquez sur "Générer une clé API"</li>
                        <li>Copiez la "Clé consommateur" et le "Secret consommateur"</li>
                      </ol>
                    </div>
                  </div>
                )}
                
                {activeTab === 'etsy' && (
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Connecter votre boutique Etsy</h3>
                    
                    <form onSubmit={handleConnectEtsy} className="space-y-4">
                      <div>
                        <label htmlFor="etsyApiKey" className="block text-sm font-medium text-gray-700 mb-1">
                          Clé API Etsy
                        </label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            id="etsyApiKey"
                            type="text"
                            value={etsyApiKey}
                            onChange={(e) => setEtsyApiKey(e.target.value)}
                            placeholder="Entrez votre clé API Etsy"
                            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="etsyShopId" className="block text-sm font-medium text-gray-700 mb-1">
                          ID de la boutique Etsy
                        </label>
                        <div className="relative">
                          <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            id="etsyShopId"
                            type="text"
                            value={etsyShopId}
                            onChange={(e) => setEtsyShopId(e.target.value)}
                            placeholder="Entrez l'ID de votre boutique Etsy"
                            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Connexion en cours...
                            </>
                          ) : (
                            <>
                              Connecter la boutique Etsy
                              <ArrowRight size={16} className="ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                    
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                        <p className="text-sm text-amber-700">
                          L'intégration Etsy sera disponible prochainement. Restez à l'affût pour les mises à jour !
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'amazon' && (
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Connecter votre compte Amazon Seller</h3>
                    
                    <form onSubmit={handleConnectAmazon} className="space-y-4">
                      <div>
                        <label htmlFor="amazonSellerId" className="block text-sm font-medium text-gray-700 mb-1">
                          ID Vendeur Amazon
                        </label>
                        <div className="relative">
                          <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            id="amazonSellerId"
                            type="text"
                            value={amazonSellerId}
                            onChange={(e) => setAmazonSellerId(e.target.value)}
                            placeholder="Entrez votre ID Vendeur Amazon"
                            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="amazonMarketplace" className="block text-sm font-medium text-gray-700 mb-1">
                          Marketplace
                        </label>
                        <select
                          id="amazonMarketplace"
                          value={amazonMarketplace}
                          onChange={(e) => setAmazonMarketplace(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          required
                        >
                          <option value="US">États-Unis (US)</option>
                          <option value="CA">Canada (CA)</option>
                          <option value="MX">Mexique (MX)</option>
                          <option value="UK">Royaume-Uni (UK)</option>
                          <option value="DE">Allemagne (DE)</option>
                          <option value="FR">France (FR)</option>
                          <option value="IT">Italie (IT)</option>
                          <option value="ES">Espagne (ES)</option>
                          <option value="JP">Japon (JP)</option>
                          <option value="AU">Australie (AU)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="amazonAccessKey" className="block text-sm font-medium text-gray-700 mb-1">
                          Clé d'accès AWS
                        </label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            id="amazonAccessKey"
                            type="text"
                            value={amazonAccessKey}
                            onChange={(e) => setAmazonAccessKey(e.target.value)}
                            placeholder="Entrez votre clé d'accès AWS"
                            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="amazonSecretKey" className="block text-sm font-medium text-gray-700 mb-1">
                          Clé secrète AWS
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            id="amazonSecretKey"
                            type={showApiSecret ? "text" : "password"}
                            value={amazonSecretKey}
                            onChange={(e) => setAmazonSecretKey(e.target.value)}
                            placeholder="Entrez votre clé secrète AWS"
                            className="w-full rounded-md border border-gray-300 pl-10 pr-10 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiSecret(!showApiSecret)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showApiSecret ? (
                              <svg xmlns="http://www.w3.org/2000/svg\" width="20\" height="20\" viewBox="0 0 24 24\" fill="none\" stroke="currentColor\" strokeWidth="2\" strokeLinecap="round\" strokeLinejoin="round">
                                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                <line x1="2" x2="22" y1="2" y2="22"></line>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Connexion en cours...
                            </>
                          ) : (
                            <>
                              Connecter le compte Amazon
                              <ArrowRight size={16} className="ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                    
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                        <p className="text-sm text-amber-700">
                          L'intégration Amazon sera disponible prochainement. Restez à l'affût pour les mises à jour !
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'tiktok' && (
                  <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Connecter votre boutique TikTok</h3>
                    
                    <form onSubmit={handleConnectTikTok} className="space-y-4">
                      <div>
                        <label htmlFor="tiktokAccessToken" className="block text-sm font-medium text-gray-700 mb-1">
                          Token d'accès TikTok
                        </label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            id="tiktokAccessToken"
                            type="text"
                            value={tiktokAccessToken}
                            onChange={(e) => setTiktokAccessToken(e.target.value)}
                            placeholder="Entrez votre token d'accès TikTok"
                            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="tiktokShopId" className="block text-sm font-medium text-gray-700 mb-1">
                          ID de la boutique TikTok
                        </label>
                        <div className="relative">
                          <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            id="tiktokShopId"
                            type="text"
                            value={tiktokShopId}
                            onChange={(e) => setTiktokShopId(e.target.value)}
                            placeholder="Entrez l'ID de votre boutique TikTok"
                            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Connexion en cours...
                            </>
                          ) : (
                            <>
                              Connecter la boutique TikTok
                              <ArrowRight size={16} className="ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                    
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
                        <p className="text-sm text-amber-700">
                          L'intégration TikTok sera disponible prochainement. Restez à l'affût pour les mises à jour !
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Besoin d'aide pour connecter votre boutique ?</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Consultez notre{' '}
                  <a href="/documentation/getting-started/store-connection" className="font-medium underline">
                    guide étape par étape
                  </a>{' '}
                  ou{' '}
                  <a href="/support" className="font-medium underline">
                    contactez notre équipe support
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Connectez votre boutique</h1>
        <p className="text-gray-600">
          Connectez votre plateforme e-commerce pour commencer à utiliser Shopopti+.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        layout
      >
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            className={`flex flex-1 items-center justify-center space-x-2 border-b-2 px-4 py-3 text-sm font-medium
              ${activeTab === 'shopify' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('shopify')}
          >
            <ShoppingBag size={20} />
            <span>Shopify</span>
          </button>
          <button
            type="button"
            className={`flex flex-1 items-center justify-center space-x-2 border-b-2 px-4 py-3 text-sm font-medium
              ${activeTab === 'woocommerce' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('woocommerce')}
          >
            <Store size={20} />
            <span>WooCommerce</span>
          </button>
          <button
            type="button"
            className={`flex flex-1 items-center justify-center space-x-2 border-b-2 px-4 py-3 text-sm font-medium
              ${activeTab === 'etsy' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('etsy')}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.56 21.5h6.89c3.37 0 4.09-1.3 4.09-3.95V6.45c0-2.65-.72-3.95-4.09-3.95H8.56c-3.37 0-4.09 1.3-4.09 3.95v11.1c0 2.65.72 3.95 4.09 3.95z" />
            </svg>
            <span>Etsy</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-500"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'shopify' ? (
              <form onSubmit={handleConnectShopify} className="mt-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="shopifyUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      URL de la boutique Shopify
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        id="shopifyUrl"
                        type="text"
                        value={shopifyUrl}
                        onChange={(e) => setShopifyUrl(e.target.value)}
                        placeholder="votre-boutique.myshopify.com"
                        className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="shopifyApiKey" className="block text-sm font-medium text-gray-700 mb-1">
                      Clé API Shopify
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        id="shopifyApiKey"
                        type="text"
                        value={shopifyApiKey}
                        onChange={(e) => setShopifyApiKey(e.target.value)}
                        placeholder="shpat_..."
                        className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Vous pouvez trouver ceci dans votre admin Shopify sous Paramètres → Applications et canaux de vente → Développer des applications
                    </p>
                  </div>
                  <div className="pt-3">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connexion en cours...
                        </>
                      ) : (
                        <>
                          <span>Connecter la boutique Shopify</span>
                          <ArrowRight size={16} className="ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            ) : activeTab === 'woocommerce' ? (
              <form onSubmit={handleConnectWooCommerce} className="mt-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="woocommerceUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      URL de la boutique WooCommerce
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        id="woocommerceUrl"
                        type="text"
                        value={woocommerceUrl}
                        onChange={(e) => setWoocommerceUrl(e.target.value)}
                        placeholder="https://votre-boutique.com"
                        className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="woocommerceKey" className="block text-sm font-medium text-gray-700 mb-1">
                      Clé consommateur
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        id="woocommerceKey"
                        type="text"
                        value={woocommerceKey}
                        onChange={(e) => setWoocommerceKey(e.target.value)}
                        placeholder="ck_..."
                        className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="woocommerceSecret" className="block text-sm font-medium text-gray-700 mb-1">
                      Secret consommateur
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        id="woocommerceSecret"
                        type={showApiSecret ? "text" : "password"}
                        value={woocommerceSecret}
                        onChange={(e) => setWoocommerceSecret(e.target.value)}
                        placeholder="cs_..."
                        className="w-full rounded-md border border-gray-300 pl-10 pr-10 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiSecret(!showApiSecret)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showApiSecret ? (
                          <svg xmlns="http://www.w3.org/2000/svg\" width="20\" height="20\" viewBox="0 0 24 24\" fill="none\" stroke="currentColor\" strokeWidth="2\" strokeLinecap="round\" strokeLinejoin="round">
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                            <line x1="2" x2="22" y1="2" y2="22"></line>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Vous pouvez trouver ces informations dans votre admin WooCommerce sous WooCommerce → Réglages → Avancé → API REST
                    </p>
                  </div>
                  <div className="pt-3">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connexion en cours...
                        </>
                      ) : (
                        <>
                          <span>Connecter la boutique WooCommerce</span>
                          <ArrowRight size={16} className="ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleConnectEtsy} className="mt-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="etsyApiKey" className="block text-sm font-medium text-gray-700 mb-1">
                      Clé API Etsy
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        id="etsyApiKey"
                        type="text"
                        value={etsyApiKey}
                        onChange={(e) => setEtsyApiKey(e.target.value)}
                        placeholder="Entrez votre clé API Etsy"
                        className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="etsyShopId" className="block text-sm font-medium text-gray-700 mb-1">
                      ID de la boutique Etsy
                    </label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        id="etsyShopId"
                        type="text"
                        value={etsyShopId}
                        onChange={(e) => setEtsyShopId(e.target.value)}
                        placeholder="Entrez l'ID de votre boutique Etsy"
                        className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="pt-3">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Connexion en cours...
                        </>
                      ) : (
                        <>
                          <span>Connecter la boutique Etsy</span>
                          <ArrowRight size={16} className="ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 rounded-md bg-blue-50 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Besoin d'aide pour connecter votre boutique ?</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Consultez notre{' '}
                  <a href="/documentation/getting-started/store-connection" className="font-medium underline">
                    guide étape par étape
                  </a>{' '}
                  ou{' '}
                  <a href="/support" className="font-medium underline">
                    contactez notre équipe support
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StoreConnection;