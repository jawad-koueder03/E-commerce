// src/components/products/ProductSort.jsx
import React, { useState, useRef, useEffect } from 'react';
import './ProductSort.css';

/**
 * مكون خيارات الترتيب
 * يوفر قائمة منسدلة وخيارات متعددة لترتيب المنتجات
 */
const ProductSort = ({ 
  value = 'default', 
  onChange,
  options = [],
  label = 'ترتيب حسب',
  showLabel = true,
  variant = 'default', // 'default' | 'inline' | 'minimal'
  className = '',
  onSortChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // خيارات الترتيب الافتراضية
  const defaultOptions = [
    { value: 'default', label: 'الافتراضي', icon: '📋' },
    { value: 'price-asc', label: 'السعر: من الأقل للأعلى', icon: '💰' },
    { value: 'price-desc', label: 'السعر: من الأعلى للأقل', icon: '💰' },
    { value: 'rating-desc', label: 'التقييم: الأعلى أولاً', icon: '⭐' },
    { value: 'name-asc', label: 'الاسم: أ-ي', icon: '🔤' },
    { value: 'name-desc', label: 'الاسم: ي-أ', icon: '🔤' },
    { value: 'newest', label: 'الأحدث أولاً', icon: '🆕' },
    { value: 'oldest', label: 'الأقدم أولاً', icon: '📅' },
  ];

  const sortOptions = options.length > 0 ? options : defaultOptions;

  // الحصول على الخيار المحدد
  const selected = sortOptions.find(opt => opt.value === selectedOption) || sortOptions[0];

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // إغلاق القائمة عند الضغط على Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // تحديث القيمة عند تغييرها من الخارج
  useEffect(() => {
    if (value !== selectedOption) {
      setSelectedOption(value);
    }
  }, [value]);

  // معالجة اختيار خيار
  const handleSelect = (option) => {
    setSelectedOption(option.value);
    setIsOpen(false);
    
    if (onChange) {
      onChange(option.value);
    }
    
    if (onSortChange) {
      onSortChange(option.value);
    }
    
    // إرجاع التركيز للزر
    buttonRef.current?.focus();
  };

  // الحصول على أيقونة الترتيب
  const getSortIcon = () => {
    switch (selectedOption) {
      case 'price-asc':
        return '📈';
      case 'price-desc':
        return '📉';
      case 'rating-desc':
        return '⭐';
      case 'name-asc':
        return '🔤';
      case 'name-desc':
        return '🔤';
      case 'newest':
        return '🆕';
      case 'oldest':
        return '📅';
      default:
        return '📋';
    }
  };

  // الحصول على نص مختصر للعرض المدمج
  const getShortLabel = () => {
    if (selectedOption === 'default') return 'الافتراضي';
    if (selectedOption === 'price-asc') return 'السعر ↑';
    if (selectedOption === 'price-desc') return 'السعر ↓';
    if (selectedOption === 'rating-desc') return 'التقييم';
    if (selectedOption === 'name-asc') return 'أ-ي';
    if (selectedOption === 'name-desc') return 'ي-أ';
    if (selectedOption === 'newest') return 'الأحدث';
    if (selectedOption === 'oldest') return 'الأقدم';
    return selected.label;
  };

  // فتح/إغلاق القائمة
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // إعادة تعيين الترتيب
  const resetSort = () => {
    handleSelect(sortOptions[0]);
  };

  // التحقق مما إذا كان الترتيب غير افتراضي
  const isActive = selectedOption !== 'default';

  return (
    <div 
      className={`product-sort ${variant} ${className} ${isActive ? 'active' : ''}`}
      ref={dropdownRef}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-label="خيارات ترتيب المنتجات"
    >
      {/* === عرض النص (في وضع inline) === */}
      {showLabel && variant !== 'minimal' && (
        <span className="sort-label">{label}</span>
      )}

      {/* === زر الترتيب === */}
      <button
        ref={buttonRef}
        className={`sort-button ${isOpen ? 'open' : ''} ${isActive ? 'active' : ''}`}
        onClick={toggleDropdown}
        aria-label={`ترتيب حسب: ${selected.label}`}
        aria-controls="sort-dropdown"
      >
        <span className="sort-button-content">
          {variant !== 'minimal' && (
            <span className="sort-icon">{getSortIcon()}</span>
          )}
          
          {variant === 'minimal' ? (
            <span className="sort-minimal-label">
              <span className="sort-minimal-icon">↕</span>
              {getShortLabel()}
            </span>
          ) : (
            <span className="sort-button-label">
              {variant === 'inline' ? getShortLabel() : selected.label}
            </span>
          )}
          
          <span className={`sort-arrow ${isOpen ? 'open' : ''}`}>
            <svg viewBox="0 0 12 8" width="12" height="8">
              <path 
                d="M1 1l5 5 5-5" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                fill="none" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </span>
        
        {isActive && variant !== 'minimal' && (
          <span className="sort-active-dot" />
        )}
      </button>

      {/* === القائمة المنسدلة === */}
      {isOpen && (
        <div 
          className="sort-dropdown"
          role="listbox"
          id="sort-dropdown"
          aria-label="خيارات الترتيب"
        >
          <div className="sort-dropdown-header">
            <span className="dropdown-title">ترتيب حسب</span>
            {isActive && (
              <button 
                className="dropdown-reset"
                onClick={(e) => {
                  e.stopPropagation();
                  resetSort();
                }}
                aria-label="إعادة تعيين الترتيب"
              >
                <span className="reset-icon">⟳</span>
                إعادة تعيين
              </button>
            )}
          </div>
          
          <ul className="sort-options">
            {sortOptions.map((option) => (
              <li key={option.value}>
                <button
                  className={`sort-option ${selectedOption === option.value ? 'selected' : ''}`}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={selectedOption === option.value}
                  tabIndex={selectedOption === option.value ? 0 : -1}
                >
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-label">{option.label}</span>
                  {selectedOption === option.value && (
                    <span className="option-check">✓</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductSort;