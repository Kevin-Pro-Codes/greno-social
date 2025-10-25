import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


import Page from './Page';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext.jsx';
import { useEffect } from 'react';


useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);

export default function App() {
   return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={           
           <PublicRoute>
            <Login />
          </PublicRoute>       
          }/>
          <Route path="/register" element={<Register />} />        
    
          <Route path="/home" element={
            <ProtectedRoute>
              <Page />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}




