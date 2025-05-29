import React, { useState } from 'react';
import { Plus, Trash2, Copy, Check, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  created: string;
  lastTriggered?: string;
}

const Webhooks: React.FC = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: '1',
      url: 'https://example.com/webhook/orders',
      events: ['order.created', 'order.updated', 'order.fulfilled'],
      active: true,
      created: '2023-05-15T14:30:00Z',
      lastTriggered: '2023-05-20T09:45:00Z'
    },
    {
      id: '2',
      url: 'https://example.com/webhook/products',
      events: ['product.created', 'product.updated'],
      active: true,
      created: '2023-05-10T11:20:00Z',
      lastTriggered: '2023-05-19T16:30:00Z'
    }
  ]);
  
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    events: [] as string[]
  });
  
  const [isAddingWebhook, setIsAddingWebhook] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  
  const availableEvents = [
    { value: 'order.created', label: 'Order Created' },
    { value: 'order.updated', label: 'Order Updated' },
    { value: 'order.fulfilled', label: 'Order Fulfilled' },
    { value: 'order.cancelled', label: 'Order Cancelled' },
    { value: 'product.created', label: 'Product Created' },
    { value: 'product.updated', label: 'Product Updated' },
    { value: 'product.deleted', label: 'Product Deleted' },
    { value: 'customer.created', label: 'Customer Created' },
    { value: 'customer.updated', label: 'Customer Updated' }
  ];
  
  const handleAddWebhook = async () => {
    if (!newWebhook.url || newWebhook.events.length === 0) {
      alert('Please enter a URL and select at least one event');
      return;
    }
    
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const webhook: Webhook = {
        id: Date.now().toString(),
        url: newWebhook.url,
        events: newWebhook.events,
        active: true,
        created: new Date().toISOString()
      };
      
      setWebhooks([...webhooks, webhook]);
      setNewWebhook({ url: '', events: [] });
      setIsAddingWebhook(false);
    } catch (error) {
      console.error('Error adding webhook:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteWebhook = async (id: string) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWebhooks(webhooks.filter(webhook => webhook.id !== id));
    } catch (error) {
      console.error('Error deleting webhook:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleWebhook = async (id: string) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWebhooks(webhooks.map(webhook => 
        webhook.id === id ? { ...webhook, active: !webhook.active } : webhook
      ));
    } catch (error) {
      console.error('Error toggling webhook:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTestWebhook = async (id: string) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Webhook test successful!');
    } catch (error) {
      console.error('Error testing webhook:', error);
      alert('Webhook test failed. Please check your URL and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getEventLabel = (eventValue: string) => {
    const event = availableEvents.find(e => e.value === eventValue);
    return event ? event.label : eventValue;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Webhooks</h1>
          <p className="text-gray-600">
            Set up webhooks to receive real-time notifications about events in your store.
          </p>
        </div>
        
        <Button onClick={() => setIsAddingWebhook(true)} disabled={isAddingWebhook}>
          <Plus className="h-4 w-4 mr-2" />
          Add Webhook
        </Button>
      </div>
      
      {isAddingWebhook && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4">New Webhook</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://example.com/webhook"
                value={newWebhook.url}
                onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Events</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {availableEvents.map(event => (
                  <div key={event.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`event-${event.value}`}
                      checked={newWebhook.events.includes(event.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewWebhook({
                            ...newWebhook,
                            events: [...newWebhook.events, event.value]
                          });
                        } else {
                          setNewWebhook({
                            ...newWebhook,
                            events: newWebhook.events.filter(e => e !== event.value)
                          });
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`event-${event.value}`} className="ml-2 block text-sm text-gray-700">
                      {event.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsAddingWebhook(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddWebhook}
              disabled={loading || !newWebhook.url || newWebhook.events.length === 0}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Add Webhook'
              )}
            </Button>
          </div>
        </div>
      )}
      
      {webhooks.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No webhooks yet</h3>
          <p className="mt-1 text-gray-500">
            Add a webhook to receive real-time notifications about events in your store.
          </p>
          <div className="mt-6">
            <Button onClick={() => setIsAddingWebhook(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Events
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Triggered
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {webhooks.map((webhook) => (
                  <tr key={webhook.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 mr-2">{webhook.url}</span>
                        <button
                          onClick={() => copyToClipboard(webhook.url, `url-${webhook.id}`)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {copied === `url-${webhook.id}` ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.map((event) => (
                          <span
                            key={event}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {getEventLabel(event)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input
                            type="checkbox"
                            id={`toggle-${webhook.id}`}
                            checked={webhook.active}
                            onChange={() => handleToggleWebhook(webhook.id)}
                            className="sr-only"
                            disabled={loading}
                          />
                          <label
                            htmlFor={`toggle-${webhook.id}`}
                            className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                              webhook.active ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                                webhook.active ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            ></span>
                          </label>
                        </div>
                        <span className={`text-sm ${webhook.active ? 'text-green-600' : 'text-gray-500'}`}>
                          {webhook.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(webhook.lastTriggered)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleTestWebhook(webhook.id)}
                          className="text-blue-600 hover:text-blue-900"
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteWebhook(webhook.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="bg-blue-50 p-4 rounded-md">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">About Webhooks</h4>
            <p className="mt-1 text-sm text-blue-700">
              Webhooks allow your application to receive real-time HTTP notifications when specific events occur in your store.
              Each notification is sent as a POST request to the URL you specify.
            </p>
            <a
              href="#"
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 inline-block"
            >
              View Webhook Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Webhooks;