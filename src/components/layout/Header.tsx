import React, { useState } from 'react';
import { Menu, Bell, ChevronDown, Search, Settings, LogOut } from 'lucide-react';
import { useUserContext } from '../../contexts/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSelector from '../LanguageSelector';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useUserContext();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-accent-200/10 bg-secondary-500 shadow-sm z-10">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center md:hidden">
          <button className="rounded-md p-2 text-accent-200 hover:text-white">
            <Menu size={24} />
          </button>
        </div>
        
        <div className="hidden md:flex md:w-72 relative">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Rechercher..."
              className="input w-full pl-10"
            />
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-400" 
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <LanguageSelector />
          
          <motion.div 
            className="relative"
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="rounded-full p-2 text-accent-200 hover:text-white relative"
            >
              <Bell size={20} />
              <motion.span 
                className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-primary-400" 
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
                  className="absolute right-0 top-full mt-1 w-80 rounded-md border border-accent-200/10 bg-secondary-400 shadow-lg z-20"
                >
                  <div className="border-b border-accent-200/10 px-4 py-3">
                    <h3 className="font-medium text-white">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto p-2">
                    <div className="rounded-md p-3 hover:bg-secondary-500">
                      <p className="text-sm font-medium text-white">Nouvelle commande reçue</p>
                      <p className="text-xs text-accent-200">Il y a 10 minutes</p>
                    </div>
                    <div className="rounded-md p-3 hover:bg-secondary-500">
                      <p className="text-sm font-medium text-white">Stock faible</p>
                      <p className="text-xs text-accent-200">Il y a 1 heure</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 rounded-md p-1 text-sm transition hover:bg-secondary-400"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-400 bg-opacity-10 text-primary-400">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <ChevronDown size={16} className="text-accent-400" />
            </button>
            
            <AnimatePresence>
              {showUserMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-1 w-56 rounded-md border border-accent-200/10 bg-secondary-400 shadow-lg z-20"
                >
                  <div className="border-b border-accent-200/10 px-4 py-3">
                    <p className="text-sm font-medium text-white">{user?.name || 'Utilisateur'}</p>
                    <p className="text-xs text-accent-200">{user?.email || 'user@example.com'}</p>
                  </div>
                  <div className="p-2">
                    <button onClick={() => navigate('/app/settings')} className="flex w-full items-center rounded-md px-4 py-2 text-sm text-accent-200 hover:bg-secondary-500 hover:text-white">
                      <Settings size={16} className="mr-2" />
                      Paramètres
                    </button>
                    <button onClick={handleLogout} className="flex w-full items-center rounded-md px-4 py-2 text-sm text-error-400 hover:bg-secondary-500">
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