import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css'; // Only keep this if you need custom overrides

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="container-fluid h-100">
      <div className="row h-100 g-3">
        {/* Left Box - Chat */}
        <div className="col-lg-3 col-md-12 order-lg-1 order-3">
          <div className="bg-black rounded p-3 h-100">
            <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
          </div>
        </div>
        
        {/* Center Box - Posts */}
        <div className="col-lg-6 col-md-12 order-lg-2 order-1">
          <div className="bg-black rounded p-3 h-100">
            <CenterBox />
          </div>
        </div>
        
        {/* Right Box - Tools */}
        <div className="col-lg-3 col-md-12 order-lg-3 order-2">
          <div className="bg-black rounded p-3 h-100">
            <RightBox />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Containers;