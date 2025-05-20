// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBlzJzLlyRXe353ZcmlyKthrzF-msiqeqk",
  authDomain: "shop-cake-1241a.firebaseapp.com",
  projectId: "shop-cake-1241a",
  storageBucket: "shop-cake-1241a.firebasestorage.app",
  messagingSenderId: "1086588124430",
  appId: "1:1086588124430:web:92dbae1b31bc6ebc202b5f",
  measurementId: "G-T6BF1RS5JB"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
