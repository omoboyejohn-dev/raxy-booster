// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_-MVpov7-MZKxGegsqvrbB4_a3a0WGHM",
  authDomain: "raxy-booster.firebaseapp.com",
  projectId: "raxy-booster",
  storageBucket: "raxy-booster.firebasestorage.app",
  messagingSenderId: "629973087965",
  appId: "1:629973087965:web:f274a36384968b814c0d34",
  measurementId: "G-L520MSR5L5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Export
export { auth, db };
