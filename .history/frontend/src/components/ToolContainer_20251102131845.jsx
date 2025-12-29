import React from 'react';
import { FaUser, FaUsers, FaCommentDots, FaListAlt, FaRegCalendarAlt } from 'react-icons/fa';
import '../styles/Containers.css';

function RightBox() {
  return (
    <div className="right-box h-100">
      <div className="tools-section d-flex flex-column align-items-center justify-content-center bg-dark rounded p-3 h-100">
        <div className="icon-item d-flex align-items-center w-100 p-3 rounded">
          <FaUser className="tool-icon" /> 
          <span className="tool-label">Profile</span>
        </div> 
        <div className="icon-item d-flex align-items-center w-100 p-3 rounded">
          <FaUsers size={21} className="tool-icon" /> 
          <span className="tool-label">Friends</span>
        </div>           
        <div className="icon-item d-flex align-items-center w-100 p-3 rounded">
          <FaCommentDots className="tool-icon" /> 
          <span className="tool-label">Chats</span>
        </div>  
        <div className="icon-item d-flex align-items-center w-100 p-3 rounded">
          <FaListAlt className="tool-icon" /> 
          <span className="tool-label">Posts</span>
        </div>              
        <div className="icon-item-last d-flex align-items-center w-100 p-3 rounded mb-0">
          <FaRegCalendarAlt size={19} className="tool-icon" /> 
          <span className="tool-label">Events</span>
        </div>     
      </div>
    </div>
  );
}

export default RightBox;