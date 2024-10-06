import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDlVkgHwtKH6tkLYgvW4LMlGLOLTSLngU0",
  authDomain: "sistema-pccn-be44a.firebaseapp.com",
  projectId: "sistema-pccn-be44a",
  storageBucket: "sistema-pccn-be44a.appspot.com",
  messagingSenderId: "205766770180",
  appId: "1:205766770180:web:6f26559b53394b8338ff51"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const firestore = getFirestore(app)
export const storage = getStorage(app)

