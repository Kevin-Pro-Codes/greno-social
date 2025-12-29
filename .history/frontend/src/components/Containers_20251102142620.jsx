import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex justify-content-center w-100 h-100 p-0">
      {/* Left Chat - Shrinks relative to center */}
      <div className="left-box h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(0px, calc(50vw - 400px), 350px)',
        minWidth: '0px',
        opacity: 'clamp(0, 1, 1)',
        transition: 'all 0.3s ease'
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Center Posts - Dictates the layout */}
      <div className="center-box h-100" style={{
        flex: '0 0 800px', // Fixed basis, won't grow/shrink
        minWidth: '500px',
        maxWidth: '800px'
      }}>
        <CenterBox />
      </div>
      
      {/* Right Tools - Shrinks relative to center */}
      <div className="right-box h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(0px, calc(50vw - 400px), 280px)',
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