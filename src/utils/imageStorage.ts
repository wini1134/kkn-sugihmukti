import { useState, useEffect, useRef } from 'react';
import { subscribeToAppState, saveAppState } from '../lib/firebase';

const DB_NAME = 'kkn_sugihmukti_posko_db';
const STORE_NAME = 'app_data';

export function compressImageFile(
  file: File,
  maxWidth = 600,
  maxHeight = 600,
  quality = 0.65
): Promise<string> {
  return new Promise((resolve, reject) => {
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

export async function setPersistentItem(key: string, value: string | object): Promise<void> {
  const stringVal = typeof value === 'string' ? value : JSON.stringify(value);
  const now = Date.now();

  // 1. Save to IndexedDB (Primary reliable storage - no 5MB limit)
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(stringVal, key);
    store.put(now.toString(), `${key}_time`);
    await new Promise<void>((resolve) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch (err) {
    console.error('IndexedDB save failed', err);
  }

  // 2. Save to localStorage as secondary fast cache
  try {
    localStorage.setItem(key, stringVal);
    localStorage.setItem(`${key}_time`, now.toString());
  } catch (err) {
    console.warn(`localStorage setItem full for ${key}, relying on IndexedDB & Firebase`, err);
  }

  // 3. Save to Firebase Firestore (Global & Permanent Cloud Sync)
  try {
    await saveAppState(key, value, now);
  } catch (err) {
    console.error('Firebase save failed', err);
  }
}

export async function getPersistentItem(key: string, fallback: string): Promise<string> {
  // Try IndexedDB first because it handles full data without quota truncations
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
      return idbResult;
    }
  } catch (e) {
    console.warn('IndexedDB read failed', e);
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

export async function getPersistentTimestamp(key: string): Promise<number> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(`${key}_time`);
    const result = await new Promise<string | undefined>((resolve) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(undefined);
    });
    if (result) return parseInt(result, 10) || 0;
  } catch (_) {}

  try {
    const localTime = localStorage.getItem(`${key}_time`);
    if (localTime) return parseInt(localTime, 10) || 0;
  } catch (_) {}

  return 0;
}

export async function syncAllLocalToFirebase(): Promise<number> {
  const keys = [
    'kkn_admin_users_v2',
    'kkn_hero_bg',
    'kkn_about_img',
    'kkn_navbar_logo',
    'kkn_team_members_v1',
    'kkn_gallery_items_v1',
    'kkn_polaroids_v1',
    'kkn_programs_v1',
    'kkn_testimonials_v2',
    'kkn_guestbook_entries_v1',
    'kkn_programs_v2',
    'kkn_gallery_v2',
    'kkn_team_v2',
    'kkn_hero_banner_v2',
    'kkn_guestbook_v2',
    'kkn_polaroids_v2'
  ];

  let syncedCount = 0;
  for (const key of keys) {
    try {
      const saved = await getPersistentItem(key, '');
      const time = await getPersistentTimestamp(key);
      if (saved) {
        let parsed;
        try {
          parsed = JSON.parse(saved);
        } catch {
          parsed = saved;
        }
        if (parsed !== null && parsed !== undefined && parsed !== '') {
          await saveAppState(key, parsed, time || Date.now());
          syncedCount++;
        }
      }
    } catch (e) {
      console.warn(`Error syncing key ${key} to Firebase:`, e);
    }
  }
  return syncedCount;
}

/**
 * Custom React hook for real-time Firebase Cloud Firestore + IndexedDB + LocalStorage persistent state.
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, (updater: T | ((prev: T) => T)) => void, boolean] {
  const [state, setState] = useState<T>(() => {
    try {
      const local = localStorage.getItem(key);
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (parsed !== null && parsed !== undefined) return parsed;
        } catch (_) {
          // If local is a raw string (e.g., base64 photo or text)
          return local as unknown as T;
        }
      }
    } catch (_) {}
    return initialValue;
  });

  const isLoadedRef = useRef(false);
  const userHasUpdatedRef = useRef(false);
  const localTimestampRef = useRef<number>(0);
  const localValueRef = useRef<T>(state);

  // Keep localValueRef in sync with state
  useEffect(() => {
    localValueRef.current = state;
  }, [state]);

  useEffect(() => {
    let isMounted = true;

    // 1. Initial local load from IndexedDB (handles larger datasets and strings reliably)
    Promise.all([
      getPersistentItem(key, ''),
      getPersistentTimestamp(key)
    ]).then(([saved, time]) => {
      if (!isMounted || userHasUpdatedRef.current) return;
      if (time) localTimestampRef.current = time;

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed !== undefined && parsed !== null) {
            setState(parsed);
            localValueRef.current = parsed;
          }
        } catch (_) {
          if (typeof initialValue === 'string') {
            setState(saved as unknown as T);
            localValueRef.current = saved as unknown as T;
          }
        }
      }
      isLoadedRef.current = true;
    });

    // 2. Subscribe to Real-Time Firebase Firestore updates
    const unsubscribe = subscribeToAppState(key, (cloudValue, cloudTimestampMs) => {
      if (!isMounted) return;
      if (cloudValue !== undefined && cloudValue !== null) {
        if (userHasUpdatedRef.current) return;

        // Prevent empty or default cloud state from overwriting custom local data
        const isCloudEmpty =
          (Array.isArray(cloudValue) && cloudValue.length === 0) ||
          (typeof cloudValue === 'string' && cloudValue.trim() === '');

        const isLocalNotEmpty =
          (Array.isArray(localValueRef.current) && localValueRef.current.length > 0) ||
          (typeof localValueRef.current === 'string' && localValueRef.current.trim() !== '');

        // If local data exists and is newer than cloud data, push local data to Cloud instead of overwriting!
        if (localTimestampRef.current > cloudTimestampMs && isLocalNotEmpty) {
          saveAppState(key, localValueRef.current, localTimestampRef.current).catch(() => {});
          return;
        }

        // If cloud is empty while local has data, don't overwrite local data with empty
        if (isCloudEmpty && isLocalNotEmpty) {
          saveAppState(key, localValueRef.current, localTimestampRef.current || Date.now()).catch(() => {});
          return;
        }

        // Accept cloud update if cloud timestamp is newer or valid
        setState(cloudValue);
        localValueRef.current = cloudValue;
        if (cloudTimestampMs) localTimestampRef.current = cloudTimestampMs;
        isLoadedRef.current = true;

        // Keep local cache in sync with Cloud
        try {
          const stringVal = typeof cloudValue === 'string' ? cloudValue : JSON.stringify(cloudValue);
          try {
            localStorage.setItem(key, stringVal);
            if (cloudTimestampMs) localStorage.setItem(`${key}_time`, cloudTimestampMs.toString());
          } catch (_) {}

          openDB().then((db) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            store.put(stringVal, key);
            if (cloudTimestampMs) store.put(cloudTimestampMs.toString(), `${key}_time`);
          }).catch(() => {});
        } catch (_) {}
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [key]);

  const setPersistentState = (updater: T | ((prev: T) => T)) => {
    userHasUpdatedRef.current = true;
    isLoadedRef.current = true;
    const now = Date.now();
    localTimestampRef.current = now;

    setState((prev) => {
      const nextValue = typeof updater === 'function' ? (updater as (prev: T) => T)(prev) : updater;
      localValueRef.current = nextValue;
      setPersistentItem(key, nextValue as unknown as string | object);
      return nextValue;
    });
  };

  return [state, setPersistentState, isLoadedRef.current];
}
