import React, { useState } from 'react';
import { useShop } from '../contexts/ShopContext';
import { ShoppingBag, ArrowRight, Store, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StoreConnection: React.FC = () => {
  const { isConnected, store, connectShopify, connectWooCommerce } = useShop();
  const [activeTab, setActiveTab] = useState<'shopify' | 'woocommerce'>('shopify');
  const [shopifyUrl, setShopifyUrl] = useState('');
  const [shopifyApiKey, setShopifyApiKey] = useState('');
  const [woocommerceUrl, setWoocommerceUrl] = useState('');
  const [woocommerceKey, setWoocommerceKey] = useState('');
  const [woocommerceSecret, setWoocommerceSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleConnectShopify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await connectShopify(shopifyUrl, shopifyApiKey);
      if (success) {
        navigate('/app/dashboard');
      } else {
        setError('Échec de la connexion à Shopify. Veuillez vérifier vos identifiants.');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWooCommerce = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = await connectWooCommerce(woocommerceUrl, woocommerceKey, woocommerceSecret);
      if (success) {
        navigate('/app/dashboard');
      } else {
        setError('Échec de la connexion à WooCommerce. Veuillez vérifier vos identifiants.');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (isConnected && store) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white md:text-3xl">Connexion de la boutique</h1>
          <p className="text-accent-200">Gérez votre boutique e-commerce connectée.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card"
          layout
        >
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-400 bg-opacity-10 text-primary-400">
              {store.platform === 'shopify' ? (
                <ShoppingBag className="h-7 w-7" />
              ) : (
                <Store className="h-7 w-7" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{store.name}</h2>
              <div className="flex items-center mt-1">
                <span className="text-sm capitalize text-accent-200">{store.platform}</span>
                <span className="mx-2 text-accent-200">•</span>
                <div className="flex items-center text-success-400">
                  <Check size={14} className="mr-1" />
                  <span className="text-sm">Connecté</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-accent-200/10 pt-4">
            <h3 className="font-medium text-white">Informations de la boutique</h3>
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-accent-200">URL de la boutique</p>
                <p className="font-medium text-white">{store.url}</p>
              </div>
              <div>
                <p className="text-sm text-accent-200">Statut</p>
                <div className="flex items-center">
                  <span className="inline-block h-2 w-2 rounded-full bg-success-400"></span>
                  <span className="ml-2 font-medium capitalize text-white">{store.status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-accent-200/10 pt-4">
            <h3 className="font-medium text-white">Prochaines étapes</h3>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-md bg-primary-400 bg-opacity-10 p-3">
                <h4 className="font-medium text-primary-400">Importer des produits</h4>
                <p className="mt-1 text-sm text-primary-400">Importez vos produits existants ou ajoutez-en de nouveaux.</p>
              </div>
              <div className="rounded-md bg-primary-400 bg-opacity-10 p-3">
                <h4 className="font-medium text-primary-400">Optimiser le contenu</h4>
                <p className="mt-1 text-sm text-primary-400">Laissez l'IA optimiser vos descriptions et votre SEO.</p>
              </div>
              <div className="rounded-md bg-primary-400 bg-opacity-10 p-3">
                <h4 className="font-medium text-primary-400">Publier sur les canaux</h4>
                <p className="mt-1 text-sm text-primary-400">Publiez vos produits sur Google, Facebook et TikTok.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white md:text-3xl">Connectez votre boutique</h1>
        <p className="text-accent-200">
          Connectez votre plateforme e-commerce pour commencer à utiliser Shopopti+.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card"
        layout
      >
        <div className="flex border-b border-accent-200/10">
          <button
            type="button"
            className={`flex flex-1 items-center justify-center space-x-2 border-b-2 px-4 py-3 text-sm font-medium
              ${activeTab === 'shopify' 
                ? 'border-primary-400 text-primary-400' 
                : 'border-transparent text-accent-200 hover:text-white'}`}
            onClick={() => setActiveTab('shopify')}
          >
            <ShoppingBag size={20} />
            <span>Shopify</span>
          </button>
          <button
            type="button"
            className={`flex flex-1 items-center justify-center space-x-2 border-b-2 px-4 py-3 text-sm font-medium
              ${activeTab === 'woocommerce' 
                ? 'border-primary-400 text-primary-400' 
                : 'border-transparent text-accent-200 hover:text-white'}`}
            onClick={() => setActiveTab('woocommerce')}
          >
            <Store size={20} />
            <span>WooCommerce</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 rounded-md bg-error-400/10 p-3 text-sm text-error-400"
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
                    <label htmlFor="shopifyUrl" className="block text-sm font-medium text-accent-200">
                      URL de la boutique Shopify
                    </label>
                    <input
                      id="shopifyUrl"
                      type="text"
                      value={shopifyUrl}
                      onChange={(e) => setShopifyUrl(e.target.value)}
                      placeholder="votre-boutique.myshopify.com"
                      className="input mt-1 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="shopifyApiKey" className="block text-sm font-medium text-accent-200">
                      Clé API Shopify
                    </label>
                    <input
                      id="shopifyApiKey"
                      type="text"
                      value={shopifyApiKey}
                      onChange={(e) => setShopifyApiKey(e.target.value)}
                      placeholder="shpat_..."
                      className="input mt-1 w-full"
                      required
                    />
                    <p className="mt-1 text-xs text-accent-200">
                      Vous pouvez trouver ceci dans votre admin Shopify sous Paramètres → Applications et canaux de vente → Développer des applications
                    </p>
                  </div>
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-full flex justify-center items-center"
                    >
                      {loading ? (
                        <svg className="h-5 w-5 animate-spin text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                          <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <>
                          <span>Connecter la boutique Shopify</span>
                          <ArrowRight size={16} className="ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleConnectWooCommerce} className="mt-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="woocommerceUrl" className="block text-sm font-medium text-accent-200">
                      URL de la boutique WooCommerce
                    </label>
                    <input
                      id="woocommerceUrl"
                      type="text"
                      value={woocommerceUrl}
                      onChange={(e) => setWoocommerceUrl(e.target.value)}
                      placeholder="https://votre-boutique.com"
                      className="input mt-1 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="woocommerceKey" className="block text-sm font-medium text-accent-200">
                      Clé consommateur
                    </label>
                    <input
                      id="woocommerceKey"
                      type="text"
                      value={woocommerceKey}
                      onChange={(e) => setWoocommerceKey(e.target.value)}
                      placeholder="ck_..."
                      className="input mt-1 w-full"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="woocommerceSecret" className="block text-sm font-medium text-accent-200">
                      Secret consommateur
                    </label>
                    <input
                      id="woocommerceSecret"
                      type="text"
                      value={woocommerceSecret}
                      onChange={(e) => setWoocommerceSecret(e.target.value)}
                      placeholder="cs_..."
                      className="input mt-1 w-full"
                      required
                    />
                    <p className="mt-1 text-xs text-accent-200">
                      Vous pouvez trouver ces informations dans votre admin WooCommerce sous WooCommerce → Réglages → Avancé → API REST
                    </p>
                  </div>
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-full flex justify-center items-center"
                    >
                      {loading ? (
                        <svg className="h-5 w-5 animate-spin text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                          <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <>
                          <span>Connecter la boutique WooCommerce</span>
                          <ArrowRight size={16} className="ml-2" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 rounded-md bg-secondary-600 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-accent-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-white">Besoin d'aide pour connecter votre boutique ?</h3>
              <div className="mt-2 text-sm text-accent-200">
                <p>
                  Consultez notre{' '}
                  <a href="#" className="font-medium text-primary-400 hover:text-primary-500">
                    guide étape par étape
                  </a>{' '}
                  ou{' '}
                  <a href="#" className="font-medium text-primary-400 hover:text-primary-500">
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