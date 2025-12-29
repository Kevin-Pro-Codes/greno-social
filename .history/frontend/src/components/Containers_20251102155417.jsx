import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex flex-column flex-xl-row justify-content-center w-100 h-100 p-0">
      {/* Left Chat - Full width when stacked */}
      <div className="left-box order-3 order-xl-1 h-100 w-100 w-xl-auto" style={{
        maxWidth: '350px',
        opacity: 'clamp(0, calc(40vw - 320px), 1)',
        transition: 'all 0.3s ease'
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Center Posts - Full width when stacked */}
      <div className="center-box order-1 order-xl-2 h-100 w-100" style={{
        maxWidth: '800px'
      }}>
        <CenterBox />
      </div>
      
      {/* Right Tools - Full width when stacked */}
      <div className="right-box order-2 order-xl-3 h-100 w-100 w-xl-auto" style={{
        maxWidth: '280px',
        opacity: 'clamp(0, calc(40vw - 320px), 1)',
        transition: 'all 0.3s ease'
      }}>
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;