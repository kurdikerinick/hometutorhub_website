import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
// import logo from '../../images/logo.jpeg';
// import { useNavigate } from 'react-router-dom';

import { db } from '../../firebase/firebase'; // Adjust the import path as needed
import TutorHome from './home';
// import { Link } from 'react-router-dom'; // Ensure you have imported Link from react-router-dom
// import './findtutor.css'; // Adjust the import path as needed

const StudentList = () => {
    // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tutors, setTutors] = useState([]);
//   const handleMobileMenuToggle = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

 
  useEffect(() => {
    const tutorsRef = ref(db, 'students');
    onValue(tutorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tutorsList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }));
        setTutors(tutorsList);
      } else {
        setTutors([]);
      }
    });
  }, []);

  return (
    <>
 <TutorHome/>
      <div className="tutors-container">
        <h1>Find Students</h1>
        <div className="tutors-grid">
          {tutors.length > 0 ? (
            tutors.map((students) => (
              <div key={students.id} className="tutor-card">
                {/* <div className="tutor-card-header">
                  <p><strong>Posted On:</strong> {new Date().toLocaleDateString()}</p>
                </div> */}
                <div className="tutor-card-body">
                  <p><strong>Name:</strong> {students.stud_name}</p>
                  {/* <p><strong>Email:</strong> {tutor.email}</p> */}
                  <p><strong>Address:</strong> {students.presentaddress}</p>
                  <p><strong>Board:</strong> {students.board}</p>
                  <p><strong>Class:</strong> {students.class}</p>
                  <p><strong>Subject:</strong> {students.subject}</p>
                  {/* <p><strong>Classes:</strong> {students.ccategory.join(', ')}</p> */}
                  <p><strong>Location:</strong> {students.location}</p>
                </div>
              
              </div>
            ))
          ) : (
            <p>No tutors found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentList;
