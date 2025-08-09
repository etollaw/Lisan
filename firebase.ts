// app/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Analytics may not work properly in React Native without additional setup
// import { getAnalytics } from "firebase/analytics";
// import 'firebase/analytics'; // Note: This should come before getAuth()

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
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // This might not work in React Native without extra setup
const auth = getAuth(app);







const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;



