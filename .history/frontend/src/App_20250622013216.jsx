import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


import Page from './Page';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>        
        <Route path="/" element={<Login />} />
         <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Page />} />
 
      </Routes>
    </BrowserRouter>
  );
}




