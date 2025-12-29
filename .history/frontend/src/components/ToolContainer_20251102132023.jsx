import React from 'react';
import { RiSpeakFill } from "react-icons/ri";
import { FaBell, FaUserFriends, FaRegCalendarAlt, FaHandshake, FaUser, FaUsers, FaListAlt, FaCommentDots } from 'react-icons/fa';
import { RiUserSharedLine } from 'react-icons/ri';
import '../styles/Containers.css';

function RightBox() {
  return (
    <div className="right-box bg-transparent w-100">
      <div className="tools-section bg-dark rounded border border-success p-3">     
        <div className="icon-item d-flex align-items-center text-white w-100 p-3 rounded">
          <FaUser /> 
          <span className="ms-2">Profile</span>
        </div> 
        <div className="icon-item d-flex align-items-center text-white w-100 p-3 rounded">
          <FaUsers size={21}/> 
          <span className="ms-2">Friends</span>
        </div>           
        <div className="icon-item d-flex align-items-center text-white w-100 p-3 rounded">
          <FaCommentDots /> 
          <span className="ms-2">Chats</span>
        </div>  
        <div className="icon-item d-flex align-items-center text-white w-100 p-3 rounded">
          <FaListAlt /> 
          <span className="ms-2">Posts</span>
        </div>              
        <div className="icon-item-last d-flex align-items-center text-white w-100 p-3 rounded mb-0">
          <FaRegCalendarAlt size={19} /> 
          <span className="ms-2">Events</span>
        </div>     
      </div>
    </div>
  );
}

export default RightBox;