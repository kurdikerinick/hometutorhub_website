import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../firebase/firebase.js'; // Adjust path as needed
import BranchAdminSidebar from './branchadminhome.js';
import './enquires.css'; // Import the CSS file

const Students = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
        const userDataRef = ref(db, 'students');
        const snapshot = await get(userDataRef);

        if (snapshot.exists()) {
          const userDataList = [];
          snapshot.forEach((childSnapshot) => {
            userDataList.push(childSnapshot.val());
          });
          console.log('Fetched user data:', userDataList); // Log the fetched data
          setUserData(userDataList);
        } else {
          console.log('No data available in the payments table');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <div className="enquires-container">
      <BranchAdminSidebar />
      <h2 className="enquires-header">Students Details</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Student ID</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Present Address</th>
            <th>Subject</th>
            <th>Board</th>

          </tr>
        </thead>
        <tbody>
          {userData.length > 0 ? (
            userData.map((students, index) => (
              <tr key={index}>
                <td>{students.stud_name || 'N/A'}</td>
                <td>{students.studentId || 'N/A'}</td>
                <td>{students.email || 'N/A'}</td>
                <td>{students.contact || 'N/A'}</td>
                <td>{students.presentaddress || 'N/A'}</td>
                <td>{students.subject || 'N/A'}</td>
                <td>{students.board || 'N/A'}</td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Students;
