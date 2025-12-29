import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex w-100 h-100">
      {/* Chat - Perfectly fitted */}
      <div className="left-box order-lg-1 order-3 h-100">
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Posts - Flexible center */}
      <div className="center-box order-lg-2 order-1 flex-grow-1 h-100">
        <CenterBox />
      </div>
      
      {/* Tools */}
      <div className="right-box order-lg-3 order-2 h-100">
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;