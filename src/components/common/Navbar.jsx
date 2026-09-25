// src/components/common/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from './Button';
import './Navbar.css';

const Navbar = () => {
  const { cart } = useCart();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef(null);
  const searchRef = useRef(null);

  // حساب عدد العناصر في السلة
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  // حساب المجموع الكلي
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // تنسيق السعر
  const formattedTotal = new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'USD',
  }).format(cartTotal);

  // تحديد الصفحة النشطة
  const isActive = (path) => location.pathname === path;

  // تأثير التمرير
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // إغلاق القائمة المتنقلة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // إغلاق البحث عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // منع التمرير عند فتح القائمة المتنقلة
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // يمكن توجيه المستخدم إلى صفحة البحث
      console.log('البحث عن:', searchQuery);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* === الشعار === */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🛍️</span>
          <span className="logo-text">متجري</span>
          <span className="logo-dot">.</span>
        </Link>

        {/* === الروابط الرئيسية (Desktop) === */}
        <ul className="navbar-links">
          <li>
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              الرئيسية
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className={`nav-link ${isActive('/products') ? 'active' : ''}`}
            >
              المنتجات
            </Link>
          </li>
          <li>
            <Link
              to="/categories"
              className={`nav-link ${isActive('/categories') ? 'active' : ''}`}
            >
              الفئات
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            >
              عن المتجر
            </Link>
          </li>
        </ul>

        {/* === أدوات التحكم (يمين) === */}
        <div className="navbar-actions">
          {/* زر البحث */}
          <div className="search-wrapper" ref={searchRef}>
            <button
              className="action-btn search-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="بحث"
            >
              🔍
            </button>
            
            {/* شريط البحث المنسدل */}
            {isSearchOpen && (
              <form className="search-dropdown" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit">بحث</button>
              </form>
            )}
          </div>

          {/* زر السلة */}
          <Link to="/cart" className="action-btn cart-btn">
            <span className="cart-icon">🛒</span>
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </Link>

          {/* زر تسجيل الدخول (Desktop) */}
          <Button
            variant="outline"
            size="small"
            className="login-btn-desktop"
          >
            تسجيل الدخول
          </Button>

          {/* زر القائمة المتنقلة */}
          <button
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="القائمة"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* === ملخص السلة المصغر (يظهر عند وجود منتجات) === */}
      {cartItemsCount > 0 && !isMobileMenuOpen && (
        <div className="navbar-cart-summary">
          <span className="cart-summary-items">
            {cartItemsCount} منتج{cartItemsCount > 1 ? 'ات' : ''}
          </span>
          <span className="cart-summary-total">{formattedTotal}</span>
          <Link to="/cart" className="cart-summary-link">
            عرض السلة →
          </Link>
        </div>
      )}

      {/* === القائمة المتنقلة (Mobile Menu) === */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu" ref={mobileMenuRef}>
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">القائمة</span>
              <button
                className="mobile-menu-close"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ✕
              </button>
            </div>

            <ul className="mobile-menu-links">
              <li>
                <Link
                  to="/"
                  className={`mobile-link ${isActive('/') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>🏠</span> الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className={`mobile-link ${isActive('/products') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>📦</span> المنتجات
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className={`mobile-link ${isActive('/categories') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>📂</span> الفئات
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`mobile-link ${isActive('/about') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>ℹ️</span> عن المتجر
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className={`mobile-link ${isActive('/cart') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>🛒</span> السلة
                  {cartItemsCount > 0 && (
                    <span className="mobile-cart-badge">{cartItemsCount}</span>
                  )}
                </Link>
              </li>
            </ul>

            <div className="mobile-menu-footer">
              <Button variant="primary" fullWidth>
                تسجيل الدخول
              </Button>
              <p className="mobile-menu-total">
                إجمالي السلة: {formattedTotal}
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;