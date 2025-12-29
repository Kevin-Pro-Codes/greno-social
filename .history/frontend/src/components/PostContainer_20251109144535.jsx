import React, { useState, useEffect, useCallback } from 'react';
import { FaEllipsisH, FaImage, FaVideo, FaSmile, FaUser, FaUsers } from 'react-icons/fa';
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
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('my-posts'); // 'my-posts' or 'all-friends'

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  const fetchPosts = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      let url;
      if (profileUserId) {
        url = `http://localhost:3000/api/posts/user/${profileUserId}`;
      } else {
        // fetch all posts, then filter client-side if needed
        url = 'http://localhost:3000/api/posts/all';
      }

      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      setPosts(data);
      setVisiblePosts(data.slice(0, 6));
      setNextIndex(6);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [profileUserId, user?.id]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Filter posts based on selected mode
  const getFilteredPosts = () => {
    if (profileUserId) return visiblePosts.filter(p => p.user_id === parseInt(profileUserId));
    if (viewMode === 'my-posts') return visiblePosts.filter(p => p.user_id === user.id);
    return visiblePosts; // all-friends
  };

  const handleViewModeChange = (mode) => {
    if (viewMode !== mode) {
      setViewMode(mode);
      setVisiblePosts(posts.slice(0, 6)); // reset visible posts
      setNextIndex(6);
    }
  };

  const handlePost = async () => {
    if (!user?.id || postContent.trim() === '') return;
    const newPostData = { post: postContent };

    try {
      const res = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newPostData),
      });

      if (!res.ok) throw new Error('Failed to save post');

      const savedPost = await res.json();
      const updatedPosts = [savedPost, ...posts];
      setPosts(updatedPosts);
      setVisiblePosts(updatedPosts.slice(0, nextIndex));
      setPostContent('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/posts/${id}`, { method: 'DELETE', credentials: 'include' });
      const updatedPosts = posts.filter(p => p.id !== id);
      setPosts(updatedPosts);
      setVisiblePosts(updatedPosts.slice(0, nextIndex));
    } catch (err) {
      console.error(err);
    }
  };

  const handleShowMore = () => {
    const nextPosts = posts.slice(visiblePosts.length, visiblePosts.length + 6);
    setVisiblePosts(prev => [...prev, ...nextPosts]);
    setNextIndex(prev => prev + 6);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch(`http://localhost:3000/api/users/${user.id}/avatar`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to upload avatar');
      const data = await res.json();

      const updatedUser = { ...user, avatar: data.filePath };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="center-box">
        <p>Please log in to see posts.</p>
      </div>
    );
  }

  const displayPosts = getFilteredPosts();

  return (
    <div className="center-box">
      {loading && (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <p>Loading posts...</p>
        </div>
      )}

      <div className="post-composer">
        <div className="avatar-wrapper">
          <label htmlFor="avatar-upload" className="avatar-label">
            <img
              src={user?.avatar ? `http://localhost:3000/${user.avatar}` : profile_blue}
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
            onChange={handleAvatarChange}
          />
        </div>

        <div className="post-input-area">
          <div className="post-header-row">
            <strong className="nickname">{user?.name || user?.username || 'Guest'}</strong>
          </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '8px' }}>
  <button
    className={`btn ${viewMode === 'my-posts' ? 'btn-success' : 'btn-outline-success'}`}
    onClick={() => handleViewModeChange('my-posts')}
    title="My Posts"
    type="button"
    style={{
      fontSize: '28px',      // make icon bigger
      padding: '6px 12px',  // make button bigger
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  ><FaUser /></button>

  <button
    className={`btn ${viewMode === 'all-friends' ? 'btn-success' : 'btn-outline-success'}`}
    onClick={() => handleViewModeChange('all-friends')}
    title="All Friends"
    type="button"
    style={{
      fontSize: '28px',      // bigger icon
      padding: '6px 12px',  // bigger button
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  ><FaUsers /></button>
</div>
          <textarea
            className="post-text-area"
            placeholder="You can post something..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handlePost();
              }
            }}
          />

          <div className="post-action-row">
            <div className="toolbar-buttons">
              <button type="button" className="toolbar-btn" title="Dots"><FaEllipsisH /></button>
              <button type="button" className="toolbar-btn" title="Add Emoji"><FaSmile /></button>
              <button type="button" className="toolbar-btn" title="Add Image"><FaImage /></button>
              <button type="button" className="toolbar-btn" title="Add Video"><FaVideo /></button>
            </div>
            <div className="send-button-wrapper">
              <button
                className="post-button"
                onClick={handlePost}
                disabled={!postContent.trim()}
              >Send</button>
            </div>
          </div>
        </div>
      </div>

      <div className="posts-container">
        {!loading && displayPosts.length === 0 ? (
          <div className="empty-posts" style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No posts found.</p>
          </div>
        ) : (
          <>
            {displayPosts.map((post) => (
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
                {post.user_id === user.id && (
                  <button className="delete-button" onClick={() => handleDelete(post.id)}>✕</button>
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
