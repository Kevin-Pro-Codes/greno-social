import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex flex-column flex-md-row w-100 h-100 overflow-hidden">
      {/* Chat - Collapses on medium screens */}
      <div className="left-box order-3 order-md-1 h-100 flex-shrink-0 d-none d-md-flex" style={{
        width: '320px',
        minWidth: '280px'
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Posts - Flexible center */}
      <div className="center-box order-1 order-md-2 h-100 flex-grow-1 min-width-0">
        <CenterBox />
      </div>
      
      {/* Tools - Collapses on medium screens */}
      <div className="right-box order-2 order-md-3 h-100 flex-shrink-0 d-none d-lg-flex" style={{
        width: '250px',
        minWidth: '200px'
      }}>
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;