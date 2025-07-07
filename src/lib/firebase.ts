import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// IMPORTANT: Replace with your own Firebase project configuration.
const firebaseConfig = {
  apiKey: "AIzaSyA9aOc04uP77qVZ1E-HKLPZLJ_7b35z3zU",
  authDomain: "gymapp-3f326.firebaseapp.com",
  projectId: "gymapp-3f326",
  storageBucket: "gymapp-3f326.appspot.com",
  messagingSenderId: "830415062900",
  appId: "1:830415062900:web:35de7893d4d6f1267f8e21",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
