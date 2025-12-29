import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex justify-content-center w-100 h-100 p-0">
      {/* Left Chat - Collapses at 150% zoom */}
      <div className="left-box h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(0px, calc(33vw - 267px), 350px)', // More aggressive for 150% zoom
        minWidth: '0px',
        opacity: 'clamp(0, calc(40vw - 320px), 1)', // Faster fade
        transition: 'all 0.3s ease'
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Center Posts - Smaller to trigger earlier collapse */}
      <div className="center-box h-100" style={{
        flex: '0 0 auto',
        width: 'clamp(450px, 70vw, 700px)', // Reduced from 800px to 700px
        minWidth: '450px' // Reduced from 500px
      }}>
        <CenterBox />
      </div>
      
      {/* Right Tools - Collapses at 150% zoom */}
      <div className="right-box h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(0px, calc(33vw - 267px), 280px)', // More aggressive for 150% zoom
        minWidth: '0px',
        opacity: 'clamp(0, calc(40vw - 320px), 1)', // Faster fade
        transition: 'all 0.3s ease'
      }}>
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;