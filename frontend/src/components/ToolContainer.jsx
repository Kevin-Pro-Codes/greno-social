import React from 'react';
import { FaUser, FaUsers, FaCommentDots, FaListAlt, FaRegCalendarAlt } from 'react-icons/fa';

function RightBox() {
  const tools = [
    { label: 'Profile', icon: <FaUser size={18} /> },
    { label: 'Friends', icon: <FaUsers size={20} /> },
    { label: 'Chats', icon: <FaCommentDots size={18} /> },
    { label: 'Posts', icon: <FaListAlt size={18} /> },
    { label: 'Events', icon: <FaRegCalendarAlt size={18} /> },
  ];

  return (
    <div className="w-full flex flex-col justify-start items-stretch p-0 m-0 box-border">
      <div className="flex flex-col items-stretch justify-start gap-2 border-2 border-[#a0cc3a] rounded-xl p-4 bg-black w-full box-border">
        {tools.map((item, index) => (
          <button
            key={index}
            type="button"
            className="flex items-center gap-3.5 text-white hover:text-[#a0cc3a] hover:bg-[#1a1a1a] cursor-pointer rounded-lg px-4 py-3 w-full box-border transition-colors duration-200 text-left bg-transparent border-0 outline-none"
          >
            <span className="shrink-0 transition-colors duration-200">{item.icon}</span>
            <span className="text-[1rem] font-medium tracking-wide">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default RightBox;