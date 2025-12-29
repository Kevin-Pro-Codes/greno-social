import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import profile from '../assets/profile.svg';
import '../styles/ChatContainer.css';

function LeftBox({ isChatMinimized, toggleChat }) {
  const [visibleCount, setVisibleCount] = useState(10);

  const chatList = [
    { name: 'Sarah_Tech', preview: 'Hey, about the React component...', time: '2 min', unread: 3 },
    { name: 'Dev_Mike', preview: 'Meeting at 3pm tomorrow', time: '1h' },
    // ... your chat list
  ];

  const visibleChats = chatList.slice(0, visibleCount);

  const showMore = () => {
    setVisibleCount(prev => Math.min(prev + 10, chatList.length));
  };

  const showLess = () => {
    setVisibleCount(10);
  };

  if (isChatMinimized) {
    return (
      <div className="show-hide-chat">
        <button onClick={toggleChat} className="max-chat-btn border-0 bg-transparent">
          <FiChevronRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="left-box bg-black rounded p-3 h-100 d-flex flex-column min-h-0">
      <div className="chat-header mb-3 flex-shrink-0">
        <div className="chat-header-top d-flex align-items-center position-relative mb-2">
          <button onClick={toggleChat} className="min-chat-btn border-0 bg-transparent position-absolute start-0">
            <FiChevronLeft size={20} />
          </button>
          <h3 className="chat-title text-center flex-grow-1 m-0">Chats</h3>
        </div>
        <div className="search-chat position-relative">
          <FiSearch className="search-icon position-absolute top-50 start-0 translate-middle-y ms-2" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-100 ps-4"
          />
        </div>
      </div>

      <div className="chat-scrollable-container flex-grow-1 min-h-0">
        {visibleChats.map((chat, index) => (
          <div className={`chat-item d-flex align-items-center p-2 rounded ${chat.unread ? 'unread' : ''}`} key={index}>
            <img src={profile} alt="Profile" className="chat-avatar me-2 flex-shrink-0" />
            <div className="chat-info flex-grow-1 min-w-0 me-2">
              <div className="chat-name text-truncate">{chat.name}</div>
              <div className="chat-preview text-truncate">{chat.preview}</div>
            </div>
            <div className="chat-meta d-flex flex-column align-items-end flex-shrink-0">
              <span className="chat-time">{chat.time}</span>
              {chat.unread && <span className="unread-badge">{chat.unread}</span>}
            </div>
          </div>
        ))}
        
        {chatList.length > 10 && (
          <div className="show-more-chats d-flex justify-content-center align-items-center py-2 flex-shrink-0">
            <button
              onClick={visibleCount < chatList.length ? showMore : showLess}
              className="post-dots border-0 bg-transparent"
            >
              {visibleCount < chatList.length ? (
                <>
                  <span className="dot2"></span>
                  <span className="dot2"></span>
                  <span className="dot2"></span>
                </>
              ) : (
                <>
                  <span className="dot2"></span>
                  <span className="dot2"></span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftBox;