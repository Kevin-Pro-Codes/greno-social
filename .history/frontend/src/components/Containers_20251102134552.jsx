import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex flex-column flex-lg-row w-100 h-100 overflow-hidden">
      {/* Chat - Collapsible with min/max width */}
      <div className="left-box order-3 order-lg-1 h-100 flex-shrink-0" style={{
        minWidth: '280px', 
        maxWidth: '350px',
        width: '100%'
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Posts - Flexible center that shrinks first */}
      <div className="center-box order-1 order-lg-2 h-100 flex-grow-1 flex-shrink-1 min-width-0">
        <CenterBox />
      </div>
      
      {/* Tools - Fixed width but can hide on small screens */}
      <div className="right-box order-2 order-lg-3 h-100 flex-shrink-0 d-none d-lg-flex" style={{
        width: '250px',
        minWidth: '200px'
      }}>
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;