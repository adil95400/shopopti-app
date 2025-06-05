import React from 'react';
import { motion } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';
import MainNavbar from '../components/layout/MainNavbar';
import Footer from '../components/layout/Footer';
import { ShoppingBag } from 'lucide-react';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 md:pr-8 mb-8 md:mb-0"
            >
              <div className="max-w-md mx-auto md:mx-0 md:ml-auto">
                <div className="text-center md:text-left mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">Welcome to Shopopti+</h1>
                  <p className="mt-3 text-lg text-gray-600">
                    Sign in to access your account and manage your online store.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="flex justify-center mb-6">
                    <div className="p-3 bg-primary-100 rounded-full">
                      <ShoppingBag className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-center">
                    <h3 className="text-lg font-medium">Optimize Your E-commerce</h3>
                    <p className="text-gray-600">
                      Access all your optimization tools, order management, and analytics in one place.
                    </p>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="flex -space-x-2">
                          <img 
                            src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                            alt="User" 
                            className="h-8 w-8 rounded-full border-2 border-white"
                          />
                          <img 
                            src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                            alt="User" 
                            className="h-8 w-8 rounded-full border-2 border-white"
                          />
                          <img 
                            src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                            alt="User" 
                            className="h-8 w-8 rounded-full border-2 border-white"
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          Joined by +10,000 e-commerce sellers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:w-1/2 md:pl-8"
            >
              <div className="max-w-md mx-auto">
                <LoginForm />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LoginPage;