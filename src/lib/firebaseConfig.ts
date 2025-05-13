// c:\VS\webdev\personal-portfolio\src\firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; // Optional: if you want to use Analytics
// import { getAuth } from "firebase/auth"; // If you plan to use Authentication
// import { getFirestore } from "firebase/firestore"; // If you plan to use Firestore
// import { getStorage } from "firebase/storage"; // If you plan to use Storage

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID // Optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app); // Optional

// Export the services you want to use in your app
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);

export default app; // Export the initialized app itself, or specific services
export { analytics }; // Export analytics if you plan to use it elsewhere
