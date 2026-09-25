// src/App.js

// === جميع الاستيرادات في الأعلى ===
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import './styles/global.css';

// === Lazy Loading (بعد الاستيرادات) ===
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

/**
 * المكون الرئيسي للتطبيق
 */
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* الصفحات العامة */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<CartPage />} />

              {/* صفحات المصادقة */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* الصفحات المحمية */}
              <Route path="/checkout" element={
                <ProtectedRoute><CheckoutPage /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><ProfilePage /></ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute><OrdersPage /></ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute><WishlistPage /></ProtectedRoute>
              } />

              {/* صفحة 404 */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;