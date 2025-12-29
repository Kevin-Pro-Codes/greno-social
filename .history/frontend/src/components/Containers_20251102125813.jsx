import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import LeftBox from './ChatContainer';
import CenterBox from './PostContainer';
import RightBox from './ToolContainer';

function Containers({ isChatMinimized, toggleChat }) {
  return (
    <div className="container-fluid custom-layout">
      <div className="row custom-row">
        <div className="col-lg-3 col-md-12 custom-col order-lg-1 order-3">
          <LeftBox isChatMinimized={isChatMinimized} toggleChat={toggleChat} />
        </div>
        <div className="col-lg-6 col-md-12 custom-col order-lg-2 order-1">
          <CenterBox />
        </div>
        <div className="col-lg-3 col-md-12 custom-col order-lg-3 order-2">
          <RightBox />
        </div>
      </div>
    </div>
  );
}

export default Containers;