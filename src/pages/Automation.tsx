import React from 'react';
import { Bot, Zap, Settings, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useShopContext } from '../contexts/ShopContext';

const Automation: React.FC = () => {
  const { isConnected } = useShopContext();

  const automationTasks = [
    {
      id: 'seo',
      title: 'SEO Optimization',
      description: 'Automatically optimize product titles, descriptions, and meta tags for better search rankings.',
      status: 'active',
      lastRun: '2024-03-10T14:23:54Z',
      nextRun: '2024-03-11T14:23:54Z',
      icon: Sparkles
    },
    {
      id: 'pricing',
      title: 'Dynamic Pricing',
      description: 'Adjust product prices based on market demand, competition, and inventory levels.',
      status: 'active',
      lastRun: '2024-03-10T12:00:00Z',
      nextRun: '2024-03-10T18:00:00Z',
      icon: Zap
    },
    {
      id: 'content',
      title: 'Content Generation',
      description: 'Generate engaging product descriptions and blog posts using AI.',
      status: 'paused',
      lastRun: '2024-03-09T23:00:00Z',
      nextRun: null,
      icon: Bot
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' · ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-neutral-100 p-3">
          <Bot size={28} className="text-neutral-400" />
        </div>
        <h2 className="mt-4 text-lg font-medium text-neutral-900">No store connected</h2>
        <p className="mt-1 text-neutral-500">Connect your store to enable AI automation</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 md:text-3xl">AI Automation</h1>
          <p className="text-neutral-500">
            Automate your store operations with artificial intelligence.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="btn btn-primary">
            <Settings size={16} className="mr-2" />
            Configure Automation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {automationTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card"
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-md p-2 
                ${task.status === 'active' ? 'bg-success-400/10 text-success-400' : 'bg-neutral-100 text-neutral-500'}`}
              >
                <task.icon size={20} />
              </div>
              <div className="flex items-center">
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                  ${task.status === 'active' 
                    ? 'bg-success-400/10 text-success-400' 
                    : 'bg-neutral-100 text-neutral-500'}`}
                >
                  {task.status === 'active' ? 'Active' : 'Paused'}
                </span>
              </div>
            </div>

            <h3 className="mt-4 text-lg font-medium text-neutral-900">{task.title}</h3>
            <p className="mt-1 text-sm text-neutral-600">{task.description}</p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm">
                <Clock size={14} className="mr-2 text-neutral-400" />
                <span className="text-neutral-600">Last run:</span>
                <span className="ml-1 text-neutral-900">{formatDate(task.lastRun)}</span>
              </div>
              {task.nextRun && (
                <div className="flex items-center text-sm">
                  <ArrowRight size={14} className="mr-2 text-neutral-400" />
                  <span className="text-neutral-600">Next run:</span>
                  <span className="ml-1 text-neutral-900">{formatDate(task.nextRun)}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-100">
              <button className="btn btn-outline w-full">
                Configure
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card bg-gradient-to-r from-primary-400/10 to-secondary-400/10">
        <div className="flex items-start space-x-4">
          <div className="rounded-md bg-primary-400/20 p-3">
            <Sparkles size={24} className="text-primary-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-neutral-900">AI Automation Insights</h3>
            <p className="mt-1 text-neutral-600">
              Your automated tasks have optimized 127 products and adjusted prices 48 times in the last 7 days, 
              leading to a 15% increase in conversion rate.
            </p>
            <button className="btn btn-primary mt-4">
              View Detailed Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Automation;