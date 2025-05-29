import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import PerformanceMetrics from '../components/analytics/PerformanceMetrics';
import TrafficSources from '../components/analytics/TrafficSources';
import ProductPerformance from '../components/analytics/ProductPerformance';
import { Calendar, ChevronDown, Download, BarChart3, Globe, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';

const AdvancedAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data
      const mockData = generateMockData(period);
      setData(mockData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (period: 'week' | 'month' | 'year') => {
    // Generate dates
    const dates = [];
    const now = new Date();
    const daysToGenerate = period === 'week' ? 7 : period === 'month' ? 30 : 365;
    
    for (let i = daysToGenerate - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    // Generate revenue data
    const revenueData = dates.map(date => ({
      date,
      value: Math.floor(Math.random() * 1000) + 500
    }));
    
    // Generate orders data
    const ordersData = dates.map(date => ({
      date,
      value: Math.floor(Math.random() * 20) + 5
    }));
    
    // Generate visitors data
    const visitorsData = dates.map(date => ({
      date,
      value: Math.floor(Math.random() * 500) + 100
    }));
    
    // Generate conversion data
    const conversionData = dates.map((date, index) => ({
      date,
      value: parseFloat(((ordersData[index].value / visitorsData[index].value) * 100).toFixed(2))
    }));
    
    // Traffic sources
    const trafficSources = {
      sources: [
        { name: 'Direct', value: 3500, icon: <Globe className="h-4 w-4 text-blue-500" />, color: '#3B82F6' },
        { name: 'Google', value: 2500, icon: <Search className="h-4 w-4 text-green-500" />, color: '#10B981' },
        { name: 'Facebook', value: 1800, icon: <Facebook className="h-4 w-4 text-blue-600" />, color: '#2563EB' },
        { name: 'Instagram', value: 1200, icon: <Instagram className="h-4 w-4 text-pink-500" />, color: '#EC4899' },
        { name: 'Email', value: 800, icon: <Mail className="h-4 w-4 text-yellow-500" />, color: '#F59E0B' }
      ],
      referrers: [
        { name: 'google.com', visits: 2500, conversion: 4.2 },
        { name: 'facebook.com', visits: 1800, conversion: 3.8 },
        { name: 'instagram.com', visits: 1200, conversion: 3.5 },
        { name: 'pinterest.com', visits: 650, conversion: 2.9 },
        { name: 'tiktok.com', visits: 450, conversion: 2.7 }
      ]
    };
    
    // Product performance
    const productPerformance = Array(15).fill(0).map((_, i) => ({
      id: `prod-${i + 1}`,
      name: `Product ${i + 1}`,
      image: `https://images.pexels.com/photos/${1037992 + i * 10}/pexels-photo-${1037992 + i * 10}.jpeg?auto=compress&cs=tinysrgb&w=300`,
      views: Math.floor(Math.random() * 1000) + 100,
      orders: Math.floor(Math.random() * 100) + 10,
      revenue: Math.floor(Math.random() * 5000) + 500,
      conversion: parseFloat((Math.random() * 10 + 1).toFixed(2)),
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
    }));
    
    return {
      revenue: {
        daily: revenueData,
        total: revenueData.reduce((acc, curr) => acc + curr.value, 0),
        change: parseFloat((Math.random() * 30 - 10).toFixed(1))
      },
      orders: {
        daily: ordersData,
        total: ordersData.reduce((acc, curr) => acc + curr.value, 0),
        change: parseFloat((Math.random() * 30 - 10).toFixed(1))
      },
      visitors: {
        daily: visitorsData,
        total: visitorsData.reduce((acc, curr) => acc + curr.value, 0),
        change: parseFloat((Math.random() * 30 - 10).toFixed(1))
      },
      conversion: {
        daily: conversionData,
        average: parseFloat((conversionData.reduce((acc, curr) => acc + curr.value, 0) / conversionData.length).toFixed(2)),
        change: parseFloat((Math.random() * 10 - 5).toFixed(1))
      },
      traffic: trafficSources,
      products: productPerformance
    };
  };

  function Search({ className }: { className?: string }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </svg>
    );
  }

  function Facebook({ className }: { className?: string }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    );
  }

  function Instagram({ className }: { className?: string }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
      </svg>
    );
  }

  function Mail({ className }: { className?: string }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
      </svg>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600">
            Detailed insights into your store's performance and customer behavior.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <button className="px-4 py-2 border border-gray-300 rounded-md flex items-center bg-white">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span>
                {period === 'week' ? 'Last 7 days' : 
                 period === 'month' ? 'Last 30 days' : 
                 'Last 365 days'}
              </span>
              <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
            </button>
            
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 hidden">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => setPeriod('week')}
                >
                  Last 7 days
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => setPeriod('month')}
                >
                  Last 30 days
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  onClick={() => setPeriod('year')}
                >
                  Last 365 days
                </button>
              </div>
            </div>
          </div>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="traffic" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            <span>Traffic Sources</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2" />
            <span>Product Performance</span>
          </TabsTrigger>
        </TabsList>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : data ? (
          <>
            <TabsContent value="overview">
              <PerformanceMetrics data={data} period={period} />
            </TabsContent>
            
            <TabsContent value="traffic">
              <TrafficSources data={data.traffic} />
            </TabsContent>
            
            <TabsContent value="products">
              <ProductPerformance products={data.products} />
            </TabsContent>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No data available
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;