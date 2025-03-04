import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBAtRCYRY7s3a65mqblzbkAWpr4YCz34Y",
  authDomain: "forumwikiwurdleeu.firebaseapp.com",
  projectId: "forumwikiwurdleeu",
  storageBucket: "forumwikiwurdleeu.firebasestorage.app",
  messagingSenderId: "306125331533",
  appId: "1:306125331533:web:525fa2b028eac69e4bd004",
  measurementId: "G-4VTFZXR4JD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);