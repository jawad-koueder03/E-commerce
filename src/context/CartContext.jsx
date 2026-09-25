// src/context/CartContext.jsx
import React, { createContext, useReducer, useContext, useEffect, useMemo, useCallback } from 'react';

// === إنشاء السياق ===
const CartContext = createContext();

// === أنواع الإجراءات (Actions) ===
const CART_ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  INCREASE_QUANTITY: 'INCREASE_QUANTITY',
  DECREASE_QUANTITY: 'DECREASE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
  UPDATE_ITEM: 'UPDATE_ITEM',
  APPLY_COUPON: 'APPLY_COUPON',
  REMOVE_COUPON: 'REMOVE_COUPON',
};

// === الدالة المسؤولة عن تحديث الحالة (Reducer) ===
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      let updatedItems;
      if (existingItemIndex >= 0) {
        // إذا كان المنتج موجوداً، نزيد الكمية
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
      } else {
        // إذا كان المنتج جديداً، نضيفه مع كمية 1
        updatedItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: updatedItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
      };
    }

    case CART_ACTIONS.REMOVE_FROM_CART: {
      const updatedItems = state.items.filter((item) => item.id !== action.payload);
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: updatedItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
      };
    }

    case CART_ACTIONS.INCREASE_QUANTITY: {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: updatedItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
      };
    }

    case CART_ACTIONS.DECREASE_QUANTITY: {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: updatedItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
      };
    }

    case CART_ACTIONS.UPDATE_ITEM: {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, ...action.payload.updates }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: updatedItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        coupon: null,
        discount: 0,
      };

    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        ...action.payload,
      };

    case CART_ACTIONS.APPLY_COUPON: {
      const discount = action.payload.discount || 0;
      const totalPrice = state.totalPrice;
      const discountedTotal = totalPrice - (totalPrice * discount) / 100;
      return {
        ...state,
        coupon: action.payload.code,
        discount: discount,
        totalPrice: discountedTotal,
      };
    }

    case CART_ACTIONS.REMOVE_COUPON: {
      const originalTotal = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      return {
        ...state,
        coupon: null,
        discount: 0,
        totalPrice: originalTotal,
      };
    }

    default:
      return state;
  }
};

// === الحالة الافتراضية ===
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  coupon: null,
  discount: 0,
};

// === تحميل السلة من LocalStorage ===
const loadCartFromStorage = () => {
  try {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsed = JSON.parse(storedCart);
      // التحقق من صحة البيانات
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.items)) {
        return parsed;
      }
    }
    return initialState;
  } catch (error) {
    console.error('خطأ في تحميل السلة من LocalStorage:', error);
    return initialState;
  }
};

// === حفظ السلة في LocalStorage ===
const saveCartToStorage = (state) => {
  try {
    localStorage.setItem('cart', JSON.stringify(state));
  } catch (error) {
    console.error('خطأ في حفظ السلة في LocalStorage:', error);
  }
};

// === مزود السياق (Provider) ===
export const CartProvider = ({ children }) => {
  // تهيئة الحالة مع البيانات المخزنة
  const [state, dispatch] = useReducer(cartReducer, loadCartFromStorage());

  // حفظ السلة في LocalStorage عند كل تغيير
  useEffect(() => {
    saveCartToStorage(state);
  }, [state]);

  // === دوال مساعدة للاستخدام ===

  // إضافة منتج للسلة
  const addToCart = useCallback((product) => {
    dispatch({
      type: CART_ACTIONS.ADD_TO_CART,
      payload: {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        description: product.description,
      },
    });
  }, []);

  // إزالة منتج من السلة
  const removeFromCart = useCallback((id) => {
    dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: id });
  }, []);

  // زيادة كمية منتج
  const increaseQuantity = useCallback((id) => {
    dispatch({ type: CART_ACTIONS.INCREASE_QUANTITY, payload: id });
  }, []);

  // إنقاص كمية منتج
  const decreaseQuantity = useCallback((id) => {
    dispatch({ type: CART_ACTIONS.DECREASE_QUANTITY, payload: id });
  }, []);

  // تحديث منتج (مثل: تغيير الكمية مباشرة)
  const updateItem = useCallback((id, updates) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_ITEM,
      payload: { id, updates },
    });
  }, []);

  // تفريغ السلة
  const clearCart = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  }, []);

  // تطبيق كود خصم
  const applyCoupon = useCallback((code, discount) => {
    dispatch({
      type: CART_ACTIONS.APPLY_COUPON,
      payload: { code, discount },
    });
  }, []);

  // إزالة كود الخصم
  const removeCoupon = useCallback(() => {
    dispatch({ type: CART_ACTIONS.REMOVE_COUPON });
  }, []);

  // التحقق من وجود منتج في السلة
  const isInCart = useCallback(
    (id) => {
      return state.items.some((item) => item.id === id);
    },
    [state.items]
  );

  // الحصول على كمية منتج معين
  const getItemQuantity = useCallback(
    (id) => {
      const item = state.items.find((item) => item.id === id);
      return item ? item.quantity : 0;
    },
    [state.items]
  );

  // الحصول على منتج معين
  const getItem = useCallback(
    (id) => {
      return state.items.find((item) => item.id === id);
    },
    [state.items]
  );

  // حساب المجموع الكلي مع الخصم
  const getTotalWithDiscount = useCallback(() => {
    const subtotal = state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const discount = state.discount || 0;
    return subtotal - (subtotal * discount) / 100;
  }, [state.items, state.discount]);

  // === القيم التي سيتم توفيرها ===
  const value = useMemo(
    () => ({
      // الحالة
      cart: state.items,
      items: state.items,
      totalItems: state.totalItems,
      totalPrice: state.totalPrice,
      coupon: state.coupon,
      discount: state.discount,

      // الإجراءات
      dispatch,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      updateItem,
      clearCart,
      applyCoupon,
      removeCoupon,

      // دوال مساعدة
      isInCart,
      getItemQuantity,
      getItem,
      getTotalWithDiscount,

      // اختصارات
      cartCount: state.totalItems,
      cartTotal: state.totalPrice,
      itemsCount: state.items.length,
      isEmpty: state.items.length === 0,
    }),
    [
      state,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      updateItem,
      clearCart,
      applyCoupon,
      removeCoupon,
      isInCart,
      getItemQuantity,
      getItem,
      getTotalWithDiscount,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// === خطاف مخصص لاستخدام السياق بسهولة ===
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// === تصدير الإجراءات للاستخدام في المكونات الأخرى ===
export { CART_ACTIONS };

export default CartContext;