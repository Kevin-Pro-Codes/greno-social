import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout container-fluid h-100">
      <div className="row h-100 g-3">
        {/* Left Box - Chat - Order 1 on desktop, 3 on mobile */}
        <div className="col-lg-3 col-12 order-lg-1 order-3">
          <div className="left-box bg-black rounded p-3 h-100 overflow-auto">
            <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
          </div>
        </div>
        
        {/* Center Box - Posts - Order 2 on desktop, 1 on mobile */}
        <div className="col-lg-6 col-12 order-lg-2 order-1">
          <div className="center-box bg-black rounded p-3 h-100 overflow-auto">
            <CenterBox />
          </div>
        </div>
        
        {/* Right Box - Tools - Order 3 on desktop, 2 on mobile */}
        <div className="col-lg-3 col-12 order-lg-3 order-2">
          <div className="right-box bg-black rounded p-3 h-100 overflow-auto">
            <RightBox />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Containers;