// src/components/products/ProductSearch.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ProductSearch.css';

/**
 * مكون شريط البحث
 * يوفر بحث متقدم مع اقتراحات وتصحيح إملائي
 */
const ProductSearch = ({ 
  value = '', 
  onChange, 
  onSearch, 
  placeholder = 'ابحث عن منتج...',
  suggestions = [],
  onSuggestionClick,
  loading = false,
  showSuggestions = true,
  autoFocus = false,
  variant = 'default', // 'default' | 'minimal' | 'rounded' | 'boxed'
  size = 'medium', // 'small' | 'medium' | 'large'
  className = '',
  debounceDelay = 300,
  clearable = true,
  history = [],
  onHistoryClick,
  showHistory = true,
  maxHistoryItems = 5,
}) => {
  const [searchValue, setSearchValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [showHistoryList, setShowHistoryList] = useState(false);
  const [recentSearches, setRecentSearches] = useState(history || []);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const debounceTimer = useRef(null);

  // تحديث القيمة عند تغييرها من الخارج
  useEffect(() => {
    if (value !== searchValue) {
      setSearchValue(value);
    }
  }, [value]);

  // حفظ البحث في التاريخ
  const addToHistory = useCallback((query) => {
    if (!query.trim()) return;
    
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item !== query);
      const newHistory = [query, ...filtered].slice(0, maxHistoryItems);
      return newHistory;
    });
  }, [maxHistoryItems]);

  // معالجة البحث مع debounce
  const handleSearch = useCallback((query) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (onSearch) {
        onSearch(query);
      }
      if (query.trim()) {
        addToHistory(query);
      }
    }, debounceDelay);
  }, [onSearch, debounceDelay, addToHistory]);

  // معالجة تغيير النص
  const handleChange = (e) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    
    if (onChange) {
      onChange(newValue);
    }

    // عرض الاقتراحات
    if (newValue.trim().length > 0 && showSuggestions) {
      setShowSuggestionsList(true);
      setShowHistoryList(false);
    } else if (newValue.trim().length === 0 && showHistory && recentSearches.length > 0) {
      setShowHistoryList(true);
      setShowSuggestionsList(false);
    } else {
      setShowSuggestionsList(false);
      setShowHistoryList(false);
    }

    // البحث التلقائي
    handleSearch(newValue);
  };

  // معالجة إرسال البحث
  const handleSubmit = (e) => {
    e.preventDefault();
    const query = searchValue.trim();
    if (query) {
      if (onSearch) {
        onSearch(query);
      }
      addToHistory(query);
      setShowSuggestionsList(false);
      setShowHistoryList(false);
      inputRef.current?.blur();
    }
  };

  // معالجة النقر على اقتراح
  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion);
    if (onChange) {
      onChange(suggestion);
    }
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
    if (onSearch) {
      onSearch(suggestion);
    }
    addToHistory(suggestion);
    setShowSuggestionsList(false);
    setShowHistoryList(false);
    inputRef.current?.blur();
  };

  // معالجة النقر على عنصر في التاريخ
  const handleHistoryClick = (query) => {
    setSearchValue(query);
    if (onChange) {
      onChange(query);
    }
    if (onHistoryClick) {
      onHistoryClick(query);
    }
    if (onSearch) {
      onSearch(query);
    }
    setShowHistoryList(false);
    setShowSuggestionsList(false);
    inputRef.current?.blur();
  };

  // مسح النص
  const clearSearch = () => {
    setSearchValue('');
    if (onChange) {
      onChange('');
    }
    if (onSearch) {
      onSearch('');
    }
    setShowSuggestionsList(false);
    setShowHistoryList(false);
    inputRef.current?.focus();
  };

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestionsList(false);
        setShowHistoryList(false);
        setIsFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // إغلاق القوائم عند الضغط على Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowSuggestionsList(false);
        setShowHistoryList(false);
        inputRef.current?.blur();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // تصفية الاقتراحات بناءً على النص المدخل
  const getFilteredSuggestions = () => {
    if (!searchValue.trim()) return [];
    const query = searchValue.toLowerCase().trim();
    return suggestions.filter(item => 
      item.toLowerCase().includes(query)
    ).slice(0, 8);
  };

  // إبراز النص المتطابق
  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <strong key={index} className="highlight">{part}</strong> : 
        part
    );
  };

  const filteredSuggestions = getFilteredSuggestions();
  const hasSuggestions = filteredSuggestions.length > 0;
  const hasHistory = recentSearches.length > 0 && showHistory;

  return (
    <div 
      className={`product-search ${variant} ${size} ${className} ${isFocused ? 'focused' : ''}`}
      ref={wrapperRef}
    >
      <form className="search-form" onSubmit={handleSubmit} role="search">
        <div className="search-wrapper">
          {/* أيقونة البحث */}
          <span className="search-icon">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path 
                fill="currentColor" 
                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              />
            </svg>
          </span>

          {/* حقل الإدخال */}
          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={handleChange}
            onFocus={() => {
              setIsFocused(true);
              if (searchValue.trim().length > 0 && showSuggestions) {
                setShowSuggestionsList(true);
              } else if (!searchValue.trim() && showHistory && recentSearches.length > 0) {
                setShowHistoryList(true);
              }
            }}
            placeholder={placeholder}
            className="search-input"
            autoFocus={autoFocus}
            aria-label="بحث"
            aria-autocomplete="list"
            aria-expanded={showSuggestionsList || showHistoryList}
            aria-controls="search-results"
          />

          {/* مؤشر التحميل */}
          {loading && (
            <span className="search-loader">
              <span className="loader-dot"></span>
              <span className="loader-dot"></span>
              <span className="loader-dot"></span>
            </span>
          )}

          {/* زر المسح */}
          {clearable && searchValue && !loading && (
            <button
              type="button"
              className="search-clear"
              onClick={clearSearch}
              aria-label="مسح البحث"
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path 
                  fill="currentColor" 
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </svg>
            </button>
          )}

          {/* زر البحث */}
          <button
            type="submit"
            className="search-submit"
            aria-label="بحث"
          >
            بحث
          </button>
        </div>
      </form>

      {/* قائمة الاقتراحات والتاريخ */}
      {(showSuggestionsList || showHistoryList) && (
        <div className="search-results" id="search-results" role="listbox">
          {/* عرض الاقتراحات */}
          {showSuggestionsList && hasSuggestions && (
            <div className="search-suggestions">
              <div className="suggestions-header">
                <span className="suggestions-title">اقتراحات</span>
                <span className="suggestions-count">
                  {filteredSuggestions.length} نتيجة
                </span>
              </div>
              <ul className="suggestions-list">
                {filteredSuggestions.map((suggestion, index) => (
                  <li key={index}>
                    <button
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                      role="option"
                      tabIndex={0}
                    >
                      <span className="suggestion-icon">🔍</span>
                      <span className="suggestion-text">
                        {highlightMatch(suggestion, searchValue)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* عرض التاريخ */}
          {showHistoryList && hasHistory && !hasSuggestions && (
            <div className="search-history">
              <div className="history-header">
                <span className="history-title">عمليات البحث الأخيرة</span>
                <button
                  type="button"
                  className="history-clear"
                  onClick={() => {
                    setRecentSearches([]);
                    if (onHistoryClick) onHistoryClick('clear');
                  }}
                >
                  مسح الكل
                </button>
              </div>
              <ul className="history-list">
                {recentSearches.map((query, index) => (
                  <li key={index}>
                    <button
                      className="history-item"
                      onClick={() => handleHistoryClick(query)}
                    >
                      <span className="history-icon">🕐</span>
                      <span className="history-text">{query}</span>
                      <span className="history-remove" onClick={(e) => {
                        e.stopPropagation();
                        setRecentSearches(prev => prev.filter((_, i) => i !== index));
                      }}>
                        ✕
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* حالة عدم وجود نتائج */}
          {showSuggestionsList && !hasSuggestions && searchValue.trim().length > 0 && (
            <div className="search-no-results">
              <span className="no-results-icon">🔍</span>
              <p className="no-results-text">
                لا توجد نتائج لـ "<strong>{searchValue}</strong>"
              </p>
              <button
                className="no-results-search"
                onClick={handleSubmit}
              >
                البحث عن "{searchValue}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;