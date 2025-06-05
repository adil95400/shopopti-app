import React, { useState, useEffect } from 'react';
import { 
  PackageCheck, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  MoreVertical,
  Download,
  CheckCircle,
  Truck,
  AlertTriangle,
  Clock,
  RefreshCw,
  Loader2,
  Plus,
  ArrowRight,
  FileText,
  ExternalLink,
  Printer,
  X,
  Package,
  DollarSign,
  Send
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useShop } from '../contexts/ShopContext';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

// Types
interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    address: string;
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    supplier: string;
    variantInfo?: string;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'refunded' | 'pending';
  date: string;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  source?: string;
}

const Orders: React.FC = () => {
  const { isConnected } = useShop();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingOrders, setProcessingOrders] = useState<string[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInfo, setTrackingInfo] = useState({
    number: '',
    carrier: 'fedex'
  });
  const [showBatchProcessing, setShowBatchProcessing] = useState(false);
  const [batchProcessingStatus, setBatchProcessingStatus] = useState<{
    total: number;
    processed: number;
    success: number;
    failed: number;
    inProgress: boolean;
  }>({
    total: 0,
    processed: 0,
    success: 0,
    failed: 0,
    inProgress: false
  });

  // Mock order data
  const mockOrders = [
    {
      id: 'ord-001',
      orderNumber: '#2301',
      customer: {
        name: 'Michael Johnson',
        email: 'michael.j@example.com',
        address: '123 Main St, New York, NY 10001, USA'
      },
      items: [
        {
          id: 'item-001',
          name: 'Premium Wireless Headphones',
          quantity: 1,
          price: 129.99,
          image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
          supplier: 'TechPro Supply',
          variantInfo: 'Black'
        }
      ],
      total: 129.99,
      status: 'pending' as const,
      paymentStatus: 'paid' as const,
      date: '2023-06-15T14:23:54Z',
      source: 'shopify'
    },
    {
      id: 'ord-002',
      orderNumber: '#2302',
      customer: {
        name: 'Sarah Williams',
        email: 'sarahw@example.com',
        address: '456 Park Ave, Boston, MA 02108, USA'
      },
      items: [
        {
          id: 'item-002',
          name: 'Smart Watch Series 5',
          quantity: 1,
          price: 89.95,
          image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300',
          supplier: 'TechPro Supply',
          variantInfo: 'Silver'
        }
      ],
      total: 89.95,
      status: 'processing' as const,
      paymentStatus: 'paid' as const,
      date: '2023-06-14T09:12:11Z',
      source: 'shopify'
    },
    {
      id: 'ord-003',
      orderNumber: '#2303',
      customer: {
        name: 'David Brown',
        email: 'david.brown@example.com',
        address: '789 Oak St, Chicago, IL 60601, USA'
      },
      items: [
        {
          id: 'item-003',
          name: 'Ergonomic Office Chair',
          quantity: 1,
          price: 149.50,
          image: 'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=300',
          supplier: 'EcoHome Essentials',
          variantInfo: 'Black Mesh'
        },
        {
          id: 'item-004',
          name: 'Adjustable Desk Lamp',
          quantity: 1,
          price: 55.00,
          image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=300',
          supplier: 'EcoHome Essentials',
          variantInfo: 'White'
        }
      ],
      total: 204.50,
      status: 'processing' as const,
      paymentStatus: 'paid' as const,
      date: '2023-06-13T18:45:30Z',
      source: 'woocommerce'
    },
    {
      id: 'ord-004',
      orderNumber: '#2304',
      customer: {
        name: 'Emily Davis',
        email: 'edavis@example.com',
        address: '321 Pine St, San Francisco, CA 94101, USA'
      },
      items: [
        {
          id: 'item-005',
          name: 'Wireless Earbuds',
          quantity: 1,
          price: 59.99,
          image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
          supplier: 'TechPro Supply',
          variantInfo: 'White'
        }
      ],
      total: 59.99,
      status: 'delivered' as const,
      paymentStatus: 'paid' as const,
      date: '2023-06-12T10:33:22Z',
      trackingNumber: 'TRK123456789',
      carrier: 'FedEx',
      source: 'shopify'
    },
    {
      id: 'ord-005',
      orderNumber: '#2305',
      customer: {
        name: 'James Wilson',
        email: 'jwilson@example.com',
        address: '654 Maple Ave, Seattle, WA 98101, USA'
      },
      items: [
        {
          id: 'item-006',
          name: 'Bluetooth Speaker',
          quantity: 1,
          price: 79.99,
          image: 'https://images.pexels.com/photos/1706694/pexels-photo-1706694.jpeg?auto=compress&cs=tinysrgb&w=300',
          supplier: 'TechPro Supply',
          variantInfo: 'Black'
        },
        {
          id: 'item-007',
          name: 'Phone Charging Stand',
          quantity: 1,
          price: 29.99,
          image: 'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=300',
          supplier: 'TechPro Supply',
          variantInfo: 'Silver'
        }
      ],
      total: 109.98,
      status: 'shipped' as const,
      paymentStatus: 'paid' as const,
      date: '2023-06-11T15:19:45Z',
      trackingNumber: 'TRK987654321',
      carrier: 'UPS',
      source: 'shopify'
    },
    {
      id: 'ord-006',
      orderNumber: '#2306',
      customer: {
        name: 'Jennifer Taylor',
        email: 'jtaylor@example.com',
        address: '987 Cedar Rd, Miami, FL 33101, USA'
      },
      items: [
        {
          id: 'item-008',
          name: 'Smart Home Hub',
          quantity: 1,
          price: 129.99,
          image: 'https://images.pexels.com/photos/4219530/pexels-photo-4219530.jpeg?auto=compress&cs=tinysrgb&w=300',
          supplier: 'TechPro Supply',
          variantInfo: 'White'
        }
      ],
      total: 129.99,
      status: 'pending' as const,
      paymentStatus: 'pending' as const,
      date: '2023-06-10T08:27:33Z',
      source: 'woocommerce'
    }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchQuery, statusFilter, dateFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch orders from your API
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Apply date filter
    if (dateFilter) {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(order => 
            new Date(order.date).toDateString() === today.toDateString()
          );
          break;
        case 'yesterday':
          filterDate.setDate(today.getDate() - 1);
          filtered = filtered.filter(order => 
            new Date(order.date).toDateString() === filterDate.toDateString()
          );
          break;
        case 'last7days':
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(order => 
            new Date(order.date) >= filterDate
          );
          break;
        case 'last30days':
          filterDate.setDate(today.getDate() - 30);
          filtered = filtered.filter(order => 
            new Date(order.date) >= filterDate
          );
          break;
      }
    }
    
    setFilteredOrders(filtered);
  };

  const handleOrderSelect = (orderId: string) => {
    const isSelected = selectedOrders.includes(orderId);
    
    if (isSelected) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedOrders(filteredOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleProcessOrder = async (orderId: string) => {
    try {
      setProcessingOrders([...processingOrders, orderId]);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update order status
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'processing' } : order
      ));
      
      toast.success(`Order ${orders.find(o => o.id === orderId)?.orderNumber} processed successfully`);
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Failed to process order');
    } finally {
      setProcessingOrders(processingOrders.filter(id => id !== orderId));
    }
  };

  const handleShipOrder = async (orderId: string) => {
    if (!selectedOrder) return;
    
    try {
      setProcessingOrders([...processingOrders, orderId]);
      
      if (!trackingInfo.number) {
        toast.error('Please enter a tracking number');
        return;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update order status
      setOrders(orders.map(order => 
        order.id === orderId ? { 
          ...order, 
          status: 'shipped',
          trackingNumber: trackingInfo.number,
          carrier: trackingInfo.carrier
        } : order
      ));
      
      // Reset tracking info
      setTrackingInfo({
        number: '',
        carrier: 'fedex'
      });
      
      toast.success(`Order ${selectedOrder.orderNumber} marked as shipped`);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error shipping order:', error);
      toast.error('Failed to ship order');
    } finally {
      setProcessingOrders(processingOrders.filter(id => id !== orderId));
    }
  };

  const handleBatchProcess = async () => {
    if (selectedOrders.length === 0) {
      toast.error('Please select at least one order to process');
      return;
    }
    
    try {
      setBatchProcessingStatus({
        total: selectedOrders.length,
        processed: 0,
        success: 0,
        failed: 0,
        inProgress: true
      });
      
      setShowBatchProcessing(true);
      
      // Process orders one by one
      for (let i = 0; i < selectedOrders.length; i++) {
        const orderId = selectedOrders[i];
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Update order status
          setOrders(orders.map(order => 
            order.id === orderId ? { ...order, status: 'processing' } : order
          ));
          
          setBatchProcessingStatus(prev => ({
            ...prev,
            processed: prev.processed + 1,
            success: prev.success + 1
          }));
        } catch (error) {
          console.error(`Error processing order ${orderId}:`, error);
          
          setBatchProcessingStatus(prev => ({
            ...prev,
            processed: prev.processed + 1,
            failed: prev.failed + 1
          }));
        }
      }
      
      // Wait a bit before closing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Processed ${selectedOrders.length} orders`);
      setSelectedOrders([]);
    } catch (error) {
      console.error('Error in batch processing:', error);
      toast.error('Failed to process orders in batch');
    } finally {
      setBatchProcessingStatus(prev => ({
        ...prev,
        inProgress: false
      }));
      
      // Wait a bit before closing
      setTimeout(() => {
        setShowBatchProcessing(false);
      }, 3000);
    }
  };

  const handleBatchShip = async () => {
    if (selectedOrders.length === 0) {
      toast.error('Please select at least one order to ship');
      return;
    }
    
    try {
      setBatchProcessingStatus({
        total: selectedOrders.length,
        processed: 0,
        success: 0,
        failed: 0,
        inProgress: true
      });
      
      setShowBatchProcessing(true);
      
      // Process orders one by one
      for (let i = 0; i < selectedOrders.length; i++) {
        const orderId = selectedOrders[i];
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Generate a random tracking number
          const trackingNumber = `TRK${Math.floor(Math.random() * 1000000000)}`;
          
          // Update order status
          setOrders(orders.map(order => 
            order.id === orderId ? { 
              ...order, 
              status: 'shipped',
              trackingNumber,
              carrier: 'FedEx'
            } : order
          ));
          
          setBatchProcessingStatus(prev => ({
            ...prev,
            processed: prev.processed + 1,
            success: prev.success + 1
          }));
        } catch (error) {
          console.error(`Error shipping order ${orderId}:`, error);
          
          setBatchProcessingStatus(prev => ({
            ...prev,
            processed: prev.processed + 1,
            failed: prev.failed + 1
          }));
        }
      }
      
      // Wait a bit before closing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Shipped ${selectedOrders.length} orders`);
      setSelectedOrders([]);
    } catch (error) {
      console.error('Error in batch shipping:', error);
      toast.error('Failed to ship orders in batch');
    } finally {
      setBatchProcessingStatus(prev => ({
        ...prev,
        inProgress: false
      }));
      
      // Wait a bit before closing
      setTimeout(() => {
        setShowBatchProcessing(false);
      }, 3000);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            <Truck size={12} className="mr-1" />
            Shipped
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
            <Clock size={12} className="mr-1" />
            Processing
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            <X size={12} className="mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' · ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-100 p-3">
          <PackageCheck size={28} className="text-gray-400" />
        </div>
        <h2 className="mt-4 text-lg font-medium text-gray-900">No store connected</h2>
        <p className="mt-1 text-gray-500">Connect your store to manage orders</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Orders</h1>
          <p className="text-gray-600">
            Manage and process your customer orders efficiently.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {selectedOrders.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline\" onClick={handleBatchProcess}>
                <Package className="h-4 w-4 mr-2" />
                Process {selectedOrders.length} Orders
              </Button>
              <Button variant="outline" onClick={handleBatchShip}>
                <Truck className="h-4 w-4 mr-2" />
                Ship {selectedOrders.length} Orders
              </Button>
            </div>
          )}
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search orders, customers..."
              className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="rounded-md border border-gray-300 px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              className="rounded-md border border-gray-300 px-3 py-2"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 days</option>
              <option value="last30days">Last 30 days</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    onChange={handleSelectAll}
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                  />
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Order
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tracking
                </th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" />
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Search className="h-8 w-8 text-gray-300" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                      <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-3 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleOrderSelect(order.id)}
                      />
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            src={order.items[0].image} 
                            alt={order.items[0].name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                          <div className="text-xs text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customer.name}</div>
                      <div className="text-xs text-gray-500">{order.customer.email}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(order.date)}
                      </div>
                      {order.source && (
                        <div className="text-xs text-gray-500 capitalize">
                          {order.source}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${order.total.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.paymentStatus === 'paid' && (
                          <span className="text-green-600">Paid</span>
                        )}
                        {order.paymentStatus === 'pending' && (
                          <span className="text-yellow-600">Pending</span>
                        )}
                        {order.paymentStatus === 'refunded' && (
                          <span className="text-red-600">Refunded</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {order.trackingNumber ? (
                        <div>
                          <div className="text-xs text-gray-500">{order.carrier}</div>
                          <div className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                            {order.trackingNumber.substring(0, 10)}...
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">Not available</div>
                      )}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {order.status === 'pending' && (
                          <Button 
                            size="sm"
                            onClick={() => handleProcessOrder(order.id)}
                            disabled={processingOrders.includes(order.id)}
                          >
                            {processingOrders.includes(order.id) ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Package className="h-4 w-4 mr-1" />
                            )}
                            <span className="hidden sm:inline">Process</span>
                          </Button>
                        )}
                        {order.status === 'processing' && (
                          <Button 
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Truck className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Ship</span>
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <span className="hidden sm:inline">View</span>
                          <ArrowRight className="h-4 w-4 sm:ml-1" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                  <span className="ml-3">{selectedOrder.orderNumber}</span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Customer</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customer.email}</p>
                    <p className="text-sm text-gray-600 mt-2">{selectedOrder.customer.address}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Order Info</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Date:</span>
                      <span className="text-sm font-medium">{formatDate(selectedOrder.date)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span>{getStatusBadge(selectedOrder.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Payment:</span>
                      <span className={`text-sm font-medium ${
                        selectedOrder.paymentStatus === 'paid' ? 'text-green-600' :
                        selectedOrder.paymentStatus === 'pending' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Shipping</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {selectedOrder.trackingNumber ? (
                      <>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Carrier:</span>
                          <span className="text-sm font-medium">{selectedOrder.carrier}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tracking:</span>
                          <a 
                            href="#" 
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            {selectedOrder.trackingNumber}
                          </a>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-600">No tracking information available yet.</p>
                    )}
                  </div>
                </div>
              </div>
              
              <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
              <div className="border rounded-lg overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variant
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supplier
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.variantInfo || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.supplier}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.quantity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {selectedOrder.status === 'processing' && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-blue-800 mb-3">Ship Order</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        Tracking Number
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter tracking number"
                        value={trackingInfo.number}
                        onChange={(e) => setTrackingInfo({ ...trackingInfo, number: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1">
                        Carrier
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={trackingInfo.carrier}
                        onChange={(e) => setTrackingInfo({ ...trackingInfo, carrier: e.target.value })}
                      >
                        <option value="fedex">FedEx</option>
                        <option value="ups">UPS</option>
                        <option value="usps">USPS</option>
                        <option value="dhl">DHL</option>
                      </select>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleShipOrder(selectedOrder.id)}
                    disabled={processingOrders.includes(selectedOrder.id) || !trackingInfo.number}
                  >
                    {processingOrders.includes(selectedOrder.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Truck className="h-4 w-4 mr-2" />
                    )}
                    Mark as Shipped
                  </Button>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold">${selectedOrder.total.toFixed(2)}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Invoice
                  </Button>
                  {selectedOrder.status === 'pending' && (
                    <Button 
                      size="sm"
                      onClick={() => handleProcessOrder(selectedOrder.id)}
                      disabled={processingOrders.includes(selectedOrder.id)}
                    >
                      {processingOrders.includes(selectedOrder.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Package className="h-4 w-4 mr-2" />
                      )}
                      Process Order
                    </Button>
                  )}
                  {selectedOrder.status === 'processing' && (
                    <Button 
                      size="sm"
                      disabled={!trackingInfo.number}
                      onClick={() => handleShipOrder(selectedOrder.id)}
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Ship Order
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Batch Processing Modal */}
      {showBatchProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {batchProcessingStatus.inProgress ? 'Processing Orders...' : 'Processing Complete'}
              </h3>
              {!batchProcessingStatus.inProgress && (
                <button
                  onClick={() => setShowBatchProcessing(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Progress:</span>
                <span className="text-sm font-medium">
                  {batchProcessingStatus.processed} / {batchProcessingStatus.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(batchProcessingStatus.processed / batchProcessingStatus.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 p-3 rounded-md">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-medium text-green-800">Success</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-1">{batchProcessingStatus.success}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-md">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="font-medium text-red-800">Failed</span>
                </div>
                <p className="text-2xl font-bold text-red-600 mt-1">{batchProcessingStatus.failed}</p>
              </div>
            </div>
            
            {batchProcessingStatus.inProgress ? (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : (
              <Button 
                className="w-full"
                onClick={() => setShowBatchProcessing(false)}
              >
                Close
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;