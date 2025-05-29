import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ChannelManager from '../components/multichannel/ChannelManager';
import ProductPublisher from '../components/multichannel/ProductPublisher';
import BulkActions from '../components/automation/BulkActions';
import { Store, Share2, BarChart, Settings } from 'lucide-react';

const MultiChannel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('channels');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const handleBulkAction = async (action: string, value?: any) => {
    // In a real app, you would perform the action on the selected products
    console.log(`Performing ${action} on ${selectedProducts.length} products with value:`, value);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert(`${action} completed successfully!`);
  };

  // Sample product for the ProductPublisher component
  const sampleProduct = {
    id: 'prod-1',
    name: 'Wireless Bluetooth Earbuds',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
    price: 59.99,
    status: 'active' as const
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Multi-Channel Publishing</h1>
          <p className="text-gray-600">
            Manage and publish your products across multiple sales channels.
          </p>
        </div>
        
        <BulkActions
          selectedCount={selectedProducts.length}
          onAction={handleBulkAction}
        />
      </div>

      <Tabs defaultValue="channels" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="channels" className="flex items-center">
            <Store className="h-4 w-4 mr-2" />
            <span>Sales Channels</span>
          </TabsTrigger>
          <TabsTrigger value="publish" className="flex items-center">
            <Share2 className="h-4 w-4 mr-2" />
            <span>Publish Products</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            <span>Channel Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="channels">
          <ChannelManager />
        </TabsContent>
        
        <TabsContent value="publish">
          <ProductPublisher product={sampleProduct} />
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Channel Settings</h3>
            <p className="text-gray-600 mb-4">
              Configure global settings for all your sales channels.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Markup Percentage</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="30"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This percentage will be added to your product cost when publishing to channels.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">Auto-Sync Inventory</label>
                  <p className="text-sm text-gray-500">Automatically sync inventory across all channels</p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="toggle-sync"
                    className="sr-only"
                    defaultChecked
                  />
                  <label
                    htmlFor="toggle-sync"
                    className="block overflow-hidden h-6 rounded-full cursor-pointer bg-blue-500"
                  >
                    <span
                      className="block h-6 w-6 rounded-full bg-white transform translate-x-6"
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">Auto-Publish New Products</label>
                  <p className="text-sm text-gray-500">Automatically publish new products to all active channels</p>
                </div>
                <div className="relative inline-block w-12 align-middle select-none">
                  <input
                    type="checkbox"
                    id="toggle-publish"
                    className="sr-only"
                  />
                  <label
                    htmlFor="toggle-publish"
                    className="block overflow-hidden h-6 rounded-full cursor-pointer bg-gray-300"
                  >
                    <span
                      className="block h-6 w-6 rounded-full bg-white transform translate-x-0"
                    ></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiChannel;