import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import IntegrationCard from '../components/integrations/IntegrationCard';
import ApiIntegration from '../components/integrations/ApiIntegration';
import { 
  ShoppingBag, CreditCard, Truck, BarChart, Mail, 
  Globe, Code, Zap, Search, MessageSquare, Database,
  Layers, Webhook, Settings, Plus, Filter
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const Integrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const integrations = [
    // Marketplaces
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'Connect your Shopify store to import products and sync orders automatically.',
      icon: <ShoppingBag className="h-5 w-5 text-green-600" />,
      connected: true,
      category: 'marketplace' as const,
      url: 'https://shopify.com'
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce',
      description: 'Integrate with your WooCommerce store for seamless product and order management.',
      icon: <ShoppingBag className="h-5 w-5 text-purple-600" />,
      connected: false,
      category: 'marketplace' as const,
      url: 'https://woocommerce.com'
    },
    {
      id: 'amazon',
      name: 'Amazon',
      description: 'Sell your products on Amazon marketplace and manage orders from one place.',
      icon: <ShoppingBag className="h-5 w-5 text-orange-600" />,
      connected: false,
      category: 'marketplace' as const,
      url: 'https://sellercentral.amazon.com'
    },
    {
      id: 'etsy',
      name: 'Etsy',
      description: 'Connect your Etsy shop to manage listings and orders through Shopopti+.',
      icon: <ShoppingBag className="h-5 w-5 text-orange-500" />,
      connected: false,
      category: 'marketplace' as const,
      url: 'https://etsy.com'
    },
    {
      id: 'bigcommerce',
      name: 'BigCommerce',
      description: 'Integrate your BigCommerce store for seamless product and order management.',
      icon: <ShoppingBag className="h-5 w-5 text-blue-600" />,
      connected: false,
      category: 'marketplace' as const,
      url: 'https://bigcommerce.com'
    },
    {
      id: 'squarespace',
      name: 'Squarespace',
      description: 'Connect your Squarespace store to manage products and orders.',
      icon: <ShoppingBag className="h-5 w-5 text-black" />,
      connected: false,
      category: 'marketplace' as const,
      url: 'https://squarespace.com'
    },
    
    // Payment
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Process payments securely with Stripe and manage subscriptions.',
      icon: <CreditCard className="h-5 w-5 text-blue-600" />,
      connected: true,
      category: 'payment' as const,
      url: 'https://stripe.com'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Accept PayPal payments and manage transactions in one place.',
      icon: <CreditCard className="h-5 w-5 text-blue-800" />,
      connected: false,
      category: 'payment' as const,
      url: 'https://paypal.com'
    },
    {
      id: 'adyen',
      name: 'Adyen',
      description: 'Global payment platform supporting multiple payment methods.',
      icon: <CreditCard className="h-5 w-5 text-green-600" />,
      connected: false,
      category: 'payment' as const,
      url: 'https://adyen.com'
    },
    
    // Shipping
    {
      id: 'shipstation',
      name: 'ShipStation',
      description: 'Automate your shipping process and print labels with ShipStation.',
      icon: <Truck className="h-5 w-5 text-purple-600" />,
      connected: false,
      category: 'shipping' as const,
      url: 'https://shipstation.com'
    },
    {
      id: 'easyship',
      name: 'Easyship',
      description: 'Get the best shipping rates and automate fulfillment with Easyship.',
      icon: <Truck className="h-5 w-5 text-blue-600" />,
      connected: true,
      category: 'shipping' as const,
      url: 'https://easyship.com'
    },
    {
      id: 'dhl',
      name: 'DHL Express',
      description: 'Connect with DHL for international shipping and tracking.',
      icon: <Truck className="h-5 w-5 text-yellow-600" />,
      connected: false,
      category: 'shipping' as const,
      url: 'https://dhl.com'
    },
    
    // Marketing
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Create email marketing campaigns and automate customer communications.',
      icon: <Mail className="h-5 w-5 text-yellow-600" />,
      connected: false,
      category: 'marketing' as const,
      url: 'https://mailchimp.com'
    },
    {
      id: 'klaviyo',
      name: 'Klaviyo',
      description: 'Powerful email marketing automation for e-commerce businesses.',
      icon: <Mail className="h-5 w-5 text-green-600" />,
      connected: false,
      category: 'marketing' as const,
      url: 'https://klaviyo.com'
    },
    {
      id: 'facebook',
      name: 'Facebook & Instagram',
      description: 'Connect your Facebook and Instagram shops for social selling.',
      icon: <Globe className="h-5 w-5 text-blue-600" />,
      connected: true,
      category: 'marketing' as const,
      url: 'https://facebook.com/business'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      description: 'Integrate with TikTok for Business to reach new customers.',
      icon: <Globe className="h-5 w-5 text-black" />,
      connected: false,
      category: 'marketing' as const,
      url: 'https://tiktok.com/business'
    },
    
    // Analytics
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Track website traffic and user behavior with Google Analytics.',
      icon: <BarChart className="h-5 w-5 text-blue-600" />,
      connected: true,
      category: 'analytics' as const,
      url: 'https://analytics.google.com'
    },
    {
      id: 'hotjar',
      name: 'Hotjar',
      description: 'Visualize user behavior with heatmaps and session recordings.',
      icon: <BarChart className="h-5 w-5 text-red-600" />,
      connected: false,
      category: 'analytics' as const,
      url: 'https://hotjar.com'
    },
    {
      id: 'segment',
      name: 'Segment',
      description: 'Collect, clean, and control your customer data with Segment.',
      icon: <BarChart className="h-5 w-5 text-green-600" />,
      connected: false,
      category: 'analytics' as const,
      url: 'https://segment.com'
    }
  ];
  
  const handleConnect = async (id: string) => {
    try {
      setLoading(true);
      // In a real app, you would connect to the integration
      console.log(`Connecting to ${id}...`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Successfully connected to ${id}`);
    } catch (error) {
      console.error(`Error connecting to ${id}:`, error);
      toast.error(`Failed to connect to ${id}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDisconnect = async (id: string) => {
    try {
      setLoading(true);
      // In a real app, you would disconnect from the integration
      console.log(`Disconnecting from ${id}...`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Successfully disconnected from ${id}`);
    } catch (error) {
      console.error(`Error disconnecting from ${id}:`, error);
      toast.error(`Failed to disconnect from ${id}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleConfigure = (id: string) => {
    // In a real app, you would open configuration modal
    console.log(`Configuring ${id}...`);
    toast.info(`Opening configuration for ${id}`);
  };
  
  const filteredIntegrations = integrations.filter(integration => {
    // Filter by category if not "all"
    if (activeTab !== 'all' && integration.category !== activeTab) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !integration.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !integration.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600">
            Connect your store with other services and platforms to extend functionality.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search integrations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="all" className="flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            <span>All</span>
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2" />
            <span>Marketplaces</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            <span>Payment</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center">
            <Truck className="h-4 w-4 mr-2" />
            <span>Shipping</span>
          </TabsTrigger>
          <TabsTrigger value="marketing" className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            <span>Marketing</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map(integration => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onConfigure={handleConfigure}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ApiIntegration />
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-full mr-3">
              <Database className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium">Custom Integrations</h3>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              Need a custom integration? Our team can build tailored solutions for your specific needs.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              <Code className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Custom API Development</h4>
                <p className="text-sm text-gray-500">Tailored API solutions for your unique requirements</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              <Search className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Data Migration</h4>
                <p className="text-sm text-gray-500">Migrate data from any platform to Shopopti+</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              <MessageSquare className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Consultation</h4>
                <p className="text-sm text-gray-500">Expert advice on integration strategy</p>
              </div>
            </div>
          </div>
          
          <Button className="w-full mt-6">
            Contact for Custom Integration
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Layers className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-blue-800">Integration Ecosystem</h3>
            <p className="mt-2 text-sm text-blue-700">
              Shopopti+ integrates with over 50+ platforms and services to help you streamline your e-commerce operations.
              Our open API and webhook system allows for custom integrations with virtually any service.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-md shadow-sm">
                <h4 className="font-medium text-blue-800">API Documentation</h4>
                <p className="text-sm text-blue-700 mt-1">Comprehensive API docs for developers</p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <h4 className="font-medium text-blue-800">Webhook System</h4>
                <p className="text-sm text-blue-700 mt-1">Real-time event notifications</p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <h4 className="font-medium text-blue-800">Developer Support</h4>
                <p className="text-sm text-blue-700 mt-1">Dedicated support for integration partners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;