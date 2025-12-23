
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
} {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
  };

  const firebaseApp = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();
  const firestore = getFirestore(firebaseApp);

  return { firebaseApp, firestore };
}

export * from './provider';
export * from './client-provider';
