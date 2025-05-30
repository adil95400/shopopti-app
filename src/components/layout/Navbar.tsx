import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, ShoppingBag, Globe, Zap, Search, Users, Sun, Moon } from 'lucide-react';
import Logo from './Logo';
import { supabase } from '../../lib/supabase';

interface NavItem {
  label: string;
  href: string;
  items?: { label: string; href: string }[];
}

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Check for user preference in localStorage
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const navItems: NavItem[] = [
    {
      label: 'Dropship',
      href: '#',
      items: [
        { label: 'Comment ça marche', href: '/how-it-works' },
        { label: 'Trouver des produits', href: '/find-products' },
        { label: 'Catalogue', href: '/catalog' },
        { label: 'Fournisseurs', href: '/suppliers' }
      ]
    },
    {
      label: 'Intégrations',
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
      label: 'Ressources',
      href: '#',
      items: [
        { label: 'Blog', href: '/blog' },
        { label: 'Académie', href: '/academy' },
        { label: 'Guides', href: '/guides' },
        { label: 'Centre d\'aide', href: '/help-center' },
        { label: 'Statistiques', href: '/statistics' },
        { label: 'Glossaire', href: '/glossary' }
      ]
    },
    {
      label: 'Outils',
      href: '/tools',
      items: [
        { label: 'Recherche de produits', href: '/tools/product-research' },
        { label: 'Analyse de marché', href: '/tools/market-analysis' },
        { label: 'Calculateur de profit', href: '/tools/profit-calculator' },
        { label: 'Calculateur ROAS', href: '/tools/roas-calculator' },
        { label: 'Calculateur d\'inventaire', href: '/tools/inventory-calculator' }
      ]
    },
    {
      label: 'Comparaison',
      href: '/compare',
      items: [
        { label: 'vs AliExpress', href: '/compare/aliexpress' },
        { label: 'vs CJDropshipping', href: '/compare/cjdropshipping' },
        { label: 'vs Zendrop', href: '/compare/zendrop' },
        { label: 'vs DSers', href: '/compare/dsers' },
        { label: 'vs AutoDS', href: '/compare/autods' }
      ]
    },
    { label: 'Tarifs', href: '/pricing' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
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
                    className={`flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary ${location.pathname === item.href ? 'text-primary dark:text-primary' : ''}`}
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
                    <div className="absolute left-0 mt-1 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700">
                      <div className="py-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.label}
                            to={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary"
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
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <select className="bg-transparent text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary cursor-pointer border-none focus:ring-0">
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇺🇸 English</option>
              <option value="es">🇪🇸 Español</option>
              <option value="de">🇩🇪 Deutsch</option>
            </select>
            
            {isAuthenticated ? (
              <button 
                onClick={() => window.location.href = '/app/dashboard'}
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
              >
                Tableau de bord
              </button>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
                  Se connecter
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600"
                >
                  Commencer
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
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
            className="md:hidden bg-white dark:bg-gray-800 shadow-lg"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.href}
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.items && (
                    <div className="pl-4 space-y-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.label}
                          to={subItem.href}
                          className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {isAuthenticated ? (
                  <Link
                    to="/app/dashboard"
                    className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tableau de bord
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Se connecter
                    </Link>
                    <Link
                      to="/register"
                      className="block px-3 py-2 text-primary dark:text-primary hover:text-primary-600 dark:hover:text-primary-500 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Commencer
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;