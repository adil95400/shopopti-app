import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { ShopProvider } from './contexts/ShopContext';
import { UserProvider } from './contexts/UserContext';
import { LanguageProvider } from './contexts/LanguageContext';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ChatbotWidget from './components/ChatbotWidget';
import SubscriptionBanner from './components/stripe/SubscriptionBanner';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import ImportProducts from './pages/ImportProducts';
import Analytics from './pages/Analytics';
import Reviews from './pages/Reviews';
import Suppliers from './pages/Suppliers';
import Settings from './pages/Settings';
import Support from './pages/Support';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import Subscription from './pages/Account/Subscription';

import BlogAIPage from './pages/blog-ai';
import SEOAIPage from './pages/seo-ai';
import TrackingPage from './pages/tracking';
import GenerateInvoice from './pages/generateInvoice';
import AutomationsPage from './pages/automations';
import MarketplaceB2B from './pages/marketplace-b2b';
import SeoAuditPage from './pages/SeoAudit';
import SeoCompetitorScore from './pages/seo-competitor';
import Dropshipping from './pages/Dropshipping';
import MultiChannel from './pages/MultiChannel';
import AiHub from './pages/AiHub';
import AdvancedAnalytics from './pages/AdvancedAnalytics';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <UserProvider>
          <ShopProvider>
            <SubscriptionBanner />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />

              {/* Pages IA et outils */}
              <Route path="/blog-ai" element={<BlogAIPage />} />
              <Route path="/seo-ai" element={<SEOAIPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="/generate-invoice" element={<GenerateInvoice />} />
              <Route path="/automations" element={<AutomationsPage />} />
              <Route path="/marketplace-b2b" element={<MarketplaceB2B />} />
              <Route path="/app/seo-audit" element={<SeoAuditPage />} />
              <Route path="/app/seo-competitor" element={<SeoCompetitorScore />} />
              <Route path="/dropshipping" element={<Dropshipping />} />
              <Route path="/multi-channel" element={<MultiChannel />} />
              <Route path="/ai-hub" element={<AiHub />} />
              <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />

              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/app/dashboard\" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="import-products" element={<ImportProducts />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="settings" element={<Settings />} />
                <Route path="support" element={<Support />} />
                <Route path="contact" element={<Contact />} />
                <Route path="subscription" element={<Subscription />} />
              </Route>
            </Routes>

            <Toaster position="top-right" expand={true} richColors />
            <ChatbotWidget />
          </ShopProvider>
        </UserProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;