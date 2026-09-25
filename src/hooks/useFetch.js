// src/hooks/useFetch.js
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * خطاف مخصص لجلب البيانات من API
 * يدعم التحميل، الخطأ، إعادة المحاولة، التخزين المؤقت، والإلغاء
 * 
 * @param {Function} fetchFunction - دالة جلب البيانات (async)
 * @param {Array} dependencies - مصفوفة الاعتماديات لإعادة التشغيل
 * @param {Object} options - خيارات إضافية
 * @param {boolean} options.autoFetch - جلب تلقائي عند التحميل (default: true)
 * @param {number} options.retryCount - عدد محاولات إعادة المحاولة (default: 3)
 * @param {number} options.retryDelay - التأخير بين المحاولات (default: 1000ms)
 * @param {boolean} options.cache - تفعيل التخزين المؤقت (default: false)
 * @param {string} options.cacheKey - مفتاح التخزين المؤقت (default: auto-generated)
 * @param {number} options.cacheTTL - مدة صلاحية الكاش (default: 5 دقائق)
 * @param {boolean} options.initialData - بيانات أولية للعرض
 * @param {Function} options.onSuccess - دالة عند نجاح الجلب
 * @param {Function} options.onError - دالة عند فشل الجلب
 * 
 * @returns {Object} { data, loading, error, refetch, cancel, isFetching }
 */
export const useFetch = (
  fetchFunction,
  dependencies = [],
  options = {}
) => {
  const {
    autoFetch = true,
    retryCount = 3,
    retryDelay = 1000,
    cache = false,
    cacheKey = null,
    cacheTTL = 5 * 60 * 1000, // 5 دقائق
    initialData = null,
    onSuccess = null,
    onError = null,
  } = options;

  // === الحالة ===
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  // === المراجع ===
  const abortControllerRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);
  const fetchCountRef = useRef(0);
  const cacheRef = useRef(null);

  // === توليد مفتاح الكاش ===
  const getCacheKey = useCallback(() => {
    if (cacheKey) return cacheKey;
    // توليد مفتاح بناءً على الدالة والاعتماديات
    const funcString = fetchFunction.toString();
    const depsString = JSON.stringify(dependencies);
    return `fetch_${funcString.substring(0, 50)}_${depsString}`;
  }, [fetchFunction, dependencies, cacheKey]);

  // === التحقق من صلاحية الكاش ===
  const isCacheValid = useCallback((cachedData) => {
    if (!cachedData) return false;
    const now = Date.now();
    return (now - cachedData.timestamp) < cacheTTL;
  }, [cacheTTL]);

  // === دالة الجلب الرئيسية ===
  const fetchData = useCallback(
    async (skipCache = false) => {
      // إلغاء أي طلب سابق
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // إنشاء AbortController جديد
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setIsFetching(true);
      setLoading(true);
      setError(null);

      // التحقق من الكاش
      if (!skipCache && cache && cacheRef.current) {
        const cached = cacheRef.current;
        if (isCacheValid(cached)) {
          setData(cached.data);
          setLoading(false);
          setIsFetching(false);
          if (onSuccess) onSuccess(cached.data);
          return;
        }
      }

      let attempts = 0;
      let lastError = null;

      while (attempts <= retryCount) {
        try {
          const result = await fetchFunction(abortController.signal);
          
          // التحقق من إلغاء الطلب
          if (abortController.signal.aborted) {
            return;
          }

          // تحديث البيانات
          setData(result);
          setError(null);
          setLoading(false);
          setIsFetching(false);
          fetchCountRef.current += 1;

          // حفظ في الكاش
          if (cache) {
            cacheRef.current = {
              data: result,
              timestamp: Date.now(),
            };
            try {
              localStorage.setItem(
                getCacheKey(),
                JSON.stringify({
                  data: result,
                  timestamp: Date.now(),
                })
              );
            } catch (e) {
              // تجاهل أخطاء localStorage
            }
          }

          if (onSuccess) onSuccess(result);
          return result;
        } catch (err) {
          // تخطي أخطاء الإلغاء
          if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
            return;
          }

          lastError = err;
          attempts++;

          if (attempts <= retryCount) {
            // انتظار قبل إعادة المحاولة
            await new Promise((resolve) => {
              retryTimeoutRef.current = setTimeout(resolve, retryDelay * attempts);
            });
          }
        }
      }

      // فشل جميع المحاولات
      const finalError = lastError || new Error('فشل في جلب البيانات');
      setError(finalError.message || 'حدث خطأ أثناء جلب البيانات');
      setLoading(false);
      setIsFetching(false);
      if (onError) onError(finalError);
    },
    [fetchFunction, retryCount, retryDelay, cache, isCacheValid, getCacheKey, onSuccess, onError]
  );

  // === دالة إعادة المحاولة ===
  const refetch = useCallback(
    (skipCache = false) => {
      return fetchData(skipCache);
    },
    [fetchData]
  );

  // === دالة إلغاء الطلب ===
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    setLoading(false);
    setIsFetching(false);
  }, []);

  // === تحميل البيانات من الكاش عند البدء ===
  useEffect(() => {
    if (cache && !initialData) {
      try {
        const stored = localStorage.getItem(getCacheKey());
        if (stored) {
          const parsed = JSON.parse(stored);
          if (isCacheValid(parsed)) {
            setData(parsed.data);
            cacheRef.current = parsed;
            setLoading(false);
          }
        }
      } catch (e) {
        // تجاهل أخطاء localStorage
      }
    }
  }, [cache, getCacheKey, initialData, isCacheValid]);

  // === جلب البيانات عند تغيير الاعتماديات ===
  useEffect(() => {
    if (!autoFetch) return;

    isMountedRef.current = true;
    fetchData();

    // تنظيف عند إلغاء التثبيت
    return () => {
      isMountedRef.current = false;
      cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);

  // === إعادة تعيين الخطأ عند تغيير الاعتماديات ===
  useEffect(() => {
    setError(null);
  }, [...dependencies]);

  return {
    data,
    loading,
    error,
    refetch,
    cancel,
    isFetching,
    // معلومات إضافية
    retry: refetch,
    fetchCount: fetchCountRef.current,
  };
};

export default useFetch;