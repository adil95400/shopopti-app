import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  PackageCheck, 
  BarChart3, 
  Sparkles,
  Store,
  Import,
  MessageSquare,
  Bot,
  Truck,
  Share2,
  Settings,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const navItems = [
  { to: '/app/dashboard', icon: <LayoutDashboard size={20} />, label: 'Tableau de bord' },
  { to: '/app/products', icon: <ShoppingBag size={20} />, label: 'Produits' },
  { to: '/app/import-products', icon: <Import size={20} />, label: 'Importer' },
  { to: '/app/orders', icon: <PackageCheck size={20} />, label: 'Commandes' },
  { to: '/app/winning-products', icon: <Sparkles size={20} />, label: 'Produits gagnants' },
  { to: '/app/analytics', icon: <BarChart3 size={20} />, label: 'Analyses' },
  { to: '/app/store-connection', icon: <Store size={20} />, label: 'Connexion boutique' },
  { to: '/app/reviews', icon: <MessageSquare size={20} />, label: 'Avis' },
  { to: '/app/automation', icon: <Bot size={20} />, label: 'Automatisation IA' },
  { to: '/app/logistics', icon: <Truck size={20} />, label: 'Logistique' },
  { to: '/app/suppliers', icon: <Building size={20} />, label: 'Fournisseurs' },
  { to: '/app/channels', icon: <Share2 size={20} />, label: 'Canaux de vente' },
];

const Sidebar: React.FC = () => {
  return (
    <motion.aside 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="hidden md:flex w-64 flex-col bg-secondary-500 shadow-md z-10"
    >
      <div className="flex h-16 items-center justify-center border-b border-accent-200/10">
        <Logo />
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
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
      </nav>
      <div className="border-t border-accent-200/10 p-4">
        <NavLink
          to="/app/settings"
          className={({ isActive }) => 
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <Settings size={20} />
          <span>Paramètres</span>
        </NavLink>
      </div>
    </motion.aside>
  );
};

export default Sidebar;