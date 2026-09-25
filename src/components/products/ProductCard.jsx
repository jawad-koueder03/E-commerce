// src/components/products/ProductCard.jsx
import React, { useState, useMemo ,useCallback} from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from '../common/Button';
import './ProductCard.css';

/**
 * مكون بطاقة المنتج
 * يعرض معلومات المنتج مع خيارات التفاعل
 */

const ProductCard = ({ 
  product, 
  viewMode = 'grid', 
  onClick, 
  animationDelay = 0,
  showQuickView = true,
  showAddToCart = true,
  showRating = true,
  showCategory = true,
  showBadge = true,
}) => {
  const { addToCart, cart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // التحقق إذا كان المنتج في السلة
  const isInCart = useMemo(() => {
    return cart.some(item => item.id === product.id);
  }, [cart, product.id]);

  // حساب التقييم
  const rating = product.rating?.rate || 0;
  const ratingCount = product.rating?.count || 0;
  const fullStars = Math.round(rating);
  const hasRating = rating > 0;

  // حساب الخصم (محاكاة)
  const discount = useMemo(() => {
    if (product.price > 100) return Math.floor(Math.random() * 20) + 10;
    if (product.price > 50) return Math.floor(Math.random() * 10) + 5;
    return 0;
  }, [product.price]);

  const originalPrice = useMemo(() => {
    if (discount > 0) {
      return product.price / (1 - discount / 100);
    }
    return null;
  }, [product.price, discount]);

  // تنسيق السعر
  const formattedPrice = new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(product.price);

  const formattedOriginalPrice = originalPrice ? new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(originalPrice) : null;

  // معالجة الإضافة للسلة
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  // معالجة النقر على البطاقة
  const handleCardClick = () => {
    if (onClick) {
      onClick(product.id);
    }
  };

  // توليد نجوم التقييم
  const renderStars = () => {
    return Array(5).fill().map((_, i) => (
      <span 
        key={i} 
        className={`star ${i < fullStars ? 'filled' : ''}`}
        aria-hidden="true"
      >
        {i < fullStars ? '★' : '☆'}
      </span>
    ));
  };

  // اختصار النص
  const truncateText = (text, maxLength = 60) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div 
      className={`product-card ${viewMode} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      style={{ animationDelay: `${animationDelay}ms` }}
      role="article"
      aria-label={product.title}
    >
      <Link to={`/product/${product.id}`} className="product-link" aria-label={`عرض تفاصيل ${product.title}`}>
        {/* === قسم الصورة === */}
        <div className="product-image-wrapper">
          {/* صورة المنتج */}
          <div className="product-image-container">
            {!isImageLoaded && (
              <div className="image-placeholder shimmer"></div>
            )}
            <img 
              src={product.image} 
              alt={product.title} 
              className={`product-image ${isImageLoaded ? 'loaded' : ''}`}
              loading="lazy"
              onLoad={() => setIsImageLoaded(true)}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
              }}
            />
          </div>
          
          {/* شارة الخصم */}
          {showBadge && discount > 0 && (
            <span className="product-badge discount-badge">
              -{discount}%
            </span>
          )}

          {/* شارة المنتج الجديد (محاكاة) */}
          {showBadge && product.id % 3 === 0 && (
            <span className="product-badge new-badge">
              جديد
            </span>
          )}

          {/* شارة التقييم السريع */}
          {showRating && hasRating && viewMode === 'grid' && (
            <span className="product-rating-badge">
              ⭐ {rating.toFixed(1)}
            </span>
          )}

          {/* شارة السلة (في وضع الشبكة) */}
          {isInCart && viewMode === 'grid' && (
            <span className="product-cart-badge">
              ✅ في السلة
            </span>
          )}

          {/* تراكب عند التمرير (في وضع الشبكة) */}
          {viewMode === 'grid' && isHovered && (
            <div className="product-overlay">
              <div className="overlay-actions">
                {showQuickView && (
                  <button 
                    className="overlay-btn quick-view"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // فتح نافذة سريعة للمنتج
                    }}
                    aria-label="معاينة سريعة"
                  >
                    <span className="btn-icon">👁️</span>
                    معاينة
                  </button>
                )}
                
                {showAddToCart && (
                  <Button 
                    variant={isInCart ? 'success' : 'primary'}
                    size="small"
                    onClick={handleAddToCart}
                    className="overlay-add-btn"
                  >
                    {isInCart ? '✅ أضيفت' : '🛒 أضف للسلة'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* === معلومات المنتج === */}
        <div className="product-info">
          {/* الفئة */}
          {showCategory && product.category && (
            <span className="product-category">{product.category}</span>
          )}

          {/* العنوان */}
          <h3 className="product-title">
            {truncateText(product.title, viewMode === 'grid' ? 40 : 80)}
          </h3>

          {/* الوصف المختصر (في وضع القائمة فقط) */}
          {viewMode === 'list' && product.description && (
            <p className="product-description">
              {truncateText(product.description, 120)}
            </p>
          )}

          {/* التقييم بالنجوم */}
          {showRating && (
            <div className="product-rating">
              <div className="stars" role="img" aria-label={`تقييم ${rating} من 5`}>
                {renderStars()}
              </div>
              {hasRating && (
                <span className="rating-count">({ratingCount})</span>
              )}
            </div>
          )}

          {/* السعر */}
          <div className="product-footer">
            <div className="product-pricing">
              <span className="product-price">
                {formattedPrice}
              </span>
              {formattedOriginalPrice && (
                <span className="product-original-price">
                  {formattedOriginalPrice}
                </span>
              )}
            </div>

            {/* زر الإضافة (في وضع القائمة) */}
            {viewMode === 'list' && showAddToCart && (
              <Button 
                variant={isInCart ? 'success' : 'primary'}
                size="medium"
                onClick={handleAddToCart}
                className="list-add-btn"
              >
                {isInCart ? '✅ في السلة' : '🛒 أضف للسلة'}
              </Button>
            )}
          </div>

          {/* حالة التوفر (في وضع القائمة) */}
          {viewMode === 'list' && (
            <div className="product-availability">
              <span className={`availability-badge ${product.id % 3 === 0 ? 'out-of-stock' : 'in-stock'}`}>
                {product.id % 3 === 0 ? '❌ غير متوفر' : '✅ متوفر'}
              </span>
            </div>
          )}

          {/* أيقونات إضافية (في وضع القائمة) */}
          {viewMode === 'list' && (
            <div className="product-extra-actions">
              <button 
                className="extra-action"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // إضافة إلى المفضلة
                }}
                aria-label="إضافة إلى المفضلة"
              >
                ❤️
              </button>
              <button 
                className="extra-action"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // مشاركة المنتج
                }}
                aria-label="مشاركة المنتج"
              >
                📤
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* إشعار الإضافة للسلة */}
      {showNotification && (
        <div className="product-notification">
          <span className="notification-icon">✅</span>
          <span className="notification-text">
            تمت إضافة <strong>{truncateText(product.title, 20)}</strong> إلى السلة
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductCard;