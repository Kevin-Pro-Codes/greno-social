// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  console.log('isLoggedIn:', isLoggedIn);
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}