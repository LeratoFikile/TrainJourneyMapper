import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCFlaTbccwyEw_wB7aUkEBTSlx3y6Bsjw",
  authDomain: "train-journey-mapper.firebaseapp.com",
  projectId: "train-journey-mapper",
  storageBucket: "train-journey-mapper.firebasestorage.app",
  messagingSenderId: "514217213683",
  appId: "1:514217213683:web:6cfa8cf32e2640379bc186",
  measurementId: "G-PY5RCE8QJ5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);