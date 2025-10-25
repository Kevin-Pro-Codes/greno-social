import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostsContainer';
import RightBox from './ToolsContainer';
import '../styles/ShowHideChat.css';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout">
      <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      <CenterBox />
      <RightBox />
    </div>
  );
}

export default Containers;