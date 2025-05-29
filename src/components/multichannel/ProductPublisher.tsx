import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Globe, 
  Facebook, 
  Instagram, 
  Check, 
  X, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '../ui/button';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  status: 'active' | 'draft' | 'archived';
}

interface Channel {
  id: string;
  name: string;
  type: 'marketplace' | 'social' | 'webstore';
  icon: React.ReactNode;
  connected: boolean;
}

interface ProductPublisherProps {
  product: Product;
}

const ProductPublisher: React.FC<ProductPublisherProps> = ({ product }) => {
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: '1',
      name: 'Shopify Store',
      type: 'webstore',
      icon: <ShoppingBag className="h-5 w-5" />,
      connected: true
    },
    {
      id: '2',
      name: 'Amazon',
      type: 'marketplace',
      icon: <Globe className="h-5 w-5" />,
      connected: true
    },
    {
      id: '3',
      name: 'Facebook Shop',
      type: 'social',
      icon: <Facebook className="h-5 w-5" />,
      connected: true
    },
    {
      id: '4',
      name: 'Instagram Shop',
      type: 'social',
      icon: <Instagram className="h-5 w-5" />,
      connected: true
    }
  ]);
  
  const [publishStatus, setPublishStatus] = useState<Record<string, 'published' | 'not_published' | 'publishing' | 'error'>>({
    '1': 'published',
    '2': 'not_published',
    '3': 'published',
    '4': 'error'
  });
  
  const handlePublish = (channelId: string) => {
    setPublishStatus({ ...publishStatus, [channelId]: 'publishing' });
    
    // Simulate API call
    setTimeout(() => {
      setPublishStatus({ ...publishStatus, [channelId]: 'published' });
    }, 2000);
  };
  
  const handleUnpublish = (channelId: string) => {
    setPublishStatus({ ...publishStatus, [channelId]: 'publishing' });
    
    // Simulate API call
    setTimeout(() => {
      setPublishStatus({ ...publishStatus, [channelId]: 'not_published' });
    }, 2000);
  };
  
  const handleRetry = (channelId: string) => {
    setPublishStatus({ ...publishStatus, [channelId]: 'publishing' });
    
    // Simulate API call
    setTimeout(() => {
      setPublishStatus({ ...publishStatus, [channelId]: Math.random() > 0.3 ? 'published' : 'error' });
    }, 2000);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium mb-4">Publish Product</h3>
      
      <div className="flex items-center mb-6">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-16 h-16 object-cover rounded-md mr-4"
        />
        <div>
          <h4 className="font-medium">{product.name}</h4>
          <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
          <div className="mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              product.status === 'active' ? 'bg-green-100 text-green-800' :
              product.status === 'draft' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }`}>
              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {channels.map((channel) => (
          <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-gray-100">
                {channel.icon}
              </div>
              <div className="ml-3">
                <h4 className="font-medium">{channel.name}</h4>
                <p className="text-sm text-gray-500 capitalize">{channel.type}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              {publishStatus[channel.id] === 'published' && (
                <>
                  <span className="inline-flex items-center mr-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Published
                  </span>
                  <Button variant="outline" size="sm" onClick={() => handleUnpublish(channel.id)}>
                    Unpublish
                  </Button>
                </>
              )}
              
              {publishStatus[channel.id] === 'not_published' && (
                <Button size="sm" onClick={() => handlePublish(channel.id)}>
                  Publish
                </Button>
              )}
              
              {publishStatus[channel.id] === 'publishing' && (
                <Button size="sm" disabled>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publishing...
                </Button>
              )}
              
              {publishStatus[channel.id] === 'error' && (
                <>
                  <span className="inline-flex items-center mr-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <X className="h-3 w-3 mr-1" />
                    Failed
                  </span>
                  <Button size="sm" variant="outline" onClick={() => handleRetry(channel.id)}>
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Retry
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
            <p className="text-sm text-gray-600">
              Publishing to multiple channels helps increase your product visibility and sales potential.
            </p>
          </div>
          <Button variant="outline" size="sm">
            Publish to All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductPublisher;