import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import profile from '../assets/profile.svg';
import '../styles/ChatContainer.css';

function LeftBox({ isChatMinimized, toggleChat }) {
  const [visibleCount, setVisibleCount] = useState(10);

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
    { name: 'CloudOps_Alex', preview: 'AWS instance scaled', time: '3h', unread: 2 },
    { name: 'DataViz_Team', preview: 'Chart updates live', time: '1d' },
    { name: 'InfraGroup', preview: 'Firewall config updated', time: '6h' },
    { name: 'ML_Lab', preview: 'Model accuracy improved', time: '3d' },
    { name: 'Dev_Priya', preview: 'Can you review PR #21?', time: '8h', unread: 1 },
    { name: 'GraphQL_Team', preview: 'API schema changed', time: '2d' },
    { name: 'iOS_Beta', preview: 'New build released', time: '12h', unread: 4 },
    { name: 'Web_Lead', preview: 'SEO audit feedback', time: '2w' },
    { name: 'Testers_Only', preview: 'Bug report on mobile nav', time: '5d' },
    { name: 'ProjectX', preview: 'Sprint velocity improved', time: '6d' },
    { name: 'SlackBot', preview: 'Reminder: Team meeting', time: '1h' },
    { name: 'Dev_Rahul', preview: 'Refactor suggestions sent', time: '4d' },
    { name: 'SysAdmin', preview: 'Backup complete', time: 'Today' },
    { name: 'UI_Squad', preview: 'Component library updated', time: '3d' },
    { name: 'Backend_Ahmed', preview: 'Endpoint throttled', time: '3h' },
    { name: 'Recruitment', preview: 'Candidate shortlisted', time: '2w' },
    { name: 'SprintBoard', preview: 'Story points adjusted', time: '4h' },
    { name: 'DesignOps', preview: 'Feedback implemented', time: '1d' },
    { name: 'Analytics_Team', preview: 'User retention up 10%', time: '2d' },
    { name: 'Security_Check', preview: 'Audit logs reviewed', time: '1w' },
    { name: 'Node_Masters', preview: 'Memory leak patched', time: '3d' },
   
  ];

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
        <button onClick={toggleChat} className="max-chat-btn border-0 bg-transparent">
          <FiChevronRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="left-box bg-black rounded p-3 h-100 overflow-auto">
      <div className="chat-header mb-3">
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

      <div className="chat-scrollable-container d-flex flex-column gap-1">
        {visibleChats.map((chat, index) => (
          <div className={`chat-item d-flex align-items-center p-2 rounded ${chat.unread ? 'unread' : ''}`} key={index}>
            <img src={profile} alt="Profile" className="chat-avatar me-3" />
            <div className="chat-info flex-grow-1 min-w-0">
              <div className="chat-name">{chat.name}</div>
              <div className="chat-preview text-truncate">{chat.preview}</div>
            </div>
            <div className="chat-meta d-flex flex-column align-items-end ms-2">
              <span className="chat-time">{chat.time}</span>
              {chat.unread && <span className="unread-badge">{chat.unread}</span>}
            </div>
          </div>
        ))}
        
        {chatList.length > 10 && (
          <div className="show-more-chats d-flex justify-content-center align-items-center py-2">
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