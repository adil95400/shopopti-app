import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to="/">
      <motion.div 
        className="flex items-center space-x-2"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-600 shadow-lg">
          <ShoppingBag className="h-6 w-6 text-white" />
        </div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-900">Shopopti</span>
          <span className="text-2xl font-bold text-primary">+</span>
        </div>
      </motion.div>
    </Link>
  );
};

export default Logo;