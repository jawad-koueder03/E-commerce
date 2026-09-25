// src/components/layout/Sidebar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

/**
 * مكون الشريط الجانبي
 * يحتوي على: فلترة المنتجات، الفئات، السعر، التقييم
 */
const Sidebar = ({ 
  isOpen = false, 
  onClose, 
  categories = [],
  onFilterChange,
  initialFilters = {}
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  // حالة الفلاتر
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    priceRange: initialFilters.priceRange || [0, 1000],
    rating: initialFilters.rating || 0,
    sortBy: initialFilters.sortBy || 'default',
    inStock: initialFilters.inStock || false,
  });

  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);

  // إغلاق السايدبار عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (onClose) onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // منع التمرير عند فتح السايدبار على الموبايل
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // معالجة تغيير الفئة
  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? '' : category
    }));
  };

  // معالجة تغيير السعر
  const handlePriceChange = (e, index) => {
    const value = parseInt(e.target.value);
    setFilters(prev => {
      const newRange = [...prev.priceRange];
      newRange[index] = value;
      if (index === 0 && value > newRange[1]) {
        newRange[1] = value;
      }
      if (index === 1 && value < newRange[0]) {
        newRange[0] = value;
      }
      return { ...prev, priceRange: newRange };
    });
  };

  // معالجة تغيير التقييم
  const handleRatingChange = (rating) => {
    setFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating
    }));
  };

  // تطبيق الفلاتر
  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
    if (onClose) onClose();
  };

  // إعادة تعيين الفلاتر
  const resetFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 1000],
      rating: 0,
      sortBy: 'default',
      inStock: false,
    });
    if (onFilterChange) {
      onFilterChange({
        category: '',
        priceRange: [0, 1000],
        rating: 0,
        sortBy: 'default',
        inStock: false,
      });
    }
  };

  // عدد الفلاتر النشطة
  const activeFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.rating > 0) count++;
    if (filters.sortBy !== 'default') count++;
    if (filters.inStock) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    return count;
  };

  // توليد نجوم التقييم
  const renderStars = (rating) => {
    return Array(5).fill().map((_, i) => (
      <span key={i} className={`star ${i < rating ? 'star-active' : ''}`}>
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

  return (
    <>
      {/* الخلفية (Overlay) */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      {/* السايدبار */}
      <aside 
        ref={sidebarRef} 
        className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
      >
        {/* === رأس السايدبار === */}
        <div className="sidebar-header">
          <div className="sidebar-header-content">
            <span className="sidebar-title">🔍 تصفية المنتجات</span>
            <span className="sidebar-badge">{activeFiltersCount()}</span>
          </div>
          <button 
            className="sidebar-close" 
            onClick={onClose}
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>

        {/* === محتوى السايدبار === */}
        <div className="sidebar-content">
          {/* خيارات الترتيب */}
          <div className="sidebar-section">
            <div className="section-header">
              <span className="section-icon">📊</span>
              <h4 className="section-title">ترتيب حسب</h4>
            </div>
            <select 
              className="sidebar-select"
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* الفئات */}
          <div className="sidebar-section">
            <div 
              className="section-header clickable"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <span className="section-icon">📂</span>
              <h4 className="section-title">الفئات</h4>
              <span className="section-toggle">{isCategoryOpen ? '−' : '+'}</span>
            </div>
            {isCategoryOpen && (
              <div className="category-list">
                <button
                  className={`category-item ${!filters.category ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('')}
                >
                  <span>📦</span> جميع المنتجات
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-item ${filters.category === category ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    <span>📌</span> {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* نطاق السعر */}
          <div className="sidebar-section">
            <div 
              className="section-header clickable"
              onClick={() => setIsPriceOpen(!isPriceOpen)}
            >
              <span className="section-icon">💰</span>
              <h4 className="section-title">نطاق السعر</h4>
              <span className="section-toggle">{isPriceOpen ? '−' : '+'}</span>
            </div>
            {isPriceOpen && (
              <div className="price-range">
                <div className="price-inputs">
                  <div className="price-input-group">
                    <label>من</label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceChange(e, 0)}
                    />
                  </div>
                  <div className="price-input-group">
                    <label>إلى</label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                    />
                  </div>
                </div>
                <div className="price-slider">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="price-slider-input"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="price-slider-input"
                  />
                </div>
                <div className="price-display">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>
            )}
          </div>

          {/* التقييم */}
          <div className="sidebar-section">
            <div 
              className="section-header clickable"
              onClick={() => setIsRatingOpen(!isRatingOpen)}
            >
              <span className="section-icon">⭐</span>
              <h4 className="section-title">التقييم</h4>
              <span className="section-toggle">{isRatingOpen ? '−' : '+'}</span>
            </div>
            {isRatingOpen && (
              <div className="rating-list">
                {[5, 4, 3, 2, 1].map(rating => (
                  <button
                    key={rating}
                    className={`rating-item ${filters.rating === rating ? 'active' : ''}`}
                    onClick={() => handleRatingChange(rating)}
                  >
                    <span className="rating-stars">{renderStars(rating)}</span>
                    <span className="rating-label">{rating} نجوم</span>
                    {filters.rating === rating && (
                      <span className="rating-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* متوفر في المخزون */}
          <div className="sidebar-section">
            <div className="section-header">
              <span className="section-icon">📦</span>
              <h4 className="section-title">التوفر</h4>
            </div>
            <label className="stock-toggle">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">
                {filters.inStock ? '✅ متوفر فقط' : '🌐 جميع المنتجات'}
              </span>
            </label>
          </div>
        </div>

        {/* === أزرار الإجراءات === */}
        <div className="sidebar-footer">
          <button 
            className="sidebar-btn btn-reset"
            onClick={resetFilters}
          >
            🔄 إعادة تعيين
          </button>
          <button 
            className="sidebar-btn btn-apply"
            onClick={applyFilters}
          >
            تطبيق الفلاتر ({activeFiltersCount()})
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;