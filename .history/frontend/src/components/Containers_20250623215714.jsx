import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './LeftContainer';
import CenterBox from './CenterContainer';
import RightBox from './RightContainer';
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