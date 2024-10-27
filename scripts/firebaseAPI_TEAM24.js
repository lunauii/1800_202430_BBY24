// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-qBTke-Ck4_EsnO124E65sA2ybJI6rI4",
  authDomain: "comp-1800-bby-24.firebaseapp.com",
  projectId: "comp-1800-bby-24",
  storageBucket: "comp-1800-bby-24.appspot.com",
  messagingSenderId: "717474678518",
  appId: "1:717474678518:web:793c126430b22fc690ced7"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();