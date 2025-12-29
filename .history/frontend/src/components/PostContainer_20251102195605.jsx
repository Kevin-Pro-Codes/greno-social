import React, { useState, useEffect } from 'react';
import { FaEllipsisH, FaImage, FaVideo, FaSmile } from 'react-icons/fa';
import profile_blue from '../assets/profile-blue.png';
import '../styles/Containers.css';
import '../styles/PostContainer.css';

function formatTimestamp(isoString) {
  if (!isoString) return 'Agora mesmo';

  const date = new Date(isoString);
  date.setHours(date.getHours() - 3);

  const options = {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  return date.toLocaleString('en-US', options);
}

function CenterBox({ profileUserId }) {
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [nextIndex, setNextIndex] = useState(6);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const url = profileUserId
      ? `http://localhost:3000/api/posts/user/${profileUserId}`
      : 'http://localhost:3000/api/posts';

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setVisiblePosts(data.slice(0, 6));
        setNextIndex(6);
      })
      .catch(err => console.error('Failed to fetch posts', err));
  }, [profileUserId]);

  const handlePost = async () => {
    if (!postContent.trim()) return;

    const newPostData = {
      user_id: user.id,
      author: user.name,
      post: postContent,
      avatar: user.avatar || null,
    };

    try {
      const res = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPostData),
      });

      if (!res.ok) throw new Error('Failed to save post');

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
      await fetch(`http://localhost:3000/api/posts/${id}`, { method: 'DELETE' });
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

  const filteredPosts = profileUserId
    ? visiblePosts.filter(post => post.user_id === profileUserId)
    : visiblePosts;

  return (
    <div className="center-box">
      <div className="post-composer">
        <div className="avatar-wrapper">
          <label htmlFor="avatar-upload" className="avatar-label">
            <img
              src={user.avatar ? `http://localhost:3000/${user.avatar}` : profile_blue}
              alt="User"
              className="post-avatar"
            />
            <div className="icon-overlay"><FaImage /></div>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

        <div className="post-input-area">
          <strong className="nickname">{user.name}</strong>
          <textarea
            className="post-text-area"
            placeholder="You can post something..."
            value={postContent}
            onChange={e => setPostContent(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handlePost()}
          />

          <div className="post-action-row">
            <div className="toolbar-buttons">
              <button className="toolbar-btn" title="Dots"><FaEllipsisH /></button>
              <button className="toolbar-btn" title="Add Emoji"><FaSmile /></button>
              <button className="toolbar-btn" title="Add Image"><FaImage /></button>
              <button className="toolbar-btn" title="Add Video"><FaVideo /></button>
            </div>

            <div className="send-button-wrapper">
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
          <div className="empty-posts" />
        ) : (
          <>
            {filteredPosts.map(post => (
              <div className="post-sample" key={post.id}>
                <div className="post-header">
                  <img
                    src={post.avatar ? `http://localhost:3000/${post.avatar}` : profile_blue}
                    alt="User"
                    className="post-avatar-members"
                  />
                  <div className="post-user-info">
                    <strong className="post-nickname">{post.author}</strong>
                    <span className="timestamp-inline">{formatTimestamp(post.timestamp)}</span>
                  </div>
                </div>
                <p className="post-body">{post.post}</p>
                <button className="delete-button" onClick={() => handleDelete(post.id)}>✕</button>
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
