import React from 'react';
import { RiSpeakFill } from "react-icons/ri";
import { FaUser, FaUsers, FaBell, FaCommentDots, FaImage, FaPlayCircle, FaUsersCog, FaEnvelope, FaFileAlt } from 'react-icons/fa';
import { RiUserSharedLine } from 'react-icons/ri';
import '../styles/Containers.css';

function RightBox() {
  return (
    <div className="right-box">
      <div className="tools-section">
        <div className="icon-item"><FaBell /> <span>Requests</span></div>
        <div className="icon-item"><RiSpeakFill /> <span>Events</span></div>
         <div className="icon-item"><FaUser /> <span>Profile</span></div> 
        <div className="icon-item"><FaFileAlt /> <span>Posts</span></div>  
           <div className="icon-item-last"><FaCommentDots /> <span>Chats</span></div>              
               
        {/* 
         <div className="icon-item"><FaUsers /> <span>Friends</span></div> 
         <div className="icon-item"><FaUsersCog /> <span>Groups -</span></div>
         <div className="icon-item"><FaImage /> <span>Gallery -</span></div>
        <div className="icon-item"><FaPlayCircle /> <span>Videos -</span></div>  
        */}     
        
      </div>
    </div>
  );
}

export default RightBox;