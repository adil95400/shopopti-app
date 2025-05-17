import React, { useLayoutEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion } from 'framer-motion';
import { useShopContext } from '../../contexts/ShopContext';

const Layout: React.FC = () => {
  const { isConnected } = useShopContext();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!isConnected) {
      navigate('/app/store-connection');
    }
  }, [isConnected, navigate]);

  return (
    <div className="flex h-screen overflow-hidden bg-secondary-400">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-7xl"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
