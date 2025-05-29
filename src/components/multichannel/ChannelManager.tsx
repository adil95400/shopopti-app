import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Globe, 
  Facebook, 
  Instagram, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Settings,
  Check,
  X
} from 'lucide-react';
import { Button } from '../ui/button';

interface Channel {
  id: string;
  name: string;
  type: 'marketplace' | 'social' | 'webstore';
  icon: React.ReactNode;
  connected: boolean;
  productCount: number;
  status: 'active' | 'pending' | 'error';
}

const ChannelManager: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: '1',
      name: 'Shopify Store',
      type: 'webstore',
      icon: <ShoppingBag className="h-5 w-5" />,
      connected: true,
      productCount: 120,
      status: 'active'
    },
    {
      id: '2',
      name: 'Amazon',
      type: 'marketplace',
      icon: <Globe className="h-5 w-5" />,
      connected: true,
      productCount: 85,
      status: 'active'
    },
    {
      id: '3',
      name: 'Facebook Shop',
      type: 'social',
      icon: <Facebook className="h-5 w-5" />,
      connected: true,
      productCount: 65,
      status: 'active'
    },
    {
      id: '4',
      name: 'Instagram Shop',
      type: 'social',
      icon: <Instagram className="h-5 w-5" />,
      connected: false,
      productCount: 0,
      status: 'pending'
    }
  ]);
  
  const [isAddingChannel, setIsAddingChannel] = useState(false);
  const [newChannelType, setNewChannelType] = useState<string>('');
  
  const availableChannels = [
    { id: 'shopify', name: 'Shopify', type: 'webstore', icon: <ShoppingBag className="h-5 w-5" /> },
    { id: 'woocommerce', name: 'WooCommerce', type: 'webstore', icon: <ShoppingBag className="h-5 w-5" /> },
    { id: 'amazon', name: 'Amazon', type: 'marketplace', icon: <Globe className="h-5 w-5" /> },
    { id: 'ebay', name: 'eBay', type: 'marketplace', icon: <Globe className="h-5 w-5" /> },
    { id: 'etsy', name: 'Etsy', type: 'marketplace', icon: <Globe className="h-5 w-5" /> },
    { id: 'facebook', name: 'Facebook Shop', type: 'social', icon: <Facebook className="h-5 w-5" /> },
    { id: 'instagram', name: 'Instagram Shop', type: 'social', icon: <Instagram className="h-5 w-5" /> }
  ];
  
  const handleAddChannel = (channelId: string) => {
    const channelToAdd = availableChannels.find(c => c.id === channelId);
    if (!channelToAdd) return;
    
    const newChannel: Channel = {
      id: Date.now().toString(),
      name: channelToAdd.name,
      type: channelToAdd.type as any,
      icon: channelToAdd.icon,
      connected: false,
      productCount: 0,
      status: 'pending'
    };
    
    setChannels([...channels, newChannel]);
    setIsAddingChannel(false);
    setNewChannelType('');
  };
  
  const handleRemoveChannel = (id: string) => {
    setChannels(channels.filter(channel => channel.id !== id));
  };
  
  const handleToggleChannel = (id: string) => {
    setChannels(channels.map(channel => 
      channel.id === id ? { ...channel, connected: !channel.connected } : channel
    ));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Sales Channels</h2>
        <Button onClick={() => setIsAddingChannel(true)} disabled={isAddingChannel}>
          <Plus className="h-4 w-4 mr-2" />
          Add Channel
        </Button>
      </div>
      
      {isAddingChannel && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Add Sales Channel</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableChannels
              .filter(channel => !channels.some(c => c.name === channel.name))
              .map(channel => (
                <div
                  key={channel.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    newChannelType === channel.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setNewChannelType(channel.id)}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${
                      newChannelType === channel.id ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {channel.icon}
                    </div>
                    <span className="ml-3 font-medium">{channel.name}</span>
                  </div>
                </div>
              ))}
          </div>
          
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAddingChannel(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => handleAddChannel(newChannelType)}
              disabled={!newChannelType}
            >
              Add Channel
            </Button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <div key={channel.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${
                  channel.connected ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {channel.icon}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">{channel.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{channel.type}</p>
                </div>
              </div>
              <div className="flex items-center">
                {channel.status === 'active' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Active
                  </span>
                )}
                {channel.status === 'pending' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                )}
                {channel.status === 'error' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <X className="h-3 w-3 mr-1" />
                    Error
                  </span>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Products</span>
                <span className="text-sm font-medium">{channel.productCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (channel.productCount / 150) * 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
              
              <div className="flex items-center">
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id={`toggle-${channel.id}`}
                    checked={channel.connected}
                    onChange={() => handleToggleChannel(channel.id)}
                    className="sr-only"
                  />
                  <label
                    htmlFor={`toggle-${channel.id}`}
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer ${channel.connected ? 'bg-blue-500' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${channel.connected ? 'translate-x-4' : 'translate-x-0'}`}
                    ></span>
                  </label>
                </div>
                <button
                  onClick={() => handleRemoveChannel(channel.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelManager;