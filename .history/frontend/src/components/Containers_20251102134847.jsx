import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex flex-column flex-lg-row w-100 h-100 gap-3 p-3">
      {/* Chat - Perfectly fitted, full width on mobile, fixed on desktop */}
      <div className="left-box order-3 order-lg-1 h-100 w-100 flex-lg-shrink-0" style={{flexBasis: '350px'}}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Posts - Flexible center */}
      <div className="center-box order-1 order-lg-2 h-100 flex-grow-1 min-vw-50">
        <CenterBox />
      </div>
      
      {/* Tools */}
      <div className="right-box order-2 order-lg-3 h-100 w-100 flex-lg-shrink-0" style={{flexBasis: '280px'}}>
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;