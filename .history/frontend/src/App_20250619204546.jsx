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
import './styles/Login.css';



import Login from './Login';
import Register from './Register';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* other routes */}
      </Routes>
    </BrowserRouter>
  );
}








/*

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  const toggleChat = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  return (
    <div className="app-container">
      {}
     <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {}
      <main className="main-content">
        

<Containers
  isChatMinimized={isChatMinimized}
  toggleChat={toggleChat}
  postContent={postContent}
  setPostContent={setPostContent}
/>


      </main>
    </div>
  );
}

export default App;

*/