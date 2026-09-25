// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // روابط سريعة
  const quickLinks = [
    { path: '/', label: 'الرئيسية' },
    { path: '/products', label: 'جميع المنتجات' },
    { path: '/categories', label: 'الفئات' },
    { path: '/about', label: 'عن المتجر' },
  ];

  // روابط خدمة العملاء
  const customerLinks = [
    { path: '/faq', label: 'الأسئلة الشائعة' },
    { path: '/shipping', label: 'الشحن والتوصيل' },
    { path: '/returns', label: 'الاستبدال والإرجاع' },
    { path: '/contact', label: 'اتصل بنا' },
  ];

  // روابط حسابي
  const accountLinks = [
    { path: '/profile', label: 'الملف الشخصي' },
    { path: '/orders', label: 'طلباتي' },
    { path: '/wishlist', label: 'قائمة الرغبات' },
    { path: '/login', label: 'تسجيل الدخول' },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* === العمود الأول: عن المتجر === */}
        <div className="footer-section footer-about">
          <h3 className="footer-title">
            <span className="footer-logo">🛍️</span> متجري
          </h3>
          <p className="footer-description">
            متجر إلكتروني عصري يوفر أفضل المنتجات الرقمية بأفضل الأسعار. 
            نسعى لتقديم تجربة تسوق مميزة لعملائنا الكرام.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Twitter" className="social-link twitter">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="social-link instagram">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 7.787a4.213 4.213 0 100 8.426 4.213 4.213 0 000-8.426zm0 6.947a2.733 2.733 0 110-5.466 2.733 2.733 0 010 5.466zm5.394-6.642a.985.985 0 11-1.97 0 .985.985 0 011.97 0z"/>
              </svg>
            </a>
            <a href="#" aria-label="YouTube" className="social-link youtube">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="#" aria-label="GitHub" className="social-link github">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.399 1.02 0 2.04.132 3 .399 2.292-1.552 3.3-1.23 3.3-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.694.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>
          </div>
        </div>

        {/* === العمود الثاني: روابط سريعة === */}
        <div className="footer-section">
          <h4 className="footer-heading">روابط سريعة</h4>
          <ul className="footer-links">
            {quickLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* === العمود الثالث: خدمة العملاء === */}
        <div className="footer-section">
          <h4 className="footer-heading">خدمة العملاء</h4>
          <ul className="footer-links">
            {customerLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* === العمود الرابع: حسابي === */}
        <div className="footer-section">
          <h4 className="footer-heading">حسابي</h4>
          <ul className="footer-links">
            {accountLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* === العمود الخامس: معلومات الاتصال === */}
        <div className="footer-section footer-contact-section">
          <h4 className="footer-heading">معلومات الاتصال</h4>
          <ul className="footer-contact">
            <li>
              <span className="contact-icon">📧</span>
              <span>info@mystore.com</span>
            </li>
            <li>
              <span className="contact-icon">📱</span>
              <span>+966 50 000 0000</span>
            </li>
            <li>
              <span className="contact-icon">📍</span>
              <span>الرياض، المملكة العربية السعودية</span>
            </li>
            <li>
              <span className="contact-icon">🕐</span>
              <span>السبت - الخميس: 9ص - 9م</span>
            </li>
          </ul>
        </div>
      </div>

      {/* === الحقوق المحفوظة === */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <div className="footer-bottom-left">
            <p className="footer-copyright">
              © {currentYear} <strong>متجري</strong>. جميع الحقوق محفوظة.
            </p>
            <div className="footer-legal">
              <Link to="/privacy">سياسة الخصوصية</Link>
              <span className="legal-divider">|</span>
              <Link to="/terms">شروط الاستخدام</Link>
            </div>
          </div>
          <div className="footer-bottom-right">
            <div className="footer-payment">
              <span className="payment-icon" title="Visa">💳</span>
              <span className="payment-icon" title="Mastercard">💳</span>
              <span className="payment-icon" title="PayPal">💳</span>
              <span className="payment-icon" title="Apple Pay">📱</span>
              <span className="payment-icon" title="Secure">🔒</span>
            </div>
            <p className="footer-secure">🛡️ دفع آمن 100%</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;