import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../components/layout/Logo';
import { User, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import MainNavbar from '../components/layout/MainNavbar';
import RegisterForm from '../components/auth/RegisterForm';
import Footer from '../components/layout/Footer';

const Register: React.FC = () => {
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
                  <h1 className="text-3xl font-bold text-gray-900">Join Shopopti+ Today</h1>
                  <p className="mt-3 text-lg text-gray-600">
                    Create your account and start optimizing your e-commerce business with AI-powered tools.
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="space-y-4 text-center md:text-left">
                    <h3 className="text-lg font-medium">Why join Shopopti+?</h3>
                    
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
                          <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>AI-powered product optimization</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
                          <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>Bulk order processing and automation</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
                          <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>Multi-store management from one dashboard</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
                          <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>Advanced analytics and performance tracking</span>
                      </li>
                    </ul>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        "Shopopti+ has transformed my business. I've increased sales by 35% in just 3 months!"
                      </p>
                      <div className="flex items-center mt-2">
                        <img 
                          src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                          alt="User" 
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div className="ml-2">
                          <p className="text-sm font-medium">Thomas Martin</p>
                          <p className="text-xs text-gray-500">TechStyle Founder</p>
                        </div>
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
                <RegisterForm />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;