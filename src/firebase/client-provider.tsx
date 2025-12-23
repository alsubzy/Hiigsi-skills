'use client';

import {
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';

import { initializeFirebase, FirebaseProvider } from '@/firebase';

type FirebaseClientProviderProps = {
  children: ReactNode;
};

type FirebaseInstances = {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
};

/**
 * Ensures that Firebase is initialized only once on the client-side.
 */
export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
  const [firebase, setFirebase] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    // This code only runs on the client
    const instances = initializeFirebase();
    setFirebase(instances);
  }, []);

  if (!firebase) {
    // You can render a loading spinner here if you want
    return null;
  }

  return (
    <FirebaseProvider
      firebaseApp={firebase.firebaseApp}
      firestore={firebase.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
