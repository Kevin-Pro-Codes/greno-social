import React, { useState, useEffect } from 'react';
import kevin from '../assets/kevin.jpg';
import profile from '../assets/profile.svg';
import '../styles/Containers.css';
import '../styles/PostContainer.css';

function formatTimestamp(isoString) {
  if (!isoString) return 'Agora mesmo';

  const date = new Date(isoString);
  date.setHours(date.getHours() - 3); // adjust timezone if needed

  const options = {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  return date.toLocaleString('en-US', options);
}

function CenterBox() {
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6); // NEW state for pagination

  const user = JSON.parse(localStorage.getItem('user')) || {
    id: 1,
    username: 'Kevin_Greeno',
    name: 'Kevin',
    avatar: kevin,
  };

  useEffect(() => {
    fetch('http://localhost:3000/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error('Failed to fetch posts', err));
  }, []);

  const handlePost = async () => {
    if (postContent.trim() === '') return;

    const newPostData = {
      user_id: user.id,
      author: user.username,
      post: postContent,
      avatar: user.avatar || '',
    };

    try {
      const res = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPostData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save post');
      }

      const savedPost = await res.json();
      setPosts([savedPost, ...posts]);
      setPostContent('');
    } catch (err) {
      console.error('Failed to save post:', err);
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

  const filteredPosts =
    activeTab === 'mine'
      ? posts.filter(post => post.author === user.username)
      : posts;

  return (
    <div className="center-box">
      <div className="post-composer">
        <div className="avatar-wrapper">
          <img src={user.avatar || kevin} alt="User" className="post-avatar" />
        </div>
        <div className="post-input-area">
          <strong className="nickname">{user.name}</strong>
          <textarea
            className="post-textarea"
            placeholder="You can post something..."
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

      {/* 
      <div className="post-tabs">
        <button
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`tab-button ${activeTab === 'mine' ? 'active' : ''}`}
          onClick={() => setActiveTab('mine')}
        >
          With me
        </button>
      </div>
      */}

      <div className="posts-container">
        {filteredPosts.length === 0 ? (
          <div className="empty-posts">
            <p>No posts to show.</p>
          </div>
        ) : (
          <>
            {filteredPosts.slice(0, visibleCount).map((post) => (
              <div className="post-sample" key={post.id}>
                <div className="post-header">
                  <img src={user.avatar || kevin} alt="User" className="post-avatar-members" />
                  <div className="post-user-info">
                    <strong className="post-nickname">{user.name}</strong>
                    <span className="timestamp">{formatTimestamp(post.timestamp)}</span>
                  </div>
                </div>
                <p className="post-body">{post.post}</p>

                {post.author === user.username && (
                  <div className="post-actions">
                    <button
                      className="action-button delete"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}

            {visibleCount < filteredPosts.length && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  onClick={() => setVisibleCount(prev => prev + 6)}
                  className="post-button"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Show More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CenterBox;
