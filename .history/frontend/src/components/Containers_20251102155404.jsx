import React from 'react';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout">
      {/* LEFT SIDE */}
      <aside className="side-box left-box">
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </aside>

      {/* CENTER */}
      <main className="center-box">
        <CenterBox />
      </main>

      {/* RIGHT SIDE */}
      <aside className="side-box right-box">
        <RightBox />
      </aside>
    </div>
  );
}

export default Containers;