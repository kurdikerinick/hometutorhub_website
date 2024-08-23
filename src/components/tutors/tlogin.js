import React, { useState } from 'react';
import { getAuth, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../firebase/firebase';
import { get, ref } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const TutorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const auth = getAuth();
      console.log('Attempting to sign in with:', email, password);
      
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const tutorsRef = ref(db, 'tutors');
      const snapshot = await get(tutorsRef);

      let tutorId = null;
      if (snapshot.exists()) {
        const tutorsData = snapshot.val();
        for (const id in tutorsData) {
          if (tutorsData[id].email === email) {
            tutorId = id;
            break;
          }
        }
      }

      if (!user.emailVerified) {
        await sendVerificationEmail(user);
        toast.info('Verification email sent. Please check your inbox and click on the verification link.');
      } else {
        if (tutorId) {
          localStorage.setItem('tutorId', tutorId);
          navigate(`/tutoraccount/${tutorId}`);
        } else {
          setError('Tutor ID not found.');
        }
      }
    } catch (error) {
      console.error('Error signing in:', error);
      if (error.code === 'auth/invalid-credential') {
        setError('Invalid credentials. Please check your email and password.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else {
        setError('Error signing in. Please try again later.');
      }
    }
  };

  const sendVerificationEmail = async (user) => {
    try {
      await sendEmailVerification(user);
      console.log('Verification email sent.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      setError('Error sending verification email. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Tutor Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>

        {error && <p>{error}</p>}
        <ToastContainer />
      </div>
    </div>
  );
};

export default TutorLogin;
