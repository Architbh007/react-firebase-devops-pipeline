import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration - uses environment variables when available
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAOFBYofKi4BBBFgNrbOY-MekVm6a7vk7Y",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "fullstack-2e14f.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "fullstack-2e14f",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "fullstack-2e14f.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "438764839401",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:438764839401:web:546a9a44ecbead5be5eb78",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-618EH8S1KE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Export app for other Firebase services if needed
export default app;