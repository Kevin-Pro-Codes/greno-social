// MainApp.jsx
import React, { useState } from 'react';
import Navbar from './Navbar';         // make sure this path is correct
import Containers from './Containers'; // make sure this path is correct

export default function MainApp() {
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
