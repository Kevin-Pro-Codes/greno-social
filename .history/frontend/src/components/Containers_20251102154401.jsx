import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex justify-content-center w-100 h-100 p-0">
      {/* Left Chat - Compresses and shrinks low */}
      <div className="left-box h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(0px, calc(25vw - 200px), 350px)',
        minWidth: '0px',
        opacity: 'clamp(0, calc(30vw - 240px), 1)',
        transition: 'all 0.3s ease'
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Center Posts - Stays centered */}
      <div className="center-box h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(500px, 55vw, 800px)',
        minWidth: '500px',
        maxWidth: '800px',
        margin: '0 1rem'
      }}>
        <CenterBox />
      </div>
      
      {/* Right Tools - Shrinks normally */}
      <div className="right-box h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(0px, calc(25vw - 200px), 280px)',
        minWidth: '0px',
        opacity: 'clamp(0, calc(30vw - 240px), 1)',
        transition: 'all 0.3s ease'
      }}>
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;