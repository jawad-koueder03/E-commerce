// src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading: authLoading } = useAuth();

  // حالة النموذج
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // إذا كان المستخدم مسجلاً بالفعل، توجيهه للصفحة الرئيسية
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

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
    if (registerError) setRegisterError('');
    if (registerSuccess) setRegisterSuccess('');
  };

  // التحقق من صحة النموذج
  const validateForm = () => {
    const newErrors = {};

    // الخطوة 1: المعلومات الشخصية
    if (currentStep === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'الاسم الأول مطلوب';
      } else if (formData.firstName.length < 2) {
        newErrors.firstName = 'الاسم الأول يجب أن يكون حرفين على الأقل';
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = 'الاسم الأخير مطلوب';
      } else if (formData.lastName.length < 2) {
        newErrors.lastName = 'الاسم الأخير يجب أن يكون حرفين على الأقل';
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
    }

    // الخطوة 2: كلمة المرور
    if (currentStep === 2) {
      if (!formData.password) {
        newErrors.password = 'كلمة المرور مطلوبة';
      } else if (formData.password.length < 8) {
        newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.password = 'كلمة المرور يجب أن تحتوي على حرف صغير';
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = 'كلمة المرور يجب أن تحتوي على حرف كبير';
      } else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'كلمة المرور يجب أن تحتوي على رقم';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = 'كلمتا المرور غير متطابقتين';
      }

      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'يجب الموافقة على الشروط والأحكام';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // الانتقال للخطوة التالية
  const nextStep = () => {
    if (validateForm()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // العودة للخطوة السابقة
  const prevStep = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // معالجة تقديم النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setRegisterError('');
    setRegisterSuccess('');

    try {
      const success = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (success) {
        setRegisterSuccess('تم إنشاء حسابك بنجاح! جاري توجيهك...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setRegisterError('حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      setRegisterError(error.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setIsSubmitting(false);
    }
  };

  // قوة كلمة المرور
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;

    const levels = [
      { score: 0, label: 'ضعيفة', color: '#ef4444' },
      { score: 1, label: 'ضعيفة', color: '#ef4444' },
      { score: 2, label: 'متوسطة', color: '#f59e0b' },
      { score: 3, label: 'قوية', color: '#10b981' },
      { score: 4, label: 'قوية جداً', color: '#10b981' },
    ];

    return levels[score] || levels[0];
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="register-page">
      <div className="register-container">
        {/* === الجانب الأيسر (الصورة) === */}
        <div className="register-left">
          <div className="register-left-content">
            <span className="left-icon">🎉</span>
            <h1 className="left-title">انضم إلى متجري</h1>
            <p className="left-subtitle">
              أنشئ حسابك الآن واستمتع بتجربة تسوق مميزة مع عروض حصرية للأعضاء
            </p>
            <div className="left-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>توصيل مجاني للطلبات فوق 100$</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>خصم 10% على أول طلب</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>عروض حصرية للأعضاء</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>دعم عملاء على مدار الساعة</span>
              </div>
            </div>
          </div>
        </div>

        {/* === الجانب الأيمن (النموذج) === */}
        <div className="register-right">
          <div className="register-form-container">
            <div className="register-header">
              <h2 className="register-title">إنشاء حساب جديد</h2>
              <p className="register-subtitle">
                {currentStep === 1 ? 'أدخل معلوماتك الشخصية' : 'أنشئ كلمة مرور قوية'}
              </p>
            </div>

            {/* مؤشر الخطوات */}
            <div className="register-steps">
              <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''}`}>
                <span className="step-number">1</span>
                <span className="step-label">معلومات شخصية</span>
              </div>
              <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
              <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''}`}>
                <span className="step-number">2</span>
                <span className="step-label">كلمة المرور</span>
              </div>
            </div>

            {/* رسائل الحالة */}
            {registerError && (
              <div className="register-error">
                <span className="error-icon">❌</span>
                <span>{registerError}</span>
              </div>
            )}

            {registerSuccess && (
              <div className="register-success">
                <span className="success-icon">✅</span>
                <span>{registerSuccess}</span>
              </div>
            )}

            <form className="register-form" onSubmit={handleSubmit}>
              {/* === الخطوة 1: المعلومات الشخصية === */}
              {currentStep === 1 && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName" className="form-label">
                        الاسم الأول *
                      </label>
                      <div className="input-wrapper">
                        <span className="input-icon">👤</span>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`form-input ${errors.firstName ? 'error' : ''}`}
                          placeholder="أدخل اسمك الأول"
                          autoComplete="given-name"
                        />
                      </div>
                      {errors.firstName && (
                        <span className="error-message">{errors.firstName}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="lastName" className="form-label">
                        الاسم الأخير *
                      </label>
                      <div className="input-wrapper">
                        <span className="input-icon">👤</span>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`form-input ${errors.lastName ? 'error' : ''}`}
                          placeholder="أدخل اسمك الأخير"
                          autoComplete="family-name"
                        />
                      </div>
                      {errors.lastName && (
                        <span className="error-message">{errors.lastName}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      البريد الإلكتروني *
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

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      رقم الهاتف *
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">📱</span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        placeholder="+966 50 000 0000"
                        autoComplete="tel"
                      />
                    </div>
                    {errors.phone && (
                      <span className="error-message">{errors.phone}</span>
                    )}
                  </div>

                  <div className="form-actions">
                    <Button
                      type="button"
                      variant="primary"
                      size="large"
                      fullWidth
                      onClick={nextStep}
                    >
                      التالي ←
                    </Button>
                  </div>
                </>
              )}

              {/* === الخطوة 2: كلمة المرور === */}
              {currentStep === 2 && (
                <>
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      كلمة المرور *
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
                        autoComplete="new-password"
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

                    {/* مؤشر قوة كلمة المرور */}
                    {formData.password && (
                      <div className="password-strength">
                        <div className="strength-bar">
                          <div
                            className="strength-fill"
                            style={{
                              width: `${(passwordStrength.score / 4) * 100}%`,
                              backgroundColor: passwordStrength.color,
                            }}
                          />
                        </div>
                        <span className="strength-label" style={{ color: passwordStrength.color }}>
                          قوة كلمة المرور: {passwordStrength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                      تأكيد كلمة المرور *
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔐</span>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'إخفاء التأكيد' : 'إظهار التأكيد'}
                      >
                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <span className="error-message">{errors.confirmPassword}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="terms-label">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                      />
                      <span>
                        أوافق على{' '}
                        <Link to="/terms" className="terms-link">الشروط والأحكام</Link>
                        {' و '}
                        <Link to="/privacy" className="terms-link">سياسة الخصوصية</Link>
                      </span>
                    </label>
                    {errors.acceptTerms && (
                      <span className="error-message">{errors.acceptTerms}</span>
                    )}
                  </div>

                  <div className="form-actions form-actions-two">
                    <Button
                      type="button"
                      variant="outline"
                      size="large"
                      onClick={prevStep}
                    >
                      ← العودة
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="large"
                      fullWidth
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner"></span>
                          جاري إنشاء الحساب...
                        </>
                      ) : (
                        'إنشاء حساب'
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>

            {/* روابط إضافية */}
            <div className="register-footer">
              <p className="login-link">
                لديك حساب بالفعل؟{' '}
                <Link to="/login" className="login-link-text">
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;