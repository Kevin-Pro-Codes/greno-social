import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="container-fluid vh-100 py-3">
      <div className="row h-100 g-3">
        {/* Chat - Hidden on mobile, visible on desktop */}
        <div className="col-lg-3 col-12 d-none d-lg-block">
          <div className="left-box h-100">
            <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
          </div>
        </div>
        
        {/* Posts - Full width on mobile, 6 cols on desktop */}
        <div className="col-lg-6 col-12">
          <div className="center-box h-100">
            <CenterBox />
          </div>
        </div>
        
        {/* Tools - Full width on mobile, 3 cols on desktop */}
        <div className="col-lg-3 col-12">
          <div className="right-box h-100">
            <RightBox />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Containers;