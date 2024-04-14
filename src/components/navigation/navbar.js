import React, { useState, useRef } from 'react';
import './navbar.css';
import { getDatabase, ref, push } from 'firebase/database';

import logo from '../../images/logo.jpeg';
import EmailIcon from '@mui/icons-material/Email';
import PlaceIcon from '@mui/icons-material/Place';
import CallIcon from '@mui/icons-material/Call';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    message: ''
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // State variable for form submission success

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const db = getDatabase();
    const usersRef = ref(db, 'users');

    push(usersRef, formData)
      .then(() => {
        setFormData({
          name: '',
          contact: '',
          message: ''
        });
        setIsFormSubmitted(true);
      })
      .catch((error) => {
        console.error('Error submitting message:', error);
        alert('An error occurred while submitting your message. Please try again later.');
      });
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToRef = (ref) => {
    window.scrollTo({ top: ref.current.offsetTop, behavior: 'smooth' });
  };

  return (
    <div>
      <nav className={`navbar ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        <div className="navbar-container">
          <a href="/" onClick={(e) => { e.preventDefault(); scrollToRef(homeRef); }}>
            <img className="navbar-logo" src={logo} alt="Logo" />
          </a>
          <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-menu' : ''}`}>
            <a href="/" onClick={(e) => { e.preventDefault(); scrollToRef(homeRef); }}>Home</a>
            <a href="/" onClick={(e) => { e.preventDefault(); scrollToRef(aboutRef); }}>About</a>
            <a href="/" onClick={(e) => { e.preventDefault(); scrollToRef(contactRef); }}>Contact</a>
            <div className="navbar-dropdown">
              <button className="dropbtn">Login</button>
              <div className="dropdown-content">
                <a href="/studentlogin">Student</a>
                <a href="/slogin">Super Admin</a>
                <a href="/blogin">Branch Admin</a>
                <a href="/tutorlogin">Tutor</a>
              </div>
            </div>
          </div>
          <div className="mobile-menu-toggle" onClick={handleMobileMenuToggle}>
            &#9776; {/* Unicode for the hamburger icon */}
          </div>
        </div>
      </nav>
      <div ref={homeRef} className="fullscreen-section home-section">
        <h1 className='landing-page'>SR Tutorials</h1>
        <p className='landing-paragraph'> Unlock the power of personalized Learning at Your doorstep!<br />Learning made easy: One-on-One at Home <br/>
        Where education meets Comfort, and personalized<br/> learning thrives.</p>
        <button className="know-more-button">Know More</button>
      </div>
      <div ref={aboutRef} className="fullscreen-section about-section">
        <div className="about-us-container">
          <h1 className='about-us-h1'>Who We Are</h1>
          <p className='aboutus-p'> Your Partner in Learning and Growth. 
            We are a team of creative minds<br/> committed to providing you with the best resources and  guidance on  your<br/> educational journey. Our goal is to make learning a delightful and enriching<br/> experience.
            Our services encompass a wide range of subjects, from <br/>science to art, and everything in between. <br/>We're here to help you unlock your potential and achieve your goals.
          </p>
        </div>
      </div>
      <div ref={contactRef} className="fullscreen-section contact-section">
        <div className="contact-container">
          <div className="contact-box">
            <h2>Contact Us</h2>
            <div className="info-item">
              <CallIcon/>
              <span>9987656787</span>
            </div>
            <div className="info-item">
              <EmailIcon/> <span>info@srtutorials.com</span>
            </div>
            <div className="info-item">
              <PlaceIcon/>
              <span>Vidya Nagar BVB college, Hubli 580008 </span>
            </div>
            <h2>Get in Touch</h2>
            <div className="contact-form-box">
              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input type="text" id="name" name="name" placeholder="Your Name" required onChange={handleChange} value={formData.name} />
                  </div>
                  <div className="form-group">
                    <input type="tel" id="contact" name="contact" placeholder="Your Contact Number" required onChange={handleChange} value={formData.contact} />
                  </div>
                  <div className="form-group">
                    <textarea id="message" name="message" placeholder="Type Your Message" rows="4" required onChange={handleChange} value={formData.message}></textarea>
                  </div>
                  <button type="submit">Submit</button>
                </form>
              </div>
            </div>
            {isFormSubmitted && (
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
          <p>&copy; 2024 SRTutorials. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Navbar;
