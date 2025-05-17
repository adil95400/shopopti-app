
import Assistant from './pages/Assistant';
import AIProducts from './pages/AIProducts';
import ChromeExtension from './pages/ChromeExtension';
import MultichannelPublish from './pages/MultichannelPublish';
import MobileApp from './pages/MobileApp';
import BlogGenerator from './pages/BlogGenerator';
import Onboarding from './pages/Onboarding';
import Help from './pages/Help';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ShopProvider } from './contexts/ShopContext';
import { UserProvider } from './contexts/UserContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Orders from './pages/Orders';
import WinningProducts from './pages/WinningProducts';
import Analytics from './pages/Analytics';
import StoreConnection from './pages/StoreConnection';
import Reviews from './pages/Reviews';
import Automation from './pages/Automation';
import Logistics from './pages/Logistics';
import Suppliers from './pages/Suppliers';
import Channels from './pages/Channels';
import ImportProducts from './pages/ImportProducts';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Appearance from './pages/Appearance';
import Language from './pages/Language';
import Documentation from './pages/Documentation';
import Support from './pages/Support';
import Tutorials from './pages/Tutorials';
import Contact from './pages/Contact';
import Customers from './pages/Customers';
import Payments from './pages/Payments';
import HowItWorks from './pages/HowItWorks';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Affiliates from './pages/Affiliates';
import Academy from './pages/Academy';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import Glossary from './pages/Glossary';
import Statistics from './pages/Statistics';
import Integrations from './pages/Integrations';
import Pricing from './pages/Pricing';
import Compare from './pages/Compare';
import './App.css';
import './i18n';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <UserProvider>
          <ShopProvider>
            <Routes>
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/ai-products" element={<AIProducts />} />
        <Route path="/chrome-extension" element={<ChromeExtension />} />
        <Route path="/multichannel-publish" element={<MultichannelPublish />} />
        <Route path="/mobile-app" element={<MobileApp />} />
        <Route path="/blog-generator" element={<BlogGenerator />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/help" element={<Help />} />
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/affiliates" element={<Affiliates />} />
              <Route path="/academy" element={<Academy />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/glossary" element={<Glossary />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/compare/*" element={<Compare />} />
              
              <Route path="/app" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="import-products" element={<ImportProducts />} />
                <Route path="orders" element={<Orders />} />
                <Route path="winning-products" element={<WinningProducts />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="store-connection" element={<StoreConnection />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="automation" element={<Automation />} />
                <Route path="logistics" element={<Logistics />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="channels" element={<Channels />} />
                <Route path="customers" element={<Customers />} />
                <Route path="payments" element={<Payments />} />
                <Route path="settings" element={<Settings />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="appearance" element={<Appearance />} />
                <Route path="language" element={<Language />} />
                <Route path="documentation" element={<Documentation />} />
                <Route path="support" element={<Support />} />
                <Route path="tutorials" element={<Tutorials />} />
                <Route path="contact" element={<Contact />} />
              </Route>
            </Routes>
            <Toaster position="top-right" expand={true} richColors />
          </ShopProvider>
        </UserProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;