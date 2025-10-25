import React from 'react';
import { RiSpeakFill } from "react-icons/ri";
import { FaBell, FaUserFriends, FaUser, FaUsers, FaListAlt, FaCommentDots } from 'react-icons/fa';
import { RiUserSharedLine } from 'react-icons/ri';
import '../styles/Containers.css';

function RightBox() {
  return (
    <div className="right-box">
      <div className="tools-section">     
       <div className="icon-item"><FaUser /> <span>Profile</span></div> 
        <div className="icon-item"><FaUserFriends size={21} /> <span>Events</span></div>       
           <div className="icon-item"><FaUsers /> <span>Friends</span></div> 
        <div className="icon-item"><FaListAlt /> <span>Posts</span></div>  
           <div className="icon-item-last"><FaCommentDots /> <span>Chats</span></div>              
               
        {/* 
        <div className="icon-item"><FaBell /> <span>Notifications</span></div>
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