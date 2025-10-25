import React, { useState, useEffect } from 'react';
import kevin from '../assets/kevin.jpg';
import profile from '../assets/profile.svg';
import '../styles/Containers.css';

function CenterBox() {
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch posts on load
  useEffect(() => {
    fetch('http://localhost:3000/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Failed to fetch posts', err));
  }, []);

  const handlePost = async () => {
    if (postContent.trim() === '') return;

    const newPostData = {
      author: 'Kevin_Greeno',
      content: postContent,
      avatar: kevin,
    };

    try {
      const res = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPostData),
      });

      const savedPost = await res.json();
      setPosts([savedPost, ...posts]);
      setPostContent('');
    } catch (err) {
      console.error('Failed to save post', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'DELETE',
      });
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete post', err);
    }
  };

  const filteredPosts = activeTab === 'mine'
    ? posts.filter(post => post.author === 'Kevin_Greeno')
    : posts;

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
                <img src={post.avatar || profile} alt="User" className="post-avatar-members" />
                <div>
                  <strong className="nickname">{post.author}</strong>
                  <p className="timestamp">{post.timestamp || 'Just now'}</p>
                </div>
              </div>
              <p className="post-body">{post.content}</p>
              {post.author === 'Kevin_Greeno' && (
                <div className="post-actions">
                  <button className="action-button">Edit</button>
                  <button
                    className="action-button delete"
                    onClick={() => handleDelete(post.id)}
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
