import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex flex-column flex-xl-row w-100 h-100 p-0">
      {/* Left Chat */}
      <div className="left-box order-2 order-xl-1 h-100" style={{
        flex: '0 0 350px'
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Center Posts - Takes remaining space */}
      <div className="center-box order-1 order-xl-2 h-100 flex-grow-1">
        <CenterBox />
      </div>
      
      {/* Right Tools */}
      <div className="right-box order-3 order-xl-3 h-100" style={{
        flex: '0 0 280px'
      }}>
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;