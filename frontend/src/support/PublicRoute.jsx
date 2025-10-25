import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function PublicRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const location = useLocation();

  // Redirect only if user is on a public page (e.g., /login or /register) and already authenticated
  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
