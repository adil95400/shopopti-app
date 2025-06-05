import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import LanguageSelector from '../LanguageSelector';
import Logo from './Logo';
import { 
  Menu, 
  Bell, 
  ChevronDown, 
  Search, 
  Settings, 
  LogOut, 
  CreditCard, 
  User, 
  HelpCircle, 
  BarChart3, 
  ShoppingBag, 
  Package, 
  Truck, 
  FileText, 
  Bot, 
  Globe, 
  Zap, 
  Layers,
  X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const MainNavbar: React.FC = () => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      
      if (data.session?.user) {
        // Dans une application réelle, récupérez les données utilisateur depuis Supabase
        setUserProfile({
          name: 'Utilisateur Shopopti+',
          email: data.session.user.email,
          plan: 'pro'
        });
      }
    };
    
    checkAuth();
    
    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
        if (session?.user) {
          setUserProfile({
            name: 'Utilisateur Shopopti+',
            email: session.user.email,
            plan: 'pro'
          });
        } else {
          setUserProfile(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
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
    // Close mobile menu when location changes
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Produits',
      href: '#',
      items: [
        { 
          label: 'Recherche de produits', 
          href: '/app/products', 
          icon: <Search size={18} />,
          description: 'Trouvez des produits à fort potentiel pour votre boutique'
        },
        { 
          label: 'Importation', 
          href: '/app/import-products', 
          icon: <Package size={18} />,
          description: 'Importez des produits depuis différentes sources'
        },
        { 
          label: 'Produits gagnants', 
          href: '/app/winning-products', 
          icon: <Zap size={18} />,
          description: 'Découvrez les produits les plus performants du moment'
        },
        { 
          label: 'Optimisation IA', 
          href: '/app/ai-hub', 
          icon: <Bot size={18} />,
          description: 'Optimisez vos fiches produits avec l\'intelligence artificielle'
        }
      ]
    },
    {
      label: 'Solutions',
      href: '#',
      items: [
        { 
          label: 'Dropshipping', 
          href: '/app/dropshipping', 
          icon: <Truck size={18} />,
          description: 'Solution complète pour le dropshipping'
        },
        { 
          label: 'Multi-canal', 
          href: '/app/multi-channel', 
          icon: <Layers size={18} />,
          description: 'Vendez sur plusieurs plateformes simultanément'
        },
        { 
          label: 'Marketplace B2B', 
          href: '/marketplace-b2b', 
          icon: <Globe size={18} />,
          description: 'Connectez-vous directement avec des fournisseurs vérifiés'
        },
        { 
          label: 'Automatisations', 
          href: '/app/automations', 
          icon: <Zap size={18} />,
          description: 'Automatisez vos tâches répétitives'
        }
      ]
    },
    {
      label: 'Outils IA',
      href: '#',
      items: [
        { 
          label: 'Centre IA', 
          href: '/app/ai-hub', 
          icon: <Bot size={18} />,
          description: 'Tous vos outils IA centralisés'
        },
        { 
          label: 'Blog IA', 
          href: '/blog-ai', 
          icon: <FileText size={18} />,
          description: 'Générez du contenu optimisé pour votre blog'
        },
        { 
          label: 'SEO IA', 
          href: '/seo-ai', 
          icon: <Globe size={18} />,
          description: 'Optimisez votre référencement avec l\'IA'
        },
        { 
          label: 'Analyse concurrentielle', 
          href: '/app/seo-competitor', 
          icon: <Search size={18} />,
          description: 'Analysez vos concurrents et identifiez des opportunités'
        }
      ]
    },
    {
      label: 'Ressources',
      href: '#',
      items: [
        { 
          label: 'Centre d\'aide', 
          href: '/help-center', 
          icon: <HelpCircle size={18} />,
          description: 'Guides et documentation pour vous aider'
        },
        { 
          label: 'Blog', 
          href: '/blog', 
          icon: <FileText size={18} />,
          description: 'Articles, conseils et actualités e-commerce'
        },
        { 
          label: 'Webinaires', 
          href: '/webinars', 
          icon: <User size={18} />,
          description: 'Formations et événements en ligne'
        },
        { 
          label: 'API', 
          href: '/api-docs', 
          icon: <Layers size={18} />,
          description: 'Documentation technique pour les développeurs'
        }
      ]
    },
    { 
      label: 'Tarifs', 
      href: '/pricing' 
    }
  ];

  const notifications = [
    {
      id: 1,
      title: t('common.newOrder'),
      message: 'Commande #2345 - 129.99€',
      time: '10 ' + t('common.minutes'),
      read: false
    },
    {
      id: 2,
      title: t('common.lowStock'),
      message: 'Le produit "Écouteurs sans fil" a un stock faible (3 restants)',
      time: '1 ' + t('common.hours'),
      read: true
    },
    {
      id: 3,
      title: 'Mise à jour disponible',
      message: 'Une nouvelle version de Shopopti+ est disponible',
      time: '3 ' + t('common.hours'),
      read: true
    }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-sm' : 'bg-white/95 backdrop-blur-sm'}`}>
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
                  {item.items ? (
                    <button
                      className={`flex items-center px-3 py-2 text-gray-700 hover:text-primary ${activeDropdown === item.label ? 'text-primary' : ''}`}
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        className={`ml-1 transition-transform ${
                          activeDropdown === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={`flex items-center px-3 py-2 text-gray-700 hover:text-primary ${location.pathname === item.href ? 'text-primary' : ''}`}
                    >
                      {item.label}
                    </Link>
                  )}

                  {item.items && activeDropdown === item.label && (
                    <div className="absolute left-0 mt-1 w-72 rounded-md border border-gray-200 bg-white shadow-lg z-50">
                      <div className="py-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.label}
                            to={subItem.href}
                            className="flex items-start px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                          >
                            <span className="mr-3 text-gray-400 mt-0.5">{subItem.icon}</span>
                            <div>
                              <p className="font-medium">{subItem.label}</p>
                              <p className="text-xs text-gray-500">{subItem.description}</p>
                            </div>
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('common.search')}
                className="pl-10 pr-4 py-2 w-40 lg:w-64 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <LanguageSelector />
            
            {isAuthenticated ? (
              <>
                <motion.div 
                  className="relative"
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 relative"
                  >
                    <Bell size={20} />
                    <motion.span 
                      className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-primary" 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [0.8, 1.2, 0.8] }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2,
                        repeatType: "loop"
                      }}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-1 w-80 rounded-md border border-gray-200 bg-white shadow-lg z-20"
                      >
                        <div className="border-b border-gray-200 px-4 py-3">
                          <h3 className="font-medium">{t('common.notifications')}</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto p-2">
                          {notifications.map((notification) => (
                            <div 
                              key={notification.id} 
                              className={`rounded-md p-3 hover:bg-gray-50 ${notification.read ? '' : 'bg-blue-50'}`}
                            >
                              <p className="text-sm font-medium">{notification.title}</p>
                              <p className="text-xs text-gray-500">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{t('common.ago')} {notification.time}</p>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 p-2">
                          <button className="text-center w-full text-sm text-primary hover:text-primary-dark">
                            Voir toutes les notifications
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 rounded-md p-1 text-sm transition hover:bg-gray-100"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary bg-opacity-10 text-primary">
                      <User size={18} />
                    </div>
                    <ChevronDown size={16} className="text-gray-500" />
                  </button>
                  
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-1 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-20"
                      >
                        <div className="border-b border-gray-200 px-4 py-3">
                          <p className="text-sm font-medium">{userProfile?.name || 'Utilisateur'}</p>
                          <p className="text-xs text-gray-500">{userProfile?.email || 'utilisateur@exemple.com'}</p>
                          {userProfile?.plan && (
                            <div className="mt-1 flex items-center">
                              <span className="inline-flex items-center rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary">
                                {userProfile.plan === 'pro' ? 'Forfait Pro' : 
                                 userProfile.plan === 'agency' ? 'Forfait Agence' : 'Forfait Gratuit'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <button 
                            onClick={() => {
                              setShowUserMenu(false);
                              navigate('/app/dashboard');
                            }} 
                            className="flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <BarChart3 size={16} className="mr-2" />
                            {t('nav.dashboard')}
                          </button>
                          <button 
                            onClick={() => {
                              setShowUserMenu(false);
                              navigate('/app/subscription');
                            }} 
                            className="flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <CreditCard size={16} className="mr-2" />
                            Abonnement
                          </button>
                          <button 
                            onClick={() => {
                              setShowUserMenu(false);
                              navigate('/app/settings');
                            }}
                            className="flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Settings size={16} className="mr-2" />
                            {t('common.settings')}
                          </button>
                          <button 
                            onClick={() => {
                              setShowUserMenu(false);
                              navigate('/help-center');
                            }}
                            className="flex w-full items-center rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <HelpCircle size={16} className="mr-2" />
                            Centre d'aide
                          </button>
                          <button 
                            onClick={handleLogout} 
                            className="flex w-full items-center rounded-md px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <LogOut size={16} className="mr-2" />
                            {t('common.signOut')}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary font-medium">
                  {t('common.signIn')}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600"
                >
                  {t('common.getStarted')}
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-3">
            {isAuthenticated && (
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 relative"
              >
                <Bell size={20} />
                <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-primary"></span>
              </button>
            )}
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-primary"
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
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.items ? (
                    <>
                      <button
                        className="flex w-full items-center justify-between px-3 py-2 text-gray-700 hover:text-primary font-medium"
                        onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            activeDropdown === item.label ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      <AnimatePresence>
                        {activeDropdown === item.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 space-y-1"
                          >
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.label}
                                to={subItem.href}
                                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-primary"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <span className="mr-3 text-gray-400">{subItem.icon}</span>
                                {subItem.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className="block px-3 py-2 text-gray-700 hover:text-primary font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/app/dashboard"
                      className="flex items-center px-3 py-2 text-gray-700 hover:text-primary font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <BarChart3 size={18} className="mr-3" />
                      {t('nav.dashboard')}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center px-3 py-2 text-red-600 hover:text-red-700 font-medium"
                    >
                      <LogOut size={18} className="mr-3" />
                      {t('common.signOut')}
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 px-3">
                    <Link
                      to="/login"
                      className="block py-2 text-gray-700 hover:text-primary font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('common.signIn')}
                    </Link>
                    <Link
                      to="/register"
                      className="flex justify-center items-center py-2 bg-primary text-white rounded-md font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('common.getStarted')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotifications && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed top-16 right-0 w-full md:w-80 md:right-4 rounded-md border border-gray-200 bg-white shadow-lg z-20 md:hidden"
          >
            <div className="border-b border-gray-200 px-4 py-3">
              <h3 className="font-medium">{t('common.notifications')}</h3>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`rounded-md p-3 hover:bg-gray-50 ${notification.read ? '' : 'bg-blue-50'}`}
                >
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('common.ago')} {notification.time}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 p-2">
              <button 
                className="text-center w-full text-sm text-primary hover:text-primary-dark"
                onClick={() => setShowNotifications(false)}
              >
                Fermer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default MainNavbar;