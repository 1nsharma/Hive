import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY,
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID,
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: metaEnv.VITE_FIREBASE_APP_ID,
};

// Validate Firebase configuration
const isConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  !firebaseConfig.apiKey?.includes('DemoKey')
);

if (!isConfigured) {
  console.warn('[Firebase] Missing required credentials. Firebase will not be functional.');
}

// Initialize Firebase App safely
export const app: FirebaseApp | null = isConfigured ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)) : null;

// Initialize Firebase Auth and Firestore only if configured
export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;

export const isFirebaseConfigured = isConfigured;

// Connection validation
if (typeof window !== 'undefined') {
  import('firebase/firestore').then(({ doc, getDocFromServer }) => {
    if (db) {
      getDocFromServer(doc(db, 'test', 'connection')).catch((error) => {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.warn('[Firebase] Connection offline. Operating with local fallback.');
        }
      });
    }
  }).catch(() => {});
}
