import { useState, useEffect, useRef } from 'react';
import { subscribeToAppState, saveAppState } from '../lib/firebase';

const DB_NAME = 'kkn_sugihmukti_posko_db';
const STORE_NAME = 'app_data';

export function compressImageFile(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.75
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

  // 1. Save to localStorage
  try {
    localStorage.setItem(key, stringVal);
  } catch (err) {
    console.warn(`localStorage setItem full for ${key}, relying on IndexedDB & Firebase`, err);
  }

  // 2. Save to IndexedDB
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(stringVal, key);
  } catch (err) {
    console.error('IndexedDB save failed', err);
  }

  // 3. Save to Firebase Firestore (Global & Permanent)
  try {
    await saveAppState(key, value);
  } catch (err) {
    console.error('Firebase save failed', err);
  }
}

export async function getPersistentItem(key: string, fallback: string): Promise<string> {
  try {
    const localVal = localStorage.getItem(key);
    if (localVal) return localVal;
  } catch (e) {
    console.warn('localStorage read failed', e);
  }

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

  return fallback;
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
      // Use getPersistentItem to check both localStorage AND IndexedDB (where large images live)
      const saved = await getPersistentItem(key, '');
      if (saved) {
        let parsed;
        try {
          parsed = JSON.parse(saved);
        } catch {
          parsed = saved;
        }
        if (parsed !== null && parsed !== undefined && parsed !== '') {
          await saveAppState(key, parsed);
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

    // 1. Initial local load & auto-sync existing local data to Firebase Cloud
    getPersistentItem(key, '').then((saved) => {
      if (!isMounted || userHasUpdatedRef.current) return;
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed !== undefined && parsed !== null) {
            setState(parsed);
            saveAppState(key, parsed).catch((err) =>
              console.warn(`Auto sync to cloud failed for ${key}`, err)
            );
          }
        } catch (_) {
          if (typeof initialValue === 'string') {
            setState(saved as unknown as T);
            saveAppState(key, saved).catch((err) =>
              console.warn(`Auto sync to cloud failed for ${key}`, err)
            );
          }
        }
      }
      isLoadedRef.current = true;
    });

    // 2. Subscribe to Real-Time Firebase Firestore updates
    const unsubscribe = subscribeToAppState(key, (cloudValue) => {
      if (!isMounted) return;
      if (cloudValue !== undefined && cloudValue !== null) {
        setState(cloudValue);
        isLoadedRef.current = true;
        // Keep local cache in sync
        try {
          const stringVal = typeof cloudValue === 'string' ? cloudValue : JSON.stringify(cloudValue);
          localStorage.setItem(key, stringVal);
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
    setState((prev) => {
      const nextValue = typeof updater === 'function' ? (updater as (prev: T) => T)(prev) : updater;
      setPersistentItem(key, nextValue as unknown as string | object);
      return nextValue;
    });
  };

  return [state, setPersistentState, isLoadedRef.current];
}
