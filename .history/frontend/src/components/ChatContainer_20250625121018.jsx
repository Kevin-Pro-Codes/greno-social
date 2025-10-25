import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import profilex from '../assets/profilex.svg';
import '../styles/ChatContainer.css';
import '../styles/ShowHideChat.css';
import '../styles/Containers.css';

function LeftBox({ isChatMinimized, toggleChat }) {
  const [visibleCount, setVisibleCount] = useState(10);

  const chatList = [/* your full list as is */];

  const visibleChats = chatList.slice(0, visibleCount);

  const showMore = () => {
    setVisibleCount(prev => Math.min(prev + 10, chatList.length));
  };

  const showLess = () => {
    setVisibleCount(10); // Resets to initial view
  };

  if (isChatMinimized) {
    return (
      <div className="show-hide-chat">
        <button onClick={toggleChat} className="max-chat-btn">
          <FiChevronRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="left-box">
      <div className="chat-header">
        <div className="chat-header-top">
          <button onClick={toggleChat} className="min-chat-btn">
            <FiChevronLeft size={20} />
          </button>
          <h3 className="chat-title">Chats</h3>
        </div>
        <div className="search-chat">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className="chat-scrollable-container">
        {visibleChats.map((chat, index) => (
          <div className={`chat-item ${chat.unread ? 'unread' : ''}`} key={index}>
            <img src={profilex} alt="Profile" className="chat-avatar" />
            <div className="chat-info">
              <div className="chat-name">{chat.name}</div>
              <div className="chat-preview">{chat.preview}</div>
            </div>
            <div className="chat-meta">
              <span className="chat-time">{chat.time}</span>
              {chat.unread && <span className="unread-badge">{chat.unread}</span>}
            </div>
          </div>
        ))}

        {chatList.length > 10 && (
          <div className="show-more-chats" onClick={visibleCount < chatList.length ? showMore : showLess}>
            <span style={{ cursor: 'pointer', color: '#a0cc3a', fontWeight: 'bold' }}>
              {visibleCount < chatList.length ? 'Show more' : 'Show less'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftBox;
