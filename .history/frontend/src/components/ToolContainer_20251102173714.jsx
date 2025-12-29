import React from 'react';
import { FaUser, FaUsers, FaListAlt, FaCommentDots, FaRegCalendarAlt } from 'react-icons/fa';
import '../styles/Containers.css';

function RightBox() {
  return (
    <div className="right-box">
      <div className="tools-section">
        <div className="icon-item d-flex align-items-center text-white w-100 rounded">
          <FaUser /> 
          <span className="ms-2">Profile</span>
        </div> 
        <div className="icon-item d-flex align-items-center text-white w-100 rounded">
          <FaUsers size={21}/> 
          <span className="ms-2">Friends</span>
        </div>           
        <div className="icon-item d-flex align-items-center text-white w-100 rounded">
          <FaCommentDots /> 
          <span className="ms-2">Chats</span>
        </div>  
        <div className="icon-item d-flex align-items-center text-white w-100 rounded">
          <FaListAlt /> 
          <span className="ms-2">Posts</span>
        </div>              
        <div className="icon-item-last d-flex align-items-center text-white w-100 rounded">
          <FaRegCalendarAlt size={19} /> 
          <span className="ms-2">Events</span>
        </div>     
      </div>
    </div>
  );
}

export default RightBox;
