import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Bot,
  Truck,
  Sparkles,
  Globe,
  Zap,
  Import,
  Search,
  CreditCard,
  ShoppingBag,
  BarChart3,
  Share2,
  Settings,
  Code,
  Webhook,
  Languages,
  FileBarChart2,
  Building,
  Megaphone,
  DollarSign,
  Package,
  MessageSquare,
  RefreshCw,
  GitBranch,
  FileCode,
  SplitSquareVertical,
  Mail,
  HelpCircle,
  Star
} from 'lucide-react';
import Logo from './Logo';

const sections = [
  {
    title: 'Tableau de bord',
    links: [
      { path: '/app/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      { path: '/app/products', label: 'Produits', icon: <ShoppingBag size={18} /> },
      { path: '/app/orders', label: 'Commandes', icon: <Package size={18} /> },
      { path: '/app/import-products', label: 'Import produits', icon: <Import size={18} /> },
      { path: '/app/analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
      { path: '/app/reviews', label: 'Reviews', icon: <Star size={18} /> },
      { path: '/app/suppliers', label: 'Fournisseurs', icon: <Building size={18} /> },
      { path: '/app/settings', label: 'Param\u00e8tres', icon: <Settings size={18} /> },
      { path: '/app/support', label: 'Support', icon: <HelpCircle size={18} /> },
      { path: '/app/contact', label: 'Contact', icon: <Mail size={18} /> },
      { path: '/app/subscription', label: 'Abonnement', icon: <CreditCard size={18} /> },
      { path: '/app/advanced-analytics', label: 'Advanced Analytics', icon: <BarChart3 size={18} /> }
    ]
  },
  {
    title: 'Outils IA',
    links: [
      { path: '/blog-ai', label: 'Blog IA', icon: <Bot size={18} /> },
      { path: '/seo-ai', label: 'SEO IA', icon: <Sparkles size={18} /> },
      { path: '/app/seo-audit', label: 'Audit SEO', icon: <Search size={18} /> },
      { path: '/app/seo-competitor', label: 'SEO Concurrent', icon: <Sparkles size={18} /> },
      { path: '/app/ai-hub', label: 'AI Hub', icon: <Bot size={18} /> }
    ]
  },
  {
    title: 'Dropshipping \x26 Marketplaces',
    links: [
      { path: '/app/dropshipping', label: 'Dropshipping', icon: <Truck size={18} /> },
      { path: '/app/advanced-suppliers', label: 'Fournisseurs avanc\u00e9s', icon: <Building size={18} /> },
      { path: '/app/winning-products', label: 'Winning Products', icon: <Zap size={18} /> },
      { path: '/app/multi-channel', label: 'Multi-Channel', icon: <Share2 size={18} /> },
      { path: '/app/global-marketplaces', label: 'Global Marketplaces', icon: <Globe size={18} /> },
      { path: '/app/international-selling', label: 'International Selling', icon: <Languages size={18} /> },
      { path: '/marketplace-b2b', label: 'Marketplace B2B', icon: <Globe size={18} /> }
    ]
  },
  {
    title: 'Marketing \x26 Automations',
    links: [
      { path: '/app/marketing-hub', label: 'Marketing Hub', icon: <Megaphone size={18} /> },
      { path: '/app/automations', label: 'Automations', icon: <Zap size={18} /> },
      { path: '/app/funnels', label: 'Funnels', icon: <GitBranch size={18} /> },
      { path: '/app/ab-testing', label: 'A/B Testing', icon: <SplitSquareVertical size={18} /> },
      { path: '/app/custom-reports', label: 'Rapports personnalis\u00e9s', icon: <FileBarChart2 size={18} /> }
    ]
  },
  {
    title: 'Int\u00e9grations',
    links: [
      { path: '/app/integrations', label: 'Int\u00e9grations', icon: <Code size={18} /> },
      { path: '/app/webhooks', label: 'Webhooks', icon: <Webhook size={18} /> }
    ]
  },
  {
    title: 'Modules Avanc\u00e9s',
    links: [
      { path: '/app/repricing', label: 'Repricing', icon: <DollarSign size={18} /> },
      { path: '/app/inventory', label: 'Inventory', icon: <Package size={18} /> },
      { path: '/app/chat-support', label: 'Chat Support', icon: <MessageSquare size={18} /> },
      { path: '/app/returns', label: 'Returns', icon: <RefreshCw size={18} /> },
      { path: '/app/accounting', label: 'Comptabilit\u00e9', icon: <FileText size={18} /> },
      { path: '/app/templates', label: 'Templates', icon: <FileCode size={18} /> }
    ]
  },
  {
    title: 'Utilitaires',
    links: [
      { path: '/tracking', label: 'Suivi de livraison', icon: <Truck size={18} /> },
      { path: '/generate-invoice', label: 'Factures PDF', icon: <FileText size={18} /> }
    ]
  },
  {
    title: 'Administration',
    links: [
      { path: '/app/admin/dashboard', label: 'Dashboard Admin', icon: <LayoutDashboard size={18} /> },
      { path: '/app/admin/users', label: 'Utilisateurs', icon: <Building size={18} /> },
      { path: '/app/admin/analytics', label: 'Analytics Admin', icon: <BarChart3 size={18} /> },
      { path: '/app/admin/imports', label: 'Imports', icon: <Import size={18} /> }
    ]
  }
];
export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile topbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b sticky top-0 bg-muted z-40">
        <Logo />
        <button onClick={() => setOpen(true)}><Menu size={22} /></button>
      </div>

      {/* Drawer menu */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setOpen(false)}>
          <div className="bg-white w-64 h-full p-4 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <Logo />
              <button onClick={() => setOpen(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-80px)]">
              {sections.map((section, i) => (
                <div key={i} className="mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">{section.title}</h3>
                  <div className="flex flex-col gap-1">
                    {section.links.map(link => (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded hover:bg-muted/50 ${isActive ? 'bg-muted font-semibold' : ''}`
                        }
                        onClick={() => setOpen(false)}
                      >
                        {link.icon} {link.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="w-64 hidden md:block bg-muted p-4 border-r min-h-screen overflow-y-auto">
        <div className="mb-6">
          <Logo />
        </div>
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-100px)]">
          {sections.map((section, i) => (
            <div key={i} className="mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">{section.title}</h3>
              <div className="flex flex-col gap-1">
                {section.links.map(link => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded hover:bg-primary/10 ${isActive ? 'bg-primary/20 font-semibold' : ''}`
                    }
                  >
                    {link.icon} {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}