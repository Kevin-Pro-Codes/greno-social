import React, { useState } from 'react';
import { CgProfile } from "react-icons/cg";
import { FiSearch, FiBell, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import Navbar from '../components/Navbar';         
import Containers from '../components/Containers';
import logo from './assets/greeno.jpg';
import profile from './assets/profile.svg';
import kevin from './assets/kevin.jpg';


import './App.css';
import '../styles/Navbar.css';
import './styles/Containers.css';
import './styles/ChatContainer.css';
import './styles/PostContainer.css';
import './styles/ToolContainer.css';

import './styles/ShowHideChat.css';
import './styles/Login.css';


export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  const toggleChat = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  return (
    <div className="app-container">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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
