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
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  useEffect(() => {
  const fetchPosts = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Always fetch from /api/posts - server will return only logged-in user's posts
      const url = 'http://localhost:3000/api/posts';

      console.log('📡 Fetching user posts from:', url);

      const res = await fetch(url, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('✅ User posts received:', data);

      setPosts(data);
      setVisiblePosts(data.slice(0, 6));
      setNextIndex(6);
    } catch (err) {
      console.error('❌ Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchPosts();
}, [user?.id]); // Remove profileUserId from dependencies

// Also remove the filteredPosts logic and use visiblePosts directly:
// DELETE this line:
// const filteredPosts = profileUserId
//   ? visiblePosts.filter(post => post.user_id === parseInt(profileUserId))
//   : visiblePosts;

// Then in the JSX, replace filteredPosts with visiblePosts:

  const handlePost = async () => {
    if (!user?.id || postContent.trim() === '') return;

    const newPostData = {
      post: postContent, // Only send post content - server handles user info from session
    };

    try {
      console.log('📤 Sending post:', newPostData);

      const res = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for session
        body: JSON.stringify(newPostData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save post');
      }

      const savedPost = await res.json();
      console.log('✅ Post saved:', savedPost);

      const updatedPosts = [savedPost, ...posts];
      setPosts(updatedPosts);
      setVisiblePosts(updatedPosts.slice(0, nextIndex));
      setPostContent('');
    } catch (err) {
      console.error('❌ Failed to save post:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/posts/${id}`, { 
        method: 'DELETE',
        credentials: 'include',
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

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.message || 'Failed to upload avatar');
      }

      const data = await res.json();

      const updatedUser = { ...user, avatar: data.filePath };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Refresh posts to update avatars
      const postsRes = await fetch(
        profileUserId 
          ? `http://localhost:3000/api/posts/user/${profileUserId}`
          : 'http://localhost:3000/api/posts',
        { credentials: 'include' }
      );
      const postsData = await postsRes.json();
      setPosts(postsData);
      setVisiblePosts(postsData.slice(0, nextIndex));

    } catch (err) {
      console.error('Error uploading avatar:', err);
    }
  };

  const filteredPosts = profileUserId
    ? visiblePosts.filter(post => post.user_id === parseInt(profileUserId))
    : visiblePosts;

  if (!user) {
    return (
      <div className="center-box">
        <p>Please log in to see posts.</p>
      </div>
    );
  }

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
            <div className="icon-overlay">
              <FaImage />
            </div>
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
          <strong className="nickname">{user?.name || user?.username || 'Guest'}</strong>

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
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="posts-container">
        {!loading && filteredPosts.length === 0 ? (
          <div className="empty-posts" style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No posts found.</p>
            {profileUserId && <p>This user hasn't posted anything yet.</p>}
          </div>
        ) : (
          <>
            {filteredPosts.map((post) => (
              <div className="post-sample" key={post.id}>
                <div className="post-header">
                  <img
                    src={
                      post.avatar
                        ? `http://localhost:3000/${post.avatar}`
                        : profile_blue
                    }
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