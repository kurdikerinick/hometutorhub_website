import React, { useState } from 'react';
import { ref, set, push } from 'firebase/database';
import { db } from '../../firebase/firebase'; // Import your Firebase database instance
import '../branchadmin/register.css'
import SuperAdminSidebar from './sdashboard';

const BranchAdminRegistration = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Save branch admin details to the database
    saveBranchAdminToDatabase();
  };

  const saveBranchAdminToDatabase = () => {
    const branchAdminRef = ref(db, 'branchadmins');
    const newBranchAdminRef = push(branchAdminRef); // Generate a unique key

    const branchAdminData = {
      name: name,
      email: email,
      address: address,
      phone: phone,
      dob: dob,
      password: password,
      location: location
    };

    // Set the branch admin details at the newly generated key
    set(newBranchAdminRef, branchAdminData)
      .then(() => {
        alert('Branch admin registered successfully!');
        // Clear the form fields after successful registration
        setName('');
        setEmail('');
        setAddress('');
        setPhone('');
        setDob('');
        setPassword('');
        setConfirmPassword('');
        setLocation('');
      })
      .catch((error) => {
        console.error('Error saving branch admin details:', error);
        alert('An error occurred. Please try again later.');
      });
  };

  return (
    <div className="registration-container">
      <SuperAdminSidebar/>
      <h1>Branch Admin Registration</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder='Name'
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            placeholder='Email'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            placeholder='Address'
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            placeholder='Phone'
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            placeholder='Date of Birth'
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            placeholder='Password'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            placeholder='Confirm Password'
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <select
            placeholder='Location'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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

export default BranchAdminRegistration;
