// src/components/products/ProductSkeleton.jsx
import React from 'react';
import './ProductSkeleton.css';

/**
 * مكون شاشة التحميل (Skeleton)
 * يعرض مكان المنتجات أثناء التحميل مع تأثيرات حركية
 */
const ProductSkeleton = ({ 
  viewMode = 'grid', // 'grid' | 'list'
  count = 1,
  showRating = true,
  showCategory = true,
  showPrice = true,
  showButton = true,
  className = '',
  variant = 'default', // 'default' | 'card' | 'minimal'
  animation = true,
}) => {
  // توليد مصفوفة من العناصر الوهمية
  const renderSkeletons = () => {
    return Array.from({ length: count }).map((_, index) => (
      <div 
        key={index}
        className={`product-skeleton ${viewMode} ${variant} ${className} ${animation ? 'animate' : ''}`}
        style={{ animationDelay: `${(index % 6) * 80}ms` }}
        role="status"
        aria-label="جاري التحميل"
      >
        <div className="skeleton-container">
          {/* === صورة المنتج === */}
          <div className="skeleton-image-wrapper">
            <div className="skeleton-image shimmer"></div>
            {variant === 'card' && (
              <div className="skeleton-badge shimmer"></div>
            )}
          </div>

          {/* === معلومات المنتج === */}
          <div className="skeleton-content">
            {/* الفئة */}
            {showCategory && (
              <div className="skeleton-category shimmer"></div>
            )}

            {/* العنوان */}
            <div className="skeleton-title shimmer"></div>
            <div className="skeleton-title shimmer" style={{ width: '70%' }}></div>

            {/* التقييم */}
            {showRating && (
              <div className="skeleton-rating">
                <div className="skeleton-stars shimmer"></div>
                <div className="skeleton-rating-count shimmer"></div>
              </div>
            )}

            {/* الوصف (في وضع القائمة) */}
            {viewMode === 'list' && (
              <>
                <div className="skeleton-description shimmer"></div>
                <div className="skeleton-description shimmer" style={{ width: '80%' }}></div>
              </>
            )}

            {/* السعر والزر */}
            <div className="skeleton-footer">
              <div className="skeleton-price shimmer"></div>
              {showButton && (
                <div className="skeleton-button shimmer"></div>
              )}
            </div>

            {/* حالة التوفر (في وضع القائمة) */}
            {viewMode === 'list' && (
              <div className="skeleton-availability shimmer"></div>
            )}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className={`skeleton-wrapper ${viewMode}`}>
      {renderSkeletons()}
    </div>
  );
};

export default ProductSkeleton;