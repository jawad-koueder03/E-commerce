// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  // حالة النموذج
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // المسار الذي حاول المستخدم الوصول إليه
  const from = location.state?.from?.pathname || '/';

  // إذا كان المستخدم مسجلاً بالفعل، توجيهه للصفحة المطلوبة
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from]);

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
    if (loginError) setLoginError('');
  };

  // التحقق من صحة النموذج
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // معالجة تقديم النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoginError('');

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        // سيتم التوجيه تلقائياً عن طريق useEffect
      } else {
        setLoginError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    } catch (error) {
      setLoginError(error.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ملء بيانات تجريبية
  const fillDemoCredentials = () => {
    setFormData({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: false,
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* === الجانب الأيسر (الصورة) === */}
        <div className="login-left">
          <div className="login-left-content">
            <span className="left-icon">🛍️</span>
            <h1 className="left-title">مرحباً بك في متجري</h1>
            <p className="left-subtitle">
              قم بتسجيل الدخول للوصول إلى حسابك والاستمتاع بتجربة تسوق مميزة
            </p>
            <div className="left-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>طلبات سريعة وآمنة</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>تتبع الطلبات بسهولة</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>عروض حصرية للأعضاء</span>
              </div>
            </div>
          </div>
        </div>

        {/* === الجانب الأيمن (النموذج) === */}
        <div className="login-right">
          <div className="login-form-container">
            <div className="login-header">
              <h2 className="login-title">تسجيل الدخول</h2>
              <p className="login-subtitle">
                أدخل بياناتك للوصول إلى حسابك
              </p>
            </div>

            {/* رسالة الخطأ العامة */}
            {loginError && (
              <div className="login-error">
                <span className="error-icon">❌</span>
                <span>{loginError}</span>
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              {/* البريد الإلكتروني */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  البريد الإلكتروني
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="example@email.com"
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              {/* كلمة المرور */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  كلمة المرور
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              {/* خيارات إضافية */}
              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span>تذكرني</span>
                </label>
                <Link to="/forgot-password" className="forgot-password">
                  نسيت كلمة المرور؟
                </Link>
              </div>

              {/* زر تسجيل الدخول */}
              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                disabled={isSubmitting}
                className="login-button"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>

              {/* زر البيانات التجريبية */}
              <button
                type="button"
                className="demo-button"
                onClick={fillDemoCredentials}
              >
                🧪 استخدام بيانات تجريبية
              </button>
            </form>

            {/* روابط إضافية */}
            <div className="login-footer">
              <p className="register-link">
                ليس لديك حساب؟{' '}
                <Link to="/register" className="register-link-text">
                  إنشاء حساب جديد
                </Link>
              </p>
              
              <div className="social-login">
                <span className="social-text">أو سجل الدخول باستخدام</span>
                <div className="social-buttons">
                  <button className="social-btn google" aria-label="Google">
                    <span>G</span>
                  </button>
                  <button className="social-btn facebook" aria-label="Facebook">
                    <span>f</span>
                  </button>
                  <button className="social-btn twitter" aria-label="Twitter">
                    <span>🐦</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;