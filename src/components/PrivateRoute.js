import React, { useState, useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { auth } from '../firebase/firebase'; // Import your Firebase authentication instance

// PrivateRoute component for protected routes
const PrivateRoute = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user); // Update authentication status based on user presence
    });

    return () => {
      unsubscribe(); // Unsubscribe from authentication state changes
    };
  }, []);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Navigate to="/slogin" replace /> // Redirect to login page if not authenticated
        )
      }
    />
  );
};

export default PrivateRoute;
