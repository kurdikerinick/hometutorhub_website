import React, { useState } from 'react';
import { ref, set, push } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import './joinastutor.css';
import { Link } from 'react-router-dom';
import logo from '../../images/hometutorhublogo.png';

import { db } from '../../firebase/firebase'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';
const Joinstudent = () => {
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    stud_name: '',
    email: '',
    dob: '',
    board: '',
    contact: '',
    presentaddress: '',
    location: '',
    class: '',
    subject: '',
    password: '',
    confirmPassword: '',
    additionalOptions: []

  });
const navigate= useNavigate();

const locationOptions = {
  Hubballi: [
    'OldHubballi', 'Vidyanagar', 'Keshwapur', 'Gokul road', 'Unkal', 'SaiNagar',
    'Lingaraj Nagar', 'Akshay Park', 'Akshay Colony', 'Manjunath Nagar',
    'Deshpande Nagar', 'Navanagar'
  ],
  Dharwad: [
    'Malamaddi', 'Kalyan Nagar', 'Shivagiri', 'CBNagar', 'Saptapur',
    'RaniChennamma Nagar', 'SaiNagar', 'Sampige Nagar', 'ShriNagar',
    'Basava Nagar', 'Navoday Nagar', 'Nisarga Layout', 'Madihal', 'Mrutyunjay Nagar'
  ],
  Gadag: [
    'Mulgund Naka', 'Hatalgeri Naka', 'Sambapur Road', 'Hudko Colony',
    'Puttaraj Nagar', 'Mudhol'
  ],
};
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const { name } = e.target;
    setFormData((prevFormData) => {
      const updatedOptions = checked
        ? [...prevFormData[name], value]
        : prevFormData[name].filter((item) => item !== value);

      return {
        ...prevFormData,
        [name]: updatedOptions,
      };
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      validateForm();

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      const auth = getAuth();
      const response = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      if (response.user) {
        // Send email verification
        await sendEmailVerification(response.user);

        // Save form data to database
        await saveFormData(response.user.uid);

        alert('Registration successful. Verification email sent.');
navigate('/navbar')
      }
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.code === 'auth/email-already-in-use') {
        alert('Email address is already in use. Please log in or use a different email address.');
      } else {
        alert('Registration failed. Please try again.');
      }
    }
  };

  const validateForm = () => {
    if (!formData.email) {
      throw new Error('Email is required.');
    }

    if (!isValidEmail(formData.email)) {
      throw new Error('Invalid email format.');
    }
  };

  const isValidEmail = (email) => {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const saveFormData = async (userId) => {
    const formDataRef = ref(db, `students/${userId}`);
    // Generate a unique student ID using a counter node
    const counterRef = ref(db, 'counters/userId');
    const snapshot = await push(counterRef);
    const studentId = snapshot.key;

    // Save form data along with the generated student ID to the students table
    await set(formDataRef, { ...formData, studentId });
    console.log('Form data saved successfully to students table!');

    // Save some fields to the stud_ref along with the default userId
    const studRef = ref(db, `stud_ref/${userId}`);
    const dataToSave = {
      student_id: userId, // Save the default userId as student_id
      stud_name: formData.stud_name,
      board: formData.board,
      class: formData.class,
      contact: formData.contact,
      subject: formData.subject,
      location: formData.location,
      additionalOptions: formData.additionalOptions, // Save additional options

    };
    await set(studRef, dataToSave);
    console.log('Additional data saved to stud_ref successfully!');
  };

  

  return (
    <div className="container">
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
            <Link to="/" >Contact</Link>
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
      <div className='form-wrapper'>
        <h1>Register as Student</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Name"
              name="stud_name"
              value={formData.stud_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              type="date"
              placeholder="Date of Birth"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Board"
              name="board"
              value={formData.board}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Contact"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Present Address"
              name="presentaddress"
              value={formData.presentaddress}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Class"
              name="class"
              value={formData.class}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <select
              name="location"
              value={formData.location}
              onChange={handleSelectChange}
              required
            >
              <option value="">Select a Location</option>
              <option value="Hubballi">Hubballi</option>
              <option value="Dharwad">Dharwad</option>
              <option value="Gadag">Gadag</option>
            </select>
          </div>

          {/* Conditionally render additional options based on selected location */}
          {formData.location && locationOptions[formData.location] && (
            <div>
              <p>Additional Options for {formData.location}:</p>
              {locationOptions[formData.location].map((option) => (
                <div key={option}>
                  <input
                    type="checkbox"
                    name="additionalOptions"
                    value={option}
                    checked={formData.additionalOptions.includes(option)}
                    onChange={handleCheckboxChange}
                  />
                  <label>{option}</label>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="register-button">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Joinstudent;
