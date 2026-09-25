// src/pages/NotFoundPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // عد تنازلي للعودة للرئيسية
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRedirecting(true);
          setTimeout(() => navigate('/'), 300);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  // اقتراحات للصفحات
  const suggestions = [
    { path: '/', label: '🏠 الرئيسية', icon: '🏠' },
    { path: '/products', label: '🛍️ المنتجات', icon: '🛍️' },
    { path: '/cart', label: '🛒 سلة التسوق', icon: '🛒' },
    { path: '/about', label: 'ℹ️ عن المتجر', icon: 'ℹ️' },
    { path: '/contact', label: '📞 اتصل بنا', icon: '📞' },
  ];

  // نصائح مفيدة
  const tips = [
    'تأكد من كتابة الرابط بشكل صحيح',
    'استخدم شريط البحث للعثور على المنتجات',
    'تفقد صندوق البريد الإلكتروني للروابط المرسلة',
    'تواصل مع فريق الدعم للحصول على المساعدة',
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  // العودة للصفحة السابقة
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="notfound-page">
      <div className="notfound-container">
        {/* === العناصر المتحركة في الخلفية === */}
        <div className="notfound-background">
          <div className="floating-element el-1">404</div>
          <div className="floating-element el-2">⚠️</div>
          <div className="floating-element el-3">🔍</div>
          <div className="floating-element el-4">❓</div>
        </div>

        {/* === المحتوى الرئيسي === */}
        <div className="notfound-content">
          {/* رمز الحالة */}
          <div className="notfound-code-wrapper">
            <div className="notfound-code">
              <span className="code-digit digit-1">4</span>
              <span className="code-digit digit-2">0</span>
              <span className="code-digit digit-3">4</span>
            </div>
            <div className="notfound-emoji">🔍</div>
          </div>

          {/* النصوص */}
          <h1 className="notfound-title">عذراً! الصفحة غير موجودة</h1>
          <p className="notfound-message">
            يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو حذفها أو أنها غير موجودة أبداً.
          </p>
          <p className="notfound-tip">💡 {randomTip}</p>

          {/* العد التنازلي */}
          {countdown > 0 && !isRedirecting && (
            <div className="notfound-countdown">
              <span className="countdown-text">
                سيتم توجيهك للرئيسية خلال
              </span>
              <span className="countdown-number">{countdown}</span>
              <span className="countdown-text">ثانية</span>
            </div>
          )}

          {isRedirecting && (
            <div className="notfound-redirecting">
              <span className="redirecting-spinner"></span>
              <span>جاري التوجيه...</span>
            </div>
          )}

          {/* الأزرار */}
          <div className="notfound-actions">
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate('/')}
              className="action-btn"
            >
              🏠 العودة للرئيسية
            </Button>

            <Button
              variant="outline"
              size="large"
              onClick={handleGoBack}
              className="action-btn"
            >
              ← العودة للصفحة السابقة
            </Button>
          </div>

          {/* روابط مقترحة */}
          <div className="notfound-suggestions">
            <h3 className="suggestions-title">🔗 قد تجد ما تبحث عنه هنا</h3>
            <div className="suggestions-grid">
              {suggestions.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="suggestion-link"
                >
                  <span className="suggestion-icon">{item.icon}</span>
                  <span className="suggestion-label">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* البحث المخصص */}
          <div className="notfound-search">
            <p className="search-title">🔎 ابحث عن ما تريد</p>
            <form
              className="search-form"
              onSubmit={(e) => {
                e.preventDefault();
                const query = e.target.querySelector('input').value.trim();
                if (query) {
                  navigate(`/products?search=${encodeURIComponent(query)}`);
                }
              }}
            >
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                className="search-input"
                aria-label="بحث"
              />
              <button type="submit" className="search-button">
                بحث
              </button>
            </form>
          </div>

          {/* حقوق النشر */}
          <div className="notfound-footer">
            <p className="footer-text">
              © {new Date().getFullYear()} متجري. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;