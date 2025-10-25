import React from 'react';
import { FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import profilex from '../assets/profilex.svg';
import '../styles/ChatContainer.css';
import '../styles/ShowHideChat.css';
import '../styles/Containers.css';

function LeftBox({ isChatMinimized, toggleChat }) {
  const chatList = [
    { name: 'Sarah_Tech', preview: 'Hey, about the React component...', time: '2 min', unread: 3 },
    { name: 'Dev_Mike', preview: 'Meeting at 3pm tomorrow', time: '1h' },
    { name: 'CodeGroup', preview: 'Alex: I pushed the new changes', time: '4h' },
    { name: 'DesignTeam', preview: 'New UI mockups attached', time: '5h', unread: 1 },
    { name: 'Mentor_James', preview: 'Your code review is done', time: 'Yesterday' },
    { name: 'Startup_Team', preview: 'Funding meeting notes', time: 'Yesterday' },
    { name: 'UX_Lisa', preview: 'Feedback on the new flow', time: '2d' },
    { name: 'Hackathon', preview: 'Team assignments posted', time: '2d', unread: 5 },
    { name: 'API_Group', preview: 'New documentation released', time: '3d' },
    { name: 'DevOps', preview: 'Server maintenance scheduled', time: '1w' },
    { name: 'ProductLead', preview: 'Sprint planning moved', time: '1w' },
    { name: 'HR_Team', preview: 'Policy updates shared', time: '2w' },
    { name: 'QA_Brenda', preview: 'Test cases completed', time: '2w' },
    { name: 'NodeJS_Bros', preview: 'Async bug fixed', time: '3w' },
    { name: 'ReactCore', preview: 'RFC: New hooks coming', time: '1mo' },
  ];

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

      <div className="chat-list scrollable-chat-list">
        {chatList.map((chat, index) => (
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
      </div>
    </div>
  );
}

export default LeftBox;
