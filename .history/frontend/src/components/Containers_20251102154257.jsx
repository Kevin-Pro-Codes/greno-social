import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex justify-content-center w-100 h-100 p-0">
      {/* Left Chat - Shrinks and disappears */}
      <div className="left-box h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(0px, calc(33vw - 300px), 350px)',
        minWidth: '0px',
        opacity: 'clamp(0, calc(40vw - 360px), 1)',
        transition: 'all 0.3s ease'
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Center Posts - Stays centered and shrinks */}
      <div className="center-box h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(400px, 50vw, 800px)',
        minWidth: '400px',
        maxWidth: '800px',
        margin: '0 1rem'
      }}>
        <CenterBox />
      </div>
      
      {/* Right Tools - Shrinks and disappears */}
      <div className="right-box h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(0px, calc(33vw - 300px), 280px)',
        minWidth: '0px',
        opacity: 'clamp(0, calc(40vw - 360px), 1)',
        transition: 'all 0.3s ease'
      }}>
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;