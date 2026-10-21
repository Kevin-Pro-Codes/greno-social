import React, { useState } from 'react';
import Navbar from '../components/Navbar';         
import Containers from '../components/Containers';

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  const toggleChat = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#222222]">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="flex-1 w-full max-w-[2000px] mx-auto p-4 box-border">
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
