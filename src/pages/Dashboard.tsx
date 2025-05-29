import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BarChart3, ShoppingBag, TrendingUp, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import SubscriptionOverview from '../components/dashboard/SubscriptionOverview';

export default function Dashboard() {
  const [stats, setStats] = useState({
    revenue: { value: 0, change: 0 },
    orders: { value: 0, change: 0 },
    visitors: { value: 0, change: 0 },
    conversion: { value: 0, change: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // In a real app, fetch actual data from Supabase
      // For now, we'll use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        revenue: { value: 12458.99, change: 12.5 },
        orders: { value: 143, change: 8.2 },
        visitors: { value: 4521, change: 15.3 },
        conversion: { value: 3.2, change: -0.5 }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
            <div className="p-2 bg-blue-50 rounded-full">
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">${stats.revenue.value.toLocaleString()}</p>
          <div className="flex items-center mt-2">
            <span className={`flex items-center text-sm ${stats.revenue.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {stats.revenue.change >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {Math.abs(stats.revenue.change)}%
            </span>
            <span className="text-xs text-gray-500 ml-2">vs last period</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Orders</h3>
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
            <span className="text-xs text-gray-500 ml-2">vs last period</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Visitors</h3>
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
            <span className="text-xs text-gray-500 ml-2">vs last period</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Conversion</h3>
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
            <span className="text-xs text-gray-500 ml-2">vs last period</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
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
              <>
                <div className="flex items-start">
                  <div className="p-2 bg-blue-50 rounded-full mr-3">
                    <ShoppingBag className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">New order received</p>
                    <p className="text-sm text-gray-500">Order #2345 - $129.99</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 bg-green-50 rounded-full mr-3">
                    <Users className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">New customer registered</p>
                    <p className="text-sm text-gray-500">John Doe (john@example.com)</p>
                    <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 bg-purple-50 rounded-full mr-3">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">Monthly report available</p>
                    <p className="text-sm text-gray-500">Your May 2025 performance report is ready</p>
                    <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link to="/app/analytics" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              View all activity →
            </Link>
          </div>
        </div>
        
        <div>
          <SubscriptionOverview />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/tracking" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold">📦 Suivi colis</h2>
          <p className="text-gray-500">Suivre vos envois</p>
        </Link>
        <Link to="/generate-invoice" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold">🧾 Générer facture</h2>
          <p className="text-gray-500">PDF automatisé client</p>
        </Link>
        <Link to="/blog-ai" className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-lg font-semibold">📝 Blog IA</h2>
          <p className="text-gray-500">Créer des articles optimisés</p>
        </Link>
      </div>
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