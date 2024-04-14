import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase'; // Import your Firebase database instance
import { ref, onValue } from 'firebase/database';
import SuperAdminSidebar from './sdashboard';
import './registeredbranchadmins.css'; // Import the CSS file

const RegisteredBranchAdmins = () => {
  const [branchAdmins, setBranchAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const branchAdminsRef = ref(db, 'branchadmins'); // Reference to the "branchadmins" table
    // Listen for changes to the branchadmins node in the database
    onValue(branchAdminsRef, (snapshot) => {
      try {
        const branchAdminsData = snapshot.val();
        if (branchAdminsData) {
          // Convert the object of branch admins into an array
          const adminsArray = Object.keys(branchAdminsData).map((key) => ({
            id: key,
            ...branchAdminsData[key],
          }));
          setBranchAdmins(adminsArray);
        } else {
          setBranchAdmins([]);
        }
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error('Error fetching branch admins:', error);
        setLoading(false);
        setError('Error fetching branch admins. Please try again later.');
      }
    }, (error) => {
      console.error('Error listening for changes to branch admins:', error);
      setLoading(false);
      setError('Error listening for changes to branch admins.');
    });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="registered-branch-admins">
      <SuperAdminSidebar/>
      <h2>Registered Branch Admins</h2>
      {branchAdmins.length === 0 ? (
        <p>No branch admins registered yet.</p>
      ) : (
        <table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Address</th>
      <th>Phone</th>
      <th>Date of Birth</th>
      <th>Location</th>
    </tr>
  </thead>
  <tbody>
    {branchAdmins.map((admin) => (
      <tr key={admin.id}>
        <td>{admin.name}</td>
        <td>{admin.email}</td>
        <td>{admin.address}</td>
        <td>{admin.phone}</td>
        <td>{admin.dob}</td>
        <td>{admin.location}</td>
      </tr>
    ))}
  </tbody>
</table>

      )}
    </div>
  );
};

export default RegisteredBranchAdmins;
