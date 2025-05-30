import React from 'react';
import { Truck, Package, Search, Filter, SlidersHorizontal, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShop } from '../contexts/ShopContext';

// Mock shipments data
const mockShipments = [
  {
    id: 'SHIP001',
    orderNumber: '#2301',
    customer: 'John Smith',
    address: '123 Main St, New York, NY 10001',
    status: 'in_transit',
    carrier: 'FedEx',
    trackingNumber: 'FX123456789',
    estimatedDelivery: '2024-03-12T14:00:00Z',
    items: [
      { name: 'Premium Wireless Headphones', quantity: 1 },
      { name: 'Phone Case', quantity: 2 }
    ]
  },
  {
    id: 'SHIP002',
    orderNumber: '#2302',
    customer: 'Sarah Johnson',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    status: 'delivered',
    carrier: 'UPS',
    trackingNumber: 'UPS987654321',
    deliveredAt: '2024-03-10T15:30:00Z',
    items: [
      { name: 'Smart Watch Series 5', quantity: 1 }
    ]
  },
  {
    id: 'SHIP003',
    orderNumber: '#2303',
    customer: 'Michael Brown',
    address: '789 Pine St, Chicago, IL 60601',
    status: 'processing',
    carrier: 'USPS',
    items: [
      { name: 'Ergonomic Office Chair', quantity: 1 },
      { name: 'Desk Lamp', quantity: 1 }
    ]
  }
];

const Logistics: React.FC = () => {
  const { isConnected } = useShop();
  const [searchQuery, setSearchQuery] = React.useState('');

  // Filter shipments based on search query
  const filteredShipments = mockShipments.filter(shipment =>
    shipment.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center rounded-full bg-success-400/10 px-2.5 py-0.5 text-xs font-medium text-success-400">
            Delivered
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center rounded-full bg-primary-400/10 px-2.5 py-0.5 text-xs font-medium text-primary-600">
            In Transit
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center rounded-full bg-warning-400/10 px-2.5 py-0.5 text-xs font-medium text-warning-400">
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
          <Truck size={28} className="text-neutral-400" />
        </div>
        <h2 className="mt-4 text-lg font-medium text-neutral-900">No store connected</h2>
        <p className="mt-1 text-neutral-500">Connect your store to manage logistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">Logistics</h1>
          <p className="text-neutral-500">
            Track and manage your shipments and deliveries.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="btn btn-primary">
            <Package size={16} className="mr-2" />
            Create Shipment
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search shipments..."
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

        <div className="space-y-4">
          {filteredShipments.map((shipment) => (
            <motion.div
              key={shipment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="border border-neutral-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-neutral-900">Order {shipment.orderNumber}</h3>
                    {getStatusBadge(shipment.status)}
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">{shipment.customer}</p>
                </div>
                {shipment.carrier && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900">{shipment.carrier}</p>
                    {shipment.trackingNumber && (
                      <p className="text-xs text-neutral-500">#{shipment.trackingNumber}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-start space-x-4">
                <div className="flex-1">
                  <div className="flex items-center text-sm text-neutral-600">
                    <MapPin size={14} className="mr-2 text-neutral-400" />
                    {shipment.address}
                  </div>
                  {(shipment.estimatedDelivery || shipment.deliveredAt) && (
                    <div className="mt-1 flex items-center text-sm text-neutral-600">
                      <Clock size={14} className="mr-2 text-neutral-400" />
                      {shipment.status === 'delivered' 
                        ? `Delivered on ${formatDate(shipment.deliveredAt!)}`
                        : `Estimated delivery: ${formatDate(shipment.estimatedDelivery!)}`
                      }
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 border-t border-neutral-100 pt-3">
                <h4 className="text-sm font-medium text-neutral-900">Items</h4>
                <div className="mt-2 space-y-2">
                  {shipment.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">{item.name}</span>
                      <span className="text-neutral-900">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex justify-end space-x-2">
                {shipment.trackingNumber && (
                  <button className="btn btn-outline text-sm">
                    Track Shipment
                  </button>
                )}
                <button className="btn btn-primary text-sm">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}

          {filteredShipments.length === 0 && (
            <div className="py-12 text-center">
              <div className="flex flex-col items-center">
                <Search className="h-8 w-8 text-neutral-300" />
                <h3 className="mt-2 text-sm font-medium text-neutral-900">No shipments found</h3>
                <p className="mt-1 text-sm text-neutral-500">Try adjusting your search or filters.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logistics;