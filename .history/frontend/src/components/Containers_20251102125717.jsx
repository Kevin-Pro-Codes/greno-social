import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout">
      <div className="left-box-container">
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      <div className="center-box-container">
        <CenterBox />
      </div>
      <div className="right-box-container">
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;