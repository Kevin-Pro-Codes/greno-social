import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex gap-3 w-100">
      {/* Chat - Fixed width that fits container */}
      <div className="left-box order-lg-1 order-3 flex-shrink-0" style={{width: '350px', maxWidth: '100%'}}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Posts - Flexible center */}
      <div className="center-box order-lg-2 order-1 flex-grow-1 min-width-500">
        <CenterBox />
      </div>
      
      {/* Tools - Collapsible right side */}
      <div className="right-box order-lg-3 order-2" style={{flex: '0 0 25%', maxWidth: '125%'}}>
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;