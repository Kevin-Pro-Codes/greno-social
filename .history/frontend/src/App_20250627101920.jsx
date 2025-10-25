import React from 'react';



import Page from './Page';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import PublicRoute from './support/PublicRoute';
import ProtectedRoute from './support/ProtectedRoute';
import { AuthProvider } from './support/AuthContext.jsx';
import { useEffect } from 'react';



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




