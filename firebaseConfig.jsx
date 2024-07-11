// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJ3DbEwVC-6gWTbuN86h02uVUwsJZlyDk",
  authDomain: "h2s-detection-system.firebaseapp.com",
  databaseURL: "https://h2s-detection-system-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "h2s-detection-system",
  storageBucket: "h2s-detection-system.appspot.com",
  messagingSenderId: "591698070481",
  appId: "1:591698070481:web:64d3cb58936aab74b1eef0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);