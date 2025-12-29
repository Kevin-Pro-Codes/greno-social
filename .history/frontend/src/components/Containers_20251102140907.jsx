import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';
import '../styles/Containers.css';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="three-box-layout d-flex flex-column flex-lg-row justify-content-center w-100 h-100 p-3">
      {/* Left Chat - Collapses at lg breakpoint (earlier) */}
      <div className="left-box order-2 order-lg-1 h-100 mb-2 mb-lg-0 me-lg-2 w-100 w-lg-auto" style={{
        maxWidth: '350px'
      }}>
        <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
      </div>
      
      {/* Center Posts - Always main content */}
      <div className="center-box order-1 order-lg-2 h-100 mx-lg-2 w-100" style={{
        maxWidth: '800px'
      }}>
        <CenterBox />
      </div>
      
      {/* Right Tools - Collapses at lg breakpoint (earlier) */}
      <div className="right-box order-3 order-lg-3 h-100 mt-2 mt-lg-0 ms-lg-2 w-100 w-lg-auto" style={{
        maxWidth: '280px'
      }}>
        <RightBox />
      </div>
    </div>
  );
}

export default Containers;