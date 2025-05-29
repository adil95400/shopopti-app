import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download, Filter, Calendar, RefreshCw, Plus, Trash2, Settings, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';

const CustomReports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeReport, setActiveReport] = useState('sales');
  const [dateRange, setDateRange] = useState('30d');
  
  const reports = [
    { id: 'sales', name: 'Sales Performance', type: 'line' },
    { id: 'products', name: 'Product Performance', type: 'bar' },
    { id: 'customers', name: 'Customer Segments', type: 'pie' },
    { id: 'channels', name: 'Sales Channels', type: 'bar' },
    { id: 'inventory', name: 'Inventory Status', type: 'bar' }
  ];
  
  // Sample data for reports
  const salesData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 }
  ];
  
  const productData = [
    { name: 'Product A', value: 1200 },
    { name: 'Product B', value: 900 },
    { name: 'Product C', value: 800 },
    { name: 'Product D', value: 700 },
    { name: 'Product E', value: 600 }
  ];
  
  const customerData = [
    { name: 'New', value: 400 },
    { name: 'Returning', value: 300 },
    { name: 'Loyal', value: 200 },
    { name: 'VIP', value: 100 }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const handleRefresh = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Error refreshing report:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    // In a real app, you would generate and download the report
    console.log(`Exporting ${activeReport} report as ${format}`);
    
    // Simulate download
    setTimeout(() => {
      alert(`${activeReport} report exported as ${format}`);
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Reports</h1>
          <p className="text-gray-600">
            Create and customize reports to gain insights into your business performance.
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleRefresh()} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-900 mb-4">Saved Reports</h3>
            <div className="space-y-2">
              {reports.map(report => (
                <button
                  key={report.id}
                  className={`w-full flex items-center justify-between p-3 rounded-md text-left ${
                    activeReport === report.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  onClick={() => setActiveReport(report.id)}
                >
                  <div className="flex items-center">
                    <FileText className={`h-4 w-4 mr-2 ${
                      activeReport === report.id ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    <span>{report.name}</span>
                  </div>
                  {activeReport === report.id && (
                    <div className="flex items-center">
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Edit report
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Delete report
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">
                {reports.find(r => r.id === activeReport)?.name || 'Report'}
              </h3>
              
              <div className="flex space-x-2">
                <div className="relative">
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md appearance-none pr-8"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="ytd">Year to date</option>
                    <option value="custom">Custom range</option>
                  </select>
                  <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 h-4 w-4" />
                </div>
                
                <div className="relative">
                  <button className="px-3 py-2 border border-gray-300 rounded-md flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Filters</span>
                  </button>
                </div>
                
                <div className="relative">
                  <button className="px-3 py-2 border border-gray-300 rounded-md flex items-center">
                    <Download className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Export</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 hidden">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => handleExport('pdf')}
                      >
                        Export as PDF
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => handleExport('csv')}
                      >
                        Export as CSV
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => handleExport('excel')}
                      >
                        Export as Excel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-96">
              {activeReport === 'sales' && (
                <ResponsiveContainer width="100%\" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{fontSize: 12, fill: '#6B7280'}} />
                    <YAxis tick={{fontSize: 12, fill: '#6B7280'}} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.375rem',
                        padding: '8px 12px',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Sales"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
              
              {activeReport === 'products' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{fontSize: 12, fill: '#6B7280'}} />
                    <YAxis tick={{fontSize: 12, fill: '#6B7280'}} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.375rem',
                        padding: '8px 12px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Sales" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
              
              {activeReport === 'customers' && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {customerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} customers`, 'Count']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.375rem',
                        padding: '8px 12px',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
              
              {activeReport === 'channels' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Website', value: 4000 },
                      { name: 'Amazon', value: 3000 },
                      { name: 'eBay', value: 2000 },
                      { name: 'Facebook', value: 1500 },
                      { name: 'Instagram', value: 1000 }
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{fontSize: 12, fill: '#6B7280'}} />
                    <YAxis tick={{fontSize: 12, fill: '#6B7280'}} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.375rem',
                        padding: '8px 12px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Sales" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
              
              {activeReport === 'inventory' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Product A', value: 120 },
                      { name: 'Product B', value: 85 },
                      { name: 'Product C', value: 65 },
                      { name: 'Product D', value: 45 },
                      { name: 'Product E', value: 30 }
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{fontSize: 12, fill: '#6B7280'}} />
                    <YAxis tick={{fontSize: 12, fill: '#6B7280'}} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '0.375rem',
                        padding: '8px 12px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Stock" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleString()}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Customize
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomReports;