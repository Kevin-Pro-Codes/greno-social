import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex justify-content-center w-100 h-100 p-0">
      {/* Left Chat - More aggressive shrinking */}
      <div className="left-box h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(0px, calc(40vw - 300px), 350px)', // Changed from 50vw-400px to 40vw-300px
        minWidth: '0px',
        opacity: 'clamp(0, calc(40vw - 250px), 1)', // More aggressive fade
        transition: 'all 0.3s ease'
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Center Posts - Slightly smaller to trigger earlier collapse */}
      <div className="center-box h-100" style={{
        flex: '0 0 auto', // Changed from 800px to auto
        width: 'clamp(450px, 65vw, 700px)', // Reduced max from 800px to 700px
        minWidth: '450px' // Reduced from 500px
      }}>
        <CenterBox />
      </div>
      
      {/* Right Tools - More aggressive shrinking */}
      <div className="right-box h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(0px, calc(40vw - 300px), 280px)', // Changed from 50vw-400px to 40vw-300px
        minWidth: '0px',
        opacity: 'clamp(0, calc(40vw - 250px), 1)', // More aggressive fade
        transition: 'all 0.3s ease'
      }}>
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;