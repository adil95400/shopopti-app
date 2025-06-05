import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BarChart3, ShoppingBag, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Package, Calendar, Bell, Settings, FileText, Bot, Database, Code, Layers, Webhook } from 'lucide-react';
import SubscriptionOverview from '../components/dashboard/SubscriptionOverview';
import TrackingWidget from '../components/tracking/TrackingWidget';
import MainNavbar from '../components/layout/MainNavbar';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';

export default function Dashboard() {
  const [stats, setStats] = useState({
    revenue: { value: 1060, change: 25 },
    orders: { value: 98, change: 12 },
    visitors: { value: 4521, change: 15.3 },
    conversion: { value: 3.2, change: -0.5 }
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'order',
      title: 'Nouvelle commande reçue',
      description: 'Commande #2345 - 129.99€',
      time: '2 heures',
      icon: ShoppingBag
    },
    {
      id: 2,
      type: 'customer',
      title: 'Nouveau client inscrit',
      description: 'Jean Dupont (jean@exemple.com)',
      time: '5 heures',
      icon: Users
    },
    {
      id: 3,
      type: 'report',
      title: 'Rapport mensuel disponible',
      description: 'Votre rapport de performance Mai 2025 est prêt',
      time: '1 jour',
      icon: BarChart3
    }
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Dans une application réelle, récupérez les données depuis Supabase
      // Pour l'instant, nous utilisons des données statiques
      
      // Simuler un délai API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        revenue: { value: 1060, change: 25 },
        orders: { value: 98, change: 12 },
        visitors: { value: 4521, change: 15.3 },
        conversion: { value: 3.2, change: -0.5 }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des données du tableau de bord:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500">Chiffre d'affaires</h3>
              <div className="p-2 bg-blue-50 rounded-full">
                <DollarSign className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stats.revenue.value.toLocaleString()}€</p>
            <div className="flex items-center mt-2">
              <span className={`flex items-center text-sm ${stats.revenue.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.revenue.change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {Math.abs(stats.revenue.change)}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs période précédente</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500">Commandes</h3>
              <div className="p-2 bg-purple-50 rounded-full">
                <ShoppingBag className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stats.orders.value}</p>
            <div className="flex items-center mt-2">
              <span className={`flex items-center text-sm ${stats.orders.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.orders.change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {Math.abs(stats.orders.change)}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs période précédente</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500">Visiteurs</h3>
              <div className="p-2 bg-green-50 rounded-full">
                <Users className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stats.visitors.value.toLocaleString()}</p>
            <div className="flex items-center mt-2">
              <span className={`flex items-center text-sm ${stats.visitors.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.visitors.change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {Math.abs(stats.visitors.change)}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs période précédente</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-500">Taux de conversion</h3>
              <div className="p-2 bg-orange-50 rounded-full">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stats.conversion.value}%</p>
            <div className="flex items-center mt-2">
              <span className={`flex items-center text-sm ${stats.conversion.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.conversion.change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {Math.abs(stats.conversion.change)}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs période précédente</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Activité récente</h2>
            <div className="space-y-4">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className={`p-2 rounded-full mr-3 ${
                      activity.type === 'order' ? 'bg-blue-50' : 
                      activity.type === 'customer' ? 'bg-green-50' : 'bg-purple-50'
                    }`}>
                      <activity.icon className={`h-5 w-5 ${
                        activity.type === 'order' ? 'text-blue-500' : 
                        activity.type === 'customer' ? 'text-green-500' : 'text-purple-500'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">Il y a {activity.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link to="/app/analytics" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                Voir toute l'activité →
              </Link>
            </div>
          </div>
          
          <div className="space-y-6">
            <SubscriptionOverview />
            <TrackingWidget compact />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link to="/tracking" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold flex items-center">
              <Package className="h-5 w-5 mr-2 text-blue-500" />
              Suivi colis
            </h2>
            <p className="text-gray-500 mt-1">Suivez vos envois en temps réel</p>
          </Link>
          <Link to="/generate-invoice" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-500" />
              Générer facture
            </h2>
            <p className="text-gray-500 mt-1">Créez des factures PDF automatisées</p>
          </Link>
          <Link to="/blog-ai" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold flex items-center">
              <Bot className="h-5 w-5 mr-2 text-purple-500" />
              Blog IA
            </h2>
            <p className="text-gray-500 mt-1">Générez du contenu optimisé SEO</p>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link to="/app/integrations" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold flex items-center">
              <Code className="h-5 w-5 mr-2 text-indigo-500" />
              Intégrations
            </h2>
            <p className="text-gray-500 mt-1">Connectez vos plateformes préférées</p>
          </Link>
          <Link to="/app/webhooks" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold flex items-center">
              <Webhook className="h-5 w-5 mr-2 text-orange-500" />
              Webhooks
            </h2>
            <p className="text-gray-500 mt-1">Automatisez vos flux de données</p>
          </Link>
          <Link to="/app/advanced-analytics" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-lg font-semibold flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-red-500" />
              Analytics avancé
            </h2>
            <p className="text-gray-500 mt-1">Analysez vos performances en détail</p>
          </Link>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-blue-500 mr-3" />
              <div>
                <h3 className="font-medium">Aujourd'hui</h3>
                <p className="text-sm text-gray-600">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 bg-white rounded-full text-gray-500 hover:text-gray-700">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 bg-white rounded-full text-gray-500 hover:text-gray-700">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

function DollarSign(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
}