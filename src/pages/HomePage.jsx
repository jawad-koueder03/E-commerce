// src/pages/HomePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { fetchProducts, fetchCategories } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/products/ProductCard';
import Button from '../components/common/Button';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const slideInterval = useRef(null);

  // جلب المنتجات والفئات
  const { data: products, loading: productsLoading } = useFetch(fetchProducts);
  const { data: categories, loading: categoriesLoading } = useFetch(fetchCategories);

  // عروض السلايدر
  const slides = [
    {
      id: 1,
      title: '🎉 عروض الصيف',
      subtitle: 'خصم يصل إلى 50% على جميع المنتجات',
      buttonText: 'تسوق الآن',
      buttonLink: '/products',
      image: '☀️',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 2,
      title: '📱 أحدث الأجهزة',
      subtitle: 'اكتشف أحدث المنتجات التقنية',
      buttonText: 'استكشف',
      buttonLink: '/products?category=electronics',
      image: '📱',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      id: 3,
      title: '👗 أزياء رائعة',
      subtitle: 'تشكيلة مميزة من الملابس والإكسسوارات',
      buttonText: 'تسوق الآن',
      buttonLink: '/products?category=clothing',
      image: '👗',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
  ];

  // التحكم في السلايدر
  useEffect(() => {
    if (isAutoPlaying) {
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(slideInterval.current);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // الحصول على أفضل المنتجات (الأعلى تقييماً)
  const topRatedProducts = products
    ?.filter(p => p.rating?.rate > 4)
    ?.slice(0, 8) || [];

  // الحصول على أحدث المنتجات
  const newestProducts = products?.slice(0, 8) || [];

  // الحصول على منتجات مميزة (محاكاة)
  const featuredProducts = products
    ?.filter((_, index) => index % 2 === 0)
    ?.slice(0, 4) || [];

  // التنقل إلى صفحة المنتجات
  const handleBrowseProducts = () => {
    navigate('/products');
  };

  // معالجة إضافة المنتج للسلة
  const handleAddToCart = (product) => {
    addToCart(product);
    // يمكن إضافة إشعار هنا
  };

  // عرض حالة التحميل
  if (productsLoading || categoriesLoading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>جاري تحميل المتجر...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* === قسم الهيرو (السلايدر) === */}
      <section className="hero-section">
        <div className="hero-slider">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ background: slide.color }}
            >
              <div className="hero-content">
                <div className="hero-text">
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-subtitle">{slide.subtitle}</p>
                  <Link to={slide.buttonLink} className="hero-button">
                    {slide.buttonText} →
                  </Link>
                </div>
                <div className="hero-image">
                  <span className="hero-emoji">{slide.image}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* مؤشرات السلايدر */}
        <div className="slider-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`انتقال إلى الشريحة ${index + 1}`}
            />
          ))}
        </div>

        {/* أزرار التنقل */}
        <button className="slider-btn prev" onClick={prevSlide} aria-label="السابق">
          ‹
        </button>
        <button className="slider-btn next" onClick={nextSlide} aria-label="التالي">
          ›
        </button>
      </section>

      {/* === الفئات السريعة === */}
      <section className="categories-section">
        <div className="section-header">
          <h2 className="section-title">📂 الفئات</h2>
          <Link to="/categories" className="section-link">
            عرض الكل →
          </Link>
        </div>
        <div className="categories-grid">
          {categories?.slice(0, 6).map((category) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="category-card"
            >
              <span className="category-icon">📌</span>
              <span className="category-name">{category}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* === المنتجات المميزة === */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">⭐ منتجات مميزة</h2>
          <p className="section-subtitle">اختيارنا لأفضل المنتجات هذا الأسبوع</p>
        </div>
        <div className="featured-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="featured-item">
              <ProductCard
                product={product}
                viewMode="grid"
                onProductClick={(id) => navigate(`/product/${id}`)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* === إعلان منتصف الصفحة === */}
      <section className="promo-banner">
        <div className="promo-content">
          <span className="promo-icon">🎁</span>
          <div className="promo-text">
            <h3>اشترِ الآن ووفر أكثر</h3>
            <p>استخدم كود الخصم <strong>SAVE20</strong> للحصول على خصم 20% على طلبك الأول</p>
          </div>
          <Button variant="primary" onClick={handleBrowseProducts}>
            تسوق الآن
          </Button>
        </div>
      </section>

      {/* === أحدث المنتجات === */}
      <section className="products-section">
        <div className="section-header">
          <h2 className="section-title">🔥 أحدث المنتجات</h2>
          <p className="section-subtitle">اكتشف أحدث إضافاتنا إلى المتجر</p>
        </div>
        <div className="products-grid">
          {newestProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode="grid"
              onProductClick={(id) => navigate(`/product/${id}`)}
            />
          ))}
        </div>
        <div className="products-footer">
          <Button variant="outline" onClick={handleBrowseProducts}>
            عرض جميع المنتجات →
          </Button>
        </div>
      </section>

      {/* === أفضل المنتجات تقييماً === */}
      {topRatedProducts.length > 0 && (
        <section className="top-rated-section">
          <div className="section-header">
            <h2 className="section-title">🌟 الأكثر تقييماً</h2>
            <p className="section-subtitle">منتجات نالت إعجاب عملائنا</p>
          </div>
          <div className="products-grid">
            {topRatedProducts.map((product) => (
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

      {/* === مميزات المتجر === */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🚚</span>
            <h4>توصيل سريع</h4>
            <p>توصيل في غضون 2-3 أيام عمل</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h4>دفع آمن</h4>
            <p>جميع المدفوعات مشفرة وآمنة</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔄</span>
            <h4>إرجاع مجاني</h4>
            <p>إرجاع مجاني خلال 30 يوماً</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💬</span>
            <h4>دعم 24/7</h4>
            <p>فريق دعم على مدار الساعة</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;