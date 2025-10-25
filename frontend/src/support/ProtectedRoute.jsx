
import { useAuth } from './AuthContext.jsx';
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  // Add a loading state for auth check
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate or do real auth check here (e.g. localStorage, API call)
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(auth);
    setLoading(false); // Auth status is ready
  }, []);

  if (loading) {
    // While checking auth, render nothing or a loading spinner
    return null; 
  }

  // Redirect to login if NOT authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Otherwise, render the protected content
  return children;
}
