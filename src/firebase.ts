import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqOKADuIWuDd_715x1mlA-n37s0lJbX5I",
  authDomain: "sviat-todo.firebaseapp.com",
  projectId: "sviat-todo",
  storageBucket: "sviat-todo.firebasestorage.app",
  messagingSenderId: "401939388377",
  appId: "1:401939388377:web:750552bf97d9e959332bc8",
  measurementId: "G-MX32R0L0CG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
