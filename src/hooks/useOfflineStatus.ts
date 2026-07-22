import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../services/api';

const CHECK_INTERVAL_MS = 10000;
const FETCH_TIMEOUT_MS = 4000;

export function useOfflineStatus(): boolean {
  const [isOffline, setIsOffline] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const check = async () => {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
        const response = await fetch(API_BASE_URL, {
          method: 'HEAD',
          signal: controller.signal,
        });
        clearTimeout(timer);
        if (mountedRef.current) {
          setIsOffline(false);
        }
      } catch {
        if (mountedRef.current) {
          setIsOffline(true);
        }
      }
    };

    check();
    const interval = setInterval(check, CHECK_INTERVAL_MS);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  return isOffline;
}
