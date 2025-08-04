// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-66llW36EkRoj447xLcwEZIGd7wMBzXM",
  authDomain: "shivkara-digitals.firebaseapp.com",
  projectId: "shivkara-digitals",
  storageBucket: "shivkara-digitals.firebasestorage.app",
  messagingSenderId: "63040739476",
  appId: "1:63040739476:web:80a67bec9fb4be4e2c3c81",
  measurementId: "G-X285XBSJP5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only on client side
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes ? getAnalytics(app) : null);
}

export { app, analytics }; 