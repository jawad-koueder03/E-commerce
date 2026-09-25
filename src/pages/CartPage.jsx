// src/pages/CartPage.jsx
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import ProductEmpty from '../components/products/ProductEmpty';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { 
    items, 
    totalItems, 
    totalPrice, 
    clearCart, 
    isEmpty,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    coupon,
    discount,
    getTotalWithDiscount
  } = useCart();

  // حالات الصفحة
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // خيارات الشحن (محاكاة)
  const shippingMethods = [
    { id: 'standard', label: 'شحن عادي', price: 20, days: '5-7 أيام' },
    { id: 'express', label: 'شحن سريع', price: 50, days: '2-3 أيام' },
    { id: 'premium', label: 'شحن ممتاز', price: 80, days: '1-2 أيام' },
  ];

  const [selectedShipping, setSelectedShipping] = useState(shippingMethods[0]);

  // حساب الضريبة (15%)
  const taxRate = 0.15;
  const subtotal = totalPrice;
  const tax = subtotal * taxRate;
  const shippingCost = selectedShipping.price;
  const discountAmount = discount > 0 ? (subtotal * discount / 100) : 0;
  const finalTotal = subtotal + tax + shippingCost - discountAmount;

  // تنسيق السعر
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // معالجة تطبيق كود الخصم
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('الرجاء إدخال كود الخصم');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError('');
    setCouponSuccess('');

    // محاكاة التحقق من الكود
    setTimeout(() => {
      const validCoupons = {
        'SAVE10': 10,
        'SAVE20': 20,
        'WELCOME': 15,
        'FLASH50': 50,
      };

      const code = couponCode.trim().toUpperCase();
      if (validCoupons[code]) {
        applyCoupon(code, validCoupons[code]);
        setCouponSuccess(`تم تطبيق كود الخصم ${code} بنجاح! خصم ${validCoupons[code]}%`);
        setCouponCode('');
        setCouponError('');
      } else {
        setCouponError('كود الخصم غير صحيح أو منتهي الصلاحية');
      }
      setIsApplyingCoupon(false);
    }, 800);
  };

  // معالجة إزالة كود الخصم
  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess('');
    setCouponError('');
  };

  // معالجة تغيير طريقة الشحن
  const handleShippingChange = (method) => {
    setSelectedShipping(method);
  };

  // معالجة التوجه للدفع
  const handleCheckout = () => {
    navigate('/checkout');
  };

  // عرض حالة السلة الفارغة
  if (isEmpty) {
    return (
      <ProductEmpty
        icon="cart"
        title="سلة التسوق فارغة"
        message="لم تقم بإضافة أي منتجات إلى السلة بعد. استكشف منتجاتنا وابدأ التسوق!"
        onBack={() => navigate('/products')}
        backText="استكشاف المنتجات"
        showReset={false}
        showBack={true}
        variant="default"
      />
    );
  }

  return (
    <div className="cart-page">
      {/* === رأس الصفحة === */}
      <div className="cart-header">
        <h1 className="cart-title">🛒 سلة التسوق</h1>
        <p className="cart-subtitle">
          لديك <strong>{totalItems}</strong> منتج{totalItems > 1 ? 'ات' : ''} في السلة
        </p>
      </div>

      {/* === المحتوى === */}
      <div className="cart-content">
        {/* === قائمة المنتجات === */}
        <div className="cart-items-section">
          <div className="cart-items-header">
            <span className="header-product">المنتج</span>
            <span className="header-price">السعر</span>
            <span className="header-quantity">الكمية</span>
            <span className="header-total">الإجمالي</span>
            <span className="header-actions"></span>
          </div>

          <div className="cart-items-list">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                {/* صورة المنتج */}
                <div className="item-image">
                  <Link to={`/product/${item.id}`}>
                    <img src={item.image} alt={item.title} />
                  </Link>
                </div>

                {/* معلومات المنتج */}
                <div className="item-info">
                  <Link to={`/product/${item.id}`} className="item-title">
                    {item.title}
                  </Link>
                  <span className="item-category">{item.category}</span>
                </div>

                {/* سعر الوحدة */}
                <div className="item-price">
                  {formatPrice(item.price)}
                </div>

                {/* التحكم بالكمية */}
                <div className="item-quantity">
                  <button 
                    className="quantity-btn"
                    onClick={() => decreaseQuantity(item.id)}
                    disabled={item.quantity <= 1}
                    aria-label="إنقاص الكمية"
                  >
                    −
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => increaseQuantity(item.id)}
                    aria-label="زيادة الكمية"
                  >
                    +
                  </button>
                </div>

                {/* الإجمالي */}
                <div className="item-total">
                  {formatPrice(item.price * item.quantity)}
                </div>

                {/* زر الحذف */}
                <button 
                  className="item-remove"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="إزالة المنتج"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* أزرار الإجراءات في الأسفل */}
          <div className="cart-items-footer">
            <Button 
              variant="outline"
              onClick={() => navigate('/products')}
            >
              🛍️ مواصلة التسوق
            </Button>
            <Button 
              variant="danger"
              onClick={clearCart}
            >
              🗑️ تفريغ السلة
            </Button>
          </div>
        </div>

        {/* === ملخص الطلب === */}
        <div className="cart-summary">
          <h3 className="summary-title">📋 ملخص الطلب</h3>

          {/* كود الخصم */}
          <div className="coupon-section">
            <div className="coupon-input-group">
              <input
                type="text"
                className={`coupon-input ${couponError ? 'error' : ''} ${couponSuccess ? 'success' : ''}`}
                placeholder="أدخل كود الخصم"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={isApplyingCoupon || !!coupon}
                aria-label="كود الخصم"
              />
              <Button
                variant="outline"
                size="small"
                onClick={handleApplyCoupon}
                disabled={isApplyingCoupon || !!coupon || !couponCode.trim()}
              >
                {isApplyingCoupon ? 'جاري...' : 'تطبيق'}
              </Button>
            </div>
            
            {couponError && (
              <div className="coupon-error">{couponError}</div>
            )}
            
            {couponSuccess && (
              <div className="coupon-success">
                {couponSuccess}
                <button className="coupon-remove" onClick={handleRemoveCoupon}>
                  ✕
                </button>
              </div>
            )}

            {coupon && (
              <div className="coupon-active">
                <span className="coupon-code">{coupon}</span>
                <span className="coupon-discount">خصم {discount}%</span>
              </div>
            )}
          </div>

          {/* طريقة الشحن */}
          <div className="shipping-section">
            <h4 className="shipping-title">🚚 طريقة الشحن</h4>
            <div className="shipping-options">
              {shippingMethods.map((method) => (
                <label key={method.id} className="shipping-option">
                  <input
                    type="radio"
                    name="shipping"
                    value={method.id}
                    checked={selectedShipping.id === method.id}
                    onChange={() => handleShippingChange(method)}
                  />
                  <div className="shipping-option-content">
                    <span className="shipping-label">{method.label}</span>
                    <span className="shipping-days">{method.days}</span>
                    <span className="shipping-price">
                      {method.price === 0 ? 'مجاني' : formatPrice(method.price)}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* تفاصيل السعر */}
          <div className="summary-details">
            <div className="summary-row">
              <span>المجموع الفرعي</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            {discount > 0 && (
              <div className="summary-row discount">
                <span>الخصم ({discount}%)</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            
            <div className="summary-row">
              <span>الضريبة (15%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            
            <div className="summary-row">
              <span>الشحن</span>
              <span>{shippingCost === 0 ? 'مجاني' : formatPrice(shippingCost)}</span>
            </div>
            
            <div className="summary-row total">
              <span>الإجمالي</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
          </div>

          {/* أزرار الدفع */}
          <div className="summary-actions">
            <Button 
              variant="primary" 
              size="large"
              onClick={handleCheckout}
              fullWidth
            >
              {finalTotal > 0 ? `💰 إتمام الدفع (${formatPrice(finalTotal)})` : '💰 إتمام الدفع'}
            </Button>
            
            <p className="secure-checkout">
              🔒 مدفوعات آمنة ومشرفة
            </p>
          </div>

          {/* طرق الدفع */}
          <div className="payment-methods">
            <span>طرق الدفع المقبولة:</span>
            <div className="payment-icons">
              <span className="payment-icon">💳</span>
              <span className="payment-icon">💸</span>
              <span className="payment-icon">📱</span>
              <span className="payment-icon">🔒</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;