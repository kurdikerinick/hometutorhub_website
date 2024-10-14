import React, { useState } from 'react';
import { ref as sRef, uploadBytes } from 'firebase/storage';
import { ref, set, push } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { db, storage } from '../../firebase/firebase'; // Adjust path as needed
import './joinastutor.css';
import { Link } from 'react-router-dom';
import logo from '../../images/hometutorhublogo.png';

import { useNavigate } from 'react-router-dom';

const Jointutor = () => {
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  

  const [formData, setFormData] = useState({
    tutor_name: '',
    email: '',
    education: '',
    contact: '',
    gender: '',
    subject: '',
    ccategory: [],
    location: '',
    additionalOptions: [],
    password: '',
    confirmPassword: '',
    photo: null, // Add photo state
  });

  const navigate = useNavigate();

  const locationOptions = {
    Hubballi: ['OldHubballi', 'Vidyanagar', 'Keshwapur', 'Gokul road', 'Unkal', 'SaiNagar', 'Lingaraj Nagar', 'Akshay Park', 'Akshay Colony', 'Manjunath Nagar', 'Deshpande Nagar', 'Navanagar'],
    Dharwad: ['Malamaddi', 'Kalyan Nagar', 'Shivagiri', 'CBNagar', 'Saptapur', 'RaniChennamma Nagar', 'SaiNagar', 'Sampige Nagar', 'ShriNagar', 'Basava Nagar', 'Navoday Nagar', 'Nisarga Layout', 'Madihal', 'Mrutyunjay Nagar'],
    Gadag: ['Mulgund Naka', 'Hatalgeri Naka', 'Sambapur Road', 'Hudko Colony', 'Puttaraj Nagar', 'Mudhol'],
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
      additionalOptions: [], // Reset additional options when location changes
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevFormData) => ({ ...prevFormData, photo: file }));
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

        // Upload photo to Firebase Storage
        if (formData.photo) {
          await uploadFile(formData.photo, response.user.uid);
        }

        alert('Registration successful. Verification email sent.');
        navigate('/navbar'); // Redirect to homepage
      }
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.code === 'auth/email-already-in-use') {
        alert('Email address is already in use. Please log in or use a different email address.');
      } else if (error.code === 'auth/invalid-email') {
        alert('Invalid email address. Please check the email format.');
      } else if (error.code === 'auth/weak-password') {
        alert('Weak password. Please use a stronger password.');
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const saveFormData = async (userId) => {
    const formDataRef = ref(db, `tutors/${userId}`);
    const counterRef = ref(db, 'counters/tutorId');

    const snapshot = await push(counterRef);
    const tutorId = snapshot.key;

    await set(formDataRef, { ...formData, tutorId });
    console.log('Form data saved successfully to tutors table!');

    const tutorRef = ref(db, `tutor_ref/${userId}`);
    const dataToSave = {
      tutor_id: userId,
      tutor_name: formData.tutor_name,
      ccategory: formData.ccategory,
      contact: formData.contact,
      subject: formData.subject,
      gender: formData.gender,
      location: formData.location,
      additionalOptions: formData.additionalOptions, // Save additional options
    };
    await set(tutorRef, dataToSave);
    console.log('Additional data saved to tutor_ref successfully!');
  };

  const uploadFile = async (file, userId) => {
    if (!file) return;
    const storageRef = sRef(storage, `tutor_photos/${userId}/${file.name}`);
    await uploadBytes(storageRef, file);
    console.log('File uploaded successfully!');
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
      <div className="form-wrapper">
        <h1>Registration as Tutor</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Name"
              name="tutor_name"
              value={formData.tutor_name}
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
              type="text"
              placeholder="Education"
              name="education"
              value={formData.education}
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
            <select
              name="gender"
              value={formData.gender}
              onChange={handleSelectChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
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
            <p>Classes interested to teach:</p>
            <div>
              <input
                type="checkbox"
                name="ccategory"
                value="primary"
                checked={formData.ccategory.includes('primary')}
                onChange={handleCheckboxChange}
              />
              <label>Primary School</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="ccategory"
                value="highschool"
                checked={formData.ccategory.includes('highschool')}
                onChange={handleCheckboxChange}
              />
              <label>High School</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="ccategory"
                value="college"
                checked={formData.ccategory.includes('college')}
                onChange={handleCheckboxChange}
              />
              <label>College</label>
            </div>
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
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit" className="joinbutton">Join as Tutor</button>
        </form>
      </div>
    </div>
  );
};

export default Jointutor;
