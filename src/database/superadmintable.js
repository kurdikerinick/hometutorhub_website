// Import necessary Firebase modules
import { app } from '../firebase'; // Assuming firebase.js contains the Firebase app initialization
import { getDatabase, ref, set } from 'firebase/database';

// Define the table structure with initial values
const superAdminData = {
  "1": {
    "name": "Nikhita K",
    "email": "superadmin@gmail.com",
    "phone": "6362259038",
    "dob": "1999-11-01",
    "password": "nikhita19"
  }
};

// Get a reference to the Firebase Realtime Database
const db = getDatabase(app);

// Function to create the super admin table and add values
const createSuperAdminTable = async () => {
  try {
    // Set the super admin data at the root of the database
    await set(ref(db), superAdminData);
    console.log('Super admin table created successfully!');
  } catch (error) {
    console.error('Error creating super admin table:', error);
  }
};

// Call the function to create the super admin table and add values
createSuperAdminTable();
