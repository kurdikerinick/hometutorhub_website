import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { Link } from 'react-router-dom';
import logo from '../../images/hometutorhublogo.png';
import { listAll, getDownloadURL, ref as sRef } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../../firebase/firebase';
import './findtutor.css';
import defaultPic from '../../images/defaultpic.jpg';

const Findtutor = () => {
  const [tutors, setTutors] = useState([]);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const defaultPhotoURL = defaultPic; // Or '/images/defaultpic.jpg' if in the public folder


  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  const handleClick = () => {
    navigate('/joinstudent');
  };

  useEffect(() => {
    const tutorsRef = ref(db, 'tutors');
    onValue(tutorsRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tutorsList = await Promise.all(
          Object.keys(data).map(async (key) => {
            const tutorData = { id: key, ...data[key] };
            try {
              // Fetch the list of files in the tutor's folder
              const folderRef = sRef(storage, `tutor_photos/${tutorData.id}/`);
              const fileList = await listAll(folderRef);

              // If there is at least one file, get its download URL
              if (fileList.items.length > 0) {
                const photoURL = await getDownloadURL(fileList.items[0]);
                return { ...tutorData, photoURL };
              } else {
                return { ...tutorData, photoURL: defaultPhotoURL }; // Use default photo
              }
            } catch (error) {
              console.error(`Error fetching photo for tutor ${tutorData.tutor_name}:`, error);
              return { ...tutorData, photoURL: defaultPhotoURL }; // If there's an error, set photoURL to default
            }
          })
        );
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
            <Link to="/" >Home</Link>
            <Link to="/jointutor">Join as Tutor</Link>
            <Link to="/joinstudent">Join as Student</Link>
            <Link to="/findtutor">Find Tutor</Link>
            <Link to="/" >About</Link>
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
                  {tutor.photoURL ? (
                    <img
                      src={tutor.photoURL}
                      alt={tutor.tutor_name}
                      className="tutor-photo"
                    />
                  ) : (
                    <p>No photo available</p>
                  )}
  <p><strong>Name:</strong> {tutor.tutor_name}</p>
  <p><strong>Education:</strong> {tutor.education}</p>
  <p><strong>Gender:</strong> {tutor.gender}</p>
  <p><strong>Subject:</strong> {tutor.subject}</p>
  <p><strong>Classes:</strong> {tutor.ccategory.join(', ')}</p>
  <p className="blink"><strong>Location:</strong> {Array.isArray(tutor.additionalOptions) ? tutor.additionalOptions.join(', ') : 'N/A'}</p>
</div>

                <div className="tutor-card-footer">
                  <button className="apply-button" onClick={handleClick}>APPLY</button>
                </div>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Findtutor;
