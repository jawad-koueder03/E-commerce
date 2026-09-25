// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, totalPrice, clearCart, totalItems } = useCart();

  // حالة نموذج الدفع
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'SA',
    paymentMethod: 'card',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: معلومات, 2: تأكيد, 3: نجاح

  // التحقق من وجود منتجات في السلة
  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      navigate('/cart');
    }
  }, [items, navigate, isSuccess]);

  // معالجة تغيير الحقول
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // مسح الخطأ عند التعديل
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // التحقق من صحة النموذج
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'الاسم الأول مطلوب';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'الاسم الأخير مطلوب';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = 'رقم الهاتف غير صحيح';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'العنوان مطلوب';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'المدينة مطلوبة';
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'الرمز البريدي مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // معالجة تقديم النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      if (validateForm()) {
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (step === 2) {
      // محاكاة إرسال الطلب
      setIsSubmitting(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSuccess(true);
        setStep(3);
        clearCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error('خطأ في إتمام الطلب:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // العودة للخطوة السابقة
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // حساب الضريبة (محاكاة)
  const tax = totalPrice * 0.15;
  const shipping = totalPrice > 100 ? 0 : 20;
  const finalTotal = totalPrice + tax + shipping;

  // تنسيق السعر
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // إذا كانت السلة فارغة
  if (items.length === 0 && !isSuccess) {
    return null;
  }

  return (
    <div className="checkout-page">
      {/* === رأس الصفحة === */}
      <div className="checkout-header">
        <h1 className="checkout-title">📋 إتمام الطلب</h1>
        <p className="checkout-subtitle">أكمل بياناتك لتأكيد الطلب</p>
      </div>

      {/* === خطوات الطلب === */}
      <div className="checkout-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">معلومات الشحن</span>
        </div>
        <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">تأكيد الطلب</span>
        </div>
        <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">تم الطلب</span>
        </div>
      </div>

      {/* === محتوى الصفحة === */}
      <div className="checkout-content">
        {/* الخطوة 1: نموذج معلومات الشحن */}
        {step === 1 && (
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* الاسم الأول */}
              <div className="form-group">
                <label htmlFor="firstName">الاسم الأول *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'error' : ''}
                  placeholder="أدخل اسمك الأول"
                />
                {errors.firstName && (
                  <span className="error-message">{errors.firstName}</span>
                )}
              </div>

              {/* الاسم الأخير */}
              <div className="form-group">
                <label htmlFor="lastName">الاسم الأخير *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'error' : ''}
                  placeholder="أدخل اسمك الأخير"
                />
                {errors.lastName && (
                  <span className="error-message">{errors.lastName}</span>
                )}
              </div>

              {/* البريد الإلكتروني */}
              <div className="form-group">
                <label htmlFor="email">البريد الإلكتروني *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              {/* رقم الهاتف */}
              <div className="form-group">
                <label htmlFor="phone">رقم الهاتف *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="+966 50 000 0000"
                />
                {errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>

              {/* العنوان */}
              <div className="form-group full-width">
                <label htmlFor="address">العنوان *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                  placeholder="أدخل عنوانك بالكامل"
                />
                {errors.address && (
                  <span className="error-message">{errors.address}</span>
                )}
              </div>

              {/* المدينة */}
              <div className="form-group">
                <label htmlFor="city">المدينة *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? 'error' : ''}
                  placeholder="أدخل اسم المدينة"
                />
                {errors.city && (
                  <span className="error-message">{errors.city}</span>
                )}
              </div>

              {/* الرمز البريدي */}
              <div className="form-group">
                <label htmlFor="postalCode">الرمز البريدي *</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className={errors.postalCode ? 'error' : ''}
                  placeholder="أدخل الرمز البريدي"
                />
                {errors.postalCode && (
                  <span className="error-message">{errors.postalCode}</span>
                )}
              </div>

              {/* الدولة */}
              <div className="form-group">
                <label htmlFor="country">الدولة</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="SA">🇸🇦 السعودية</option>
                  <option value="AE">🇦🇪 الإمارات</option>
                  <option value="KW">🇰🇼 الكويت</option>
                  <option value="QA">🇶🇦 قطر</option>
                  <option value="BH">🇧🇭 البحرين</option>
                  <option value="OM">🇴🇲 عمان</option>
                  <option value="EG">🇪🇬 مصر</option>
                  <option value="JO">🇯🇴 الأردن</option>
                </select>
              </div>
            </div>

            {/* طريقة الدفع */}
            <div className="payment-section">
              <h3 className="section-title">💳 طريقة الدفع</h3>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                  />
                  <span className="payment-option-content">
                    <span className="payment-icon">💳</span>
                    <span className="payment-label">بطاقة ائتمان</span>
                  </span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleChange}
                  />
                  <span className="payment-option-content">
                    <span className="payment-icon">💸</span>
                    <span className="payment-label">PayPal</span>
                  </span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                  />
                  <span className="payment-option-content">
                    <span className="payment-icon">💵</span>
                    <span className="payment-label">الدفع عند الاستلام</span>
                  </span>
                </label>
              </div>
            </div>

            {/* ملاحظات */}
            <div className="form-group">
              <label htmlFor="notes">ملاحظات إضافية</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="أي ملاحظات إضافية حول الطلب..."
              />
            </div>

            {/* أزرار التنقل */}
            <div className="form-actions">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/cart')}
              >
                ← العودة للسلة
              </Button>
              <Button 
                type="submit" 
                variant="primary"
              >
                مراجعة الطلب →
              </Button>
            </div>
          </form>
        )}

        {/* الخطوة 2: تأكيد الطلب */}
        {step === 2 && (
          <div className="confirm-order">
            <div className="confirm-grid">
              {/* معلومات العميل */}
              <div className="confirm-section">
                <h3 className="confirm-title">👤 معلومات العميل</h3>
                <div className="confirm-details">
                  <p><strong>الاسم:</strong> {formData.firstName} {formData.lastName}</p>
                  <p><strong>البريد الإلكتروني:</strong> {formData.email}</p>
                  <p><strong>رقم الهاتف:</strong> {formData.phone}</p>
                  <p><strong>العنوان:</strong> {formData.address}</p>
                  <p><strong>المدينة:</strong> {formData.city}</p>
                  <p><strong>الدولة:</strong> {formData.country}</p>
                  <p><strong>طريقة الدفع:</strong> {
                    formData.paymentMethod === 'card' ? 'بطاقة ائتمان' :
                    formData.paymentMethod === 'paypal' ? 'PayPal' :
                    'الدفع عند الاستلام'
                  }</p>
                </div>
              </div>

              {/* ملخص الطلب */}
              <div className="confirm-section">
                <h3 className="confirm-title">🛒 ملخص الطلب</h3>
                <div className="order-items">
                  {items.map(item => (
                    <div key={item.id} className="order-item">
                      <img src={item.image} alt={item.title} />
                      <div className="order-item-info">
                        <span className="order-item-title">{item.title}</span>
                        <span className="order-item-quantity">×{item.quantity}</span>
                      </div>
                      <span className="order-item-price">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>المجموع الفرعي</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="summary-row">
                    <span>الضريبة (15%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="summary-row">
                    <span>الشحن</span>
                    <span>{shipping === 0 ? 'مجاني' : formatPrice(shipping)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>الإجمالي</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {formData.notes && (
                  <div className="order-notes">
                    <strong>ملاحظات:</strong>
                    <p>{formData.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* أزرار التنقل */}
            <div className="confirm-actions">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                ← العودة للتعديل
              </Button>
              <Button 
                type="button" 
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    جاري المعالجة...
                  </>
                ) : (
                  '✅ تأكيد الطلب'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* الخطوة 3: نجاح الطلب */}
        {step === 3 && (
          <div className="success-page">
            <div className="success-content">
              <span className="success-icon">🎉</span>
              <h2 className="success-title">تم إتمام طلبك بنجاح!</h2>
              <p className="success-message">
                شكراً لتسوقك من متجرنا. سيتم تأكيد طلبك عبر البريد الإلكتروني قريباً.
              </p>
              <div className="success-details">
                <div className="success-card">
                  <span className="success-label">رقم الطلب</span>
                  <span className="success-value">#ORD-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="success-card">
                  <span className="success-label">الإجمالي</span>
                  <span className="success-value">{formatPrice(finalTotal)}</span>
                </div>
                <div className="success-card">
                  <span className="success-label">طريقة الدفع</span>
                  <span className="success-value">
                    {formData.paymentMethod === 'card' ? 'بطاقة ائتمان' :
                     formData.paymentMethod === 'paypal' ? 'PayPal' :
                     'الدفع عند الاستلام'}
                  </span>
                </div>
              </div>
              <div className="success-actions">
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/')}
                >
                  🏠 العودة للرئيسية
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/products')}
                >
                  🛍️ مواصلة التسوق
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;