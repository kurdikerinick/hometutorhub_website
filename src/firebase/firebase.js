
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth'; // Import getAuth function from firebase/auth
import { getStorage } from 'firebase/storage'; // Import the getStorage function

import { getFunctions } from 'firebase/functions';


const firebaseConfig = {
  apiKey: "AIzaSyCL8uX1TSrvAAkSC6AH4xy-V_e0NiSzPIs",
  authDomain: "hometutorhub-a8c90.firebaseapp.com",
  databaseURL: "https://hometutorhub-a8c90-default-rtdb.firebaseio.com",
  projectId: "hometutorhub-a8c90",
  storageBucket: "hometutorhub-a8c90.appspot.com",
  messagingSenderId: "309856332248",
  appId: "1:309856332248:web:aba9a8d07176867d7a6aad"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize auth object
const storage = getStorage(app); // Initialize storage object
const db = getDatabase(app);
const firebaseApp = initializeApp(firebaseConfig);
const functions = getFunctions(firebaseApp);

export { app, db , auth, storage ,firebaseApp, functions}; 


