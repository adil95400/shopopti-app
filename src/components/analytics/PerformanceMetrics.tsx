import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';

interface PerformanceMetricsProps {
  data: {
    revenue: {
      daily: { date: string; value: number }[];
      total: number;
      change: number;
    };
    orders: {
      daily: { date: string; value: number }[];
      total: number;
      change: number;
    };
    visitors: {
      daily: { date: string; value: number }[];
      total: number;
      change: number;
    };
    conversion: {
      daily: { date: string; value: number }[];
      average: number;
      change: number;
    };
  };
  period: 'week' | 'month' | 'year';
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ data, period }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
            <div className="p-2 bg-blue-50 rounded-full">
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">${data.revenue.total.toLocaleString()}</p>
          <div className="flex items-center mt-2">
            <span className={`flex items-center text-sm ${data.revenue.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {data.revenue.change >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {Math.abs(data.revenue.change)}%
            </span>
            <span className="text-xs text-gray-500 ml-2">vs previous {period}</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Orders</h3>
            <div className="p-2 bg-purple-50 rounded-full">
              <ShoppingBag className="h-5 w-5 text-purple-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{data.orders.total}</p>
          <div className="flex items-center mt-2">
            <span className={`flex items-center text-sm ${data.orders.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {data.orders.change >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {Math.abs(data.orders.change)}%
            </span>
            <span className="text-xs text-gray-500 ml-2">vs previous {period}</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Visitors</h3>
            <div className="p-2 bg-green-50 rounded-full">
              <Users className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{data.visitors.total.toLocaleString()}</p>
          <div className="flex items-center mt-2">
            <span className={`flex items-center text-sm ${data.visitors.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {data.visitors.change >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {Math.abs(data.visitors.change)}%
            </span>
            <span className="text-xs text-gray-500 ml-2">vs previous {period}</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
            <div className="p-2 bg-orange-50 rounded-full">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{data.conversion.average}%</p>
          <div className="flex items-center mt-2">
            <span className={`flex items-center text-sm ${data.conversion.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {data.conversion.change >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {Math.abs(data.conversion.change)}%
            </span>
            <span className="text-xs text-gray-500 ml-2">vs previous {period}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.revenue.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  tick={{fontSize: 12, fill: '#6B7280'}}
                />
                <YAxis 
                  tick={{fontSize: 12, fill: '#6B7280'}}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Revenue']}
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
                  name="Revenue"
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Orders vs Visitors</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.orders.daily.map((item, index) => ({
                  date: item.date,
                  orders: item.value,
                  visitors: data.visitors.daily[index].value
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6B7280'}} />
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
                <Bar dataKey="visitors" name="Visitors" fill="#10B981" />
                <Bar dataKey="orders" name="Orders" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;