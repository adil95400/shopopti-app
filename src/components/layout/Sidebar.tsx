import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, PackageCheck, BarChart3, Sparkles, Store, Import, MessageSquare, Bot,
  Truck, Share2, Settings, Building, Users, CreditCard, FileText, HelpCircle, Book, Palette, Globe,
  Mail, Bell, ChevronLeft, ChevronRight, Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Logo';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const mainNavItems = [
  { to: '/app/dashboard', icon: <LayoutDashboard size={20} />, label: 'Tableau de bord' },
  { to: '/app/products', icon: <ShoppingBag size={20} />, label: 'Produits' },
  { to: '/app/import-products', icon: <Import size={20} />, label: 'Importer' },
  { to: '/app/orders', icon: <PackageCheck size={20} />, label: 'Commandes' },
  { to: '/app/analytics', icon: <BarChart3 size={20} />, label: 'Analyses' },
  { to: '/app/reviews', icon: <MessageSquare size={20} />, label: 'Avis' },
  { to: '/app/ai-hub', icon: <Bot size={20} />, label: 'IA Hub' }
];

const businessNavItems = [
  { to: '/app/dropshipping', icon: <Truck size={20} />, label: 'Dropshipping' },
  { to: '/app/advanced-suppliers', icon: <Building size={20} />, label: 'Fournisseurs' },
  { to: '/app/multi-channel', icon: <Share2 size={20} />, label: 'Multi-canal' },
  { to: '/app/global-marketplaces', icon: <Globe size={20} />, label: 'Marketplaces' },
  { to: '/app/marketing-hub', icon: <Mail size={20} />, label: 'Marketing' }
];

const systemNavItems = [
  { to: '/app/settings', icon: <Settings size={20} />, label: 'Paramètres' },
  { to: '/app/subscription', icon: <CreditCard size={20} />, label: 'Abonnement' },
  { to: '/app/support', icon: <HelpCircle size={20} />, label: 'Support' }
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  return (
    <>
      <motion.aside
        initial={{ width: collapsed ? 80 : 280 }}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex flex-col bg-white border-r border-gray-200 shadow-sm z-10 h-screen"
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          {!collapsed && <Logo />}
          {collapsed && (
            <div className="mx-auto">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                <ShoppingBag size={20} />
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!collapsed && (
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          <div className="space-y-8">
            <Section title="Principal" items={mainNavItems} collapsed={collapsed} />
            <Section title="Business" items={businessNavItems} collapsed={collapsed} />
            <Section title="Système" items={systemNavItems} collapsed={collapsed} />
          </div>
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className={`flex ${collapsed ? 'justify-center' : 'justify-between'} items-center`}>
            {!collapsed && (
              <div className="text-xs text-gray-500">
                <p>Shopopti+ v6.8</p>
              </div>
            )}
            <div className="flex space-x-1">
              <button className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <HelpCircle size={collapsed ? 20 : 16} />
              </button>
              {!collapsed && (
                <button className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                  <Bell size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Sidebar mobile */}
      <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" style={{ display: 'none' }}>
        <div className="w-64 h-full bg-white">
          {/* Contenu sidebar mobile */}
        </div>
      </div>
    </>
  );
};

const Section = ({
  title,
  items,
  collapsed
}: {
  title: string;
  items: { to: string; icon: React.ReactNode; label: string }[];
  collapsed: boolean;
}) => (
  <div>
    {!collapsed && (
      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        {title}
      </h3>
    )}
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'justify-center' : ''} px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {item.icon}
            {!collapsed && <span className="ml-3">{item.label}</span>}
          </NavLink>
        </li>
      ))}
    </ul>
  </div>
);

export default Sidebar;