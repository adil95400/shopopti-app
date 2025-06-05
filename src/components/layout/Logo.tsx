import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'white';
}

const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'default' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg'
  };

  const textColor = variant === 'white' ? 'text-white' : 'text-gray-900';
  const accentColor = variant === 'white' ? 'text-white' : 'text-primary';

  return (
    <Link to="/">
      <motion.div 
        className={`flex items-center space-x-2`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className={`flex ${sizeClasses[size]} items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-600 shadow-lg`}>
          <ShoppingBag className="h-6 w-6 text-white" />
        </div>
        <div className="flex items-baseline">
          <span className={`text-2xl font-bold ${textColor}`}>Shopopti</span>
          <span className={`text-2xl font-bold ${accentColor}`}>+</span>
        </div>
      </motion.div>
    </Link>
  );
};

export default Logo;