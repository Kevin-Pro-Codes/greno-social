import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex flex-column flex-xl-row justify-content-center w-100 h-100 p-0">
      {/* Left Chat - Collapses first, goes to bottom */}
      <div className="left-box order-3 order-xl-1 h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(0px, calc(25vw - 200px), 350px)',
        minWidth: '0px',
        opacity: 'clamp(0, calc(40vw - 320px), 1)',
        transition: 'all 0.3s ease'
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Center Posts - Always on top when collapsed */}
      <div className="center-box order-1 order-xl-2 h-100" style={{
        flex: '0 1 auto',
        width: 'clamp(400px, 50vw, 800px)',
        minWidth: '400px',
        maxWidth: '800px'
      }}>
        <CenterBox />
      </div>
      
      {/* Right Tools - Collapses second, goes to middle */}
      <div className="right-box order-2 order-xl-3 h-100" style={{
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