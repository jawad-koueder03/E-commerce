// src/components/products/ProductEmpty.jsx
import React from 'react';
import './ProductEmpty.css';

/**
 * مكون عرض حالة عدم وجود منتجات
 * يعرض رسالة مع خيارات لإعادة تعيين الفلاتر أو العودة
 */
const ProductEmpty = ({ 
  message = 'لم نجد أي منتجات تطابق معايير البحث الخاصة بك',
  title = 'لا توجد منتجات',
  icon = '🔍',
  onReset,
  onBack,
  resetText = 'إعادة تعيين الفلاتر',
  backText = 'العودة للرئيسية',
  showReset = true,
  showBack = true,
  variant = 'default', // 'default' | 'compact' | 'minimal'
  className = '',
  children
}) => {
  // أيقونات مختلفة للحالات
  const getIcon = () => {
    switch (icon) {
      case 'search':
        return '🔍';
      case 'filter':
        return '🔎';
      case 'cart':
        return '🛒';
      case 'error':
        return '❌';
      case 'empty':
        return '📭';
      case 'wishlist':
        return '💔';
      default:
        return icon;
    }
  };

  // رسائل مختلفة للحالات
  const getDefaultMessages = () => {
    switch (icon) {
      case 'search':
        return {
          title: 'لا توجد نتائج بحث',
          message: 'لم نجد أي منتجات تطابق كلمة البحث الخاصة بك. حاول استخدام كلمات أخرى.'
        };
      case 'filter':
        return {
          title: 'لا توجد منتجات بهذه الفلاتر',
          message: 'لم نجد أي منتجات تطابق معايير التصفية المحددة. حاول تعديل الفلاتر.'
        };
      case 'cart':
        return {
          title: 'سلة التسوق فارغة',
          message: 'لم تقم بإضافة أي منتجات إلى السلة بعد. استكشف منتجاتنا وابدأ التسوق!'
        };
      case 'wishlist':
        return {
          title: 'قائمة الرغبات فارغة',
          message: 'لم تقم بإضافة أي منتجات إلى قائمة الرغبات بعد. ابدأ بإضافة المنتجات التي تعجبك!'
        };
      default:
        return { title, message };
    }
  };

  const defaultMessages = getDefaultMessages();
  const displayTitle = title || defaultMessages.title;
  const displayMessage = message || defaultMessages.message;
  const displayIcon = getIcon();

  return (
    <div className={`product-empty ${variant} ${className}`}>
      <div className="empty-container">
        {/* === الأيقونة === */}
        <div className="empty-icon-wrapper">
          <span className="empty-icon">{displayIcon}</span>
          {variant !== 'minimal' && (
            <div className="empty-icon-ring"></div>
          )}
        </div>

        {/* === المحتوى === */}
        <div className="empty-content">
          <h3 className="empty-title">{displayTitle}</h3>
          <p className="empty-message">{displayMessage}</p>
          
          {/* محتوى مخصص */}
          {children && (
            <div className="empty-children">
              {children}
            </div>
          )}

          {/* === الأزرار === */}
          <div className="empty-actions">
            {showReset && onReset && (
              <button 
                className="empty-btn btn-reset"
                onClick={onReset}
                aria-label={resetText}
              >
                <span className="btn-icon">🔄</span>
                {resetText}
              </button>
            )}

            {showBack && onBack && (
              <button 
                className="empty-btn btn-back"
                onClick={onBack}
                aria-label={backText}
              >
                <span className="btn-icon">🏠</span>
                {backText}
              </button>
            )}

            {!showReset && !showBack && !children && (
              <button 
                className="empty-btn btn-primary"
                onClick={() => window.location.reload()}
                aria-label="إعادة المحاولة"
              >
                <span className="btn-icon">🔄</span>
                إعادة المحاولة
              </button>
            )}
          </div>
        </div>

        {/* === زخارف خلفية === */}
        {variant !== 'minimal' && (
          <>
            <div className="empty-decoration decoration-1"></div>
            <div className="empty-decoration decoration-2"></div>
            <div className="empty-decoration decoration-3"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductEmpty;