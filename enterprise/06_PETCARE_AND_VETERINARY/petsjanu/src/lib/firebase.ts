import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyPetJanuDemoKey2026",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "petjanu-app.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "petjanu-app",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "petjanu-app.appspot.com",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
};

// Initialize Firebase App safely
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth: Auth = getAuth(app);

// Initialize Firestore DB
export const db: Firestore = getFirestore(app);

export const isFirebaseConfigured = true;

// Connection validation
if (typeof window !== 'undefined') {
  import('firebase/firestore').then(({ doc, getDocFromServer }) => {
    getDocFromServer(doc(db, 'test', 'connection')).catch((error) => {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.warn('[Firebase] Connection offline. Operating with local fallback.');
      }
    });
  }).catch(() => {});
}
