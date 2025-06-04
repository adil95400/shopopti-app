import React, { useState } from 'react';
import { Menu, Bell, ChevronDown, Search, Settings, LogOut, CreditCard, User, HelpCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import LanguageSelector from '../LanguageSelector';
import Logo from './Logo';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Dans une application réelle, récupérez les données utilisateur depuis Supabase
        setUserProfile({
          name: 'Utilisateur Shopopti+',
          email: session.user.email,
          plan: 'pro'
        });
      }
    };
    
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const notifications = [
    {
      id: 1,
      title: 'Nouvelle commande reçue',
      message: 'Commande #2345 - 129.99€',
      time: '10 minutes',
      read: false
    },
    {
      id: 2,
      title: 'Stock faible',
      message: 'Le produit "Écouteurs sans fil" a un stock faible (3 restants)',
      time: '1 heure',
      read: true
    },
    {
      id: 3,
      title: 'Mise à jour disponible',
      message: 'Une nouvelle version de Shopopti+ est disponible',
      time: '3 heures',
      read: true
    }
  ];

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm z-10">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden lg:block ml-4">
            <Logo />
          </div>
          
          <div className="hidden md:flex md:w-72 relative ml-4">
            <div className="relative w-full">
              <Search 
                size={18} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSelector />
          
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
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto p-2">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`rounded-md p-3 hover:bg-gray-50 ${notification.read ? '' : 'bg-blue-50'}`}
                      >
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-gray-500">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">Il y a {notification.time}</p>
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
                      Paramètres
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
                      Déconnexion
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;