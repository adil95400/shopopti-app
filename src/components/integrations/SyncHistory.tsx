import React, { useState } from 'react';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '../ui/button';

interface SyncHistoryProps {
  onRefresh: () => Promise<void>;
}

interface SyncEvent {
  id: string;
  timestamp: string;
  status: 'success' | 'error' | 'partial' | 'in_progress';
  type: 'inventory' | 'products' | 'orders' | 'prices' | 'full';
  platforms: {
    id: string;
    name: string;
    status: 'success' | 'error' | 'skipped';
    details?: string;
  }[];
  itemsProcessed: number;
  itemsSucceeded: number;
  itemsFailed: number;
  duration: number; // in seconds
  initiatedBy: string;
  error?: string;
}

const SyncHistory: React.FC<SyncHistoryProps> = ({ onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedEvents, setExpandedEvents] = useState<string[]>([]);

  // Sample sync history data
  const [syncEvents, setSyncEvents] = useState<SyncEvent[]>([
    {
      id: '1',
      timestamp: '2025-06-15T14:30:00Z',
      status: 'success',
      type: 'full',
      platforms: [
        { id: 'shopify', name: 'Shopify', status: 'success' },
        { id: 'woocommerce', name: 'WooCommerce', status: 'success' }
      ],
      itemsProcessed: 120,
      itemsSucceeded: 120,
      itemsFailed: 0,
      duration: 45,
      initiatedBy: 'system'
    },
    {
      id: '2',
      timestamp: '2025-06-14T10:15:00Z',
      status: 'partial',
      type: 'inventory',
      platforms: [
        { id: 'shopify', name: 'Shopify', status: 'success' },
        { id: 'woocommerce', name: 'WooCommerce', status: 'error', details: 'API rate limit exceeded' }
      ],
      itemsProcessed: 85,
      itemsSucceeded: 65,
      itemsFailed: 20,
      duration: 32,
      initiatedBy: 'user',
      error: 'Some items failed to sync'
    },
    {
      id: '3',
      timestamp: '2025-06-13T08:00:00Z',
      status: 'success',
      type: 'orders',
      platforms: [
        { id: 'shopify', name: 'Shopify', status: 'success' },
        { id: 'woocommerce', name: 'WooCommerce', status: 'success' }
      ],
      itemsProcessed: 15,
      itemsSucceeded: 15,
      itemsFailed: 0,
      duration: 12,
      initiatedBy: 'system'
    },
    {
      id: '4',
      timestamp: '2025-06-12T16:45:00Z',
      status: 'error',
      type: 'products',
      platforms: [
        { id: 'shopify', name: 'Shopify', status: 'error', details: 'Authentication failed' },
        { id: 'woocommerce', name: 'WooCommerce', status: 'skipped' }
      ],
      itemsProcessed: 0,
      itemsSucceeded: 0,
      itemsFailed: 0,
      duration: 5,
      initiatedBy: 'user',
      error: 'Authentication failed for Shopify'
    },
    {
      id: '5',
      timestamp: '2025-06-11T12:30:00Z',
      status: 'success',
      type: 'prices',
      platforms: [
        { id: 'shopify', name: 'Shopify', status: 'success' },
        { id: 'woocommerce', name: 'WooCommerce', status: 'success' }
      ],
      itemsProcessed: 95,
      itemsSucceeded: 95,
      itemsFailed: 0,
      duration: 28,
      initiatedBy: 'system'
    }
  ]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await onRefresh();
      // In a real implementation, you would update the sync events here
    } catch (error) {
      console.error('Error refreshing sync history:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEventExpanded = (id: string) => {
    setExpandedEvents(prev => 
      prev.includes(id) 
        ? prev.filter(eventId => eventId !== id) 
        : [...prev, id]
    );
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} seconds`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes} min ${remainingSeconds} sec`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Success
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Error
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Partial
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            In Progress
          </span>
        );
      case 'skipped':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Skipped
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Filter sync events
  const filteredEvents = syncEvents.filter(event => {
    const matchesSearch = 
      event.type.includes(searchTerm.toLowerCase()) ||
      event.platforms.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.error && event.error.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter ? event.type === typeFilter : true;
    const matchesStatus = statusFilter ? event.status === statusFilter : true;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Synchronization History</h3>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search sync events..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="full">Full Sync</option>
              <option value="inventory">Inventory</option>
              <option value="products">Products</option>
              <option value="orders">Orders</option>
              <option value="prices">Prices</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="partial">Partial</option>
              <option value="in_progress">In Progress</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <RefreshCw className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No sync events found</h3>
              <p className="text-gray-500">
                {searchTerm || typeFilter || statusFilter
                  ? 'Try adjusting your filters'
                  : 'No synchronization has been performed yet'}
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleEventExpanded(event.id)}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-3 ${
                      event.status === 'success' ? 'bg-green-100' :
                      event.status === 'error' ? 'bg-red-100' :
                      event.status === 'partial' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      {event.status === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : event.status === 'error' ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : event.status === 'partial' ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      ) : (
                        <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium text-gray-900 capitalize">{event.type} Sync</h4>
                        <span className="mx-2 text-gray-300">•</span>
                        {getStatusBadge(event.status)}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{new Date(event.timestamp).toLocaleString()}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDuration(event.duration)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-500 mr-4">
                      {event.itemsSucceeded}/{event.itemsProcessed} items
                    </div>
                    {expandedEvents.includes(event.id) ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {expandedEvents.includes(event.id) && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="mb-4">
                      <h5 className="font-medium text-gray-700 mb-2">Platforms</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {event.platforms.map((platform) => (
                          <div key={platform.id} className="flex justify-between items-center p-3 bg-white rounded-md border border-gray-200">
                            <div>
                              <h6 className="font-medium">{platform.name}</h6>
                              {platform.details && (
                                <p className="text-sm text-gray-500 mt-1">{platform.details}</p>
                              )}
                            </div>
                            {getStatusBadge(platform.status)}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white p-3 rounded-md border border-gray-200">
                        <p className="text-sm text-gray-500">Items Processed</p>
                        <p className="text-lg font-medium">{event.itemsProcessed}</p>
                      </div>
                      <div className="bg-white p-3 rounded-md border border-gray-200">
                        <p className="text-sm text-gray-500">Items Succeeded</p>
                        <p className="text-lg font-medium text-green-600">{event.itemsSucceeded}</p>
                      </div>
                      <div className="bg-white p-3 rounded-md border border-gray-200">
                        <p className="text-sm text-gray-500">Items Failed</p>
                        <p className="text-lg font-medium text-red-600">{event.itemsFailed}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-gray-500">
                        Initiated by: <span className="font-medium">{event.initiatedBy}</span>
                      </div>
                      {event.status === 'error' && (
                        <div className="text-red-600">
                          {event.error}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SyncHistory;