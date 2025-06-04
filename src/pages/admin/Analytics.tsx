import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRole } from '../../context/RoleContext';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Navigate } from 'react-router-dom';

const AdminAnalytics: React.FC = () => {
  const { isAdmin, loading: roleLoading } = useRole();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30days');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    revenue: 0,
    revenueGrowth: 0,
    orders: 0,
    ordersGrowth: 0,
    averageOrderValue: 0,
    conversionRate: 0
  });

  useEffect(() => {
    if (isAdmin) {
      fetchAnalyticsData();
    }
  }, [isAdmin, period]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch this data from your database
      // For now, we'll use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalUsers: 1234,
        activeUsers: 789,
        newUsers: 123,
        revenue: 45678,
        revenueGrowth: 8.3,
        orders: 789,
        ordersGrowth: 5.7,
        averageOrderValue: 57.89,
        conversionRate: 3.2
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (roleLoading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Analyse de la plateforme</h1>
          <p className="text-gray-500">Statistiques et métriques globales</p>
        </div>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
            <option value="90days">90 derniers jours</option>
            <option value="year">Cette année</option>
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Chiffre d'affaires</h3>
            <div className="p-2 bg-blue-50 rounded-full">
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.revenue.toLocaleString()}€</p>
          <div className="flex items-center mt-2">
            <span className={`flex items-center text-sm ${stats.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.revenueGrowth >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {Math.abs(stats.revenueGrowth)}%
            </span>
            <span className="text-xs text-gray-500 ml-2">vs période précédente</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Commandes</h3>
            <div className="p-2 bg-purple-50 rounded-full">
              <BarChart3 className="h-5 w-5 text-purple-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.orders}</p>
          <div className="flex items-center mt-2">
            <span className={`flex items-center text-sm ${stats.ordersGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.ordersGrowth >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {Math.abs(stats.ordersGrowth)}%
            </span>
            <span className="text-xs text-gray-500 ml-2">vs période précédente</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Utilisateurs</h3>
            <div className="p-2 bg-green-50 rounded-full">
              <Users className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-600">{stats.activeUsers} actifs</span>
            <span className="mx-2 text-gray-300">•</span>
            <span className="text-sm text-green-500">+{stats.newUsers} nouveaux</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Taux de conversion</h3>
            <div className="p-2 bg-orange-50 rounded-full">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.conversionRate}%</p>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-600">Panier moyen: {stats.averageOrderValue.toFixed(2)}€</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-medium mb-4">Revenus par période</h3>
          <div className="h-80 bg-gray-100 rounded-md flex items-center justify-center">
            <span className="text-gray-500">Graphique: Revenus par période</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-medium mb-4">Répartition des utilisateurs</h3>
          <div className="h-80 bg-gray-100 rounded-md flex items-center justify-center">
            <span className="text-gray-500">Graphique: Répartition utilisateurs</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-medium mb-4">Produits les plus vendus</h3>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-4">Chargement des données...</div>
            ) : (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-200 rounded-md mr-3"></div>
                    <div>
                      <div className="font-medium text-gray-900">Produit {i + 1}</div>
                      <div className="text-xs text-gray-500">{(99.99 - i * 10).toFixed(2)}€</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{100 - i * 15} ventes</div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-medium mb-4">Activité récente</h3>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-4">Chargement des données...</div>
            ) : (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <Users className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <div className="font-medium">Action {i + 1}</div>
                    <div className="text-sm text-gray-500">Il y a {i + 1} heure{i > 0 ? 's' : ''}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;