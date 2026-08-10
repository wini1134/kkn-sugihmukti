import { useState, useEffect, useRef } from 'react';

/**
 * Utility for compressing image files and ensuring persistent storage across page reloads & site exits.
 * Uses HTML Canvas for compression and IndexedDB + localStorage for reliable data retention.
 */

const DB_NAME = 'kkn_sugihmukti_posko_db';
const STORE_NAME = 'app_data';

/**
 * Compresses an image file (e.g. uploaded photo from phone or camera) to a lightweight high-quality JPEG base64.
 * This shrinks 5MB-15MB raw image files down to ~40KB-90KB, preventing storage quota errors.
 */
export function compressImageFile(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's not an image file or SVG, attempt fallback reader
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
      const fallbackReader = new FileReader();
      fallbackReader.onerror = (err) => reject(err);
      fallbackReader.onload = () => resolve(fallbackReader.result as string);
      fallbackReader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = (err) => reject(err);
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = (err) => reject(err);
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves item to both localStorage and IndexedDB so data survives closing browser or leaving page.
 */
export async function setPersistentItem(key: string, value: string | object): Promise<void> {
  const stringVal = typeof value === 'string' ? value : JSON.stringify(value);

  // 1. Save to localStorage if possible
  try {
    localStorage.setItem(key, stringVal);
  } catch (err) {
    console.warn(`localStorage setItem full for ${key}, relying on IndexedDB`, err);
  }

  // 2. Save to IndexedDB
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(stringVal, key);
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('IndexedDB save failed', err);
  }
}

/**
 * Reads persistent data from IndexedDB first (primary store), falling back to localStorage.
 */
export async function getPersistentItem(key: string, fallback: string): Promise<string> {
  // Check IndexedDB first for highest accuracy and capacity
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);
    const idbResult = await new Promise<string | undefined>((resolve) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(undefined);
    });
    if (idbResult !== undefined && idbResult !== null && idbResult !== '') {
      try {
        localStorage.setItem(key, idbResult);
      } catch (_) {}
      return idbResult;
    }
  } catch (e) {
    console.warn('IndexedDB read failed, falling back to localStorage', e);
  }

  // Fallback to localStorage
  try {
    const localVal = localStorage.getItem(key);
    if (localVal) return localVal;
  } catch (e) {
    console.warn('localStorage read failed', e);
  }

  return fallback;
}

/**
 * Custom React hook for robust, persistent state stored in IndexedDB + localStorage.
 * Prevents race conditions on page load/refresh.
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, (updater: T | ((prev: T) => T)) => void, boolean] {
  const [state, setState] = useState<T>(() => {
    try {
      const local = localStorage.getItem(key);
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed !== null && parsed !== undefined) return parsed;
      }
    } catch (_) {}
    return initialValue;
  });

  const isLoadedRef = useRef(false);
  const userHasUpdatedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    getPersistentItem(key, '').then((saved) => {
      if (!isMounted) return;
      // Skip async update if user has explicitly updated state
      if (userHasUpdatedRef.current) return;

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed !== undefined && parsed !== null) {
            setState(parsed);
          }
        } catch (_) {
          if (typeof initialValue === 'string') {
            setState(saved as unknown as T);
          }
        }
      }
      isLoadedRef.current = true;
    });
    return () => {
      isMounted = false;
    };
  }, [key]);

  const setPersistentState = (updater: T | ((prev: T) => T)) => {
    userHasUpdatedRef.current = true;
    isLoadedRef.current = true; // Mark as loaded when explicit update occurs
    setState((prev) => {
      const nextValue = typeof updater === 'function' ? (updater as (prev: T) => T)(prev) : updater;
      setPersistentItem(key, nextValue as unknown as string | object);
      return nextValue;
    });
  };

  useEffect(() => {
    if (isLoadedRef.current) {
      setPersistentItem(key, state as unknown as string | object);
    }
  }, [key, state]);

  return [state, setPersistentState, isLoadedRef.current];
}
