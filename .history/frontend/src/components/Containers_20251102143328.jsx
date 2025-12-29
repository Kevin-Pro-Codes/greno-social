import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex justify-content-center w-100 h-100 p-0">
      {/* Left Chat - Shrinks with zoom */}
      <div className="left-box h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(0px, calc(40vw - 320px), 350px)',
        minWidth: '0px',
        opacity: 'clamp(0, calc(50vw - 400px), 1)',
        transition: 'all 0.3s ease'
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Center Posts - Also shrinks with zoom */}
      <div className="center-box h-100" style={{
        flex: '0 1 auto', // Changed to allow shrinking
        width: 'clamp(400px, 60vw, 800px)', // Now shrinks from 800px down to 400px
        minWidth: '400px',
        maxWidth: '800px'
      }}>
        <CenterBox />
      </div>
      
      {/* Right Tools - Shrinks with zoom */}
      <div className="right-box h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(0px, calc(40vw - 320px), 280px)',
        minWidth: '0px',
        opacity: 'clamp(0, calc(50vw - 400px), 1)',
        transition: 'all 0.3s ease'
      }}>
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;