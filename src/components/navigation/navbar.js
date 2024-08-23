import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import logo from '../../images/hometutorhublogo.png';
import EmailIcon from '@mui/icons-material/Email';
import PlaceIcon from '@mui/icons-material/Place';
import CallIcon from '@mui/icons-material/Call';
import { db  } from '../../firebase/firebase';
import { ref, push,set } from 'firebase/database';


const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToContactSection = () => {
    contactRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToRef = (ref) => {
    window.scrollTo({ top: ref.current.offsetTop, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      contact: e.target.contact.value,
      message: e.target.message.value
    };

    try {
      await saveFormData(formData);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000); // Hide the message after 3 seconds
    } catch (error) {
      console.error('Error saving form data to Firebase:', error);
    }
  };

  const saveFormData = async (formData) => {
    try {
      // Create a reference to the 'users' path
      const usersRef = ref(db, 'users');
      
      // Create a new reference in the 'users' path and get the key
      const newUserRef = push(usersRef);
      const userId = newUserRef.key;

      // Save form data with the new userId
      await set(newUserRef, { ...formData, userId });
      console.log('Form data saved successfully to users table!');
    } catch (error) {
      console.error('Error saving form data to Firebase:', error);
    }
  };

  return (
    <div>
      <nav className={`navbar ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="navbar-container">
          <Link to="/" onClick={(e) => { e.preventDefault(); scrollToRef(homeRef); }}>
            <img className="navbar-logo" src={logo} alt="Logo" />
          </Link>
          <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-menu' : ''}`}>
            <Link to="/" onClick={(e) => { e.preventDefault(); scrollToRef(homeRef); }}>Home</Link>
            <Link to="/jointutor">Join as Tutor</Link>
            <Link to="/joinstudent">Join as Student</Link>
            <Link to="/findtutor">Find Tutor</Link>
            <Link to="/" onClick={(e) => { e.preventDefault(); scrollToRef(aboutRef); }}>About</Link>
            <Link to="/" onClick={(e) => { e.preventDefault(); scrollToRef(contactRef); }}>Contact</Link>
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
      <div ref={homeRef} className="fullscreen-section home-section">
        <h1 className='landing-page'>EduNest</h1>
        <p className='landing-paragraph'>
          Unlock the power of personalized Learning at Your doorstep!<br />
          Learning made easy: One-on-One at Home <br />
          Where education meets Comfort, and personalized<br /> learning thrives.
        </p>
        <button className="know-more-button" onClick={scrollToContactSection}>Know More</button>
      </div>
      <div ref={aboutRef} className="fullscreen-section about-section">
        <div className="about-us-container">
          <h1 className='about-us-h1'>Who We Are</h1>
          <p className='aboutus-p'>
            Your Partner in Learning and Growth.<br />
            We are a team of creative minds committed to providing you with the best resources and guidance on your educational journey. Our goal is to make learning a delightful and enriching experience.<br />
            Our services encompass a wide range of subjects, from science to art, and everything in between. We're here to help you unlock your potential and achieve your goals.
          </p>
        </div>
      </div>
      <div ref={contactRef} className="fullscreen-section contact-section">
        <div className="contact-container">
          <div className="contact-box">
            <h2>Contact Us</h2>
            <div className="info-item">
              <CallIcon />
              <span>7349400222</span>
            </div>
            <div className="info-item">
              <EmailIcon />
              <span>edunest24@gmail.com</span>
            </div>
            <div className="info-item">
              <PlaceIcon />
              <span>Vidya Nagar BVB college, Hubli 580008 </span>
            </div>
            <h2>Get in Touch</h2>
            <div className="contact-form-box">
              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input type="text" id="name" name="name" placeholder="Your Name" required />
                  </div>
                  <div className="form-group">
                    <input type="tel" id="contact" name="contact" placeholder="Your Contact Number" required />
                  </div>
                  <div className="form-group">
                    <textarea id="message" name="message" placeholder="Type Your Message" rows="4" required></textarea>
                  </div>
                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
            {isSubmitted && (
              <div className="success-message">
                <p>Your message has been submitted successfully!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 EduNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Navbar;
