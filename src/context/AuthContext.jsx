// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo ,useReducer } from 'react';
import { login as apiLogin, register as apiRegister, fetchUserById } from '../services/api';

// === إنشاء السياق ===
const AuthContext = createContext();

// === أنواع الإجراءات ===
const AUTH_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
};

// === الحالة الافتراضية ===
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// === الدالة المسؤولة عن تحديث الحالة (Reducer) ===
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

// === مزود السياق (Provider) ===
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // === تحميل المستخدم من LocalStorage عند بدء التشغيل ===
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          const user = JSON.parse(storedUser);
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user, token: storedToken },
          });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('خطأ في تحميل المستخدم:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    loadUser();
  }, []);

  // === دالة تسجيل الدخول ===
  const login = useCallback(async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: null });

    try {
      // محاكاة طلب تسجيل الدخول
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            token: 'fake-jwt-token-' + Date.now(),
            user: {
              id: 1,
              email: email,
              name: 'مستخدم تجريبي',
              firstName: 'مستخدم',
              lastName: 'تجريبي',
              phone: '+966 50 000 0000',
              role: 'user',
              createdAt: new Date().toISOString(),
            },
          });
        }, 1000);
      });

      // حفظ البيانات في LocalStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: response.user, token: response.token },
      });

      return true;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error.message || 'فشل تسجيل الدخول',
      });
      return false;
    }
  }, []);

  // === دالة التسجيل ===
  const register = useCallback(async (userData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: null });

    try {
      // محاكاة طلب التسجيل
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            token: 'fake-jwt-token-' + Date.now(),
            user: {
              id: Date.now(),
              email: userData.email,
              name: `${userData.firstName} ${userData.lastName}`,
              firstName: userData.firstName,
              lastName: userData.lastName,
              phone: userData.phone,
              role: 'user',
              createdAt: new Date().toISOString(),
            },
          });
        }, 1000);
      });

      // حفظ البيانات في LocalStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: response.user, token: response.token },
      });

      return true;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error.message || 'فشل إنشاء الحساب',
      });
      return false;
    }
  }, []);

  // === دالة تسجيل الخروج ===
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  // === دالة تحديث بيانات المستخدم ===
  const updateUser = useCallback(async (updates) => {
    try {
      // محاكاة تحديث المستخدم
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...state.user, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: updates,
      });
      
      return true;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error.message || 'فشل تحديث البيانات',
      });
      return false;
    }
  }, [state.user]);

  // === دالة تغيير كلمة المرور ===
  const changePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      // محاكاة تغيير كلمة المرور
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // في التطبيق الحقيقي، سيتم إرسال طلب للخادم
      return true;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error.message || 'فشل تغيير كلمة المرور',
      });
      return false;
    }
  }, []);

  // === دالة إعادة تعيين كلمة المرور ===
  const resetPassword = useCallback(async (email) => {
    try {
      // محاكاة إعادة تعيين كلمة المرور
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // في التطبيق الحقيقي، سيتم إرسال طلب للخادم
      return true;
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: error.message || 'فشل إعادة تعيين كلمة المرور',
      });
      return false;
    }
  }, []);

  // === التحقق من صلاحية المستخدم ===
  const hasRole = useCallback((role) => {
    if (!state.user) return false;
    return state.user.role === role;
  }, [state.user]);

  const isAdmin = useCallback(() => {
    return hasRole('admin');
  }, [hasRole]);

  const isUser = useCallback(() => {
    return hasRole('user');
  }, [hasRole]);

  // === الحصول على اسم المستخدم الكامل ===
  const getFullName = useCallback(() => {
    if (!state.user) return '';
    return state.user.name || `${state.user.firstName || ''} ${state.user.lastName || ''}`.trim();
  }, [state.user]);

  // === الحصول على الأحرف الأولى ===
  const getInitials = useCallback(() => {
    if (!state.user) return '';
    const name = getFullName();
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }, [getFullName]);

  // === مسح الأخطاء ===
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: null });
  }, []);

  // === القيم التي سيتم توفيرها ===
  const value = useMemo(() => ({
    // الحالة
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,

    // دوال المصادقة
    login,
    register,
    logout,
    updateUser,
    changePassword,
    resetPassword,

    // دوال مساعدة
    hasRole,
    isAdmin,
    isUser,
    getFullName,
    getInitials,
    clearError,

    // اختصارات
    isLoggedIn: state.isAuthenticated,
    userName: getFullName(),
    userInitials: getInitials(),
  }), [
    state,
    login,
    register,
    logout,
    updateUser,
    changePassword,
    resetPassword,
    hasRole,
    isAdmin,
    isUser,
    getFullName,
    getInitials,
    clearError,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// === خطاف مخصص لاستخدام السياق بسهولة ===
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// === تصدير الإجراءات للاستخدام في المكونات الأخرى ===
export { AUTH_ACTIONS };

export default AuthContext;