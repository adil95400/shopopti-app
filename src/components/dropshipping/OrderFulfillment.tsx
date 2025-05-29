import React, { useState } from 'react';
import { Package, Truck, CheckCircle, AlertTriangle, Search, Filter, ArrowRight, Printer, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

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
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'refunded' | 'pending';
  date: string;
  trackingNumber?: string;
  carrier?: string;
}

const OrderFulfillment: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-12345',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St, New York, NY 10001, USA'
      },
      items: [
        {
          id: 'item-1',
          name: 'Wireless Earbuds',
          quantity: 1,
          price: 59.99,
          image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300',
          supplier: 'TechPro Supply'
        }
      ],
      total: 59.99,
      status: 'pending',
      paymentStatus: 'paid',
      date: '2023-05-15T14:30:00Z'
    },
    {
      id: '2',
      orderNumber: 'ORD-12346',
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        address: '456 Park Ave, Boston, MA 02108, USA'
      },
      items: [
        {
          id: 'item-2',
          name: 'Smart Watch',
          quantity: 1,
          price: 129.99,
          image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300',
          supplier: 'TechPro Supply'
        },
        {
          id: 'item-3',
          name: 'Watch Band',
          quantity: 2,
          price: 19.99,
          image: 'https://images.pexels.com/photos/1682821/pexels-photo-1682821.jpeg?auto=compress&cs=tinysrgb&w=300',
          supplier: 'StyleHub Global'
        }
      ],
      total: 169.97,
      status: 'processing',
      paymentStatus: 'paid',
      date: '2023-05-14T10:15:00Z'
    },
    {
      id: '3',
      orderNumber: 'ORD-12347',
      customer: {
        name: 'Robert Johnson',
        email: 'robert@example.com',
        address: '789 Oak St, Chicago, IL 60601, USA'
      },
      items: [
        {
          id: 'item-4',
          name: 'Desk Lamp',
          quantity: 1,
          price: 45.99,
          image: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=300',
          supplier: 'EcoHome Essentials'
        }
      ],
      total: 45.99,
      status: 'shipped',
      paymentStatus: 'paid',
      date: '2023-05-13T16:45:00Z',
      trackingNumber: 'TRK123456789',
      carrier: 'FedEx'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const handleFulfillOrder = async (orderId: string) => {
    // In a real app, you would call your API to fulfill the order
    setOrders(orders.map(order => 
      order.id === orderId
        ? { ...order, status: 'processing' }
        : order
    ));
  };
  
  const handleShipOrder = async (orderId: string, trackingInfo: { number: string; carrier: string }) => {
    // In a real app, you would call your API to mark the order as shipped
    setOrders(orders.map(order => 
      order.id === orderId
        ? { 
            ...order, 
            status: 'shipped',
            trackingNumber: trackingInfo.number,
            carrier: trackingInfo.carrier
          }
        : order
    ));
    
    setSelectedOrder(null);
  };
  
  const filteredOrders = orders.filter(order => {
    if (searchTerm && !order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (statusFilter && order.status !== statusFilter) {
      return false;
    }
    return true;
  });
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
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
          
          <div className="relative">
            <button
              className="px-3 py-2 border border-gray-300 rounded-md flex items-center"
            >
              <Filter className="h-4 w-4 mr-1" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                    <div className="text-sm text-gray-500">{order.items.length} item(s)</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{order.customer.name}</div>
                    <div className="text-sm text-gray-500">{order.customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(order.date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</div>
                    <div className="text-xs">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.status === 'pending' && (
                      <Badge variant="warning">Pending</Badge>
                    )}
                    {order.status === 'processing' && (
                      <Badge variant="secondary">Processing</Badge>
                    )}
                    {order.status === 'shipped' && (
                      <Badge variant="success">Shipped</Badge>
                    )}
                    {order.status === 'delivered' && (
                      <Badge variant="success">Delivered</Badge>
                    )}
                    {order.status === 'cancelled' && (
                      <Badge variant="danger">Cancelled</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleFulfillOrder(order.id)}
                        >
                          Fulfill
                        </Button>
                      )}
                      {order.status === 'processing' && (
                        <Button
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Ship
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No orders found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="font-medium">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{formatDate(selectedOrder.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    {selectedOrder.status === 'pending' && (
                      <Badge variant="warning">Pending</Badge>
                    )}
                    {selectedOrder.status === 'processing' && (
                      <Badge variant="secondary">Processing</Badge>
                    )}
                    {selectedOrder.status === 'shipped' && (
                      <Badge variant="success">Shipped</Badge>
                    )}
                    {selectedOrder.status === 'delivered' && (
                      <Badge variant="success">Delivered</Badge>
                    )}
                    {selectedOrder.status === 'cancelled' && (
                      <Badge variant="danger">Cancelled</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="font-medium">{selectedOrder.customer.name}</p>
                  <p className="text-gray-600">{selectedOrder.customer.email}</p>
                  <p className="text-gray-600 mt-2">{selectedOrder.customer.address}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Supplier
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img className="h-10 w-10 rounded-md object-cover" src={item.image} alt={item.name} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.quantity}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${item.price.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.supplier}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {selectedOrder.status === 'shipped' && selectedOrder.trackingNumber && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Shipping Information</h4>
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Tracking Number</p>
                        <p className="font-medium">{selectedOrder.trackingNumber}</p>
                      </div>
                    </div>
                    {selectedOrder.carrier && (
                      <div className="mt-2 flex items-center">
                        <Package className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <p className="text-sm text-gray-600">Carrier</p>
                          <p className="font-medium">{selectedOrder.carrier}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {selectedOrder.status === 'processing' && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Ship Order</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Enter tracking number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Carrier</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                          <option value="">Select carrier</option>
                          <option value="fedex">FedEx</option>
                          <option value="ups">UPS</option>
                          <option value="usps">USPS</option>
                          <option value="dhl">DHL</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button
                        onClick={() => handleShipOrder(selectedOrder.id, { 
                          number: 'TRK' + Math.floor(Math.random() * 1000000000), 
                          carrier: 'FedEx' 
                        })}
                      >
                        Mark as Shipped
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-lg font-bold">${selectedOrder.total.toFixed(2)}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFulfillment;