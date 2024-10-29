// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

/*
 * FROM ANGELO
 *  The following is a template for the Firebase configuration script.
 *  On your local machine, you will need to replace the values with your own.
 *  The values can be found in the Firebase Console.
 *  Once you have the values, please duplicate this file in the same directory and
 *  rename it to "firebaseAPI_BBY24.js" and then fill in the missing values with
 *  the values from your Firebase project.
 *  
 */

const firebaseConfig = {
  apiKey: ,
  authDomain: ,
  projectId: ,
  storageBucket: ,
  messagingSenderId: ,
  appId: 
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();