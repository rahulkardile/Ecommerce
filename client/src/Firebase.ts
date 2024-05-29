import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "wixshop-1.firebaseapp.com",
  projectId: "wixshop-1",
  storageBucket: "wixshop-1.appspot.com",
  messagingSenderId: "343665866195",
  appId: "1:343665866195:web:334322b50625487009eb26",
  measurementId: "G-CDM4Z099Z7"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);