// src/pages/WishlistPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import ProductEmpty from '../components/products/ProductEmpty';
import './WishlistPage.css';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();

  // حالة المفضلة
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // === تحميل المفضلة من LocalStorage ===
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const stored = localStorage.getItem('wishlist');
        if (stored) {
          const parsed = JSON.parse(stored);
          setWishlist(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error('خطأ في تحميل المفضلة:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  // === حفظ المفضلة في LocalStorage ===
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      } catch (error) {
        console.error('خطأ في حفظ المفضلة:', error);
      }
    }
  }, [wishlist, loading]);

  // === الفئات المتاحة في المفضلة ===
  const categories = useMemo(() => {
    const cats = new Set(wishlist.map(item => item.category).filter(Boolean));
    return Array.from(cats);
  }, [wishlist]);

  // === فلاتر المفضلة ===
  const filters = [
    { id: 'all', label: 'الكل', icon: '📋' },
    ...categories.map(cat => ({
      id: cat,
      label: cat,
      icon: '📌',
    })),
  ];

  // === خيارات الترتيب ===
  const sortOptions = [
    { value: 'newest', label: 'الأحدث أولاً' },
    { value: 'oldest', label: 'الأقدم أولاً' },
    { value: 'price-high', label: 'السعر: من الأعلى للأقل' },
    { value: 'price-low', label: 'السعر: من الأقل للأعلى' },
    { value: 'name-asc', label: 'الاسم: أ-ي' },
    { value: 'name-desc', label: 'الاسم: ي-أ' },
  ];

  // === تصفية وترتيب المفضلة ===
  const filteredWishlist = useMemo(() => {
    let result = [...wishlist];

    // فلتر الفئة
    if (activeFilter !== 'all') {
      result = result.filter(item => item.category === activeFilter);
    }

    // فلتر البحث
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(item =>
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }

    // الترتيب
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
        break;
      case 'oldest':
        result.sort((a, b) => (a.addedAt || 0) - (b.addedAt || 0));
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return result;
  }, [wishlist, activeFilter, searchQuery, sortBy]);

  // === إزالة منتج من المفضلة ===
  const handleRemoveFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
    showNotificationMessage('تمت إزالة المنتج من المفضلة');
  };

  // === إضافة منتج للسلة ===
  const handleAddToCart = (product) => {
    addToCart(product);
    showNotificationMessage('تمت إضافة المنتج إلى السلة');
  };

  // === إضافة الكل للسلة ===
  const handleAddAllToCart = () => {
    if (filteredWishlist.length === 0) return;
    
    filteredWishlist.forEach(product => {
      if (!isInCart(product.id)) {
        addToCart(product);
      }
    });
    
    showNotificationMessage(`تمت إضافة ${filteredWishlist.length} منتج إلى السلة`);
  };

  // === إزالة الكل ===
  const handleClearWishlist = () => {
    if (window.confirm('هل أنت متأكد من إزالة جميع المنتجات من المفضلة؟')) {
      setWishlist([]);
      showNotificationMessage('تم إفراغ قائمة المفضلة');
    }
  };

  // === عرض إشعار ===
  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2500);
  };

  // === تنسيق السعر ===
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // === عرض حالة التحميل ===
  if (loading) {
    return (
      <div className="wishlist-loading">
        <div className="loading-spinner"></div>
        <p>جاري تحميل المفضلة...</p>
      </div>
    );
  }

  // === عرض حالة المفضلة الفارغة ===
  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-header">
          <h1 className="wishlist-title">❤️ قائمة المفضلة</h1>
          <p className="wishlist-subtitle">
            احفظ المنتجات التي تعجبك للرجوع إليها لاحقاً
          </p>
        </div>
        <ProductEmpty
          icon="wishlist"
          title="قائمة المفضلة فارغة"
          message="لم تقم بإضافة أي منتجات إلى قائمة المفضلة بعد. ابدأ بتصفح المنتجات وأضف ما يعجبك!"
          onBack={() => navigate('/products')}
          backText="🛍️ تصفح المنتجات"
          showReset={false}
          showBack={true}
          variant="default"
        />
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      {/* === رأس الصفحة === */}
      <div className="wishlist-header">
        <div className="header-content">
          <h1 className="wishlist-title">❤️ قائمة المفضلة</h1>
          <p className="wishlist-subtitle">
            لديك <strong>{wishlist.length}</strong> منتج في المفضلة
          </p>
        </div>
        <div className="header-actions">
          <Button
            variant="primary"
            onClick={handleAddAllToCart}
            disabled={filteredWishlist.length === 0}
          >
            🛒 إضافة الكل للسلة
          </Button>
          <Button
            variant="outline"
            onClick={handleClearWishlist}
          >
            🗑️ إفراغ المفضلة
          </Button>
        </div>
      </div>

      {/* === شريط الأدوات === */}
      <div className="wishlist-toolbar">
        {/* البحث */}
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="ابحث في المفضلة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* الترتيب */}
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* تبديل العرض */}
        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            aria-label="عرض شبكي"
          >
            ⊞
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="عرض قائمة"
          >
            ☰
          </button>
        </div>
      </div>

      {/* === فلاتر الفئات === */}
      {categories.length > 0 && (
        <div className="wishlist-filters">
          {filters.map(filter => {
            const count = filter.id === 'all'
              ? wishlist.length
              : wishlist.filter(item => item.category === filter.id).length;

            return (
              <button
                key={filter.id}
                className={`filter-chip ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                <span className="chip-icon">{filter.icon}</span>
                <span className="chip-label">{filter.label}</span>
                <span className="chip-count">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* === قائمة المنتجات === */}
      {filteredWishlist.length === 0 ? (
        <ProductEmpty
          icon="search"
          title="لا توجد نتائج"
          message={
            searchQuery
              ? `لم نجد أي منتجات تطابق "${searchQuery}"`
              : 'لا توجد منتجات في هذه الفئة'
          }
          onReset={() => {
            setSearchQuery('');
            setActiveFilter('all');
          }}
          resetText="إعادة تعيين الفلاتر"
          showReset={true}
          showBack={false}
          variant="compact"
        />
      ) : (
        <div className={`wishlist-grid ${viewMode}`}>
          {filteredWishlist.map((product) => (
            <div key={product.id} className="wishlist-card">
              {/* === صورة المنتج === */}
              <Link to={`/product/${product.id}`} className="wishlist-image-wrapper">
                <img
                  src={product.image}
                  alt={product.title}
                  className="wishlist-image"
                  loading="lazy"
                />
                {product.price > 100 && (
                  <span className="wishlist-badge">🔥 مميز</span>
                )}
              </Link>

              {/* === زر الحذف === */}
              <button
                className="wishlist-remove"
                onClick={() => handleRemoveFromWishlist(product.id)}
                aria-label="إزالة من المفضلة"
                title="إزالة من المفضلة"
              >
                ✕
              </button>

              {/* === معلومات المنتج === */}
              <div className="wishlist-info">
                {product.category && (
                  <span className="wishlist-category">{product.category}</span>
                )}

                <Link to={`/product/${product.id}`} className="wishlist-title-link">
                  <h3 className="wishlist-product-title">{product.title}</h3>
                </Link>

                {/* التقييم */}
                {product.rating?.rate && (
                  <div className="wishlist-rating">
                    <span className="stars">⭐ {product.rating.rate.toFixed(1)}</span>
                    <span className="rating-count">
                      ({product.rating.count || 0} تقييم)
                    </span>
                  </div>
                )}

                {/* السعر */}
                <div className="wishlist-price-wrapper">
                  <span className="wishlist-price">
                    {formatPrice(product.price)}
                  </span>
                  {product.price > 100 && (
                    <span className="wishlist-original-price">
                      {formatPrice(product.price * 1.2)}
                    </span>
                  )}
                </div>

                {/* حالة التوفر */}
                <span className="wishlist-stock">
                  {product.id % 3 === 0 ? '❌ غير متوفر' : '✅ متوفر'}
                </span>

                {/* الأزرار */}
                <div className="wishlist-actions">
                  <Button
                    variant={isInCart(product.id) ? 'success' : 'primary'}
                    size="small"
                    fullWidth
                    onClick={() => handleAddToCart(product)}
                  >
                    {isInCart(product.id) ? '✅ في السلة' : '🛒 أضف للسلة'}
                  </Button>

                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    👁️ عرض
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === ملخص المفضلة === */}
      {filteredWishlist.length > 0 && (
        <div className="wishlist-summary">
          <div className="summary-info">
            <span className="summary-text">
              عرض <strong>{filteredWishlist.length}</strong> من <strong>{wishlist.length}</strong> منتج
            </span>
          </div>
          <div className="summary-actions">
            <Button
              variant="primary"
              onClick={handleAddAllToCart}
            >
              🛒 إضافة الكل للسلة ({filteredWishlist.length})
            </Button>
          </div>
        </div>
      )}

      {/* === إشعار === */}
      {showNotification && (
        <div className="wishlist-notification">
          <span className="notification-icon">✅</span>
          <span className="notification-text">{notificationMessage}</span>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;