import React from 'react';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout">
      <aside className="side-box left-box">
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </aside>
      <main className="center-box">
        <CenterBox />
      </main>
      <aside className="side-box right-box">
        <RightBox />
      </aside>
    </div>
  );
}

export default Containers;