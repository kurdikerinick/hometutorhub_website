
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth'; // Import getAuth function from firebase/auth
import { getStorage } from 'firebase/storage'; // Import the getStorage function

import { getFunctions } from 'firebase/functions';


const firebaseConfig = {
  apiKey: "AIzaSyAaaxRXLSTUCNRW3sjgzMn5ocwh-KEdMZE",
  authDomain: "srtdemo-dfee0.firebaseapp.com",
  databaseURL: "https://srtdemo-dfee0-default-rtdb.firebaseio.com",
  projectId: "srtdemo-dfee0",
  storageBucket: "srtdemo-dfee0.appspot.com",
  messagingSenderId: "488445210099",
  appId: "1:488445210099:web:a094318e1cdd2ef37a7686"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize auth object
const storage = getStorage(app); // Initialize storage object
const db = getDatabase(app);
const firebaseApp = initializeApp(firebaseConfig);
const functions = getFunctions(firebaseApp);

export { app, db , auth, storage ,firebaseApp, functions}; 


