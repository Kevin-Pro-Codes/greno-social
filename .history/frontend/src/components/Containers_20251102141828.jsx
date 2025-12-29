import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex w-100 h-100 p-0">
      {/* Left Chat - Shrinks to 0 */}
      <div className="left-box h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(0px, 25vw, 350px)',
        minWidth: '0px',
        opacity: 'clamp(0, 1, 1)',
        transition: 'all 0.3s ease'
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Center Posts - Constrained width */}
      <div className="center-box h-100" style={{
  flex: '1 0 auto',
  minWidth: '35rem',    /* 500px / 16 = 31.25rem */
  maxWidth: '50rem',       /* 800px / 16 = 50rem */
  margin: '0 auto'
}}>
        <CenterBox />
      </div>
      
      {/* Right Tools - Shrinks to 0 */}
      <div className="right-box h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(0px, 20vw, 280px)',
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