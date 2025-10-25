import React from 'react';
import { RiSpeakFill } from "react-icons/ri";
import { FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import { FaUser, FaUsers, FaCommentDots, FaImage, FaPlayCircle, FaUsersCog, FaEnvelope, FaFileAlt } from 'react-icons/fa';

import profile from '../assets/profile.svg';
import profilex from '../assets/profilex.svg';
import kevin from '../assets/kevin.jpg';
import '../styles/ShowHideChat.css';
import '../styles/Containers.css';

function Containers({
  isChatMinimized,
  toggleChat,
  postContent,
  setPostContent,
}) {
  return (
    <div className="three-box-layout">
      {/* Left Box - Chat */}
      {isChatMinimized ? (
        <div className="show-hide-chat">
          <button onClick={toggleChat} className="maximize-chat-btn">
            <FiChevronRight size={20} />
          </button>
        </div>
      ) : (
        <div className="left-box">
          <div className="chat-header">
            <div className="chat-header-top">
              <button onClick={toggleChat} className="minimize-chat-btn">
                <FiChevronLeft size={20} />
              </button>
              <h3 className="chat-title">Chats</h3>
            </div>
            <div className="search-chat">
              <FiSearch className="search-icon" />
              <input type="text" placeholder="Search..." />
            </div>
          </div>

          <div className="chat-list">
            {[
              {
                name: 'Sarah_Tech',
                preview: 'Hey, about the React component...',
                time: '2 min',
                unread: 3,
              },
              {
                name: 'Dev_Mike',
                preview: 'Meeting at 3pm tomorrow',
                time: '1h',
              },
              {
                name: 'CodeGroup',
                preview: 'Alex: I pushed the new changes',
                time: '4h',
              },
              {
                name: 'DesignTeam',
                preview: 'New UI mockups attached',
                time: '5h',
                unread: 1,
              },
              {
                name: 'Mentor_James',
                preview: 'Your code review is done',
                time: 'Yesterday',
              },
              {
                name: 'Startup_Team',
                preview: 'Funding meeting notes',
                time: 'Yesterday',
              },
              {
                name: 'UX_Lisa',
                preview: 'Feedback on the new flow',
                time: '2d',
              },
              {
                name: 'Hackathon',
                preview: 'Team assignments posted',
                time: '2d',
                unread: 5,
              },
              {
                name: 'API_Group',
                preview: 'New documentation released',
                time: '3d',
              },
              {
                name: 'DevOps',
                preview: 'Server maintenance scheduled',
                time: '1w',
              },
            ].map((chat, index) => (
              <div
                className={`chat-item ${chat.unread ? 'unread' : ''}`}
                key={index}
              >
                <img src={profilex} alt="Profile" className="chat-avatar" />
                <div className="chat-info">
                  <div className="chat-name">{chat.name}</div>
                  <div className="chat-preview">{chat.preview}</div>
                </div>
                <div className="chat-meta">
                  <span className="chat-time">{chat.time}</span>
                  {chat.unread && (
                    <span className="unread-badge">{chat.unread}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Center Box */}
      <div className="center-box">
        <div className="post-composer">
          <div className="avatar-wrapper">
            <img src={kevin} alt="User" className="post-avatar" />
          </div>
          <div className="post-input-area">
            <strong className="nickname">Kevin_Greeno</strong>
            <textarea
              className="post-textarea"
              placeholder="You can post something..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <button className="post-button">Post</button>
          </div>
        </div>

 <div className="post-sample">
  <div className="post-header">
    <img src={profile} alt="User" className="post-avatar-members" />
    <div>
      <strong className="nickname">DigitalNomad</strong>
      <p className="timestamp">5 mins ago</p>
    </div>
  </div>
  <p className="post-body">
    I've been living out of a backpack for the last six months while working remotely as a frontend developer. What surprises me most is how different the Wi-Fi situation is in each country. Vietnam has insanely fast internet, while some parts of Italy felt like the 90s again. I’ve learned to scout co-working spaces in advance, and honestly, I’ve had some of the best team syncs from hammocks in Bali. Working async has taught me more about time management than any office ever did.
  </p>
</div>

<div className="post-sample">
  <div className="post-header">
    <img src={profile} alt="User" className="post-avatar-members" />
    <div>
      <strong className="nickname">CloudBuilder</strong>
      <p className="timestamp">18 mins ago</p>
    </div>
  </div>
  <p className="post-body">
    This week, I wrapped up a project migrating a legacy monolith into a modern microservices architecture using AWS Lambda and API Gateway. It was my first time setting up a CI/CD pipeline with GitHub Actions and Terraform. The learning curve was steep, but I can’t believe how much I’ve grown in just two weeks. It’s wild how DevOps roles demand both technical depth and strategic planning. The key was breaking down each piece and deploying in stages — no more all-at-once madness.
  </p>
</div>

<div className="post-sample">
  <div className="post-header">
    <img src={profile} alt="User" className="post-avatar-members" />
    <div>
      <strong className="nickname">LangLearner</strong>
      <p className="timestamp">30 mins ago</p>
    </div>
  </div>
  <p className="post-body">
    I'm currently on day 120 of my Spanish learning journey and something just clicked today. I was ordering food in a small town in Mexico and held a full conversation with the owner — not just phrases, but an actual conversation about her family and the local ingredients she uses. It felt like magic. I've been using Duolingo, but the real change came from daily conversations through HelloTalk. Immersion is truly the best teacher. Bonus: I’m now helping others learn English by reviewing their writing!
  </p>
</div>

<div className="post-sample">
  <div className="post-header">
    <img src={profile} alt="User" className="post-avatar-members" />
    <div>
      <strong className="nickname">CodeMentor</strong>
      <p className="timestamp">1h ago</p>
    </div>
  </div>
  <p className="post-body">
    A junior developer I’ve been mentoring just deployed their first full-stack app using React, Node, and MongoDB — and the joy in their Slack message made my week. We started six months ago with just basic JavaScript, and now they’re setting up Express routes and JWT-based auth like a pro. Mentorship has taught me to explain things more clearly and reminded me what it felt like to be new in tech. If you’ve been in the field for a while, consider mentoring someone — it's the most fulfilling part of my week.
  </p>
</div>

<div className="post-sample">
  <div className="post-header">
    <img src={profile} alt="User" className="post-avatar-members" />
    <div>
      <strong className="nickname">ReactRider</strong>
      <p className="timestamp">2h ago</p>
    </div>
  </div>
  <p className="post-body">
    I've been biking through Portugal while building a startup MVP. My setup is simple: a foldable laptop stand, a power bank that lasts 3 days, and reliable internet cafes. Being forced to think through features offline has led to cleaner, more intentional code. I also started documenting everything in Notion because I can’t rely on consistent internet. Working this way reminds me that constraints aren’t always bad — they often force better design.
  </p>
</div>

<div className="post-sample">
  <div className="post-header">
    <img src={profile} alt="User" className="post-avatar-members" />
    <div>
      <strong className="nickname">AIStudent</strong>
      <p className="timestamp">4h ago</p>
    </div>
  </div>
  <p className="post-body">
    GPT-4 helped me debug an algorithm that I’d been stuck on for over two days. What blew my mind is how it not only gave me the right answer, but walked me through why my recursion was failing — in plain English. Tools like ChatGPT are changing the way I learn. Instead of just copy-pasting Stack Overflow answers, I’m now getting explanations and teaching myself the deeper principles behind every bug. It feels like pair-programming with a genius who doesn’t mind repeating things.
  </p>
</div>

<div className="post-sample">
  <div className="post-header">
    <img src={profile} alt="User" className="post-avatar-members" />
    <div>
      <strong className="nickname">CodeWanderer</strong>
      <p className="timestamp">6h ago</p>
    </div>
  </div>
  <p className="post-body">
    Just spent a week hiking through Patagonia and took a break from screens — no code, no Wi-Fi, just nature. What’s interesting is how much clarity I got on my project roadmap during those long hikes. Disconnecting helped me realize I was feature-stuffing and not solving real user pain points. I came back, rewrote the backlog, and now development feels way more focused. Sometimes the best debugging session happens 2,000 meters above sea level.
  </p>
</div>

<div className="post-sample">
  <div className="post-header">
    <img src={profile} alt="User" className="post-avatar-members" />
    <div>
      <strong className="nickname">SyntaxExplorer</strong>
      <p className="timestamp">8h ago</p>
    </div>
  </div>
  <p className="post-body">
    Spent the last month learning Rust after years of JavaScript. It’s humbling, to say the least. The borrow checker has become my new frenemy. But when my code finally compiled and ran flawlessly, I had a deep appreciation for the language's safety and performance. Also, writing documentation for my journey has helped reinforce the concepts and even got me a couple of DMs from other beginners. Don’t let fear of “hard” languages stop you — just take it slow and stay curious.
  </p>
</div>

<div className="post-sample">
  <div className="post-header">
    <img src={profile} alt="User" className="post-avatar-members" />
    <div>
      <strong className="nickname">TravelDev</strong>
      <p className="timestamp">10h ago</p>
    </div>
  </div>
  <p className="post-body">
    Landed in Morocco two weeks ago and I’ve been working from rooftop cafes ever since. Every day starts with mint tea and stand-up calls, and ends with street food and language swaps. I’ve started picking up Darija phrases and am using Anki decks to keep vocabulary fresh. As a developer, it’s easy to stay in our bubble — but traveling forces you to learn new languages, cultures, and ways of communicating. I feel like I’m leveling up not just technically, but as a human.
  </p>
</div>

<div className="post-sample">
  <div className="post-header">
    <img src={profile} alt="User" className="post-avatar-members" />
    <div>
      <strong className="nickname">MultilingualDev</strong>
      <p className="timestamp">Yesterday</p>
    </div>
  </div>
  <p className="post-body">
    I’ve been learning Mandarin through daily podcasts and coding terminology flashcards. It’s wild how many English programming terms are used directly, but explaining concepts like “closure” or “immutability” in Mandarin really pushes my comprehension. My goal is to attend a dev conference in Shanghai next year — in full Mandarin. Tech is global, and I want to build bridges, not barriers.
  </p>
</div>
</div>

      {/* Right Box */}
      <div className="right-box">
        <div className="tools-section">
          <div className="icon-item"><FaEnvelope /> <span>Invites</span></div>
    <div className="icon-item"><FaUser /> <span>Profile</span></div>
     <div className="icon-item"><FaFileAlt /> <span>Posts</span></div>
          <div className="icon-item"><FaUsers /> <span>Friends</span></div>
          <div className="icon-item"><FaCommentDots /> <span>Messages</span></div>
          <div className="icon-item"><FaImage /> <span>Gallery</span></div>
          <div className="icon-item"><FaPlayCircle /> <span>Videos</span></div>
          <div className="icon-item"><FaUsersCog /> <span>Groups</span></div>
          <div className="icon-item-last"><RiSpeakFill /> <span>Socials</span></div>
          
          
        </div>
      </div>
    </div>
  );
}

export default Containers;
