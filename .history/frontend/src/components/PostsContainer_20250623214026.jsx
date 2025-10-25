import React, { useState } from 'react';
import kevin from '../assets/kevin.jpg';
import profile from '../assets/profile.svg';
import '../styles/Containers.css';

function CenterBox() {
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  const handlePost = () => {
    if (postContent.trim() === '') return;
    
    const newPost = {
      id: Date.now(),
      author: 'Kevin_Greeno',
      avatar: kevin,
      content: postContent,
      timestamp: 'Just now',
      isMine: true
    };
    
    setPosts([newPost, ...posts]);
    setPostContent('');
  };

  const samplePosts = [
    {
      id: 1,
      author: 'DigitalNomad',
      avatar: profile,
      content: "I've been living out of a backpack for the last six months while working remotely as a frontend developer...",
      timestamp: '5 mins ago',
      isMine: false
    },
    // ... other sample posts
  ];

  const filteredPosts = activeTab === 'mine' 
    ? posts.filter(post => post.isMine) 
    : [...posts, ...samplePosts];

  return (
    <div className="center-box">
      <div className="post-composer">
        <div className="avatar-wrapper">
          <img src={kevin} alt="User" className="post-avatar" />
        </div>
        <div className="post-input-area">
          <strong className="nickname">Kevin_Greeno</strong>
          <textarea
            className="post-textarea"
            placeholder="Share your thoughts..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlePost()}
          />
          <button 
            className="post-button"
            onClick={handlePost}
            disabled={!postContent.trim()}
          >
            Post
          </button>
        </div>
      </div>

      <div className="post-tabs">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Posts
        </button>
        <button 
          className={`tab-button ${activeTab === 'mine' ? 'active' : ''}`}
          onClick={() => setActiveTab('mine')}
        >
          My Posts
        </button>
      </div>

      <div className="posts-container">
        {filteredPosts.length === 0 ? (
          <div className="empty-posts">
            <p>No posts to show. Be the first to share something!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div className="post-sample" key={post.id}>
              <div className="post-header">
                <img src={post.avatar} alt="User" className="post-avatar-members" />
                <div>
                  <strong className="nickname">{post.author}</strong>
                  <p className="timestamp">{post.timestamp}</p>
                </div>
              </div>
              <p className="post-body">{post.content}</p>
              {post.isMine && (
                <div className="post-actions">
                  <button className="action-button">Edit</button>
                  <button 
                    className="action-button delete"
                    onClick={() => setPosts(posts.filter(p => p.id !== post.id))}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CenterBox;