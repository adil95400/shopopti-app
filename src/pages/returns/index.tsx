import React, { useState, useEffect } from 'react';
import { returnsService, ReturnRequest } from '../../modules/returns';
import { Package, Search, Filter, CheckCircle, XCircle, ArrowLeft, Truck, DollarSign, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const ReturnsPage: React.FC = () => {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundMethod, setRefundMethod] = useState('original');
  const [refundNotes, setRefundNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  
  useEffect(() => {
    fetchReturns();
  }, [statusFilter]);
  
  const fetchReturns = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (statusFilter) {
        filters.status = statusFilter;
      }
      const fetchedReturns = await returnsService.getReturnRequests(filters);
      setReturns(fetchedReturns);
    } catch (error) {
      console.error('Error fetching returns:', error);
      toast.error('Failed to load return requests');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (id: string, status: 'pending' | 'approved' | 'rejected' | 'completed') => {
    try {
      await returnsService.updateReturnStatus(id, status);
      setReturns(returns.map(r => r.id === id ? { ...r, status } : r));
      if (selectedReturn?.id === id) {
        setSelectedReturn({ ...selectedReturn, status });
      }
      toast.success(`Return request ${status}`);
    } catch (error) {
      console.error('Error updating return status:', error);
      toast.error('Failed to update return status');
    }
  };
  
  const handleProcessRefund = async () => {
    if (!selectedReturn) return;
    
    if (!refundAmount || parseFloat(refundAmount) <= 0) {
      toast.error('Please enter a valid refund amount');
      return;
    }
    
    try {
      await returnsService.processRefund(selectedReturn.id!, {
        amount: parseFloat(refundAmount),
        method: refundMethod as any,
        notes: refundNotes
      });
      
      // Update the return request
      const updatedReturn = { 
        ...selectedReturn, 
        status: 'completed', 
        refundAmount: parseFloat(refundAmount) 
      };
      
      setSelectedReturn(updatedReturn);
      setReturns(returns.map(r => r.id === selectedReturn.id ? updatedReturn : r));
      
      toast.success('Refund processed successfully');
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error('Failed to process refund');
    }
  };
  
  const handleAddTracking = async () => {
    if (!selectedReturn || !trackingNumber) return;
    
    try {
      await returnsService.addReturnTracking(selectedReturn.id!, trackingNumber);
      
      // Update the return request
      const updatedReturn = { ...selectedReturn, trackingNumber };
      
      setSelectedReturn(updatedReturn);
      setReturns(returns.map(r => r.id === selectedReturn.id ? updatedReturn : r));
      
      toast.success('Tracking number added successfully');
      setTrackingNumber('');
    } catch (error) {
      console.error('Error adding tracking number:', error);
      toast.error('Failed to add tracking number');
    }
  };
  
  const filteredReturns = returns.filter(r => 
    r.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Rejected
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
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
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Returns Management</h1>
          <p className="text-gray-600">Process and manage customer return requests</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Return Requests</h3>
              <select
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search returns..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : filteredReturns.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
                <Package className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No return requests</h3>
                <p className="text-sm">
                  {searchTerm || statusFilter
                    ? 'No returns match your search criteria'
                    : 'There are no return requests yet'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredReturns.map((returnRequest) => (
                  <div
                    key={returnRequest.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedReturn?.id === returnRequest.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedReturn(returnRequest)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">Order {returnRequest.orderNumber}</h4>
                        <p className="text-sm text-gray-500 mt-1">{returnRequest.customerName}</p>
                      </div>
                      {getStatusBadge(returnRequest.status)}
                    </div>
                    <div className="mt-2 text-sm">
                      <p className="text-gray-600">
                        {returnRequest.items.length} item{returnRequest.items.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(returnRequest.createdAt!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          {selectedReturn ? (
            <>
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <Button variant="ghost\" size="sm\" className="mr-2 md:hidden\" onClick={() => setSelectedReturn(null)}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <h3 className="font-medium">Return Request Details</h3>
                    <p className="text-sm text-gray-500">Order {selectedReturn.orderNumber}</p>
                  </div>
                </div>
                <div>
                  {getStatusBadge(selectedReturn.status)}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="font-medium">{selectedReturn.customerName}</p>
                      <p className="text-gray-600">{selectedReturn.customerEmail}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Return Reason</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-gray-600">{selectedReturn.reason}</p>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-medium text-gray-900 mb-2">Return Items</h4>
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <div className="space-y-4">
                    {selectedReturn.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center">
                          <div className="h-12 w-12 bg-gray-200 rounded-md mr-3"></div>
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${item.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Condition: {item.condition}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedReturn.status === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                    <h4 className="font-medium text-yellow-800 mb-2">Pending Approval</h4>
                    <p className="text-yellow-700 text-sm mb-4">
                      This return request is waiting for your approval. Review the details and decide whether to approve or reject the return.
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        className="border-red-300 text-red-700 hover:bg-red-50"
                        onClick={() => handleStatusChange(selectedReturn.id!, 'rejected')}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Return
                      </Button>
                      <Button 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusChange(selectedReturn.id!, 'approved')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Return
                      </Button>
                    </div>
                  </div>
                )}
                
                {selectedReturn.status === 'approved' && !selectedReturn.trackingNumber && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                    <h4 className="font-medium text-blue-800 mb-2">Return Approved</h4>
                    <p className="text-blue-700 text-sm mb-4">
                      This return has been approved. Add a tracking number once the customer has shipped the items back.
                    </p>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Enter tracking number"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                      />
                      <Button 
                        onClick={handleAddTracking}
                        disabled={!trackingNumber}
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Add Tracking
                      </Button>
                    </div>
                  </div>
                )}
                
                {selectedReturn.status === 'approved' && selectedReturn.trackingNumber && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                    <h4 className="font-medium text-blue-800 mb-2">Return In Progress</h4>
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-blue-700">Tracking Number</p>
                        <p className="font-medium">{selectedReturn.trackingNumber}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h5 className="font-medium text-blue-800 mb-2">Process Refund</h5>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">
                            Refund Amount
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <DollarSign className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md"
                              value={refundAmount}
                              onChange={(e) => setRefundAmount(e.target.value)}
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">
                            Refund Method
                          </label>
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={refundMethod}
                            onChange={(e) => setRefundMethod(e.target.value)}
                          >
                            <option value="original">Original Payment Method</option>
                            <option value="store_credit">Store Credit</option>
                            <option value="bank_transfer">Bank Transfer</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-blue-700 mb-1">
                            Notes (Optional)
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows={3}
                            value={refundNotes}
                            onChange={(e) => setRefundNotes(e.target.value)}
                            placeholder="Add any notes about this refund"
                          ></textarea>
                        </div>
                        
                        <Button 
                          className="w-full"
                          onClick={handleProcessRefund}
                          disabled={!refundAmount || parseFloat(refundAmount) <= 0}
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Process Refund
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedReturn.status === 'completed' && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <h4 className="font-medium text-green-800">Return Completed</h4>
                    </div>
                    <p className="text-green-700 text-sm mb-4">
                      This return has been processed and completed. A refund of ${selectedReturn.refundAmount?.toFixed(2)} has been issued to the customer.
                    </p>
                    {selectedReturn.trackingNumber && (
                      <div className="flex items-center mt-2">
                        <Truck className="h-4 w-4 text-green-600 mr-2" />
                        <p className="text-sm text-green-700">
                          Tracking Number: <span className="font-medium">{selectedReturn.trackingNumber}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {selectedReturn.status === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                    <div className="flex items-center mb-2">
                      <XCircle className="h-5 w-5 text-red-600 mr-2" />
                      <h4 className="font-medium text-red-800">Return Rejected</h4>
                    </div>
                    <p className="text-red-700 text-sm">
                      This return request has been rejected. The customer has been notified.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
              <Package className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No return selected</h3>
              <p className="mb-4">Select a return request from the list to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;