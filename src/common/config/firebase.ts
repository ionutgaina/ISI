// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API,
//   authDomain: import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.REACT_APP_FIREBASE_APP_ID,
// };

// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);

// export default firebaseApp;


// src/common/config/firebase.ts
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: process.env.VITE_FIREBASE_API_KEY,
//   authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.VITE_FIREBASE_APP_ID,
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);




// for testing only


// Import the functions you need from the SDKs you need
import exp from "constants";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9xSO9bEomEHVraoAFIMLXYEsXPNcojj4",
  authDomain: "isi-project-ed199.firebaseapp.com",
  projectId: "isi-project-ed199",
  storageBucket: "isi-project-ed199.firebasestorage.app",
  messagingSenderId: "884507024644",
  appId: "1:884507024644:web:7753dfe43ccf80a5220451"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);