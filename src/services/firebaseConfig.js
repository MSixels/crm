import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKKsqE1kzc8jW3JN79dM5GJQClTVq-m3I",
  authDomain: "sistema-pccn.firebaseapp.com",
  projectId: "sistema-pccn",
  storageBucket: "sistema-pccn.appspot.com",
  messagingSenderId: "189772410167",
  appId: "1:189772410167:web:887dfe42fe4fd50f75feb2",
  measurementId: "G-Z2DNRP7QQG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const firestore = getFirestore(app)
