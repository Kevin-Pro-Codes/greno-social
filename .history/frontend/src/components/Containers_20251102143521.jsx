import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex justify-content-center w-100 h-100 p-0">
      {/* Left Chat - Shrinks proportionally */}
      <div className="left-box h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(0px, calc(25vw - 200px), 350px)',
        minWidth: '0px',
        opacity: 'clamp(0, calc(40vw - 320px), 1)',
        transition: 'all 0.3s ease'
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Center Posts - Shrinks proportionally */}
      <div className="center-box h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(400px, 50vw, 800px)', // Shrinks from 800px down to 400px
        minWidth: '400px',
        maxWidth: '800px'
      }}>
        <CenterBox />
      </div>
      
      {/* Right Tools - Shrinks proportionally */}
      <div className="right-box h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(0px, calc(25vw - 200px), 280px)',
        minWidth: '0px',
        opacity: 'clamp(0, calc(40vw - 320px), 1)',
        transition: 'all 0.3s ease'
      }}>
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;