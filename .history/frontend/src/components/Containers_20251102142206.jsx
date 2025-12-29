import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
   <div className="three-box-layout d-flex justify-content-center w-100 h-100 p-0">
  {/* Left Chat */}
  <div className="left-box h-100" style={{
    flex: '0 1 auto',
    width: 'max(0px, min(350px, 50vw - 45rem))', // Shrinks based on center
    opacity: 'clamp(0, 1, 1)',
    transition: 'all 0.3s ease'
  }}>
    <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
  </div>
  
  {/* Center Posts - Dynamic but dictates layout */}
  <div className="center-box h-100" style={{
    flex: '0 0 auto',
    width: 'clamp(500px, 60vw, 800px)', // Center dictates the size
    margin: '0 1rem'
  }}>
    <CenterBox />
  </div>
  
  {/* Right Tools */}
  <div className="right-box h-100" style={{
    flex: '0 1 auto',
    width: 'max(0px, min(280px, 50vw - 45rem))', // Shrinks based on center
    opacity: 'clamp(0, 1, 1)',
    transition: 'all 0.3s ease'
  }}>
    <RightBox />
  </div>
</div>
  );
}

export default Containers;