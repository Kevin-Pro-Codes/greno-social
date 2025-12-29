import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex justify-content-center align-items-center w-100 h-100 p-3">
      {/* Left Chat - Gradually shrinks */}
      <div className="left-box h-100 me-3" style={{
        flex: '0 1 auto',
        width: 'clamp(200px, 25vw, 350px)',
        minWidth: '200px',
        opacity: 'clamp(0.3, 1, 1)',
        transition: 'all 0.3s ease'
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Center Posts - Fixed center */}
      <div className="center-box h-100 mx-3 flex-grow-0" style={{
        width: 'clamp(600px, 50vw, 800px)',
        minWidth: '600px'
      }}>
        <CenterBox />
      </div>
      
      {/* Right Tools - Gradually shrinks */}
      <div className="right-box h-100 ms-3" style={{
        flex: '0 1 auto',
        width: 'clamp(150px, 20vw, 280px)',
        minWidth: '150px',
        opacity: 'clamp(0.3, 1, 1)',
        transition: 'all 0.3s ease'
      }}>
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;