import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import PlatformConnector from '../components/integrations/PlatformConnector';
import SyncSettings, { SyncSettings as SyncSettingsType } from '../components/integrations/SyncSettings';
import CategoryMapping, { CategoryMapping as CategoryMappingType } from '../components/integrations/CategoryMapping';
import SyncHistory from '../components/integrations/SyncHistory';
import NotificationSettings, { NotificationSettings as NotificationSettingsType } from '../components/integrations/NotificationSettings';
import { 
  Store, 
  RefreshCw, 
  Layers, 
  Bell, 
  Clock,
  ShoppingBag,
  Globe,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const MultiPlatformIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('platforms');
  const [searchTerm, setSearchTerm] = useState('');
  const [platformTypeFilter, setPlatformTypeFilter] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample platforms data
  const [platforms, setPlatforms] = useState([
    {
      id: 'shopify',
      name: 'Shopify',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Shopify_logo_2018.svg/2560px-Shopify_logo_2018.svg.png',
      type: 'webstore' as const,
      connected: true,
      lastSync: '2025-06-15T14:30:00Z'
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Woocommerce_logo.svg/2560px-Woocommerce_logo.svg.png',
      type: 'webstore' as const,
      connected: false
    },
    {
      id: 'amazon',
      name: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png',
      type: 'marketplace' as const,
      connected: true,
      lastSync: '2025-06-14T10:15:00Z'
    },
    {
      id: 'etsy',
      name: 'Etsy',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Etsy_logo.svg/2560px-Etsy_logo.svg.png',
      type: 'marketplace' as const,
      connected: false
    },
    {
      id: 'bigcommerce',
      name: 'BigCommerce',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Bigcommerce_logo.svg/1280px-Bigcommerce_logo.svg.png',
      type: 'webstore' as const,
      connected: false
    },
    {
      id: 'squarespace',
      name: 'Squarespace',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Squarespace_logo.svg/1280px-Squarespace_logo.svg.png',
      type: 'webstore' as const,
      connected: false
    }
  ]);

  const handleConnectPlatform = async (platformId: string, credentials: any) => {
    setLoading(true);
    try {
      // In a real implementation, you would make an API call to connect the platform
      console.log(`Connecting to ${platformId} with credentials:`, credentials);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update platform status
      setPlatforms(platforms.map(platform => 
        platform.id === platformId ? { ...platform, connected: true } : platform
      ));
      
      return true;
    } catch (error) {
      console.error(`Error connecting to ${platformId}:`, error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectPlatform = async (platformId: string) => {
    setLoading(true);
    try {
      // In a real implementation, you would make an API call to disconnect the platform
      console.log(`Disconnecting from ${platformId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update platform status
      setPlatforms(platforms.map(platform => 
        platform.id === platformId ? { ...platform, connected: false } : platform
      ));
      
      return true;
    } catch (error) {
      console.error(`Error disconnecting from ${platformId}:`, error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSyncNow = async () => {
    try {
      // In a real implementation, you would make an API call to trigger synchronization
      console.log('Triggering synchronization');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Synchronization completed successfully');
    } catch (error: any) {
      console.error('Error triggering synchronization:', error);
      toast.error(`Synchronization failed: ${error.message}`);
    }
  };

  const handleUpdateSyncSettings = async (settings: SyncSettingsType) => {
    try {
      // In a real implementation, you would make an API call to update sync settings
      console.log('Updating sync settings:', settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Sync settings updated successfully');
    } catch (error: any) {
      console.error('Error updating sync settings:', error);
      toast.error(`Failed to update sync settings: ${error.message}`);
    }
  };

  const handleSaveCategoryMapping = async (mappings: CategoryMappingType[]) => {
    try {
      // In a real implementation, you would make an API call to save category mappings
      console.log('Saving category mappings:', mappings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Category mappings saved successfully');
    } catch (error: any) {
      console.error('Error saving category mappings:', error);
      toast.error(`Failed to save category mappings: ${error.message}`);
    }
  };

  const handleRefreshCategories = async () => {
    try {
      // In a real implementation, you would make an API call to refresh categories
      console.log('Refreshing categories');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Categories refreshed successfully');
    } catch (error: any) {
      console.error('Error refreshing categories:', error);
      toast.error(`Failed to refresh categories: ${error.message}`);
    }
  };

  const handleRefreshSyncHistory = async () => {
    try {
      // In a real implementation, you would make an API call to refresh sync history
      console.log('Refreshing sync history');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Sync history refreshed successfully');
    } catch (error: any) {
      console.error('Error refreshing sync history:', error);
      toast.error(`Failed to refresh sync history: ${error.message}`);
    }
  };

  const handleSaveNotificationSettings = async (settings: NotificationSettingsType) => {
    try {
      // In a real implementation, you would make an API call to save notification settings
      console.log('Saving notification settings:', settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Notification settings saved successfully');
    } catch (error: any) {
      console.error('Error saving notification settings:', error);
      toast.error(`Failed to save notification settings: ${error.message}`);
    }
  };

  // Filter platforms based on search term and type filter
  const filteredPlatforms = platforms.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = platformTypeFilter ? platform.type === platformTypeFilter : true;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Multi-Platform Integration</h1>
          <p className="text-gray-600">
            Connect and synchronize your e-commerce platforms
          </p>
        </div>
        <Button onClick={handleSyncNow} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Sync Now
        </Button>
      </div>

      <Tabs defaultValue="platforms" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="platforms" className="flex items-center">
            <Store className="h-4 w-4 mr-2" />
            <span>Platforms</span>
          </TabsTrigger>
          <TabsTrigger value="sync" className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Sync Settings</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center">
            <Layers className="h-4 w-4 mr-2" />
            <span>Categories</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>History</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="platforms">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search platforms..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md"
                value={platformTypeFilter}
                onChange={(e) => setPlatformTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="webstore">Web Stores</option>
                <option value="marketplace">Marketplaces</option>
                <option value="social">Social Commerce</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlatforms.map((platform) => (
              <PlatformConnector
                key={platform.id}
                platform={platform}
                onConnect={handleConnectPlatform}
                onDisconnect={handleDisconnectPlatform}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="sync">
          <SyncSettings
            platforms={platforms}
            onSyncNow={handleSyncNow}
            onUpdateSettings={handleUpdateSyncSettings}
          />
        </TabsContent>
        
        <TabsContent value="categories">
          <CategoryMapping
            platforms={platforms}
            onSaveMapping={handleSaveCategoryMapping}
            onRefreshCategories={handleRefreshCategories}
          />
        </TabsContent>
        
        <TabsContent value="history">
          <SyncHistory
            onRefresh={handleRefreshSyncHistory}
          />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings
            onSaveSettings={handleSaveNotificationSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiPlatformIntegration;