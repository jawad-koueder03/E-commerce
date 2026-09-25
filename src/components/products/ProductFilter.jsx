// src/components/products/ProductFilter.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './ProductFilter.css';

/**
 * مكون شريط التصفية
 * يوفر خيارات تصفية متعددة للمنتجات
 */
const ProductFilter = ({ 
  categories = [], 
  onFilterChange, 
  initialFilters = {},
  showPriceRange = true,
  showRating = true,
  showCategory = true,
  showStock = true,
  compact = false,
  className = ''
}) => {
  // حالة الفلاتر
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    rating: initialFilters.rating || 0,
    inStock: initialFilters.inStock || false,
    sortBy: initialFilters.sortBy || 'default',
  });

  const [isExpanded, setIsExpanded] = useState(!compact);
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 1000,
  });

  // تحديث الفلاتر عند تغييرها
  const handleApplyFilters = () => {
  if (onFilterChange) {
    onFilterChange(filters);
  }
};
  // معالجة تغيير الفئة
  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? '' : category
    }));
  };

  // معالجة تغيير السعر الأدنى
  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      minPrice: value
    }));
  };

  // معالجة تغيير السعر الأعلى
  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      maxPrice: value
    }));
  };

  // معالجة تغيير التقييم
  const handleRatingChange = (rating) => {
    setFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating
    }));
  };

  // معالجة تغيير التوفر
  const handleStockChange = (e) => {
    setFilters(prev => ({
      ...prev,
      inStock: e.target.checked
    }));
  };

  // معالجة تغيير الترتيب
  const handleSortChange = (e) => {
    setFilters(prev => ({
      ...prev,
      sortBy: e.target.value
    }));
  };

  // إعادة تعيين جميع الفلاتر
  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: 0,
      inStock: false,
      sortBy: 'default',
    });
  };

  // عدد الفلاتر النشطة
  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.rating > 0) count++;
    if (filters.inStock) count++;
    if (filters.sortBy !== 'default') count++;
    return count;
  }, [filters]);

  // توليد نجوم التقييم
  const renderStars = (rating) => {
    return Array(5).fill().map((_, i) => (
      <span 
        key={i} 
        className={`rating-star ${i < rating ? 'active' : ''}`}
        onClick={() => handleRatingChange(i + 1)}
        role="button"
        tabIndex={0}
        aria-label={`${i + 1} نجوم`}
        onKeyPress={(e) => e.key === 'Enter' && handleRatingChange(i + 1)}
      >
        ★
      </span>
    ));
  };

  // خيارات الترتيب
  const sortOptions = [
    { value: 'default', label: 'الافتراضي' },
    { value: 'price-asc', label: 'السعر: من الأقل للأعلى' },
    { value: 'price-desc', label: 'السعر: من الأعلى للأقل' },
    { value: 'rating-desc', label: 'التقييم: الأعلى أولاً' },
    { value: 'name-asc', label: 'الاسم: أ-ي' },
    { value: 'name-desc', label: 'الاسم: ي-أ' },
  ];

  const activeCount = getActiveFiltersCount();

  return (
    <div className={`product-filter ${className} ${compact ? 'compact' : ''}`}>
      {/* === رأس الفلتر === */}
      <div className="filter-header">
        <div className="filter-title-group">
          <span className="filter-icon">🔍</span>
          <h3 className="filter-title">تصفية المنتجات</h3>
          {activeCount > 0 && (
            <span className="filter-badge">{activeCount}</span>
          )}
        </div>
        
        <div className="filter-actions">
          {activeCount > 0 && (
            <button 
              className="filter-reset-btn"
              onClick={resetFilters}
              aria-label="إعادة تعيين الفلاتر"
            >
              🔄 إعادة تعيين
            </button>
          )}
          {compact && (
            <button 
              className="filter-toggle-btn"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? 'طي الفلاتر' : 'توسيع الفلاتر'}
            >
              {isExpanded ? '▲' : '▼'}
            </button>
          )}
        </div>
      </div>

      {/* === محتوى الفلتر === */}
      {(isExpanded || !compact) && (
        <div className="filter-content">
          {/* الترتيب */}
          <div className="filter-section">
            <div className="filter-section-header">
              <span className="section-icon">📊</span>
              <label className="section-label">ترتيب حسب</label>
            </div>
            <select 
              className="filter-select"
              value={filters.sortBy}
              onChange={handleSortChange}
              aria-label="ترتيب المنتجات حسب"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* الفئات */}
          {showCategory && categories.length > 0 && (
            <div className="filter-section">
              <div className="filter-section-header">
                <span className="section-icon">📂</span>
                <label className="section-label">الفئات</label>
              </div>
              <div className="category-list">
                <button
                  className={`category-chip ${!filters.category ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('')}
                  aria-label="جميع الفئات"
                >
                  جميع الفئات
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-chip ${filters.category === category ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category)}
                    aria-label={`فئة ${category}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* نطاق السعر */}
          {showPriceRange && (
            <div className="filter-section">
              <div className="filter-section-header">
                <span className="section-icon">💰</span>
                <label className="section-label">نطاق السعر</label>
              </div>
              <div className="price-range-inputs">
                <div className="price-input-group">
                  <label className="price-input-label">من</label>
                  <div className="price-input-wrapper">
                    <span className="price-currency">$</span>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={handleMinPriceChange}
                      className="price-input"
                      aria-label="السعر الأدنى"
                    />
                  </div>
                </div>
                <span className="price-separator">-</span>
                <div className="price-input-group">
                  <label className="price-input-label">إلى</label>
                  <div className="price-input-wrapper">
                    <span className="price-currency">$</span>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      placeholder="1000"
                      value={filters.maxPrice}
                      onChange={handleMaxPriceChange}
                      className="price-input"
                      aria-label="السعر الأعلى"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* التقييم */}
          {showRating && (
            <div className="filter-section">
              <div className="filter-section-header">
                <span className="section-icon">⭐</span>
                <label className="section-label">التقييم</label>
              </div>
              <div className="rating-group">
                <div className="rating-stars">
                  {renderStars(filters.rating)}
                </div>
                {filters.rating > 0 && (
                  <button 
                    className="rating-clear"
                    onClick={() => handleRatingChange(0)}
                    aria-label="إلغاء فلتر التقييم"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="rating-labels">
                <span>كل التقييمات</span>
                <span>5 نجوم</span>
              </div>
            </div>
          )}

          {/* التوفر */}
          {showStock && (
            <div className="filter-section">
              <div className="filter-section-header">
                <span className="section-icon">📦</span>
                <label className="section-label">التوفر</label>
              </div>
              <div className="stock-toggle-wrapper">
                <label className="stock-toggle">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={handleStockChange}
                    aria-label="عرض المنتجات المتوفرة فقط"
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-label">
                    {filters.inStock ? '✅ متوفر فقط' : '🌐 جميع المنتجات'}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* أزرار الإجراءات */}
          <div className="filter-actions-bottom">
            <button 
              className="filter-apply-btn"
              onClick={() => onFilterChange && onFilterChange(filters)}
              aria-label="تطبيق الفلاتر"
            >
              تطبيق الفلاتر ({activeCount})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;