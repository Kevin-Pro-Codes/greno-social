import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './LeftBox.jsx';
import CenterBox from './CenterBox.jsx';
import RightBox from './RightBox.jsx';
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