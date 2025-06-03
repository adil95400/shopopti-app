import React, { useState, useEffect } from 'react';
import { accountingService, Invoice } from '../../modules/accounting';
import { FileText, Plus, Download, Printer, Search, Filter, DollarSign, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const AccountingPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  
  useEffect(() => {
    fetchInvoices();
  }, [statusFilter, dateRange]);
  
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      
      const filters: any = {};
      
      if (statusFilter) {
        filters.status = statusFilter;
      }
      
      if (dateRange.start) {
        filters.startDate = new Date(dateRange.start);
      }
      
      if (dateRange.end) {
        filters.endDate = new Date(dateRange.end);
      }
      
      const fetchedInvoices = await accountingService.getInvoices(filters);
      setInvoices(fetchedInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownloadInvoice = async (invoice: Invoice) => {
    try {
      const pdfBlob = await accountingService.generateInvoicePDF(invoice);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating invoice PDF:', error);
      toast.error('Failed to generate invoice PDF');
    }
  };
  
  const handleUpdateStatus = async (id: string, status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled') => {
    try {
      await accountingService.updateInvoiceStatus(id, status, status === 'paid' ? new Date() : undefined);
      
      // Update the invoice in the list
      setInvoices(invoices.map(invoice => 
        invoice.id === id ? { ...invoice, status } : invoice
      ));
      
      // Update the selected invoice if it's the one being updated
      if (selectedInvoice?.id === id) {
        setSelectedInvoice({ ...selectedInvoice, status });
      }
      
      toast.success(`Invoice marked as ${status}`);
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast.error('Failed to update invoice status');
    }
  };
  
  const filteredInvoices = invoices.filter(invoice => 
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Draft
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            Sent
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Cancelled
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
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Accounting Center</h1>
          <p className="text-gray-600">Manage invoices, taxes, and financial reports</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Invoiced</h3>
            <div className="p-2 bg-blue-50 rounded-full">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">€24,560.00</p>
          <p className="text-sm text-gray-500 mt-2">32 invoices</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Paid</h3>
            <div className="p-2 bg-green-50 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">€18,340.00</p>
          <p className="text-sm text-gray-500 mt-2">24 invoices</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <div className="p-2 bg-yellow-50 rounded-full">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">€4,220.00</p>
          <p className="text-sm text-gray-500 mt-2">6 invoices</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
            <div className="p-2 bg-red-50 rounded-full">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">€2,000.00</p>
          <p className="text-sm text-gray-500 mt-2">2 invoices</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Invoices</h3>
              <select
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
                <input
                  type="date"
                  className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
                <input
                  type="date"
                  className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
                <FileText className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No invoices found</h3>
                <p className="text-sm">
                  {searchTerm || statusFilter || dateRange.start || dateRange.end
                    ? 'No invoices match your search criteria'
                    : 'There are no invoices yet'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedInvoice?.id === invoice.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedInvoice(invoice)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">Invoice #{invoice.invoiceNumber}</h4>
                        <p className="text-sm text-gray-500 mt-1">{invoice.customerName}</p>
                      </div>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-sm font-medium">{formatCurrency(invoice.total)}</p>
                      <p className="text-xs text-gray-500">
                        Due: {formatDate(invoice.dueDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          {selectedInvoice ? (
            <>
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <Button variant="ghost\" size="sm\" className="mr-2 md:hidden\" onClick={() => setSelectedInvoice(null)}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <h3 className="font-medium">Invoice #{selectedInvoice.invoiceNumber}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(selectedInvoice.issueDate)} • {getStatusBadge(selectedInvoice.status)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(selectedInvoice)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Bill To</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="font-medium">{selectedInvoice.customerName}</p>
                      <p className="text-gray-600">{selectedInvoice.customerEmail}</p>
                      <p className="text-gray-600 whitespace-pre-line mt-2">{selectedInvoice.customerAddress}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Invoice Details</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Invoice Number</p>
                          <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Issue Date</p>
                          <p className="font-medium">{formatDate(selectedInvoice.issueDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Due Date</p>
                          <p className="font-medium">{formatDate(selectedInvoice.dueDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className="font-medium capitalize">{selectedInvoice.status}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-medium text-gray-900 mb-2">Invoice Items</h4>
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unit Price
                          </th>
                          <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedInvoice.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {item.description}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {formatCurrency(item.unitPrice)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {formatCurrency(item.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="flex justify-end">
                      <div className="w-64 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Subtotal:</span>
                          <span className="font-medium">{formatCurrency(selectedInvoice.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Tax ({selectedInvoice.taxRate}%):</span>
                          <span className="font-medium">{formatCurrency(selectedInvoice.taxAmount)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold text-lg">{formatCurrency(selectedInvoice.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedInvoice.notes && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-gray-600 whitespace-pre-line">{selectedInvoice.notes}</p>
                    </div>
                  </div>
                )}
                
                {selectedInvoice.status === 'draft' && (
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">
                      Edit Invoice
                    </Button>
                    <Button className="flex-1" onClick={() => handleUpdateStatus(selectedInvoice.id!, 'sent')}>
                      Mark as Sent
                    </Button>
                  </div>
                )}
                
                {selectedInvoice.status === 'sent' && (
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1" onClick={() => handleUpdateStatus(selectedInvoice.id!, 'paid')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Paid
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleUpdateStatus(selectedInvoice.id!, 'overdue')}>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Mark as Overdue
                    </Button>
                  </div>
                )}
                
                {selectedInvoice.status === 'overdue' && (
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1" onClick={() => handleUpdateStatus(selectedInvoice.id!, 'paid')}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Paid
                    </Button>
                    <Button className="flex-1">
                      Send Reminder
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
              <FileText className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No invoice selected</h3>
              <p className="mb-4">Select an invoice from the list to view details</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-full mr-3">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium">Tax Reports</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Generate tax reports for your business to help with tax filing and compliance.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="vat">VAT Report</option>
                <option value="sales">Sales Tax Report</option>
                <option value="income">Income Tax Report</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
            </div>
          </div>
          
          <Button className="w-full mt-6">
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-full mr-3">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-medium">Financial Overview</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Total Revenue (This Month)</p>
              <p className="text-2xl font-bold">€8,245.00</p>
              <div className="flex items-center mt-1 text-green-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>12% increase from last month</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Outstanding Invoices</p>
              <p className="text-2xl font-bold">€6,220.00</p>
              <p className="text-sm text-gray-500 mt-1">8 invoices pending payment</p>
            </div>
          </div>
          
          <Button variant="outline" className="w-full mt-6">
            View Financial Reports
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-full mr-3">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium">Upcoming Payments</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium">Invoice #INV-2025-0032</p>
                <p className="text-sm text-gray-500">Due in 3 days</p>
              </div>
              <p className="font-medium">€1,250.00</p>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium">Invoice #INV-2025-0035</p>
                <p className="text-sm text-gray-500">Due in 5 days</p>
              </div>
              <p className="font-medium">€780.00</p>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium">Invoice #INV-2025-0036</p>
                <p className="text-sm text-gray-500">Due in 7 days</p>
              </div>
              <p className="font-medium">€2,190.00</p>
            </div>
          </div>
          
          <Button variant="outline" className="w-full mt-6">
            View All Upcoming Payments
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountingPage;