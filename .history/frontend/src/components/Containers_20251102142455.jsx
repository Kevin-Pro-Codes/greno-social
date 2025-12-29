import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex flex-column flex-lg-row justify-content-lg-center w-100 h-100 p-0">
      {/* Left Chat - Hidden on smaller screens, visible on lg+ */}
      <div className="left-box order-2 order-lg-1 h-100 d-none d-lg-flex flex-shrink-0 me-lg-3 mb-2 mb-lg-0">
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Center Posts - Always visible, responsive width */}
      <div className="center-box order-1 order-lg-2 h-100 flex-grow-1 flex-lg-grow-0 w-100 mw-100 mw-lg-800 mx-lg-3">
        <CenterBox />
      </div>
      
      {/* Right Tools - Hidden on smaller screens, visible on lg+ */}
      <div className="right-box order-3 order-lg-3 h-100 d-none d-lg-flex flex-shrink-0 ms-lg-3 mt-2 mt-lg-0">
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;