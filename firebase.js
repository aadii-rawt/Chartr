// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7NTZxDlAOVlKWRpX68KzwqVfJONNsHrw",
  authDomain: "chartr-apk.firebaseapp.com",
  projectId: "chartr-apk",
  storageBucket: "chartr-apk.firebasestorage.app",
  messagingSenderId: "378777297169",
  appId: "1:378777297169:web:7095b13a825cbe76ff2cb0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);