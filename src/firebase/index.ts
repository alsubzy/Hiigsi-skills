import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import getConfig from 'next/config';

export function initializeFirebase(): {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  const { publicRuntimeConfig } = getConfig();

  const firebaseConfig = {
    apiKey: publicRuntimeConfig.NEXT_PUBLIC_API_KEY,
    authDomain: publicRuntimeConfig.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: publicRuntimeConfig.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: publicRuntimeConfig.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: publicRuntimeConfig.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: publicRuntimeConfig.NEXT_PUBLIC_APP_ID,
  };

  const firebaseApp = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  return { firebaseApp, auth, firestore };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
