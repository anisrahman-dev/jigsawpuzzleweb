import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'

// Firebase web app config. These values are public by design — they ship to
// every visitor's browser — so hardcoding them is safe and means Analytics
// works on any deploy without configuring env vars. Lock down data access with
// Firebase Security Rules / App Check, not by hiding this config.
const firebaseConfig = {
  apiKey: 'AIzaSyByaK_OQMYh6yzF8OtSatzlSV_-JdgP3bA',
  authDomain: 'jigsawjamweb.firebaseapp.com',
  projectId: 'jigsawjamweb',
  storageBucket: 'jigsawjamweb.firebasestorage.app',
  messagingSenderId: '337114226728',
  appId: '1:337114226728:web:89bda08de44f3fda3b151d',
  measurementId: 'G-SM6L910X32',
}

let app: FirebaseApp | undefined
let analytics: Analytics | undefined

// Only initialize in the browser where Analytics is supported (skips the
// Node-based SSR/prerender build).
if (typeof window !== 'undefined') {
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
