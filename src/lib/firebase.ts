import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

let app: FirebaseApp | undefined
let analytics: Analytics | undefined

// Only initialize when a config is present (skips local dev without env vars)
// and only in the browser where Analytics is supported.
if (firebaseConfig.apiKey && typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig)
  isSupported()
    .then((supported) => {
      if (supported && app) analytics = getAnalytics(app)
    })
    .catch(() => {
      /* Analytics unsupported (e.g. SSR/prerender, blocked) — ignore. */
    })
}

export { app, analytics }
