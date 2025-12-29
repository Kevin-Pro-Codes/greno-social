import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="container-fluid py-3" style={{ height: 'calc(100vh - 80px)' }}>
      <div className="row h-100 g-3">
        {/* Chat Container */}
        <div className="col-lg-3 col-md-12 order-lg-1 order-3 d-flex">
          <div className="bg-black rounded p-3 w-100" style={{ overflow: 'auto' }}>
            <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
          </div>
        </div>
        
        {/* Posts Container */}
        <div className="col-lg-6 col-md-12 order-lg-2 order-1 d-flex">
          <div className="bg-black rounded p-3 w-100" style={{ overflow: 'auto' }}>
            <CenterBox />
          </div>
        </div>
        
        {/* Tools Container */}
        <div className="col-lg-3 col-md-12 order-lg-3 order-2 d-flex">
          <div className="bg-black rounded p-3 w-100" style={{ overflow: 'auto' }}>
            <RightBox />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Containers;