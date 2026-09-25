// src/pages/OrdersPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchOrders } from '../services/api';
import Button from '../components/common/Button';
import ProductEmpty from '../components/products/ProductEmpty';
import './OrdersPage.css';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // حالات الصفحة
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedOrder, setExpandedOrder] = useState(null);

  // فلاتر الطلبات
  const filters = [
    { id: 'all', label: 'جميع الطلبات', icon: '📋' },
    { id: 'pending', label: 'قيد الانتظار', icon: '⏳' },
    { id: 'processing', label: 'قيد المعالجة', icon: '⚙️' },
    { id: 'shipped', label: 'تم الشحن', icon: '🚚' },
    { id: 'delivered', label: 'تم التوصيل', icon: '✅' },
    { id: 'cancelled', label: 'ملغي', icon: '❌' },
  ];

  // خيارات الترتيب
  const sortOptions = [
    { value: 'newest', label: 'الأحدث أولاً' },
    { value: 'oldest', label: 'الأقدم أولاً' },
    { value: 'price-high', label: 'السعر: من الأعلى للأقل' },
    { value: 'price-low', label: 'السعر: من الأقل للأعلى' },
  ];

  // === جلب الطلبات ===
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchOrders(user?.id || 1);

        // بيانات تجريبية موسعة
        const demoOrders = [
          {
            id: 1,
            orderNumber: 'ORD-2024-001',
            date: '2024-01-20',
            status: 'delivered',
            total: 299.99,
            subtotal: 279.99,
            tax: 42.00,
            shipping: 20.00,
            paymentMethod: 'بطاقة ائتمان',
            items: [
              { id: 1, title: 'منتج تجريبي 1', price: 99.99, quantity: 2, image: 'https://via.placeholder.com/60' },
              { id: 2, title: 'منتج تجريبي 2', price: 80.01, quantity: 1, image: 'https://via.placeholder.com/60' },
            ],
            shipping_address: {
              name: user?.name || 'مستخدم تجريبي',
              address: 'شارع الملك فهد، حي العليا',
              city: 'الرياض',
              postalCode: '12345',
              country: 'السعودية',
              phone: '+966 50 000 0000',
            },
            timeline: [
              { status: 'تم تأكيد الطلب', date: '2024-01-20 10:30', completed: true },
              { status: 'قيد المعالجة', date: '2024-01-20 14:00', completed: true },
              { status: 'تم الشحن', date: '2024-01-21 09:00', completed: true },
              { status: 'تم التوصيل', date: '2024-01-23 16:30', completed: true },
            ],
          },
          {
            id: 2,
            orderNumber: 'ORD-2024-002',
            date: '2024-02-05',
            status: 'shipped',
            total: 149.50,
            subtotal: 139.50,
            tax: 21.00,
            shipping: 10.00,
            paymentMethod: 'PayPal',
            items: [
              { id: 3, title: 'منتج تجريبي 3', price: 149.50, quantity: 1, image: 'https://via.placeholder.com/60' },
            ],
            shipping_address: {
              name: user?.name || 'مستخدم تجريبي',
              address: 'شارع الملك فهد، حي العليا',
              city: 'الرياض',
              postalCode: '12345',
              country: 'السعودية',
              phone: '+966 50 000 0000',
            },
            timeline: [
              { status: 'تم تأكيد الطلب', date: '2024-02-05 11:00', completed: true },
              { status: 'قيد المعالجة', date: '2024-02-05 15:30', completed: true },
              { status: 'تم الشحن', date: '2024-02-06 10:00', completed: true },
              { status: 'تم التوصيل', date: 'متوقع 2024-02-09', completed: false },
            ],
          },
          {
            id: 3,
            orderNumber: 'ORD-2024-003',
            date: '2024-02-15',
            status: 'processing',
            total: 449.00,
            subtotal: 420.00,
            tax: 63.00,
            shipping: 20.00,
            paymentMethod: 'الدفع عند الاستلام',
            items: [
              { id: 4, title: 'منتج تجريبي 4', price: 200.00, quantity: 2, image: 'https://via.placeholder.com/60' },
              { id: 5, title: 'منتج تجريبي 5', price: 20.00, quantity: 1, image: 'https://via.placeholder.com/60' },
            ],
            shipping_address: {
              name: user?.name || 'مستخدم تجريبي',
              address: 'شارع الملك فهد، حي العليا',
              city: 'الرياض',
              postalCode: '12345',
              country: 'السعودية',
              phone: '+966 50 000 0000',
            },
            timeline: [
              { status: 'تم تأكيد الطلب', date: '2024-02-15 09:00', completed: true },
              { status: 'قيد المعالجة', date: '2024-02-15 13:00', completed: true },
              { status: 'تم الشحن', date: 'متوقع 2024-02-17', completed: false },
              { status: 'تم التوصيل', date: 'متوقع 2024-02-20', completed: false },
            ],
          },
          {
            id: 4,
            orderNumber: 'ORD-2024-004',
            date: '2024-02-20',
            status: 'pending',
            total: 79.99,
            subtotal: 79.99,
            tax: 12.00,
            shipping: 0.00,
            paymentMethod: 'بطاقة ائتمان',
            items: [
              { id: 6, title: 'منتج تجريبي 6', price: 79.99, quantity: 1, image: 'https://via.placeholder.com/60' },
            ],
            shipping_address: {
              name: user?.name || 'مستخدم تجريبي',
              address: 'شارع الملك فهد، حي العليا',
              city: 'الرياض',
              postalCode: '12345',
              country: 'السعودية',
              phone: '+966 50 000 0000',
            },
            timeline: [
              { status: 'تم تأكيد الطلب', date: '2024-02-20 16:00', completed: true },
              { status: 'قيد المعالجة', date: 'متوقع 2024-02-21', completed: false },
              { status: 'تم الشحن', date: 'متوقع 2024-02-23', completed: false },
              { status: 'تم التوصيل', date: 'متوقع 2024-02-26', completed: false },
            ],
          },
        ];

        setOrders(demoOrders);
      } catch (err) {
        setError(err.message || 'حدث خطأ أثناء جلب الطلبات');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  // === تصفية وترتيب الطلبات ===
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // فلتر الحالة
    if (activeFilter !== 'all') {
      result = result.filter(order => order.status === activeFilter);
    }

    // فلتر البحث
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(order =>
        order.orderNumber.toLowerCase().includes(query) ||
        order.items.some(item => item.title.toLowerCase().includes(query))
      );
    }

    // الترتيب
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'price-high':
        result.sort((a, b) => b.total - a.total);
        break;
      case 'price-low':
        result.sort((a, b) => a.total - b.total);
        break;
      default:
        break;
    }

    return result;
  }, [orders, activeFilter, searchQuery, sortBy]);

  // === تنسيق السعر ===
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // === تنسيق التاريخ ===
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // === الحصول على لون الحالة ===
  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: '#fef3c7', color: '#d97706', label: 'قيد الانتظار' },
      processing: { bg: '#dbeafe', color: '#2563eb', label: 'قيد المعالجة' },
      shipped: { bg: '#e0e7ff', color: '#4f46e5', label: 'تم الشحن' },
      delivered: { bg: '#d1fae5', color: '#059669', label: 'تم التوصيل' },
      cancelled: { bg: '#fee2e2', color: '#dc2626', label: 'ملغي' },
      refunded: { bg: '#f3e8ff', color: '#7c3aed', label: 'مسترجع' },
    };
    return colors[status] || colors.pending;
  };

  // === تبديل تفاصيل الطلب ===
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(prev => prev === orderId ? null : orderId);
  };

  // === إعادة الطلب ===
  const handleReorder = (order) => {
    // إضافة المنتجات إلى السلة
    console.log('إعادة الطلب:', order);
    navigate('/cart');
  };

  // === تحميل الطلبات ===
  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <p>جاري تحميل الطلبات...</p>
      </div>
    );
  }

  // === عرض الخطأ ===
  if (error) {
    return (
      <div className="orders-error">
        <span className="error-icon">❌</span>
        <h3>حدث خطأ</h3>
        <p>{error}</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      {/* === رأس الصفحة === */}
      <div className="orders-header">
        <div className="header-content">
          <h1 className="orders-title">📦 طلباتي</h1>
          <p className="orders-subtitle">
            تابع طلباتك وتحقق من حالتها بسهولة
          </p>
        </div>
      </div>

      {/* === شريط الأدوات === */}
      <div className="orders-toolbar">
        {/* البحث */}
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="ابحث برقم الطلب أو اسم المنتج..."
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
      </div>

      {/* === فلاتر الحالة === */}
      <div className="orders-filters">
        {filters.map(filter => {
          const count = filter.id === 'all' 
            ? orders.length 
            : orders.filter(o => o.status === filter.id).length;
          
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

      {/* === قائمة الطلبات === */}
      {filteredOrders.length === 0 ? (
        <ProductEmpty
          icon="empty"
          title={searchQuery ? 'لا توجد نتائج' : 'لا توجد طلبات'}
          message={
            searchQuery
              ? `لم نجد أي طلبات تطابق "${searchQuery}"`
              : activeFilter !== 'all'
                ? 'لا توجد طلبات بهذه الحالة'
                : 'لم تقم بأي طلبات بعد. ابدأ التسوق الآن!'
          }
          onBack={() => navigate('/products')}
          backText="ابدأ التسوق"
          showReset={false}
          showBack={true}
        />
      ) : (
        <div className="orders-list">
          {filteredOrders.map(order => {
            const statusInfo = getStatusColor(order.status);
            const isExpanded = expandedOrder === order.id;

            return (
              <div key={order.id} className="order-card">
                {/* === رأس الطلب === */}
                <div className="order-header">
                  <div className="order-main-info">
                    <div className="order-number-wrapper">
                      <span className="order-label">رقم الطلب</span>
                      <span className="order-number">{order.orderNumber}</span>
                    </div>
                    <div className="order-date-wrapper">
                      <span className="order-label">التاريخ</span>
                      <span className="order-date">{formatDate(order.date)}</span>
                    </div>
                    <div className="order-total-wrapper">
                      <span className="order-label">الإجمالي</span>
                      <span className="order-total">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  <div className="order-status-wrapper">
                    <span 
                      className="order-status"
                      style={{ 
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.color,
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* === معاينة المنتجات === */}
                <div className="order-items-preview">
                  <div className="items-images">
                    {order.items.slice(0, 4).map((item, index) => (
                      <div 
                        key={item.id} 
                        className="item-preview"
                        style={{ zIndex: 4 - index }}
                      >
                        <img src={item.image} alt={item.title} />
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="items-more">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                  <div className="items-summary">
                    <span className="items-count">
                      {order.items.length} منتج{order.items.length > 1 ? 'ات' : ''}
                    </span>
                    <span className="payment-method">
                      💳 {order.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* === أزرار الإجراءات === */}
                <div className="order-actions">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    {isExpanded ? '🔼 إخفاء التفاصيل' : '🔽 عرض التفاصيل'}
                  </Button>

                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => handleReorder(order)}
                  >
                    🔄 إعادة الطلب
                  </Button>

                  {order.status === 'delivered' && (
                    <Button variant="secondary" size="small">
                      📝 تقييم المنتجات
                    </Button>
                  )}

                  {(order.status === 'pending' || order.status === 'processing') && (
                    <Button variant="danger" size="small">
                      ❌ إلغاء الطلب
                    </Button>
                  )}
                </div>

                {/* === تفاصيل الطلب (عند التوسيع) === */}
                {isExpanded && (
                  <div className="order-details">
                    {/* المنتجات */}
                    <div className="details-section">
                      <h4 className="details-title">🛍️ المنتجات</h4>
                      <div className="details-items">
                        {order.items.map(item => (
                          <div key={item.id} className="detail-item">
                            <img src={item.image} alt={item.title} className="detail-image" />
                            <div className="detail-info">
                              <Link to={`/product/${item.id}`} className="detail-title">
                                {item.title}
                              </Link>
                              <span className="detail-quantity">الكمية: {item.quantity}</span>
                            </div>
                            <span className="detail-price">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ملخص السعر */}
                    <div className="details-section">
                      <h4 className="details-title">💰 ملخص السعر</h4>
                      <div className="price-summary">
                        <div className="price-row">
                          <span>المجموع الفرعي</span>
                          <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="price-row">
                          <span>الضريبة</span>
                          <span>{formatPrice(order.tax)}</span>
                        </div>
                        <div className="price-row">
                          <span>الشحن</span>
                          <span>{order.shipping === 0 ? 'مجاني' : formatPrice(order.shipping)}</span>
                        </div>
                        <div className="price-row total">
                          <span>الإجمالي</span>
                          <span>{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* عنوان الشحن */}
                    <div className="details-section">
                      <h4 className="details-title">📍 عنوان الشحن</h4>
                      <div className="shipping-address">
                        <p className="address-name">{order.shipping_address.name}</p>
                        <p className="address-line">{order.shipping_address.address}</p>
                        <p className="address-line">
                          {order.shipping_address.city}, {order.shipping_address.postalCode}
                        </p>
                        <p className="address-line">{order.shipping_address.country}</p>
                        <p className="address-phone">📱 {order.shipping_address.phone}</p>
                      </div>
                    </div>

                    {/* الخط الزمني */}
                    <div className="details-section">
                      <h4 className="details-title">📅 تتبع الطلب</h4>
                      <div className="order-timeline">
                        {order.timeline.map((step, index) => (
                          <div 
                            key={index} 
                            className={`timeline-step ${step.completed ? 'completed' : ''}`}
                          >
                            <div className="timeline-marker">
                              {step.completed ? '✓' : '○'}
                            </div>
                            <div className="timeline-content">
                              <span className="timeline-status">{step.status}</span>
                              <span className="timeline-date">{step.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;