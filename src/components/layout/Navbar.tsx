import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import Logo from './Logo';

interface NavItem {
  label: string;
  href: string;
  items?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: 'Dropship',
    href: '#',
    items: [
      { label: 'How it Works', href: '/how-it-works' },
      { label: 'Find Products', href: '/find-products' },
      { label: 'Catalog', href: '/catalog' },
      { label: 'Suppliers', href: '/suppliers' }
    ]
  },
  {
    label: 'Integrations',
    href: '/integrations',
    items: [
      { label: 'Shopify', href: '/integrations/shopify' },
      { label: 'WooCommerce', href: '/integrations/woocommerce' },
      { label: 'Wix', href: '/integrations/wix' },
      { label: 'BigCommerce', href: '/integrations/bigcommerce' },
      { label: 'Square', href: '/integrations/square' },
      { label: 'Ecwid', href: '/integrations/ecwid' },
      { label: 'Squarespace', href: '/integrations/squarespace' }
    ]
  },
  {
    label: 'Resources',
    href: '#',
    items: [
      { label: 'Blog', href: '/blog' },
      { label: 'Academy', href: '/academy' },
      { label: 'Guides', href: '/guides' },
      { label: 'Help Center', href: '/help' },
      { label: 'Statistics', href: '/statistics' },
      { label: 'Glossary', href: '/glossary' }
    ]
  },
  {
    label: 'Tools',
    href: '/tools',
    items: [
      { label: 'Product Research', href: '/tools/product-research' },
      { label: 'Market Analysis', href: '/tools/market-analysis' },
      { label: 'Profit Calculator', href: '/tools/profit-calculator' },
      { label: 'ROAS Calculator', href: '/tools/roas-calculator' },
      { label: 'Inventory Calculator', href: '/tools/inventory-calculator' }
    ]
  },
  {
    label: 'Compare',
    href: '/compare',
    items: [
      { label: 'vs AliExpress', href: '/compare/aliexpress' },
      { label: 'vs CJDropshipping', href: '/compare/cjdropshipping' },
      { label: 'vs Zendrop', href: '/compare/zendrop' },
      { label: 'vs DSers', href: '/compare/dsers' },
      { label: 'vs AutoDS', href: '/compare/autods' }
    ]
  },
  { label: 'Pricing', href: '/pricing' }
];

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary-500/80 backdrop-blur-sm border-b border-accent-200/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Logo />
            <div className="hidden md:flex ml-10 space-x-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.href}
                    className="flex items-center px-3 py-2 text-accent-200 hover:text-white"
                  >
                    {item.label}
                    {item.items && (
                      <ChevronDown
                        size={16}
                        className={`ml-1 transition-transform ${
                          activeDropdown === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </Link>

                  {item.items && activeDropdown === item.label && (
                    <div className="absolute left-0 mt-1 w-48 rounded-md bg-secondary-400 shadow-lg ring-1 ring-accent-200/10">
                      <div className="py-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.label}
                            to={subItem.href}
                            className="block px-4 py-2 text-sm text-accent-200 hover:bg-secondary-500 hover:text-white"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <select className="bg-transparent text-accent-200 hover:text-white cursor-pointer border-none focus:ring-0">
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇺🇸 English</option>
            </select>
            <Link to="/login" className="text-accent-200 hover:text-white">
              Se connecter
            </Link>
            <Link
              to="/register"
              className="btn btn-primary"
            >
              Commencer
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-accent-200 hover:text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-secondary-400"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.href}
                    className="block px-3 py-2 text-accent-200 hover:text-white"
                  >
                    {item.label}
                  </Link>
                  {item.items && (
                    <div className="pl-4 space-y-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.label}
                          to={subItem.href}
                          className="block px-3 py-2 text-sm text-accent-200 hover:text-white"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-accent-200/10">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-accent-200 hover:text-white"
                >
                  Se connecter
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-primary-400 hover:text-primary-500"
                >
                  Commencer
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;