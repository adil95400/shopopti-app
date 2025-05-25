import React, { useState } from 'react';
import { Share2, Plus, Globe, ShoppingBag, Facebook as BrandFacebook, GitBranch as BrandTiktok, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShopContext } from '../contexts/ShopContext';

interface Channel {
  id: string;
  name: string;
  type: 'marketplace' | 'social' | 'ads';
  platform: string;
  status: 'active' | 'pending' | 'inactive';
  products: number;
  sales: number;
  icon: React.ElementType;
}

const mockChannels: Channel[] = [
  {
    id: '1',
    name: 'Google Shopping',
    type: 'marketplace',
    platform: 'google',
    status: 'active',
    products: 156,
    sales: 2450,
    icon: Globe
  },
  {
    id: '2',
    name: 'Facebook Shop',
    type: 'social',
    platform: 'facebook',
    status: 'active',
    products: 124,
    sales: 1890,
    icon: BrandFacebook
  },
  {
    id: '3',
    name: 'TikTok Shop',
    type: 'social',
    platform: 'tiktok',
    status: 'pending',
    products: 89,
    sales: 780,
    icon: BrandTiktok
  }
];

const Channels: React.FC = () => {
  const { isConnected } = useShopContext();
  const [channels] = useState<Channel[]>(mockChannels);
  const [showAddChannel, setShowAddChannel] = useState(false);

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-neutral-100 p-3">
          <Share2 size={28} className="text-neutral-400" />
        </div>
        <h2 className="mt-4 text-lg font-medium text-neutral-900">No store connected</h2>
        <p className="mt-1 text-neutral-500">Connect your store to manage sales channels</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">Sales Channels</h1>
          <p className="text-neutral-500">
            Manage and optimize your multi-channel presence.
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddChannel(true)}
        >
          <Plus size={16} className="mr-2" />
          Add Channel
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <motion.div
            key={channel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`rounded-md p-2 
                  ${channel.status === 'active' ? 'bg-success-400/10 text-success-400' :
                    channel.status === 'pending' ? 'bg-warning-400/10 text-warning-400' :
                    'bg-neutral-100 text-neutral-500'}`}
                >
                  <channel.icon size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">{channel.name}</h3>
                  <p className="text-sm text-neutral-500 capitalize">{channel.type}</p>
                </div>
              </div>
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize
                ${channel.status === 'active' ? 'bg-success-400/10 text-success-400' :
                  channel.status === 'pending' ? 'bg-warning-400/10 text-warning-400' :
                  'bg-neutral-100 text-neutral-500'}`}
              >
                {channel.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-md bg-neutral-50 p-3">
                <p className="text-sm text-neutral-500">Products</p>
                <p className="mt-1 text-lg font-medium text-neutral-900">{channel.products}</p>
              </div>
              <div className="rounded-md bg-neutral-50 p-3">
                <p className="text-sm text-neutral-500">Sales</p>
                <p className="mt-1 text-lg font-medium text-neutral-900">${channel.sales}</p>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="btn btn-primary flex-1">
                Manage Products
                <ArrowRight size={16} className="ml-2" />
              </button>
              <button className="btn btn-outline">
                <ShoppingBag size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Channel Modal */}
      {showAddChannel && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-neutral-900/75 transition-opacity"
              onClick={() => setShowAddChannel(false)}
            ></div>

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
              &#8203;
            </span>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium leading-6 text-neutral-900">Add Sales Channel</h3>
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <button className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50">
                    <div className="flex items-center">
                      <Globe className="h-6 w-6 text-neutral-500" />
                      <span className="ml-3 font-medium">Google Shopping</span>
                    </div>
                    <ArrowRight size={16} className="text-neutral-400" />
                  </button>
                  <button className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50">
                    <div className="flex items-center">
                      <BrandFacebook className="h-6 w-6 text-neutral-500" />
                      <span className="ml-3 font-medium">Facebook Shop</span>
                    </div>
                    <ArrowRight size={16} className="text-neutral-400" />
                  </button>
                  <button className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 hover:bg-neutral-50">
                    <div className="flex items-center">
                      <BrandTiktok className="h-6 w-6 text-neutral-500" />
                      <span className="ml-3 font-medium">TikTok Shop</span>
                    </div>
                    <ArrowRight size={16} className="text-neutral-400" />
                  </button>
                </div>
              </div>
              <div className="bg-neutral-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowAddChannel(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Channels;