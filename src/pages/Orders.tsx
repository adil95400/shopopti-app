import React, { useState } from 'react';
import { 
  PackageCheck, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  MoreVertical,
  Download,
  CheckCircle,
  Truck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useShop } from '../contexts/ShopContext';

// Mock order data
const mockOrders = [
  {
    id: '#2301',
    customer: 'Michael Johnson',
    email: 'michael.j@example.com',
    date: '2023-06-15T14:23:54Z',
    amount: 129.99,
    status: 'delivered',
    items: 2,
  },
  {
    id: '#2302',
    customer: 'Sarah Williams',
    email: 'sarahw@example.com',
    date: '2023-06-14T09:12:11Z',
    amount: 89.95,
    status: 'shipped',
    items: 1,
  },
  {
    id: '#2303',
    customer: 'David Brown',
    email: 'david.brown@example.com',
    date: '2023-06-13T18:45:30Z',
    amount: 204.50,
    status: 'processing',
    items: 3,
  },
  {
    id: '#2304',
    customer: 'Emily Davis',
    email: 'edavis@example.com',
    date: '2023-06-12T10:33:22Z',
    amount: 59.99,
    status: 'delivered',
    items: 1,
  },
  {
    id: '#2305',
    customer: 'James Wilson',
    email: 'jwilson@example.com',
    date: '2023-06-11T15:19:45Z',
    amount: 149.98,
    status: 'processing',
    items: 2,
  },
];

const Orders: React.FC = () => {
  const { isConnected } = useShop();
  const [orders] = useState(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => 
    order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center rounded-full bg-success-400/10 px-2.5 py-0.5 text-xs font-medium text-success-400">
            <CheckCircle size={12} className="mr-1" />
            Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center rounded-full bg-primary-400/10 px-2.5 py-0.5 text-xs font-medium text-primary-600">
            <Truck size={12} className="mr-1" />
            Shipped
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center rounded-full bg-warning-400/10 px-2.5 py-0.5 text-xs font-medium text-warning-400">
            <svg className="mr-1 h-2 w-2 animate-pulse-slow text-warning-400" fill="currentColor" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3" />
            </svg>
            Processing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
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
        <div className="rounded-full bg-neutral-100 p-3">
          <PackageCheck size={28} className="text-neutral-400" />
        </div>
        <h2 className="mt-4 text-lg font-medium text-neutral-900">No store connected</h2>
        <p className="mt-1 text-neutral-500">Connect your store to manage orders</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">Orders</h1>
          <p className="text-neutral-500">
            Manage and track your customer orders.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="btn btn-outline">
            <Download size={16} className="mr-2" />
            Export Orders
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search orders, customers..."
              className="input pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline">
              <Filter size={16} className="mr-2" />
              Filters
            </button>
            <button className="btn btn-outline">
              <SlidersHorizontal size={16} className="mr-2" />
              Sort
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {filteredOrders.map((order) => (
                <motion.tr 
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-neutral-50"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-neutral-900">{order.id}</div>
                    <div className="text-xs text-neutral-500">{order.items} item{order.items !== 1 ? 's' : ''}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-neutral-900">{order.customer}</div>
                    <div className="text-xs text-neutral-500">{order.email}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-neutral-900">
                      {formatDate(order.date)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-neutral-900">
                      ${order.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="relative inline-block text-left">
                      <button className="text-neutral-600 hover:text-neutral-900">
                        <MoreVertical size={16} />
                      </button>
                      {/* Dropdown menu would go here */}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Search className="h-8 w-8 text-neutral-300" />
                      <h3 className="mt-2 text-sm font-medium text-neutral-900">No orders found</h3>
                      <p className="mt-1 text-sm text-neutral-500">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;