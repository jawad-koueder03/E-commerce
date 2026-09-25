// src/components/common/Card.jsx
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Button from './Button';
import './Card.css';

/**
 * مكون بطاقة المنتج
 * @param {object} product - بيانات المنتج
 * @param {string} product.id - معرف المنتج
 * @param {string} product.title - عنوان المنتج
 * @param {number} product.price - سعر المنتج
 * @param {string} product.image - رابط الصورة
 * @param {string} product.description - وصف المنتج
 * @param {string} product.category - فئة المنتج
 * @param {number} product.rating - تقييم المنتج
 */
const Card = ({ product }) => {
  const { dispatch } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // تنسيق السعر
  const formattedPrice = new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  // إضافة المنتج إلى السلة
  const addToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
      },
    });

    // إظهار إشعار مؤقت
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 1500);
  };

  // اختصار النص إذا كان طويلاً
  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div
      className={`card ${isHovered ? 'card-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* شارة التقييم (اختياري) */}
      {product.rating && (
        <div className="card-badge">
          ⭐ {product.rating.rate || product.rating}
        </div>
      )}

      {/* قسم الصورة */}
      <div className="card-image-container">
        <img
          src={product.image}
          alt={product.title}
          className="card-image"
          loading="lazy"
        />
        {isHovered && (
          <div className="card-image-overlay">
            <Button
              variant="primary"
              size="small"
              onClick={addToCart}
            >
              🛒 أضف بسرعة
            </Button>
          </div>
        )}
      </div>

      {/* قسم المعلومات */}
      <div className="card-content">
        {/* الفئة */}
        {product.category && (
          <span className="card-category">{product.category}</span>
        )}

        {/* العنوان */}
        <h3 className="card-title" title={product.title}>
          {truncateText(product.title, 30)}
        </h3>

        {/* الوصف المختصر */}
        {product.description && (
          <p className="card-description">
            {truncateText(product.description, 60)}
          </p>
        )}

        {/* السعر والتقييم */}
        <div className="card-footer">
          <span className="card-price">{formattedPrice}</span>
          
          {product.rating && (
            <span className="card-rating">
              {Array(5)
                .fill()
                .map((_, index) => (
                  <span
                    key={index}
                    className={`star ${
                      index < Math.round(product.rating.rate || product.rating)
                        ? 'star-filled'
                        : ''
                    }`}
                  >
                    ★
                  </span>
                ))}
              <span className="rating-count">
                ({product.rating.count || 0})
              </span>
            </span>
          )}
        </div>

        {/* زر الإضافة */}
        <Button
          variant="primary"
          fullWidth
          onClick={addToCart}
          className="card-add-btn"
        >
          🛒 أضف إلى السلة
        </Button>
      </div>

      {/* إشعار الإضافة */}
      {showNotification && (
        <div className="card-notification">
          ✅ تمت الإضافة بنجاح!
        </div>
      )}
    </div>
  );
};

export default Card;