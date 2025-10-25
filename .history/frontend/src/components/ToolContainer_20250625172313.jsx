import React from 'react';
import { RiSpeakFill } from "react-icons/ri";
import { FaUser, FaUsers, FaCommentDots, FaImage, FaPlayCircle, FaUsersCog, FaEnvelope, FaFileAlt } from 'react-icons/fa';
import '../styles/Containers.css';

function RightBox() {
  return (
    <div className="right-box bg-yellow-500">
      <div className="tools-section bg-red-500">
        <div className="icon-item bg-red-500"><FaEnvelope /> <span>Invites</span></div>
        <div className="icon-item"><FaFileAlt /> <span>Posts</span></div>  
           <div className="icon-item"><FaCommentDots /> <span>Chats</span></div>          
        <div className="icon-item"><FaUser /> <span>Profile</span></div>        
         <div className="icon-item"><FaUsers /> <span>Friends</span></div>        
          <div className="icon-item"><FaUsersCog /> <span>Groups -</span></div>
         <div className="icon-item"><FaImage /> <span>Gallery -</span></div>
        <div className="icon-item"><FaPlayCircle /> <span>Videos -</span></div>       
        <div className="icon-item-last"><RiSpeakFill /> <span>Socials -</span></div>
      </div>
    </div>
  );
}

export default RightBox;