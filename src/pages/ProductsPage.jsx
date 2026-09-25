// src/pages/ProductsPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { fetchProducts, fetchCategories } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductList from '../components/products/ProductList';
import ProductFilter from '../components/products/ProductFilter';
import ProductSearch from '../components/products/ProductSearch';
import ProductSort from '../components/products/ProductSort';
import Sidebar from '../components/layout/Sidebar';
import Button from '../components/common/Button';
import './ProductsPage.css';

const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  // حالات الصفحة
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    rating: 0,
    inStock: false,
    sortBy: 'default',
  });

  // جلب البيانات
  const { data: products, loading: productsLoading, error: productsError } = useFetch(fetchProducts);
  const { data: categories, loading: categoriesLoading } = useFetch(fetchCategories);

  // قراءة معاملات البحث من URL
  useEffect(() => {
    const query = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    setSearchQuery(query);
    if (category) {
      setFilters(prev => ({ ...prev, category }));
    }
  }, [searchParams]);

  // تطبيق الفلاتر والترتيب والبحث على المنتجات
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result = [...products];

    // 1. تطبيق البحث
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
      );
    }

    // 2. تطبيق فلتر الفئة
    if (filters.category) {
      result = result.filter(product =>
        product.category === filters.category
      );
    }

    // 3. تطبيق فلتر السعر
    if (filters.minPrice) {
      result = result.filter(product =>
        product.price >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice) {
      result = result.filter(product =>
        product.price <= parseFloat(filters.maxPrice)
      );
    }

    // 4. تطبيق فلتر التقييم
    if (filters.rating > 0) {
      result = result.filter(product =>
        product.rating?.rate && Math.round(product.rating.rate) >= filters.rating
      );
    }

    // 5. تطبيق فلتر المتوفر (محاكاة)
    if (filters.inStock) {
      result = result.filter((_, index) => index % 3 !== 0);
    }

    // 6. تطبيق الترتيب
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'newest':
        // محاكاة: ترتيب حسب المعرف (الأحدث أولاً)
        result.sort((a, b) => b.id - a.id);
        break;
      case 'oldest':
        result.sort((a, b) => a.id - b.id);
        break;
      default:
        break;
    }

    return result;
  }, [products, filters, searchQuery]);

  // عدد الفلاتر النشطة
  const activeFiltersCount = useCallback(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.rating > 0) count++;
    if (filters.inStock) count++;
    if (filters.sortBy !== 'default') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [filters, searchQuery]);

  // معالجة تغيير الفلاتر من الـ Sidebar
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // معالجة البحث
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchParams({ search: query.trim() });
    } else {
      setSearchParams({});
    }
  };

  // معالجة تغيير الترتيب
  const handleSortChange = (value) => {
    setFilters(prev => ({ ...prev, sortBy: value }));
  };

  // إعادة تعيين جميع الفلاتر
  const resetAllFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: 0,
      inStock: false,
      sortBy: 'default',
    });
    setSearchQuery('');
    setSearchParams({});
  };

  // معالجة النقر على منتج
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // معالجة إضافة المنتج للسلة
  const handleAddToCart = (product) => {
    addToCart(product);
  };

  // عرض حالة التحميل
  if (productsLoading || categoriesLoading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
        <p>جاري تحميل المنتجات...</p>
      </div>
    );
  }

  // عرض حالة الخطأ
  if (productsError) {
    return (
      <div className="products-error">
        <span className="error-icon">❌</span>
        <h3>حدث خطأ</h3>
        <p>{productsError}</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* === رأس الصفحة === */}
      <div className="products-header">
        <div className="products-header-content">
          <h1 className="products-title">🛍️ جميع المنتجات</h1>
          <p className="products-subtitle">
            اكتشف مجموعة متنوعة من المنتجات المميزة
          </p>
        </div>
      </div>

      {/* === شريط الأدوات === */}
      <div className="products-toolbar">
        <div className="toolbar-left">
          {/* زر فتح السايدبار */}
          <Button
            variant="outline"
            size="medium"
            onClick={() => setIsSidebarOpen(true)}
            className="filter-toggle-btn"
          >
            🔍 تصفية
            {activeFiltersCount() > 0 && (
              <span className="filter-badge">{activeFiltersCount()}</span>
            )}
          </Button>

          {/* عرض عدد النتائج */}
          <span className="results-count">
            {filteredProducts.length} منتج
          </span>
        </div>

        <div className="toolbar-right">
          {/* شريط البحث */}
          <ProductSearch
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder="ابحث عن منتج..."
            variant="minimal"
            size="medium"
            showSuggestions={true}
            debounceDelay={300}
            suggestions={products?.slice(0, 10).map(p => p.title) || []}
          />

          {/* خيارات الترتيب */}
          <ProductSort
            value={filters.sortBy}
            onChange={handleSortChange}
            variant="minimal"
            showLabel={false}
          />

          {/* أزرار تغيير العرض */}
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="عرض شبكي"
              title="عرض شبكي"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor"/>
                <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor"/>
                <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor"/>
                <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor"/>
              </svg>
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="عرض قائمة"
              title="عرض قائمة"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <rect x="3" y="4" width="18" height="3" rx="1" fill="currentColor"/>
                <rect x="3" y="10" width="18" height="3" rx="1" fill="currentColor"/>
                <rect x="3" y="16" width="18" height="3" rx="1" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* === الفلاتر السريعة (Desktop) === */}
      <div className="products-filters-desktop">
        <ProductFilter
          categories={categories || []}
          onFilterChange={handleFilterChange}
          initialFilters={filters}
          compact={true}
          showPriceRange={true}
          showRating={true}
          showCategory={true}
          showStock={true}
        />
      </div>

      {/* === قائمة المنتجات === */}
      <ProductList
        products={filteredProducts}
        loading={productsLoading}
        viewMode={viewMode}
        onProductClick={handleProductClick}
        onAddToCart={handleAddToCart}
        itemsPerPage={12}
        hasMore={filteredProducts.length > 12}
        animation={true}
      />

      {/* === السايدبار (Mobile) === */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        categories={categories || []}
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      {/* === زر إعادة تعيين الفلاتر (يظهر عند وجود فلاتر نشطة) === */}
      {activeFiltersCount() > 0 && (
        <button className="reset-filters-fab" onClick={resetAllFilters}>
          <span className="fab-icon">🔄</span>
          إعادة تعيين الفلاتر
        </button>
      )}
    </div>
  );
};

export default ProductsPage;