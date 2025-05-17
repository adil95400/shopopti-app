import React from 'react';
import { useShopContext } from '../contexts/ShopContext';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  PackageCheck, 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Store,
  ArrowRight,
  Zap,
  Globe,
  Bot
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for charts
const salesData = [
  { name: 'Lun', sales: 4000 },
  { name: 'Mar', sales: 3000 },
  { name: 'Mer', sales: 5000 },
  { name: 'Jeu', sales: 2780 },
  { name: 'Ven', sales: 1890 },
  { name: 'Sam', sales: 2390 },
  { name: 'Dim', sales: 3490 },
];

const Dashboard: React.FC = () => {
  const { isConnected, stats, store } = useShopContext();

  // Animation variants for staggered animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // If no store is connected, show a welcome screen
  if (!isConnected) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary-400 bg-opacity-10">
            <Store className="h-12 w-12 text-primary-400" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white">Bienvenue sur Shopopti+</h1>
          <p className="mt-2 text-lg text-accent-200">
            Connectez votre boutique pour commencer l'optimisation avec l'IA
          </p>
          <div className="mt-8">
            <Link to="/app/store-connection">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-primary"
              >
                Connecter votre boutique
                <ArrowRight size={16} className="ml-2" />
              </motion.button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="card">
              <div className="flex items-center justify-center">
                <Globe className="h-8 w-8 text-primary-400" />
              </div>
              <h3 className="mt-4 text-center text-lg font-medium text-white">
                Intégrations Multiples
              </h3>
              <p className="mt-2 text-center text-accent-200">
                Compatible avec Shopify, WooCommerce et plus encore
              </p>
            </div>

            <div className="card">
              <div className="flex items-center justify-center">
                <Bot className="h-8 w-8 text-primary-400" />
              </div>
              <h3 className="mt-4 text-center text-lg font-medium text-white">
                Optimisation IA
              </h3>
              <p className="mt-2 text-center text-accent-200">
                Améliorez vos produits et vos ventes avec l'IA
              </p>
            </div>

            <div className="card">
              <div className="flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary-400" />
              </div>
              <h3 className="mt-4 text-center text-lg font-medium text-white">
                Automatisation
              </h3>
              <p className="mt-2 text-center text-accent-200">
                Automatisez vos tâches quotidiennes
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Tableau de bord</h1>
          <p className="text-accent-200">
            Bienvenue ! Voici ce qui se passe dans votre boutique aujourd'hui.
          </p>
        </div>
        <div className="flex items-center space-x-2 rounded-lg border border-accent-200/10 bg-secondary-500 px-3 py-2 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-400 bg-opacity-10 text-primary-400">
            {store?.platform === 'shopify' ? 
              <ShoppingCart className="h-5 w-5" /> : 
              <Store className="h-5 w-5" />
            }
          </div>
          <div>
            <p className="font-medium text-white">{store?.name}</p>
            <p className="text-xs text-accent-200">{store?.platform} · Connecté</p>
          </div>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={item} className="metric-card">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-accent-200">Total Produits</h3>
            <div className="rounded-md bg-primary-400 bg-opacity-10 p-2 text-primary-400">
              <ShoppingBag size={16} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-white">{stats.total_products}</p>
          <p className="mt-1 text-sm text-accent-200">
            <span className="text-success-400">+5%</span> depuis le mois dernier
          </p>
        </motion.div>

        <motion.div variants={item} className="metric-card">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-accent-200">Total Commandes</h3>
            <div className="rounded-md bg-primary-400 bg-opacity-10 p-2 text-primary-400">
              <PackageCheck size={16} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-white">{stats.total_orders}</p>
          <p className="mt-1 text-sm text-accent-200">
            <span className="text-success-400">+12%</span> depuis le mois dernier
          </p>
        </motion.div>

        <motion.div variants={item} className="metric-card">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-accent-200">Revenu Aujourd'hui</h3>
            <div className="rounded-md bg-primary-400 bg-opacity-10 p-2 text-primary-400">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-white">${stats.revenue_today.toFixed(2)}</p>
          <p className="mt-1 text-sm text-accent-200">
            <span className="text-success-400">+8%</span> depuis hier
          </p>
        </motion.div>

        <motion.div variants={item} className="metric-card">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-accent-200">Revenu Mensuel</h3>
            <div className="rounded-md bg-primary-400 bg-opacity-10 p-2 text-primary-400">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-white">${stats.revenue_month.toFixed(2)}</p>
          <p className="mt-1 text-sm text-accent-200">
            <span className="text-success-400">+15%</span> depuis le mois dernier
          </p>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <div className="card col-span-2">
          <h3 className="mb-4 font-medium text-white">Aperçu des ventes</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#525252" />
                <XAxis 
                  dataKey="name" 
                  tick={{fontSize: 12, fill: '#a3a3a3'}}
                />
                <YAxis 
                  tick={{fontSize: 12, fill: '#a3a3a3'}}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Ventes']}
                  contentStyle={{
                    backgroundColor: '#1a1724',
                    border: '1px solid #525252',
                    borderRadius: '0.375rem',
                    padding: '8px 12px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#FF7A3D" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#FF7A3D' }}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card">
            <h3 className="mb-4 font-medium text-white">Commandes Récentes</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((order) => (
                <div key={order} className="flex items-center justify-between border-b border-accent-200/10 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-400 bg-opacity-10">
                      <PackageCheck size={16} className="text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Commande #{1000 + order}</p>
                      <p className="text-xs text-accent-200">Il y a 2 heures</p>
                    </div>
                  </div>
                  <p className="font-medium text-white">${(Math.random() * 100).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center">
              <Link to="/app/orders" className="text-sm font-medium text-primary-400 hover:text-primary-500">
                Voir toutes les commandes
              </Link>
            </div>
          </div>

          <div className="card">
            <h3 className="mb-4 font-medium text-white">Recommandations IA</h3>
            <div className="rounded-md bg-primary-400 bg-opacity-10 p-3 text-sm text-primary-400">
              <p className="font-medium">Optimisez vos titres de produits</p>
              <p className="mt-1">L'analyse IA montre que l'ajout de mots-clés à vos titres de produits pourrait améliorer votre visibilité de 15%.</p>
            </div>
            <div className="mt-3 text-center">
              <Link to="/app/products" className="text-sm font-medium text-primary-400 hover:text-primary-500">
                Voir les recommandations
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;