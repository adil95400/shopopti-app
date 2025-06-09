import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Providers
import { ShopProvider } from './contexts/ShopContext';
import { UserProvider } from './contexts/UserContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { RoleProvider } from './context/RoleContext';

// Layouts
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Components
import ChatbotWidget from './components/ChatbotWidget';
import SubscriptionBanner from './components/stripe/SubscriptionBanner';

// Public pages
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import Documentation from './pages/Documentation';
import FaqPage from './pages/faq';
import HelpCenterPage from './pages/help-center';

// Auth pages
import AuthCallback from './pages/auth/AuthCallback';

// AI and tools pages
import BlogAIPage from './pages/blog-ai';
import SEOAIPage from './pages/seo-ai';
import TrackingPage from './pages/tracking';
import GenerateInvoice from './pages/generateInvoice';
import AutomationsPage from './pages/automations';
import MarketplaceB2B from './pages/marketplace-b2b';
import SeoAuditPage from './pages/SeoAudit';
import SeoCompetitorPage from './pages/seo-competitor';
import Dropshipping from './pages/Dropshipping';
import MultiChannel from './pages/MultiChannel';
import MultiChannelIntegrations from './pages/MultiChannelIntegrations';
import AiHub from './pages/AiHub';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import Integrations from './pages/Integrations';
import Webhooks from './pages/Webhooks';
import InternationalSelling from './pages/InternationalSelling';
import CustomReports from './pages/CustomReports';
import MarketingHub from './pages/MarketingHub';
import GlobalMarketplaces from './pages/GlobalMarketplaces';
import AdvancedSuppliers from './pages/AdvancedSuppliers';
import WinningProducts from './pages/WinningProducts';

// Dashboard pages
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
import Subscription from './pages/Account/Subscription';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import UsersAdmin from './pages/admin/Users';
import AdminAnalytics from './pages/admin/Analytics';
import Imports from './pages/admin/Imports';

// Missing modules pages
import RepricingPage from './pages/repricing';
import InventoryPage from './pages/inventory';
import ChatSupportPage from './pages/chat-support';
import ReturnsPage from './pages/returns';
import AccountingPage from './pages/accounting';
import FunnelsPage from './pages/funnels';
import TemplatesPage from './pages/templates';
import ABTestingPage from './pages/ab-testing';

const AppRoutes = () => {
  return (
    <HashRouter>
      <LanguageProvider>
        <CurrencyProvider>
          <UserProvider>
            <RoleProvider>
              <ShopProvider>
              <SubscriptionBanner />
              <Routes>
                {/* Public pages */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/success" element={<Success />} />
                <Route path="/cancel" element={<Cancel />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/documentation/:category/:article" element={<Documentation />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/help-center" element={<HelpCenterPage />} />

                {/* Auth callback */}
                <Route path="/auth/callback" element={<AuthCallback />} />

                {/* AI and tools pages accessible without login */}
                <Route path="/blog-ai" element={<BlogAIPage />} />
                <Route path="/seo-ai" element={<SEOAIPage />} />
                <Route path="/tracking" element={<TrackingPage />} />
                <Route path="/generate-invoice" element={<GenerateInvoice />} />
                <Route path="/marketplace-b2b" element={<MarketplaceB2B />} />

                {/* Protected pages (require login) */}
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
                  <Route path="automations" element={<AutomationsPage />} />
                  <Route path="winning-products" element={<WinningProducts />} />
                  
                  {/* Advanced modules */}
                  <Route path="seo-audit" element={<SeoAuditPage />} />
                  <Route path="seo-competitor" element={<SeoCompetitorPage />} />
                  <Route path="dropshipping" element={<Dropshipping />} />
                  <Route path="multi-channel" element={<MultiChannel />} />
                  <Route path="ai-hub" element={<AiHub />} />
                  <Route path="advanced-analytics" element={<AdvancedAnalytics />} />
                  <Route path="integrations" element={<Integrations />} />
                  <Route
                    path="multi-channel-integrations"
                    element={<MultiChannelIntegrations />}
                  />
                  <Route path="webhooks" element={<Webhooks />} />
                  <Route path="international-selling" element={<InternationalSelling />} />
                  <Route path="custom-reports" element={<CustomReports />} />
                  <Route path="marketing-hub" element={<MarketingHub />} />
                  <Route path="global-marketplaces" element={<GlobalMarketplaces />} />
                  <Route path="advanced-suppliers" element={<AdvancedSuppliers />} />
                  
                  {/* Missing modules */}
                  <Route path="repricing" element={<RepricingPage />} />
                  <Route path="inventory" element={<InventoryPage />} />
                  <Route path="chat-support" element={<ChatSupportPage />} />
                  <Route path="returns" element={<ReturnsPage />} />
                  <Route path="accounting" element={<AccountingPage />} />
                  <Route path="funnels" element={<FunnelsPage />} />
                  <Route path="templates" element={<TemplatesPage />} />
                  <Route path="ab-testing" element={<ABTestingPage />} />
                  
                  {/* Admin routes */}
                  <Route path="admin">
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<UsersAdmin />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="imports" element={<Imports />} />
                  </Route>
                </Route>
                
                {/* Default redirect */}
                <Route path="*" element={<Navigate to="/\" replace />} />
              </Routes>
              
              <Toaster position="top-right" expand={true} richColors />
              <ChatbotWidget />
            </ShopProvider>
          </RoleProvider>
        </UserProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </HashRouter>
  );
};

export default AppRoutes;