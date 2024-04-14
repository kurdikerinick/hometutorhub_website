import React, { useState, useEffect } from 'react';
import { getAuth, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase/firebase';
import { ref, get } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const SuperAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Remove the isVerified state variable
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const auth = getAuth(app);
        const superadminRef = ref(app.database(), 'superadmin/1');
        const snapshot = await get(superadminRef);

        if (snapshot.exists()) {
          const superadminData = snapshot.val();
          if (superadminData.email === email && superadminData.password === password) {
            if (auth.currentUser && auth.currentUser.emailVerified) {
              toast.success('Email is verified!');
            }
          }
        }
      } catch (error) {
        console.error('Error checking verification:', error);
      }
    };

    checkVerification();
  }, [email, password]); // Remove setIsVerified from the dependency array

  const handleLogin = async () => {
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);

      if (!auth.currentUser.emailVerified) {
        await sendVerificationEmail(auth.currentUser);
        toast.info('Verification email sent. Please check your inbox and click on the verification link.');
      } else {
        navigate('/superadminsidebar');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Error signing in. Please try again later.');
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
        <h2>Super Admin Login</h2>
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

export default SuperAdminLogin;
