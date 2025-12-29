import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex justify-content-center w-100 h-100 p-3">
      {/* Left Chat - Shrinks to 0 */}
      <div className="left-box h-100 me-2" style={{
        width: 'clamp(0px, 20vw, 350px)',
        minWidth: '0px',
        opacity: 'clamp(0, 1, 1)',
        transition: 'all 0.3s ease',
        flexShrink: 1
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Center Posts - Stays fixed */}
      <div className="center-box h-100 mx-2" style={{
        width: 'min(800px, 70vw)',
        minWidth: '600px',
        flexShrink: 0
      }}>
        <CenterBox />
      </div>
      
      {/* Right Tools - Shrinks to 0 */}
      <div className="right-box h-100 ms-2" style={{
        width: 'clamp(0px, 15vw, 280px)',
        minWidth: '0px',
        opacity: 'clamp(0, 1, 1)',
        transition: 'all 0.3s ease',
        flexShrink: 1
      }}>
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;