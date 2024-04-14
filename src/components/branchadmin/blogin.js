import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase/firebase'; // Assuming you have the auth object exported from firebase/firebase
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { toast } from 'react-toastify';
import '../branchadmin/blogin.css'
const BranchAdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Reference to the branchadmins table in the Firebase database
      const branchAdminsRef = ref(db, 'branchadmins');

      // Query to find the branch admin with matching email and location
      const branchAdminQuery = query(
        branchAdminsRef,
        orderByChild('email'), // Order by email
        equalTo(email) // Filter by email
      );

      const snapshot = await get(branchAdminQuery);

      if (snapshot.exists()) {
        // Extract the data of the first matching branch admin
        const branchAdminData = snapshot.val();
        const branchAdminKey = Object.keys(branchAdminData)[0];
        const branchAdmin = branchAdminData[branchAdminKey];

        // Check if the password matches
        if (branchAdmin.password === password) {
          // Check if email is verified
          if (auth.currentUser && auth.currentUser.emailVerified) {
            // Successful login
            alert('Login successful');
            navigate('/branchadminhome');
          } else {
            // Email not verified
            alert('Email not verified. Please verify your email before logging in.');
          }
        } else {
          // Invalid password
          alert('Invalid password');
        }
      } else {
        // If no branch admin with the given email is found
        alert('No branch admin with this email found');
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Display error message using toast
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
      <h1>Branch Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="">Select Branch</option>
            <option value="branch1">Branch 1</option>
            <option value="branch2">Branch 2</option>
            <option value="branch3">Branch 3</option>
          </select>
        </div>
        <button type="submit">Login</button>
      </form>
      </div>
    </div>
  );
};

export default BranchAdminLogin;
