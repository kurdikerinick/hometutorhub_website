import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import logo from '../../images/hometutorhublogo.png';
import { useNavigate } from 'react-router-dom';

import { db } from '../../firebase/firebase'; // Adjust the import path as needed
import { Link } from 'react-router-dom'; // Ensure you have imported Link from react-router-dom
import './findtutor.css'; // Adjust the import path as needed

const Findtutor = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tutors, setTutors] = useState([]);
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/joinstudent'); // Navigate to the JoinStudent page
  };
  useEffect(() => {
    const tutorsRef = ref(db, 'externaltutors');
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
      <nav className={`navbar ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      <div className="navbar-container">
    <Link to="/" >
      <img className="navbar-logo" src={logo} alt="Logo" />
    </Link>
    <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-menu' : ''}`}>
    <Link to="/">Home</Link>
            <Link to="/jointutor">Join as Tutor</Link>
            <Link to="/joinstudent">Join as Student</Link>

            <Link to="/findtutor" className="active">Find Tutor</Link>
            <Link to="/">About</Link>
            <Link to="/">Contact</Link>
            <div className="navbar-dropdown">
              <button className="dropbtn">Login</button>
              <div className="dropdown-content">
                <Link to="/studentlogin">Student</Link>
                {/* <Link to="/slogin">Super Admin</Link> */}
                {/* <Link to="/blogin">Branch Admin</Link> */}
                <Link to="/tutorlogin">Tutor</Link>
              </div>
            </div>
          </div>
          <div className="mobile-menu-toggle" onClick={handleMobileMenuToggle}>
            &#9776; {/* Unicode for the hamburger icon */}
          </div>
        </div>
      </nav>
      <div className="tutors-container">
        <h1>Find Tutors</h1>
        <div className="tutors-grid">
          {tutors.length > 0 ? (
            tutors.map((tutor) => (
              <div key={tutor.id} className="tutor-card">
                <div className="tutor-card-header">
                  <p><strong>Posted On:</strong> {new Date().toLocaleDateString()}</p>
                </div>
                <div className="tutor-card-body">
                  <p><strong>Name:</strong> {tutor.tutor_name}</p>
                  {/* <p><strong>Email:</strong> {tutor.email}</p> */}
                  <p><strong>Education:</strong> {tutor.education}</p>
                  {/* <p><strong>Contact:</strong> {tutor.contact}</p> */}
                  <p><strong>Gender:</strong> {tutor.gender}</p>
                  <p><strong>Subject:</strong> {tutor.subject}</p>
                  <p><strong>Classes:</strong> {tutor.ccategory.join(', ')}</p>
                  <p><strong>Location:</strong> {tutor.location}</p>
                </div>
                <div className="tutor-card-footer">
                  <button className="apply-button" onClick={handleClick}>APPLY</button>
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

export default Findtutor;
