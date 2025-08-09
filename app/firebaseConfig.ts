// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSEa_ta4i94cV3X0IzMDXIGcton7XJ1_c",
  authDomain: "lisan-27815.firebaseapp.com",
  projectId: "lisan-27815",
  storageBucket: "lisan-27815.firebasestorage.app",
  messagingSenderId: "353440981076",
  appId: "1:353440981076:web:836b5d5bf2df4ce6b74dc1",
  measurementId: "G-SGQ84T0LM3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
