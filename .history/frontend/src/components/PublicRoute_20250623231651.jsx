import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
