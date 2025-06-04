import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRole } from '../../context/RoleContext';
import { BarChart3, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Navigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { isAdmin, loading } = useRole();
  const [stats, setStats] = useState({
    users: { total: 0, growth: 0 },
    revenue: { total: 0, growth: 0 },
    orders: { total: 0, growth: 0 },
    products: { total: 0, growth: 0 }
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminStats();
    }
  }, [isAdmin]);

  const fetchAdminStats = async () => {
    try {
      setDataLoading(true);
      
      // In a real app, you would fetch this data from your database
      // For now, we'll use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        users: { total: 1234, growth: 12.5 },
        revenue: { total: 45678, growth: 8.3 },
        orders: { total: 789, growth: 5.7 },
        products: { total: 456, growth: -2.3 }
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Administration</h1>
          <p className="text-gray-500">Vue d'ensemble de la plateforme</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Exporter les données</Button>
          <Button>Paramètres</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.total}</div>
            <div className="flex items-center pt-1 text-xs">
              {stats.users.growth > 0 ? (
                <>
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">{stats.users.growth}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">{Math.abs(stats.users.growth)}%</span>
                </>
              )}
              <span className="text-gray-500 ml-1">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.total.toLocaleString()}</div>
            <div className="flex items-center pt-1 text-xs">
              {stats.revenue.growth > 0 ? (
                <>
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">{stats.revenue.growth}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">{Math.abs(stats.revenue.growth)}%</span>
                </>
              )}
              <span className="text-gray-500 ml-1">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders.total}</div>
            <div className="flex items-center pt-1 text-xs">
              {stats.orders.growth > 0 ? (
                <>
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">{stats.orders.growth}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">{Math.abs(stats.orders.growth)}%</span>
                </>
              )}
              <span className="text-gray-500 ml-1">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products.total}</div>
            <div className="flex items-center pt-1 text-xs">
              {stats.products.growth > 0 ? (
                <>
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">{stats.products.growth}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">{Math.abs(stats.products.growth)}%</span>
                </>
              )}
              <span className="text-gray-500 ml-1">vs mois dernier</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataLoading ? (
                <div className="text-center py-4">Chargement des données...</div>
              ) : (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                        <Users className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium">Utilisateur {i + 1}</div>
                        <div className="text-sm text-gray-500">utilisateur{i + 1}@exemple.com</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button variant="outline" className="w-full mt-4">Voir tous les utilisateurs</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commandes récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataLoading ? (
                <div className="text-center py-4">Chargement des données...</div>
              ) : (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                        <ShoppingBag className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-medium">Commande #{1000 + i}</div>
                        <div className="text-sm text-gray-500">{(99.99 * (i + 1)).toFixed(2)}€</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(Date.now() - i * 43200000).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button variant="outline" className="w-full mt-4">Voir toutes les commandes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;