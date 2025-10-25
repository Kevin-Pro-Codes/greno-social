import React from 'react';
import { FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import profilex from '../assets/profilex.svg';
import '../styles/ChatContainer.css';
import '../styles/ShowHideChat.css';
import '../styles/Containers.css';

function LeftBox({ isChatMinimized, toggleChat }) {
  const chatList = [
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
  { name: 'Docker_Gang', preview: 'New image pushed', time: '5h', unread: 3 },
  { name: 'BillingDept', preview: 'Invoice #9837 sent', time: '1mo' },
  { name: 'Dev_Laura', preview: 'Pair programming?', time: '2h' },
  { name: 'QA_Team', preview: 'Regression suite passed', time: '2d' },
  { name: 'FinTech_Grp', preview: 'API keys rotated', time: '5d' },
  { name: 'NextJS_Forum', preview: 'SSR issue debugged', time: '2w' },
  { name: 'Docs_Bot', preview: 'New markdown tips', time: '1d' },
  { name: 'AI_Lab', preview: 'Prompt tuning guide', time: '3w' },
  { name: 'CloudBilling', preview: 'Cost spike alert', time: '2w', unread: 1 },
  { name: 'TeamZen', preview: 'Code freeze scheduled', time: '3d' },
  { name: 'LegacySupport', preview: 'Deprecated API notice', time: '6h' },
  { name: 'Vue_Meetup', preview: 'Slides are up!', time: '1w' },
  { name: 'ReactNative_Dev', preview: 'Crash logs fixed', time: '4d' },
  { name: 'Sales_Team', preview: 'Quarterly report', time: 'Yesterday' },
  { name: 'Dev_Andy', preview: 'Review left on PR', time: '5h' },
  { name: 'Startup_Alpha', preview: 'Demo scheduled', time: 'Today' },
  { name: 'FoundersChat', preview: 'Pitch deck updated', time: '2mo' },
  { name: 'Team_Merge', preview: 'Conflict resolved', time: '3d' },
  { name: 'DarkModeGang', preview: 'CSS variables refactored', time: '1mo' },
  { name: 'DebuggersClub', preview: 'Null pointer issue', time: '6d' },
  { name: 'Mentor_Sam', preview: 'Let’s talk progress', time: '3d' },
  { name: 'CI_CD_Team', preview: 'Pipeline green ✅', time: '7h' },
  { name: 'DesignCritique', preview: 'Review at 4pm', time: 'Today' },
  { name: 'Interns2025', preview: 'Welcome email sent', time: 'Yesterday' },
  { name: 'TestBot_3000', preview: 'All tests passed', time: '1h' },
  { name: 'Slack_Alerts', preview: 'Downtime detected', time: '30m', unread: 6 },
  { name: 'Zoom_Call', preview: 'Meeting starting soon', time: 'Now' },
  { name: 'Frontend_Mara', preview: 'Button styles fixed', time: '1d' },
  { name: 'iOS_Team', preview: 'Push notification test', time: '6h' },
  { name: 'JS_Wizards', preview: 'Hoisting deep dive', time: '4d' },
  { name: 'Legal_Team', preview: 'NDA templates updated', time: '1w' },
  { name: 'Partners_Inc', preview: 'Contract received', time: '2w' },
  { name: 'Notifications', preview: 'Unread summary posted', time: 'Today' },
];

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

      {/* 🔽 Scrollable container for all chats */}
      <div className="chat-scrollable-container">
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
