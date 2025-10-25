import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import profilex from '../assets/profilex.svg';
import '../styles/ChatContainer.css';
import '../styles/ShowHideChat.css';
import '../styles/Containers.css';

function LeftBox({ isChatMinimized, toggleChat }) {
  const [showAll, setShowAll] = useState(false); // 👈 state to toggle how many chats to show

  const chatList = [
    { name: 'Sarah_Tech', preview: 'Hey, about the React component...', time: '2 min', unread: 3 },
    { name: 'Dev_Mike', preview: 'Meeting at 3pm tomorrow', time: '1h' },
    { name: 'CodeGroup', preview: 'Alex: I pushed the new changes', time: '4h' },
    { name: 'DesignTeam', preview: 'New UI mockups attached', time: '5h', unread: 1 },
    { name: 'Mentor_James', preview: 'Your code review is done', time: 'Yesterday' },
    { name: 'Startup_Team', preview: 'Funding meeting notes', time: 'Yesterday' },
    { name: 'UX_Lisa', preview: 'Feedback on the new flow', time: '2d' },
    { name: 'Hackathon', preview: 'Team assignments posted', time: '2d', unread: 5 },
    // ... add the rest as needed
  ];

  const visibleChats = showAll ? chatList : chatList.slice(0, 5); // 👈 only show first 5 unless toggled

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

      {/* 🔽 Scrollable container for chats */}
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

        {/* 👇 Show more/less control */}
        {chatList.length > 5 && (
          <div className="show-more-chats" onClick={() => setShowAll(!showAll)}>
            <span style={{ cursor: 'pointer', color: '#a0cc3a' }}>
              {showAll ? 'Show less' : '…'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftBox;
