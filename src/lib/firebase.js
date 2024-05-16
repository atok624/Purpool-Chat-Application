import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "we-chat-f61ce.firebaseapp.com",
  projectId: "we-chat-f61ce",
  storageBucket: "we-chat-f61ce.appspot.com",
  messagingSenderId: "948103776474",
  appId: "1:948103776474:web:7566c2cd1a480d3bc0fde3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
