import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Calendar, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useShop } from '../contexts/ShopContext';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Mock analytics data
const salesData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const conversionsData = [
  { name: 'Mon', value: 2.4 },
  { name: 'Tue', value: 1.3 },
  { name: 'Wed', value: 3.5 },
  { name: 'Thu', value: 2.8 },
  { name: 'Fri', value: 4.1 },
  { name: 'Sat', value: 5.2 },
  { name: 'Sun', value: 3.9 },
];

const channelData = [
  { name: 'Direct', value: 35 },
  { name: 'Google', value: 25 },
  { name: 'Facebook', value: 20 },
  { name: 'Email', value: 15 },
  { name: 'Other', value: 5 },
];

const productPerformanceData = [
  { name: 'Product A', sales: 120, views: 320 },
  { name: 'Product B', sales: 98, views: 290 },
  { name: 'Product C', sales: 86, views: 250 },
  { name: 'Product D', sales: 72, views: 210 },
  { name: 'Product E', sales: 65, views: 180 },
];

const COLORS = ['#3366FF', '#00C8B3', '#FF7D00', '#FFCB00', '#FF5630'];

const Analytics: React.FC = () => {
  const { isConnected } = useShop();
  const [timeRange, setTimeRange] = useState('30days');

  // Animation variants for staggered animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-neutral-100 p-3">
          <BarChart3 size={28} className="text-neutral-400" />
        </div>
        <h2 className="mt-4 text-lg font-medium text-neutral-900">No store connected</h2>
        <p className="mt-1 text-neutral-500">Connect your store to view analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">Analytics</h1>
          <p className="text-neutral-500">
            Monitor your store's performance and growth.
          </p>
        </div>
        <div className="flex">
          <div className="relative">
            <select
              className="input pr-10 appearance-none"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="year">This year</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
              <Calendar size={16} />
            </div>
          </div>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={item} className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-neutral-700">Revenue</h3>
            <div className="rounded-md bg-primary-100 p-2 text-primary-600">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold">$12,458</p>
          <div className="mt-1 flex items-center text-sm">
            <span className="flex items-center text-success-400">
              <ArrowUpRight size={16} className="mr-1" />
              12%
            </span>
            <span className="ml-2 text-neutral-500">vs last period</span>
          </div>
        </motion.div>

        <motion.div variants={item} className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-neutral-700">Orders</h3>
            <div className="rounded-md bg-secondary-100 p-2 text-secondary-600">
              <ShoppingBag size={16} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold">143</p>
          <div className="mt-1 flex items-center text-sm">
            <span className="flex items-center text-success-400">
              <ArrowUpRight size={16} className="mr-1" />
              8.2%
            </span>
            <span className="ml-2 text-neutral-500">vs last period</span>
          </div>
        </motion.div>

        <motion.div variants={item} className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-neutral-700">Conversion</h3>
            <div className="rounded-md bg-accent-100 p-2 text-accent-600">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold">3.2%</p>
          <div className="mt-1 flex items-center text-sm">
            <span className="flex items-center text-error-400">
              <ArrowDownRight size={16} className="mr-1" />
              0.5%
            </span>
            <span className="ml-2 text-neutral-500">vs last period</span>
          </div>
        </motion.div>

        <motion.div variants={item} className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-neutral-700">Customers</h3>
            <div className="rounded-md bg-success-400/20 p-2 text-success-400">
              <Users size={16} />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold">891</p>
          <div className="mt-1 flex items-center text-sm">
            <span className="flex items-center text-success-400">
              <ArrowUpRight size={16} className="mr-1" />
              14.3%
            </span>
            <span className="ml-2 text-neutral-500">vs last period</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        <div className="card">
          <h3 className="mb-4 font-medium text-neutral-800">Revenue Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  tick={{fontSize: 12, fill: '#6b7280'}}
                />
                <YAxis 
                  tick={{fontSize: 12, fill: '#6b7280'}}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    padding: '8px 12px',
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Revenue"
                  stroke="#3366FF" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4 font-medium text-neutral-800">Conversion Rate</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  tick={{fontSize: 12, fill: '#6b7280'}}
                />
                <YAxis 
                  tick={{fontSize: 12, fill: '#6b7280'}}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Conversion Rate']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    padding: '8px 12px',
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Conversion Rate"
                  fill="#00C8B3" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        <div className="card">
          <h3 className="mb-4 font-medium text-neutral-800">Traffic Sources</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4 font-medium text-neutral-800">Top Products Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productPerformanceData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{fontSize: 12, fill: '#6b7280'}} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{fontSize: 12, fill: '#6b7280'}}
                  width={100}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    padding: '8px 12px',
                  }}
                />
                <Legend />
                <Bar dataKey="sales" name="Sales" fill="#3366FF" radius={[0, 4, 4, 0]} />
                <Bar dataKey="views" name="Views" fill="#FF7D00" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;