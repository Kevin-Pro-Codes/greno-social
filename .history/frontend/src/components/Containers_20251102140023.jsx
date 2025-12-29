import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex justify-content-center w-100 h-100 overflow-hidden">
      {/* Left Chat - Shrinks and disappears */}
      <div className="left-box h-100 flex-shrink-1 d-none d-xl-flex" style={{
        width: 'clamp(0px, 350px, 400px)',
        minWidth: '0px',
        opacity: 'clamp(0, 1, 1)',
        transition: 'all 0.3s ease'
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Center Posts - Always centered */}
      <div className="center-box h-100 flex-grow-0" style={{
        width: 'clamp(500px, 800px, 1200px)',
        minWidth: '500px',
        maxWidth: '90vw'
      }}>
        <CenterBox />
      </div>
      
      {/* Right Tools - Shrinks and disappears */}
      <div className="right-box h-100 flex-shrink-1 d-none d-lg-flex" style={{
        width: 'clamp(0px, 280px, 300px)',
        minWidth: '0px',
        opacity: 'clamp(0, 1, 1)',
        transition: 'all 0.3s ease'
      }}>
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;