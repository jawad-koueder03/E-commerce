// src/components/products/ProductList.jsx
import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import ProductEmpty from './ProductEmpty';
import './ProductList.css';

/**
 * مكون عرض قائمة المنتجات
 * يدعم عرض شبكي وقائمة مع تحميل تدريجي
 */
const ProductList = ({ 
  products = [], 
  loading = false, 
  viewMode = 'grid',
  onProductClick,
  onLoadMore,
  hasMore = false,
  itemsPerPage = 12,
  animation = true
}) => {
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  // تحديث المنتجات المرئية عند تغيير قائمة المنتجات أو الصفحة
  useEffect(() => {
    if (!loading) {
      const start = 0;
      const end = page * itemsPerPage;
      setVisibleProducts(products.slice(start, end));
    }
  }, [products, page, itemsPerPage, loading]);

  // إعداد المراقب للتحميل التدريجي
  useEffect(() => {
    if (!hasMore || loading || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !isLoadingMore) {
          loadMore();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, isLoadingMore, page, products]);

  // تحميل المزيد من المنتجات
  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    setPage(prev => prev + 1);
    
    if (onLoadMore) {
      await onLoadMore(page + 1);
    }
    
    setIsLoadingMore(false);
  };

  // عرض شاشة التحميل
  if (loading && products.length === 0) {
    return (
      <div className={`product-list ${viewMode}`}>
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <ProductSkeleton key={index} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  // عرض حالة عدم وجود منتجات
  if (!loading && (!products || products.length === 0)) {
    return (
      <ProductEmpty 
        message="لم نجد أي منتجات تطابق معايير البحث الخاصة بك"
        onReset={() => window.location.reload()}
      />
    );
  }

  // عرض المنتجات
  return (
    <div className="product-list-wrapper">
      {/* عداد النتائج */}
      <div className="product-list-header">
        <span className="product-count">
          عرض <strong>{visibleProducts.length}</strong> من <strong>{products.length}</strong> منتج
        </span>
        {viewMode === 'grid' && (
          <span className="view-mode-label">🖼️ عرض شبكي</span>
        )}
        {viewMode === 'list' && (
          <span className="view-mode-label">📋 عرض قائمة</span>
        )}
      </div>

      {/* شبكة/قائمة المنتجات */}
      <div className={`product-list ${viewMode}`}>
        {visibleProducts.map((product, index) => (
          <div 
            key={product.id} 
            className={`product-list-item ${animation ? 'animate' : ''}`}
            style={{ 
              animationDelay: animation ? `${(index % 12) * 50}ms` : '0ms'
            }}
          >
            <ProductCard 
              product={product}
              viewMode={viewMode}
              onClick={onProductClick}
            />
          </div>
        ))}
      </div>

      {/* محفز التحميل التدريجي */}
      {hasMore && (
        <div 
          ref={loadMoreRef} 
          className="load-more-trigger"
        >
          {isLoadingMore && (
            <div className="load-more-loader">
              <span className="loader-spinner"></span>
              <span>جاري تحميل المزيد...</span>
            </div>
          )}
        </div>
      )}

      {/* زر تحميل المزيد (بديل للمراقب) */}
      {hasMore && visibleProducts.length < products.length && (
        <div className="load-more-button-wrapper">
          <button 
            className="load-more-button"
            onClick={loadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <span className="button-spinner"></span>
                جاري التحميل...
              </>
            ) : (
              <>
                🔄 عرض المزيد
                <span className="remaining-count">
                  ({products.length - visibleProducts.length} منتج متبقي)
                </span>
              </>
            )}
          </button>
        </div>
      )}

      {/* عرض جميع المنتجات */}
      {!hasMore && visibleProducts.length === products.length && products.length > 0 && (
        <div className="all-products-loaded">
          <span>✅ تم عرض جميع المنتجات</span>
        </div>
      )}
    </div>
  );
};

export default ProductList;