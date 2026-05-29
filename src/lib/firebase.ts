import type { FirebaseApp } from 'firebase/app';
import type * as FirestoreModule from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Object.values(firebaseConfig).every(Boolean);

interface FirebaseRuntime {
  app: FirebaseApp;
  firestore: Firestore;
  api: typeof FirestoreModule;
}

let runtimePromise: Promise<FirebaseRuntime | null> | null = null;

export function getFirebaseRuntime(): Promise<FirebaseRuntime | null> {
  if (!firebaseConfigured) return Promise.resolve(null);
  if (!runtimePromise) {
    runtimePromise = Promise.all([
      import('firebase/app'),
      import('firebase/firestore'),
    ]).then(([appModule, firestoreModule]) => {
      const app = appModule.getApps().length ? appModule.getApps()[0] : appModule.initializeApp(firebaseConfig);
      return {
        app,
        firestore: firestoreModule.getFirestore(app),
        api: firestoreModule,
      };
    });
  }
  return runtimePromise;
}
