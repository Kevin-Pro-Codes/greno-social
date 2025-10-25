import React, { useState, useEffect } from 'react';
import kevin from '../assets/kevin.jpg';
import profile from '../assets/profile.svg';
import '../styles/Containers.css';

function CenterBox() {
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  const user = JSON.parse(localStorage.getItem('user')) || {
    id: 0,
    username: 'Kevin_Greeno',
    avatar: kevin,
  };

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/posts');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error('❌ Failed to fetch posts:', err);
      }
    };

    fetchPosts();
  }, []);

  // Post a new message
  const handlePost = async () => {
    if (postContent.trim() === '') return;

    const newPost = {
      user_id: user.id,
      author: user.username,
      post: postContent,
      avatar: user.avatar || kevin,
    };

    try {
      const res = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save post');
      }

      const savedPost = await res.json();
      setPosts([savedPost, ...posts]);
      setPostContent('');
    } catch (err) {
      console.error('❌ Failed to save post:', err);
    }
  };

  // Delete a post
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: 'DELETE',
      });
      setPosts(posts.filter((p) => p.id !== id));
    } catch (err) {
      console.error('❌ Failed to delete post:', err);
    }
  };

  const filteredPosts =
    activeTab === 'mine'
      ? posts.filter((p) => p.author === user.username)
      : posts;

  return (
    <div className="center-box">
      {/* Post Input */}
      <div className="post-composer">
        <img src={user.avatar || kevin} alt="avatar" className="post-avatar" />
        <div className="post-input-area">
          <strong className="nickname">{user.username}</strong>
          <textarea
            placeholder="What's on your mind?"
            className="post-textarea"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handlePost()}
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

      {/* Tabs */}
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

      {/* Posts List */}
      <div className="posts-container">
        {filteredPosts.length === 0 ? (
          <div className="empty-posts">
            <p>No posts to show yet. Be the first to share!</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div className="post-sample" key={post.id}>
              <div className="post-header">
                <img
                  src={post.avatar || profile}
                  alt="avatar"
                  className="post-avatar-members"
                />
                <div>
                  <strong className="nickname">{post.author}</strong>
                  <p className="timestamp">
                    {new Date(post.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="post-body">{post.post}</p>
              {post.author === user.username && (
                <div className="post-actions">
                  {/* Future: Edit button logic */}
                  <button className="action-button delete" onClick={() => handleDelete(post.id)}>
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
