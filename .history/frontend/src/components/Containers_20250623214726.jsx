import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './LeftBox';
import CenterBox from '../CenterBox';
import RightBox from '../RightBox';
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