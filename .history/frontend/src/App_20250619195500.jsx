import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { FiSearch, FiBell, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { CgProfile } from "react-icons/cg";
import logo from './assets/greeno.jpg';
import profile from './assets/profile.svg';
import kevin from './assets/kevin.jpg';

import Navbar from './components/Navbar';
import Containers from './components/Containers';

import './App.css';
import './styles/Navbar.css';
import './styles/Containers.css';
import './styles/ShowHideChat.css';
import Login from './Login';


function App() {
  return <Login />;
}

export default App;