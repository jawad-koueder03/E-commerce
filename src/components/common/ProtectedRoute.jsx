// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import './ProtectedRoute.css';

/**
 * مكون حماية المسارات
 * يمنع الوصول للمستخدمين غير المسجلين أو غير المصرح لهم
 * 
 * @param {ReactNode} children - المحتوى المحمي
 * @param {string} requiredRole - الصلاحية المطلوبة (اختياري)
 * @param {string} redirectTo - المسار البديل عند الفشل (افتراضي: /login)
 * @param {ReactNode} fallback - مكون بديل عند الفشل (اختياري)
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole = null,
  redirectTo = '/login',
  fallback = null,
}) => {
  const { isAuthenticated, loading, user, hasRole } = useAuth();
  const location = useLocation();

  // === عرض شاشة التحميل أثناء التحقق ===
  if (loading) {
    return <LoadingSpinner />;
  }

  // === إذا لم يكن المستخدم مسجلاً ===
  if (!isAuthenticated) {
    // توجيه لصفحة تسجيل الدخول مع حفظ المسار المطلوب
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // === إذا كانت هناك صلاحية مطلوبة ===
  if (requiredRole && !hasRole(requiredRole)) {
    // إذا كان هناك مكون بديل، اعرضه
    if (fallback) {
      return fallback;
    }

    // وإلا، توجيه لصفحة "غير مصرح"
    return (
      <div className="protected-route-denied">
        <div className="denied-content">
          <span className="denied-icon">🚫</span>
          <h2 className="denied-title">غير مصرح لك بالوصول</h2>
          <p className="denied-message">
            عذراً، ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة.
          </p>
          <p className="denied-role">
            الصلاحية المطلوبة: <strong>{requiredRole}</strong>
          </p>
          <p className="denied-role">
            صلاحيتك الحالية: <strong>{user?.role || 'زائر'}</strong>
          </p>
        </div>
      </div>
    );
  }

  // === إذا كان مصرحاً، اعرض المحتوى ===
  return children;
};

export default ProtectedRoute;