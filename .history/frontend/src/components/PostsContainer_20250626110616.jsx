import React, { useState, useEffect } from 'react';
import kevin from '../assets/kevin.jpg';
import profile from '../assets/profile.svg';
import '../styles/Containers.css';
import '../styles/PostContainer.css';
import { FaImage, FaVideo, FaSmile } from 'react-icons/fa';

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
  const [visiblePosts, setVisiblePosts] = useState([]); // what’s currently shown
  const [nextIndex, setNextIndex] = useState(6); // how many posts to show next

  const user = JSON.parse(localStorage.getItem('user')) || {
    id: 1,
    username: 'Kevin_Greeno',
    name: 'Kevin',
    avatar: kevin,
  };

  useEffect(() => {
    fetch('http://localhost:3000/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setVisiblePosts(data.slice(0, 6)); // show first 6
        setNextIndex(6);
      })
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
      const updatedPosts = [savedPost, ...posts];
      setPosts(updatedPosts);
      setVisiblePosts(updatedPosts.slice(0, nextIndex));
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
      const updatedPosts = posts.filter(p => p.id !== id);
      setPosts(updatedPosts);
      setVisiblePosts(updatedPosts.slice(0, nextIndex));
    } catch (err) {
      console.error('Failed to delete post', err);
    }
  };

  const handleShowMore = () => {
    const nextPosts = posts.slice(visiblePosts.length, visiblePosts.length + 6);
    setVisiblePosts(prev => [...prev, ...nextPosts]);
    setNextIndex(prev => prev + 6);
  };

  const filteredPosts =
    activeTab === 'mine'
      ? visiblePosts.filter(post => post.author === user.username)
      : visiblePosts;

  return (
    <div className="center-box">
      <div className="post-composer">
        <div className="avatar-wrapper">
          <img src={user.avatar || kevin} alt="User" className="post-avatar" />
        </div>
        <div className="post-input-area">
          <strong className="nickname">{user.name}</strong>

          <textarea
            className="post-text-area"
            placeholder="You can post something..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlePost()}
          />

<div className="post-action-row">
  <div className="button-group">
    <button className="toolbar-btn" title="Add Emoji"><FaSmile /></button>
    <button className="toolbar-btn" title="Add Image"><FaImage /></button>
    <button className="toolbar-btn" title="Add Video"><FaVideo /></button>
    <button
      className="post-button"
      onClick={handlePost}
      disabled={!postContent.trim()}
    >
      Send
    </button>
  </div>
</div>
        </div>
      </div>

      <div className="posts-container">
        {filteredPosts.length === 0 ? (
          <div className="empty-posts">
            <p>No posts to show.</p>
          </div>
        ) : (
          <>
            {filteredPosts.map((post) => (
              <div className="post-sample" key={post.id}>
                <div className="post-header">
                  <img src={user.avatar || kevin} alt="User" className="post-avatar-members" />
                  <div className="post-user-info">
                    <strong className="post-nickname">{user.name}</strong>
                    <span className="timestamp-inline">{formatTimestamp(post.timestamp)}</span>
                  </div>
                </div>
                <p className="post-body">{post.post}</p>

                {post.author === user.username && (
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(post.id)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {visiblePosts.length < posts.length && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  onClick={handleShowMore}
                  className="post-dots"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
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
