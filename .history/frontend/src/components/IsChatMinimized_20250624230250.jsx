import React, { useState } from 'react';
import LeftBox from './LeftBox';
import ToolContainer from './ToolContainer'; // or whatever the center is
import '../styles/YourLayout.css'; // assuming this is where .center-box lives

function ChatContainer() {
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  const toggleChat = () => {
    setIsChatMinimized((prev) => !prev);
  };

  return (
    <div className="main-layout">
      <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      
      <div className={`center-box ${isChatMinimized ? 'chat-minimized' : ''}`}>
        <ToolContainer />
      </div>
    </div>
  );
}

export default ChatContainer;