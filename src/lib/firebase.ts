import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';
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

/**
 * Listens to real-time changes from Firestore for a given state key.
 */
export function subscribeToAppState(key: string, onChange: (value: any) => void) {
  const docRef = doc(db, 'app_state', key);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && data.value !== undefined) {
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
    const docRef = doc(db, 'app_state', key);
    const stringVal = typeof value === 'string' ? JSON.stringify(value) : JSON.stringify(value);
    await setDoc(docRef, {
      key,
      value: stringVal,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error(`Firestore save error for ${key}:`, error);
  }
}
