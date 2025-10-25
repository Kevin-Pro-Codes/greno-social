import React from 'react';



import Page from './Page.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import Register from './Register.jsx';
import PublicRoute from '../support/PublicRoute.jsx';
import ProtectedRoute from '../support/ProtectedRoute.jsx';
import { AuthProvider } from '../support/AuthContext.jsx';
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




