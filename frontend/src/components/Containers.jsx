import React from 'react';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="flex justify-center items-stretch gap-2 sm:gap-3 w-full min-h-[calc(100vh-80px)] px-2 py-4 box-border transition-all duration-300 max-lg:flex-col max-lg:gap-3 max-lg:min-h-auto">
      {/* Left box (Chats) */}
      <aside className={`bg-black text-white rounded-xl p-5 box-border overflow-hidden flex flex-col shrink-0 transition-all duration-300 ${
        isChatMinimized
          ? 'w-16 min-w-[64px] max-w-[64px] max-lg:w-full max-lg:max-w-full'
          : 'w-[320px] max-w-[340px] max-lg:w-full max-lg:max-w-full max-lg:order-1'
      }`}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </aside>

      {/* Center box (Posts Feed) */}
      <main className="flex-1 max-w-[700px] min-w-[300px] bg-black text-white rounded-xl p-5 sm:p-6 box-border overflow-hidden w-full max-lg:order-[-1] max-lg:max-w-full">
        <CenterBox />
      </main>

      {/* Right box (Navigation Tools) */}
      <aside className="w-[260px] max-w-[280px] bg-black text-white rounded-xl p-5 box-border overflow-hidden shrink-0 transition-all duration-300 w-full max-lg:order-2 max-lg:max-w-full">
        <RightBox />
      </aside>
    </div>
  );
}

export default Containers;