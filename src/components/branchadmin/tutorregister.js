import React, { useState } from 'react';
import { ref, set, push } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { ref as sRef, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../firebase/firebase';
import BranchAdminSidebar from './branchadminhome';
import '../branchadmin/register.css';

const TutorRegistration = () => {
  const [formData, setFormData] = useState({
    tutor_name: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
    education: '',
    contact: '',
    presentaddress: '',
    gender: '',
    paddress: '',
    subject: '',
    vehicle: '',
    ccategory: '',
    location: '',
    addressproof: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, addressproof: file });
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
        await sendEmailVerification(auth.currentUser);
        await uploadFile(formData.addressproof, response.user.uid);
        await saveFormData(response.user.uid);
  
        alert('Registration successful. Verification email sent.');
        resetForm();
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const uploadFile = async (file, userId) => {
    if (!file) return;
    const storageRef = sRef(storage, `addressproofs/${userId}/${file.name}`);
    await uploadBytes(storageRef, file);
    console.log('File uploaded successfully!');
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
      presentaddress: formData.presentaddress,
      tutor_name: formData.tutor_name,
      ccategory: formData.ccategory,
      contact: formData.contact,
      subject: formData.subject,
      gender: formData.gender,
      location:formData.location,
    };
    await set(tutorRef, dataToSave);
    console.log('Additional data saved to tutorRef successfully!');
  };

  const resetForm = () => {
    setFormData({
      tutor_name: '',
      email: '',
      dob: '',
      password: '',
      education: '',
      contact: '',
      presentaddress: '',
      gender: '',
      paddress: '',
      branch: '',
      subject: '',
      vehicle: '',
      ccategory: '',
      addressproof: null,
      location:'',
    });
  };
  return (
    <div className="registration-container">
      <BranchAdminSidebar />
      <h1>Tutor Registration</h1>
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
          <select
            placeholder="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
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
            placeholder="Permanent Address"
            name="paddress"
            value={formData.paddress}
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
          <select
            placeholder="Classes interested to teach"
            name="ccategory"
            value={formData.ccategory}
            onChange={handleInputChange}
            required
          >
            <option value="">Classes interested to teach</option>
            <option value="primary">Primary School</option>
            <option value="highschool">High School</option>
            <option value="college">College</option>
          </select>
        </div>
        <div>
          <select
            placeholder="Have your own vehicle?"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleInputChange}
            required
          >
            <option value="">Have your own vehicle?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            name="addressproof"
            onChange={handleFileChange}
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
            placeholder='Location'
            name="location"
            value={formData.location}
            onChange={handleSelectChange}
            required
          >
            <option value="">Select a Location</option>
            <option value="branch1">Branch 1</option>
            <option value="branch2">Branch 2</option>
            <option value="branch3">Branch 3</option>
          </select>
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default TutorRegistration;
