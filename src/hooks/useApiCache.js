import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

const CACHE_PREFIX = 'pf_cache_';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const DEBOUNCE_MS = 400; // debounce API calls to avoid rate-limiting on HMR

function getCache(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    const now = Date.now();
    // Check if cache expired (> 5 minutes)
    if (now - entry.ts > CACHE_DURATION) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return entry.data;
  } catch (err) {
    console.warn(`[useApiCache] Error reading cache for ${key}:`, err);
    return null;
  }
}

function setCache(key, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, ts: Date.now() }));
  } catch (err) {
    console.warn(`[useApiCache] Error setting cache for ${key}:`, err);
    // localStorage full — silently ignore
  }
}

export default function useApiCache(endpoint, options = {}) {
  const { transform, initialValue, enabled = true } = options;
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromCache, setFromCache] = useState(false);
  const mountedRef = useRef(true);

  // Store initialValue and transform in refs to avoid re-creating fetchData
  // when callers pass inline objects/arrays (e.g. { initialValue: [] })
  const initialValueRef = useRef(initialValue);
  initialValueRef.current = initialValue;
  const transformRef = useRef(transform);
  transformRef.current = transform;

  const fetchData = useCallback(async () => {
    if (!mountedRef.current) return;
    
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(endpoint);
      if (!mountedRef.current) return;

      // Handle various response formats from backend
      const currentTransform = transformRef.current;
      let result;
      if (currentTransform) {
        result = currentTransform(res);
      } else if (res.data?.data !== undefined) {
        result = res.data.data;
      } else if (res.data !== undefined) {
        result = res.data;
      } else {
        result = res;
      }

      // Ensure result is array or object, not null/undefined
      if (result === null || result === undefined) {
        result = Array.isArray(initialValueRef.current) ? [] : {};
      }

      setCache(endpoint, result);
      setData(result);
      setFromCache(false);
    } catch (err) {
      if (!mountedRef.current) return;

      // Skip handling for canceled requests
      if (err.code === 'ERR_CANCELED' || err.name === 'AbortError' || err.name === 'CanceledError') {
        return;
      }

      console.error(`[useApiCache] Error fetching ${endpoint}:`, err);

      // Try to use cached data on error
      const cached = getCache(endpoint);
      if (cached) {
        setData(cached);
        setFromCache(true);
        setError(null);
      } else {
        setError(err.message || 'Failed to fetch data');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [endpoint]); // Only depend on endpoint — stable across renders

  useEffect(() => {
    mountedRef.current = true;
    if (!enabled) return;

    // Debounce: delay API call to prevent burst requests (e.g. on HMR reload)
    const timer = setTimeout(() => {
      fetchData();
    }, DEBOUNCE_MS);

    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
    };
  }, [fetchData, enabled]);

  const refetch = useCallback(() => fetchData(), [fetchData]);

  return { data, loading, error, fromCache, refetch, setData };
}
