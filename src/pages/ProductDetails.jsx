// src/pages/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { fetchProductById, fetchProductsByCategory } from '../services/api';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import ProductCard from '../components/products/ProductCard';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();

  // حالات الصفحة
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // جلب بيانات المنتج
  const { 
    data: product, 
    loading, 
    error, 
    refetch 
  } = useFetch(() => fetchProductById(id), [id]);

  // جلب منتجات مشابهة
  useEffect(() => {
    if (product?.category) {
      fetchProductsByCategory(product.category, { limit: 4 })
        .then(data => {
          // استبعاد المنتج الحالي
          const filtered = data.filter(p => p.id !== product.id);
          setRelatedProducts(filtered);
        })
        .catch(err => console.error('خطأ في جلب المنتجات المشابهة:', err));
    }
  }, [product]);

  // التحقق من وجود المنتج في السلة
  const inCart = isInCart(product?.id);
  const cartQuantity = getItemQuantity(product?.id);

  // معالجة تغيير الكمية
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    if (quantity < 10) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // معالجة إضافة المنتج للسلة
  const handleAddToCart = () => {
    if (!product) return;
    
    // إضافة المنتج مع الكمية المحددة
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // معالجة الشراء المباشر
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  // معالجة العودة للخلف
  const handleGoBack = () => {
    navigate(-1);
  };

  // تنسيق السعر
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // توليد نجوم التقييم
  const renderStars = (rating) => {
    const fullStars = Math.round(rating);
    return Array(5).fill().map((_, i) => (
      <span key={i} className={`star ${i < fullStars ? 'filled' : ''}`}>
        {i < fullStars ? '★' : '☆'}
      </span>
    ));
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="product-details-loading">
        <div className="loading-spinner"></div>
        <p>جاري تحميل المنتج...</p>
      </div>
    );
  }

  // عرض حالة الخطأ
  if (error) {
    return (
      <div className="product-details-error">
        <span className="error-icon">❌</span>
        <h3>حدث خطأ</h3>
        <p>{error}</p>
        <Button variant="primary" onClick={() => refetch()}>
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  // إذا لم يتم العثور على المنتج
  if (!product) {
    return (
      <div className="product-details-notfound">
        <span className="notfound-icon">🔍</span>
        <h3>المنتج غير موجود</h3>
        <p>عذراً، لم نتمكن من العثور على المنتج المطلوب</p>
        <Link to="/products" className="notfound-link">
          ← العودة إلى المنتجات
        </Link>
      </div>
    );
  }

  // بيانات وهمية للألوان والمقاسات
  const colors = ['#667eea', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="product-details-page">
      {/* === مسار الصفحة (Breadcrumb) === */}
      <nav className="breadcrumb">
        <Link to="/">الرئيسية</Link>
        <span className="breadcrumb-separator">›</span>
        <Link to="/products">المنتجات</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">{product.title}</span>
      </nav>

      {/* === زر العودة === */}
      <button className="back-button" onClick={handleGoBack}>
        <span className="back-icon">←</span>
        العودة
      </button>

      {/* === تفاصيل المنتج === */}
      <div className="product-details">
        {/* === قسم الصور === */}
        <div className="product-gallery">
          <div className="gallery-main">
            <img 
              src={product.image} 
              alt={product.title} 
              className="gallery-main-image"
            />
          </div>
          <div className="gallery-thumbnails">
            {[product.image, product.image, product.image].map((img, index) => (
              <button
                key={index}
                className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                onClick={() => setActiveImage(index)}
              >
                <img src={img} alt={`صورة ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* === معلومات المنتج === */}
        <div className="product-info">
          {/* الفئة */}
          <span className="product-category">{product.category}</span>

          {/* العنوان */}
          <h1 className="product-title">{product.title}</h1>

          {/* التقييم */}
          <div className="product-rating">
            <div className="stars">
              {renderStars(product.rating?.rate || 0)}
            </div>
            <span className="rating-value">{product.rating?.rate || 0}</span>
            <span className="rating-count">({product.rating?.count || 0} تقييم)</span>
          </div>

          {/* السعر */}
          <div className="product-price">
            <span className="price-current">{formatPrice(product.price)}</span>
            {product.price > 100 && (
              <span className="price-original">{formatPrice(product.price * 1.2)}</span>
            )}
            {product.price > 100 && (
              <span className="price-discount">-20%</span>
            )}
          </div>

          {/* الوصف */}
          <div className="product-description">
            <h4 className="description-title">الوصف</h4>
            <p className="description-text">{product.description}</p>
          </div>

          {/* المميزات */}
          <div className="product-features">
            <h4 className="features-title">المميزات</h4>
            <ul className="features-list">
              <li>✅ جودة عالية</li>
              <li>✅ ضمان لمدة عام</li>
              <li>✅ شحن مجاني</li>
              <li>✅ إرجاع مجاني خلال 30 يوماً</li>
            </ul>
          </div>

          {/* الألوان */}
          <div className="product-options">
            <div className="option-group">
              <label className="option-label">اللون:</label>
              <div className="color-options">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    className={`color-option ${selectedColor === index ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(index)}
                    aria-label={`اختيار اللون ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* المقاسات */}
            <div className="option-group">
              <label className="option-label">المقاس:</label>
              <div className="size-options">
                {sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`size-option ${selectedSize === index ? 'active' : ''}`}
                    onClick={() => setSelectedSize(index)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* الكمية */}
          <div className="product-quantity">
            <label className="quantity-label">الكمية:</label>
            <div className="quantity-controls">
              <button 
                className="quantity-btn" 
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                aria-label="إنقاص الكمية"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={handleQuantityChange}
                className="quantity-input"
                aria-label="الكمية"
              />
              <button 
                className="quantity-btn" 
                onClick={increaseQuantity}
                disabled={quantity >= 10}
                aria-label="زيادة الكمية"
              >
                +
              </button>
            </div>
            <span className="stock-status">✅ متوفر</span>
          </div>

          {/* الأزرار */}
          <div className="product-actions">
            <Button 
              variant={inCart ? 'success' : 'primary'}
              size="large"
              onClick={handleAddToCart}
              className="add-to-cart-btn"
              fullWidth
            >
              {inCart ? `✅ في السلة (${cartQuantity})` : '🛒 أضف إلى السلة'}
            </Button>
            
            <Button 
              variant="outline"
              size="large"
              onClick={handleBuyNow}
              fullWidth
            >
              شراء الآن
            </Button>
          </div>

          {/* معلومات إضافية */}
          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-icon">🚚</span>
              <span className="meta-text">توصيل سريع خلال 2-3 أيام</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">🔄</span>
              <span className="meta-text">إرجاع مجاني خلال 30 يوماً</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">🔒</span>
              <span className="meta-text">دفع آمن ومشفر</span>
            </div>
          </div>
        </div>
      </div>

      {/* === منتجات مشابهة === */}
      {relatedProducts.length > 0 && (
        <section className="related-products">
          <h2 className="related-title">🔄 منتجات مشابهة</h2>
          <div className="related-grid">
            {relatedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode="grid"
                onProductClick={(id) => navigate(`/product/${id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* === إشعار الإضافة للسلة === */}
      {showNotification && (
        <div className="notification-toast">
          <span className="notification-icon">✅</span>
          <span className="notification-text">
            تمت إضافة <strong>{product.title}</strong> إلى السلة
          </span>
          <Link to="/cart" className="notification-link">
            عرض السلة →
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;