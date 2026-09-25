// src/components/layout/Layout.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from './Footer';
import './Layout.css';

/**
 * مكون التخطيط الرئيسي
 * يغلف جميع الصفحات مع Navbar و Footer
 * يوفر هيكلاً موحداً للتطبيق
 */
const Layout = ({ children }) => {
  const location = useLocation();
  
  // الصفحات التي لا تظهر فيها الـ Navbar و Footer
  const hideNavbarFooter = ['/login', '/register', '/checkout', '/payment'].includes(location.pathname);
  
  // الصفحات التي تكون بخلفية مختلفة
  const isHomePage = location.pathname === '/';
  const isProductPage = location.pathname.includes('/product/');
  const isCartPage = location.pathname === '/cart';
  
  // التمرير إلى أعلى الصفحة عند تغيير المسار
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // تحديد الكلاسات المناسبة
  const layoutClasses = [
    'layout',
    isHomePage ? 'layout-home' : '',
    isProductPage ? 'layout-product' : '',
    isCartPage ? 'layout-cart' : '',
    hideNavbarFooter ? 'layout-auth' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClasses}>
      {/* عرض Navbar إلا إذا كانت الصفحة مستثناة */}
      {!hideNavbarFooter && <Navbar />}
      
      {/* المحتوى الرئيسي */}
      <main className={`layout-main ${hideNavbarFooter ? 'layout-main-full' : ''}`}>
        {children}
      </main>
      
      {/* عرض Footer إلا إذا كانت الصفحة مستثناة */}
      {!hideNavbarFooter && <Footer />}
      
      {/* زر العودة للأعلى (يظهر عند التمرير) */}
      <ScrollToTop />
    </div>
  );
};

// === مكون زر العودة للأعلى ===
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="العودة للأعلى"
    >
      <span>⬆</span>
    </button>
  );
};

export default Layout;