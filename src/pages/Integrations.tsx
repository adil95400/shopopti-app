import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import IntegrationCard from '../components/integrations/IntegrationCard';
import ApiIntegration from '../components/integrations/ApiIntegration';
import { 
  ShoppingBag, CreditCard, Truck, BarChart, Mail, 
  Globe, Code, Zap, Search, MessageSquare, Database
} from 'lucide-react';

const Integrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  
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
    }
  ];
  
  const handleConnect = async (id: string) => {
    // In a real app, you would connect to the integration
    console.log(`Connecting to ${id}...`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
  };
  
  const handleDisconnect = async (id: string) => {
    // In a real app, you would disconnect from the integration
    console.log(`Disconnecting from ${id}...`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
  };
  
  const handleConfigure = (id: string) => {
    // In a real app, you would open configuration modal
    console.log(`Configuring ${id}...`);
  };
  
  const filteredIntegrations = activeTab === 'all'
    ? integrations
    : integrations.filter(integration => integration.category === activeTab);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-600">
          Connect your store with other services and platforms to extend functionality.
        </p>
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
    </div>
  );
};

export default Integrations;