import React from 'react';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';



interface Props {
  isChatMinimized: boolean;
  toggleChat: () => void;
}

export default function Containers({ isChatMinimized, toggleChat }: Props) {
  return (
    <div className="three-box-layout">
      {/* LEFT */}
      <aside className="side-box left-box">
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </aside>

      {/* CENTER */}
      <main className="center-box">
        <CenterBox />
      </main>

      {/* RIGHT */}
      <aside className="side-box right-box">
        <RightBox />
      </aside>
    </div>
  );
}

export default Containers;