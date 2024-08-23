import React, { useState } from 'react';
import { getAuth, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../firebase/firebase';
import { get,ref  } from 'firebase/database'; // Correct imports
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const auth = getAuth(); // Use the auth from the imported functions
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      const studentsRef = ref(db, 'students'); // Use the ref from the imported functions
      const snapshot = await get(studentsRef); // Use the get from the imported functions

      let studentId = null;
      if (snapshot.exists()) {
        const studentsData = snapshot.val();
        for (const id in studentsData) {
          if (studentsData[id].email === email) {
            studentId = id;
            break;
          }
        }
      }

      if (!user.emailVerified) {
        await sendVerificationEmail(user);
        toast.info('Verification email sent. Please check your inbox and click on the verification link.');
      } else {
        if (studentId) {
          localStorage.setItem('studentId', studentId);
          navigate(`/monitortest/${studentId}`); // Navigate to MonitorTests page with studentId
        } else {
          setError('Student ID not found.');
        }
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
        <h2>Student Login</h2>
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

export default StudentLogin;
