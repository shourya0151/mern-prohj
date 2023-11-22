// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-e8151.firebaseapp.com",
  projectId: "mern-estate-e8151",
  storageBucket: "mern-estate-e8151.appspot.com",
  messagingSenderId: "396276274045",
  appId: "1:396276274045:web:9c181df8ad70e4043ff214"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);