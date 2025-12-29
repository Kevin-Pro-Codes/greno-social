import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex justify-content-center w-100 h-100 p-3">
      {/* Left Chat - Uniformly decreases */}
      <div className="left-box h-100" style={{
        flex: '0 1 auto',
        width: 'max(0px, min(350px, 40vw - 400px))',
        minWidth: '0px',
        opacity: 'max(0, min(1, 45vw - 450px))',
        transition: 'all 0.3s ease'
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Center Posts - Increases size */}
      <div className="center-box h-100" style={{
        flex: '1 0 auto',
        width: 'clamp(600px, 70vw, 1000px)',
        minWidth: '600px',
        maxWidth: '1000px',
        margin: '0 2rem'
      }}>
        <CenterBox />
      </div>
      
      {/* Right Tools - Uniformly decreases */}
      <div className="right-box h-100" style={{
        flex: '0 1 auto',
        width: 'max(0px, min(280px, 40vw - 400px))',
        minWidth: '0px',
        opacity: 'max(0, min(1, 45vw - 450px))',
        transition: 'all 0.3s ease'
      }}>
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;