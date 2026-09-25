// src/services/api.js

// === الإعدادات الأساسية ===
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://fakestoreapi.com';
const API_TIMEOUT = 10000; // 10 ثواني

// === الإعدادات العامة للطلبات ===
const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// === دالة مساعدة للتعامل مع الأخطاء ===
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `خطأ ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

// === دالة مساعدة للتعامل مع المهلة ===
const timeoutPromise = (ms) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('انتهت مهلة الطلب')), ms);
  });
};

// === دالة مساعدة للطلب مع مهلة ===
const fetchWithTimeout = async (url, options = {}) => {
  try {
    const response = await Promise.race([
      fetch(url, options),
      timeoutPromise(API_TIMEOUT),
    ]);
    return handleResponse(response);
  } catch (error) {
    if (error.message === 'انتهت مهلة الطلب') {
      throw new Error('انتهت مهلة الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
    }
    throw error;
  }
};

// ============================================
// === منتجات (Products) ===
// ============================================

/**
 * جلب جميع المنتجات
 * @param {Object} params - معاملات التصفية
 * @param {string} params.category - تصفية حسب الفئة
 * @param {number} params.limit - عدد النتائج
 * @param {string} params.sort - ترتيب النتائج (asc/desc)
 * @returns {Promise<Array>} قائمة المنتجات
 */
export const fetchProducts = async (params = {}) => {
  const { category, limit, sort } = params;
  let url = `${API_BASE_URL}/products`;

  // بناء معاملات الاستعلام
  const queryParams = new URLSearchParams();
  if (category) queryParams.append('category', category);
  if (limit) queryParams.append('limit', limit);
  if (sort) queryParams.append('sort', sort);

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  return fetchWithTimeout(url, {
    ...defaultOptions,
    method: 'GET',
  });
};

/**
 * جلب منتج حسب المعرف
 * @param {number|string} id - معرف المنتج
 * @returns {Promise<Object>} بيانات المنتج
 */
export const fetchProductById = async (id) => {
  if (!id) throw new Error('معرف المنتج مطلوب');
  return fetchWithTimeout(`${API_BASE_URL}/products/${id}`, {
    ...defaultOptions,
    method: 'GET',
  });
};

/**
 * جلب منتجات حسب الفئة
 * @param {string} category - اسم الفئة
 * @param {Object} params - معاملات إضافية
 * @returns {Promise<Array>} قائمة المنتجات
 */
export const fetchProductsByCategory = async (category, params = {}) => {
  if (!category) throw new Error('اسم الفئة مطلوب');
  const { limit, sort } = params;
  let url = `${API_BASE_URL}/products/category/${category}`;

  const queryParams = new URLSearchParams();
  if (limit) queryParams.append('limit', limit);
  if (sort) queryParams.append('sort', sort);

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  return fetchWithTimeout(url, {
    ...defaultOptions,
    method: 'GET',
  });
};

/**
 * جلب جميع الفئات
 * @returns {Promise<Array>} قائمة الفئات
 */
export const fetchCategories = async () => {
  return fetchWithTimeout(`${API_BASE_URL}/products/categories`, {
    ...defaultOptions,
    method: 'GET',
  });
};

/**
 * إضافة منتج جديد (محاكاة)
 * @param {Object} product - بيانات المنتج
 * @returns {Promise<Object>} المنتج المضاف
 */
export const createProduct = async (product) => {
  return fetchWithTimeout(`${API_BASE_URL}/products`, {
    ...defaultOptions,
    method: 'POST',
    body: JSON.stringify(product),
  });
};

/**
 * تحديث منتج (محاكاة)
 * @param {number|string} id - معرف المنتج
 * @param {Object} updates - بيانات التحديث
 * @returns {Promise<Object>} المنتج المحدث
 */
export const updateProduct = async (id, updates) => {
  if (!id) throw new Error('معرف المنتج مطلوب');
  return fetchWithTimeout(`${API_BASE_URL}/products/${id}`, {
    ...defaultOptions,
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

/**
 * حذف منتج (محاكاة)
 * @param {number|string} id - معرف المنتج
 * @returns {Promise<Object>} نتيجة الحذف
 */
export const deleteProduct = async (id) => {
  if (!id) throw new Error('معرف المنتج مطلوب');
  return fetchWithTimeout(`${API_BASE_URL}/products/${id}`, {
    ...defaultOptions,
    method: 'DELETE',
  });
};

// ============================================
// === سلة التسوق (Cart) ===
// ============================================

/**
 * جلب سلة مستخدم (محاكاة)
 * @param {number} userId - معرف المستخدم
 * @returns {Promise<Object>} بيانات السلة
 */
export const fetchCart = async (userId = 1) => {
  return fetchWithTimeout(`${API_BASE_URL}/carts/user/${userId}`, {
    ...defaultOptions,
    method: 'GET',
  });
};

/**
 * إضافة منتج للسلة (محاكاة)
 * @param {Object} cartData - بيانات السلة
 * @param {number} cartData.userId - معرف المستخدم
 * @param {Array} cartData.products - قائمة المنتجات
 * @returns {Promise<Object>} السلة المحدثة
 */
export const addToCart = async (cartData) => {
  if (!cartData.products || !Array.isArray(cartData.products)) {
    throw new Error('قائمة المنتجات مطلوبة');
  }
  return fetchWithTimeout(`${API_BASE_URL}/carts`, {
    ...defaultOptions,
    method: 'POST',
    body: JSON.stringify({
      userId: cartData.userId || 1,
      date: new Date().toISOString().split('T')[0],
      products: cartData.products,
    }),
  });
};

/**
 * تحديث سلة (محاكاة)
 * @param {number} cartId - معرف السلة
 * @param {Object} updates - بيانات التحديث
 * @returns {Promise<Object>} السلة المحدثة
 */
export const updateCart = async (cartId, updates) => {
  if (!cartId) throw new Error('معرف السلة مطلوب');
  return fetchWithTimeout(`${API_BASE_URL}/carts/${cartId}`, {
    ...defaultOptions,
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

/**
 * حذف سلة (محاكاة)
 * @param {number} cartId - معرف السلة
 * @returns {Promise<Object>} نتيجة الحذف
 */
export const deleteCart = async (cartId) => {
  if (!cartId) throw new Error('معرف السلة مطلوب');
  return fetchWithTimeout(`${API_BASE_URL}/carts/${cartId}`, {
    ...defaultOptions,
    method: 'DELETE',
  });
};

// ============================================
// === المستخدمين (Users) ===
// ============================================

/**
 * جلب جميع المستخدمين
 * @returns {Promise<Array>} قائمة المستخدمين
 */
export const fetchUsers = async () => {
  return fetchWithTimeout(`${API_BASE_URL}/users`, {
    ...defaultOptions,
    method: 'GET',
  });
};

/**
 * جلب مستخدم حسب المعرف
 * @param {number|string} id - معرف المستخدم
 * @returns {Promise<Object>} بيانات المستخدم
 */
export const fetchUserById = async (id) => {
  if (!id) throw new Error('معرف المستخدم مطلوب');
  return fetchWithTimeout(`${API_BASE_URL}/users/${id}`, {
    ...defaultOptions,
    method: 'GET',
  });
};

/**
 * تسجيل دخول (محاكاة)
 * @param {Object} credentials - بيانات تسجيل الدخول
 * @param {string} credentials.username - اسم المستخدم
 * @param {string} credentials.password - كلمة المرور
 * @returns {Promise<Object>} بيانات المستخدم مع توكن
 */
export const login = async (credentials) => {
  if (!credentials.username || !credentials.password) {
    throw new Error('اسم المستخدم وكلمة المرور مطلوبان');
  }
  
  // محاكاة تسجيل الدخول (FakeStore API لا يدعم تسجيل الدخول الفعلي)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username === 'test' && credentials.password === 'test') {
        resolve({
          token: 'fake-jwt-token-123456789',
          user: {
            id: 1,
            username: 'test',
            email: 'test@example.com',
            name: { firstname: 'Test', lastname: 'User' },
          },
        });
      } else {
        reject(new Error('اسم المستخدم أو كلمة المرور غير صحيحة'));
      }
    }, 500);
  });
};

/**
 * تسجيل مستخدم جديد (محاكاة)
 * @param {Object} userData - بيانات المستخدم
 * @returns {Promise<Object>} بيانات المستخدم المسجل
 */
export const register = async (userData) => {
  if (!userData.username || !userData.password || !userData.email) {
    throw new Error('جميع الحقول مطلوبة');
  }
  
  return fetchWithTimeout(`${API_BASE_URL}/users`, {
    ...defaultOptions,
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

// ============================================
// === الطلبات (Orders) ===
// ============================================

/**
 * إنشاء طلب جديد (محاكاة)
 * @param {Object} orderData - بيانات الطلب
 * @param {number} orderData.userId - معرف المستخدم
 * @param {Array} orderData.products - قائمة المنتجات
 * @param {Object} orderData.shipping - معلومات الشحن
 * @param {string} orderData.paymentMethod - طريقة الدفع
 * @returns {Promise<Object>} بيانات الطلب
 */
export const createOrder = async (orderData) => {
  if (!orderData.products || !Array.isArray(orderData.products)) {
    throw new Error('قائمة المنتجات مطلوبة');
  }
  
  // محاكاة إنشاء طلب
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now(),
        userId: orderData.userId || 1,
        date: new Date().toISOString(),
        products: orderData.products,
        shipping: orderData.shipping || {},
        paymentMethod: orderData.paymentMethod || 'card',
        total: orderData.products.reduce(
          (sum, p) => sum + p.price * p.quantity,
          0
        ),
        status: 'pending',
      });
    }, 1000);
  });
};

/**
 * جلب طلبات المستخدم (محاكاة)
 * @param {number} userId - معرف المستخدم
 * @returns {Promise<Array>} قائمة الطلبات
 */
export const fetchOrders = async (userId = 1) => {
  // محاكاة جلب الطلبات
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          userId,
          date: '2024-01-15',
          total: 299.99,
          status: 'delivered',
        },
        {
          id: 2,
          userId,
          date: '2024-01-20',
          total: 149.50,
          status: 'shipped',
        },
      ]);
    }, 500);
  });
};

/**
 * جلب تفاصيل طلب (محاكاة)
 * @param {number} orderId - معرف الطلب
 * @returns {Promise<Object>} تفاصيل الطلب
 */
export const fetchOrderById = async (orderId) => {
  if (!orderId) throw new Error('معرف الطلب مطلوب');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: orderId,
        userId: 1,
        date: new Date().toISOString(),
        products: [
          { id: 1, title: 'Product 1', price: 99.99, quantity: 2 },
          { id: 2, title: 'Product 2', price: 49.99, quantity: 1 },
        ],
        total: 249.97,
        status: 'pending',
        shipping: {
          address: '123 Main St',
          city: 'Riyadh',
          country: 'SA',
        },
      });
    }, 500);
  });
};

// ============================================
// === البحث ===
// ============================================

/**
 * البحث عن منتجات
 * @param {string} query - نص البحث
 * @param {Object} params - معاملات إضافية
 * @returns {Promise<Array>} نتائج البحث
 */
export const searchProducts = async (query, params = {}) => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  // جلب جميع المنتجات وتصفيتها (محاكاة)
  const products = await fetchProducts(params);
  const searchTerm = query.toLowerCase().trim();
  
  return products.filter(product =>
    product.title.toLowerCase().includes(searchTerm) ||
    product.description?.toLowerCase().includes(searchTerm) ||
    product.category?.toLowerCase().includes(searchTerm)
  );
};

// ============================================
// === تصدير جميع الدوال ===
// ============================================

export default {
  // Products
  fetchProducts,
  fetchProductById,
  fetchProductsByCategory,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  
  // Cart
  fetchCart,
  addToCart,
  updateCart,
  deleteCart,
  
  // Users
  fetchUsers,
  fetchUserById,
  login,
  register,
  
  // Orders
  createOrder,
  fetchOrders,
  fetchOrderById,
  
  // Search
  searchProducts,
};