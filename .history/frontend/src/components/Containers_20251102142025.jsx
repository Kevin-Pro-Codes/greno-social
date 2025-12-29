import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex w-100 h-100 p-0">
      {/* Left Chat - Shrinks properly */}
      <div className="left-box h-100" style={{
        flex: '0 1 350px', // Start at 350px but can shrink
        minWidth: '0px',
        maxWidth: '350px',
        opacity: 'clamp(0, 1, 1)',
        transition: 'all 0.3s ease'
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Center Posts - Flexible but constrained */}
      <div className="center-box h-100" style={{
        flex: '1 1 600px', // Flexible but starts at 600px
        minWidth: '500px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <CenterBox />
      </div>
      
      {/* Right Tools - Shrinks properly */}
      <div className="right-box h-100" style={{
        flex: '0 1 280px', // Start at 280px but can shrink
        minWidth: '0px',
        maxWidth: '280px',
        opacity: 'clamp(0, 1, 1)',
        transition: 'all 0.3s ease'
      }}>
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;