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
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';
import './i18n';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <UserProvider>
          <ShopProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
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