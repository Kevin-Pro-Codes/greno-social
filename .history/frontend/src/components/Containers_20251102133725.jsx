import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout">
      <div className="left-box order-lg-1 order-3">
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      <div className="center-box order-lg-2 order-1">
        <CenterBox />
      </div>
      <div className="right-box order-lg-3 order-2">
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;