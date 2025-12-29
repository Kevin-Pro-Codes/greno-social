import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex flex-column flex-xl-row justify-content-center w-100 h-100 p-1">
      {/* Left Chat - Reduced margins */}
      <div className="left-box order-2 order-xl-1 h-100 mb-1 mb-xl-0 me-xl-1" style={{
        width: '100%',
        maxWidth: '350px',
        flex: '0 0 auto'
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Center Posts - Reduced margins */}
      <div className="center-box order-1 order-xl-2 h-100 mx-xl-1" style={{
        width: '100%',
        maxWidth: '800px',
        flex: '1 0 auto'
      }}>
        <CenterBox />
      </div>
      
      {/* Right Tools - Reduced margins */}
      <div className="right-box order-3 order-xl-3 h-100 mt-1 mt-xl-0 ms-xl-1" style={{
        width: '100%',
        maxWidth: '280px',
        flex: '0 0 auto'
      }}>
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;