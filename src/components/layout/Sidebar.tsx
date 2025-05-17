
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, PackageCheck, BarChart3, Sparkles, Store, Import, MessageSquare, Bot,
  Truck, Share2, Settings, Building, Users, CreditCard, FileText, HelpCircle, Book, Palette, Globe,
  Mail, Bell
} from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const mainNavItems = [
  { to: '/app/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/app/products', icon: <ShoppingBag size={20} />, label: 'Products' },
  { to: '/app/import-products', icon: <Import size={20} />, label: 'Import' },
  { to: '/app/orders', icon: <PackageCheck size={20} />, label: 'Orders' },
  { to: '/app/winning-products', icon: <Sparkles size={20} />, label: 'Winning Products' },
  { to: '/app/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
  { to: '/app/store-connection', icon: <Store size={20} />, label: 'Store Connection' },
  { to: '/app/reviews', icon: <MessageSquare size={20} />, label: 'Reviews' },
  { to: '/app/automation', icon: <Bot size={20} />, label: 'AI Automation' }
];

const businessNavItems = [
  { to: '/app/logistics', icon: <Truck size={20} />, label: 'Logistics' },
  { to: '/app/suppliers', icon: <Building size={20} />, label: 'Suppliers' },
  { to: '/app/channels', icon: <Share2 size={20} />, label: 'Sales Channels' },
  { to: '/app/customers', icon: <Users size={20} />, label: 'Customers' },
  { to: '/app/payments', icon: <CreditCard size={20} />, label: 'Payments' }
];

const systemNavItems = [
  { to: '/app/settings', icon: <Settings size={20} />, label: 'Settings' },
  { to: '/app/notifications', icon: <Bell size={20} />, label: 'Notifications' },
  { to: '/app/appearance', icon: <Palette size={20} />, label: 'Appearance' },
  { to: '/app/language', icon: <Globe size={20} />, label: 'Language' }
];

const helpNavItems = [
  { to: '/app/documentation', icon: <FileText size={20} />, label: 'Documentation' },
  { to: '/app/support', icon: <HelpCircle size={20} />, label: 'Support' },
  { to: '/app/tutorials', icon: <Book size={20} />, label: 'Tutorials' },
  { to: '/app/contact', icon: <Mail size={20} />, label: 'Contact' }
];

const aiModulesNav = [
  { to: '/assistant', label: '🧠 Assistant IA' },
  { to: '/ai-products', label: '🔥 Produit Gagnant' },
  { to: '/chrome-extension', label: '🔗 Extension Chrome' },
  { to: '/multichannel-publish', label: '🌍 Multicanal' },
  { to: '/mobile-app', label: '📱 Appli Mobile' },
  { to: '/blog-generator', label: '✍️ Blog AI' },
  { to: '/onboarding', label: '🚀 Onboarding' },
  { to: '/help', label: '❓ Aide & FAQ' }
];

const Sidebar: React.FC = () => {
  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="hidden md:flex w-64 flex-col bg-secondary-500 shadow-md z-10"
    >
      <div className="flex h-16 items-center justify-center border-b border-accent-200/10">
        <Logo />
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-8">
          <Section title="Principal" items={mainNavItems} />
          <Section title="Business" items={businessNavItems} />
          <Section title="Système" items={systemNavItems} />
          <Section title="Aide" items={helpNavItems} />

          <div>
            <h3 className="px-3 text-xs font-semibold text-accent-200 uppercase tracking-wider">
              Modules IA
            </h3>
            <ul className="mt-3 space-y-2">
              {aiModulesNav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </motion.aside>
  );
};

const Section = ({
  title,
  items
}: {
  title: string;
  items: { to: string; icon: React.ReactNode; label: string }[];
}) => (
  <div>
    <h3 className="px-3 text-xs font-semibold text-accent-200 uppercase tracking-wider">
      {title}
    </h3>
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  </div>
);

export default Sidebar;
