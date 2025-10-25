import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostsContainer';
import RightBox from './ToolContainer';
import '../styles/ShowHideChat.css';
import '../styles/ChatContainer.css';
import '../styles/PostContainer.css';
import '../styles/ToolContainer.css';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout border-9">
      <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      <CenterBox />
      <RightBox />
    </div>
  );
}

export default Containers;