import React, { useState } from 'react';
import { ref, set, push } from 'firebase/database';
import { ref as sRef, uploadBytes } from 'firebase/storage';
import { storage, db } from '../../firebase/firebase';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import '../branchadmin/register.css'
import BranchAdminSidebar from './branchadminhome';

const StudentRegistration = () => {
  const [formData, setFormData] = useState({
    stud_name: '',
    email: '',
    dob: '',
    board: '',
    contact: '',
    presentaddress: '',
    primelocation: '',
    location: '',
    class: '',
    fees: '',
    days: '',
    subject: '',
    addressproof: null,
    password: '',
    confirmPassword: ''
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
  
        // Upload address proof file
        await uploadFile(formData.addressproof, response.user.uid);
  
        // Save form data to database
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
    // Basic email format validation
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
      fees: formData.fees,
      location: formData.location,
      month: null
    };
    await set(studRef, dataToSave);
    console.log('Additional data saved to stud_ref successfully!');
  };
  
  const resetForm = () => {
    setFormData({
      stud_name: '',
      email: '',
      dob: '',
      board: '',
      location: '',
      contact: '',
      presentaddress: '',
      primelocation: '',
      branch: '',
      class: '',
      fees: '',
      days: '',
      subject: '',
      addressproof: null,
      password: '',
      confirmPassword: ''
    });
  };  
  return (
    
    <div className="registration-container">
       <BranchAdminSidebar/>
      <h1>Student Registration</h1>
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
            placeholder="Prime Location"
            name="primelocation"
            value={formData.primelocation}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Branch"
            name="branch"
            value={formData.branch}
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
            placeholder="Fees"
            name="fees"
            value={formData.fees}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Days"
            name="days"
            value={formData.days}
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
          <input
            type="file"
            accept=".jpg, .png, .jpeg, .pdf"
            name="addressproof"
            onChange={handleFileChange}
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

export default StudentRegistration;