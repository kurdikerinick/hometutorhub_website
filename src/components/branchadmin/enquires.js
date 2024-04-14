import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../firebase/firebase.js'; // Assuming db is your Firebase database reference
import BranchAdminSidebar from './branchadminhome.js';
import './enquires.css'; // Import the CSS file

const Enquires = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataRef = ref(db, 'users');
        const snapshot = await get(userDataRef);
        
        if (snapshot.exists()) {
          const userDataList = [];
          snapshot.forEach((childSnapshot) => {
            userDataList.push(childSnapshot.val());
          });
          setUserData(userDataList);
        } else {
          console.log('No data available in the users table');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="enquires-container">
      <BranchAdminSidebar/>
      <h2 className="enquires-header">User Details</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.contact}</td>
              <td>{user.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Enquires;
