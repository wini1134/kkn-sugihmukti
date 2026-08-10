import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom database ID if defined
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== ''
    ? firebaseConfig.firestoreDatabaseId
    : undefined
);

const CHUNK_SIZE = 500000; // 500 KB chunk threshold to safely bypass Firestore 1MB doc limit

/**
 * Listens to real-time changes from Firestore for a given state key.
 */
export function subscribeToAppState(key: string, onChange: (value: any) => void) {
  const docRef = doc(db, 'app_state', key);
  return onSnapshot(
    docRef,
    async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (!data) return;

        if (data.isChunked && data.chunkCount > 0) {
          try {
            const chunkPromises = [];
            for (let i = 0; i < data.chunkCount; i++) {
              chunkPromises.push(getDoc(doc(db, 'app_state', `${key}_c${i}`)));
            }
            const chunkSnaps = await Promise.all(chunkPromises);
            const fullString = chunkSnaps
              .map((s) => (s.exists() ? s.data()?.chunk || '' : ''))
              .join('');

            if (fullString) {
              try {
                onChange(JSON.parse(fullString));
              } catch (_) {
                onChange(fullString);
              }
            }
          } catch (err) {
            console.warn(`Failed to read chunked Firestore state for ${key}:`, err);
          }
        } else if (data.value !== undefined) {
          try {
            const parsed = JSON.parse(data.value);
            onChange(parsed);
          } catch (_) {
            onChange(data.value);
          }
        }
      }
    },
    (error) => {
      console.warn(`Firestore listener warning for ${key}:`, error);
    }
  );
}

/**
 * Saves or updates state value in Firestore for real-time sync across devices and deployments.
 */
export async function saveAppState(key: string, value: any): Promise<void> {
  try {
    const stringVal = typeof value === 'string' ? value : JSON.stringify(value);

    if (stringVal.length > CHUNK_SIZE) {
      const chunkCount = Math.ceil(stringVal.length / CHUNK_SIZE);
      const chunkPromises = [];

      for (let i = 0; i < chunkCount; i++) {
        const chunkStr = stringVal.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        const chunkDocRef = doc(db, 'app_state', `${key}_c${i}`);
        chunkPromises.push(setDoc(chunkDocRef, { chunk: chunkStr }));
      }

      await Promise.all(chunkPromises);

      const mainDocRef = doc(db, 'app_state', key);
      await setDoc(mainDocRef, {
        key,
        isChunked: true,
        chunkCount,
        value: '',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } else {
      const mainDocRef = doc(db, 'app_state', key);
      await setDoc(mainDocRef, {
        key,
        isChunked: false,
        chunkCount: 0,
        value: stringVal,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (error) {
    console.error(`Firestore save error for ${key}:`, error);
  }
}
