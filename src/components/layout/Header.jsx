// src/components/layout/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Header.css';

/**
 * مكون الرأس (Header) - نسخة متطورة من الـ Navbar
 * يحتوي على شعار، روابط، بحث، سلة، وملف المستخدم
 */
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, getCartCount, cartTotal } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // مراجع للقوائم المنسدلة
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const cartCount = getCartCount();
  const totalPrice = cartTotal;

  // تنسيق السعر
  const formattedTotal = new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'USD',
  }).format(totalPrice);

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

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // منع التمرير عند فتح القائمة
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // معالجة البحث
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // روابط التنقل
  const navLinks = [
    { path: '/', label: 'الرئيسية', icon: '🏠' },
    { path: '/products', label: 'المنتجات', icon: '📦' },
    { path: '/categories', label: 'الفئات', icon: '📂' },
    { path: '/about', label: 'عن المتجر', icon: 'ℹ️' },
  ];

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        {/* === الشعار === */}
        <Link to="/" className="header-logo">
          <span className="logo-icon">🛍️</span>
          <span className="logo-text">متجري</span>
          <span className="logo-badge">.com</span>
        </Link>

        {/* === روابط سطح المكتب === */}
        <nav className="header-nav desktop-nav">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                >
                  <span className="nav-icon">{link.icon}</span>
                  {link.label}
                  {isActive(link.path) && <span className="nav-indicator"></span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* === أدوات التحكم === */}
        <div className="header-actions">
          {/* زر البحث */}
          <div className="search-wrapper" ref={searchRef}>
            <button
              className="action-btn search-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="بحث"
            >
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>

            {/* شريط البحث المنسدل */}
            {isSearchOpen && (
              <div className="search-dropdown">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="ابحث عن منتج..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button type="submit">بحث</button>
                </form>
              </div>
            )}
          </div>

          {/* زر السلة مع عداد */}
          <Link to="/cart" className="action-btn cart-btn">
            <span className="cart-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
            {cartCount > 0 && (
              <span className="cart-total">{formattedTotal}</span>
            )}
          </Link>

          {/* زر الملف الشخصي */}
          <div className="user-menu-wrapper" ref={userMenuRef}>
            <button
              className="action-btn user-btn"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-label="الملف الشخصي"
            >
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </button>

            {/* قائمة المستخدم المنسدلة */}
            {isUserMenuOpen && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <span className="user-avatar">👤</span>
                  <div className="user-info">
                    <p className="user-name">زائر</p>
                    <p className="user-email">guest@example.com</p>
                  </div>
                </div>
                <ul className="user-dropdown-menu">
                  <li>
                    <Link to="/profile">
                      <span>👤</span> الملف الشخصي
                    </Link>
                  </li>
                  <li>
                    <Link to="/orders">
                      <span>📋</span> طلباتي
                    </Link>
                  </li>
                  <li>
                    <Link to="/wishlist">
                      <span>❤️</span> المفضلة
                    </Link>
                  </li>
                  <li className="dropdown-divider"></li>
                  <li>
                    <Link to="/login" className="login-link">
                      <span>🚪</span> تسجيل الدخول
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* زر القائمة المتنقلة (هامبورجر) */}
          <button
            className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="القائمة"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* === ملخص السلة المصغر === */}
      {cartCount > 0 && !isMenuOpen && (
        <div className="header-cart-summary">
          <div className="cart-summary-content">
            <span className="cart-summary-text">
              🛒 {cartCount} منتج{cartCount > 1 ? 'ات' : ''} في السلة
            </span>
            <span className="cart-summary-divider">|</span>
            <span className="cart-summary-total">{formattedTotal}</span>
            <Link to="/cart" className="cart-summary-link">
              عرض السلة →
            </Link>
          </div>
        </div>
      )}

      {/* === القائمة المتنقلة (Mobile Menu) === */}
      {isMenuOpen && (
        <div className="mobile-overlay">
          <div className="mobile-menu" ref={menuRef}>
            <div className="mobile-menu-header">
              <span className="mobile-menu-title">القائمة</span>
              <button
                className="mobile-menu-close"
                onClick={() => setIsMenuOpen(false)}
              >
                ✕
              </button>
            </div>

            <ul className="mobile-menu-links">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`mobile-link ${isActive(link.path) ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{link.icon}</span> {link.label}
                    {isActive(link.path) && <span className="mobile-link-indicator">●</span>}
                  </Link>
                </li>
              ))}
              <li className="mobile-divider"></li>
              <li>
                <Link
                  to="/cart"
                  className="mobile-link mobile-cart-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>🛒</span> السلة
                  {cartCount > 0 && (
                    <span className="mobile-cart-badge">{cartCount}</span>
                  )}
                </Link>
              </li>
            </ul>

            <div className="mobile-menu-footer">
              {cartCount > 0 && (
                <p className="mobile-total">
                  إجمالي السلة: {formattedTotal}
                </p>
              )}
              <Link
                to="/login"
                className="mobile-login-btn"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>👤</span> تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;