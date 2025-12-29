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
  const [error, setError] = useState(null);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  // Fetch posts - only logged-in user's posts
  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?.id) {
        console.log('❌ No user logged in, skipping post fetch');
        setPosts([]);
        setVisiblePosts([]);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Always fetch only the current user's posts from /api/posts
        const url = 'http://localhost:3000/api/posts';
        console.log('📡 Fetching user posts from:', url);

        const res = await fetch(url, {
          credentials: 'include', // Important for session
        });

        console.log('📨 Response status:', res.status);

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Please log in to view posts');
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log('✅ User posts received:', data);

        setPosts(data);
        setVisiblePosts(data.slice(0, 6));
        setNextIndex(6);
      } catch (err) {
        console.error('❌ Failed to fetch posts:', err);
        setError(err.message);
        setPosts([]);
        setVisiblePosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user?.id]); // Refetch when user changes

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

      // Add new post to the beginning of the list
      const updatedPosts = [savedPost, ...posts];
      setPosts(updatedPosts);
      setVisiblePosts(updatedPosts.slice(0, nextIndex));
      setPostContent('');
    } catch (err) {
      console.error('❌ Failed to save post:', err);
      setError(err.message);
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
      setError(err.message);
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
      const postsRes = await fetch('http://localhost:3000/api/posts', { 
        credentials: 'include' 
      });
      const postsData = await postsRes.json();
      setPosts(postsData);
      setVisiblePosts(postsData.slice(0, nextIndex));

    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError(err.message);
    }
  };

  // If no user, render a fallback
  if (!user) {
    return (
      <div className="center-box">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h3>Please log in to see your posts</h3>
          <p>You need to be logged in to view and create posts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="center-box">
      {/* Error Display */}
      {error && (
        <div style={{ 
          background: '#ffebee', 
          color: '#c62828', 
          padding: '1rem', 
          marginBottom: '1rem',
          borderRadius: '4px',
          border: '1px solid #ffcdd2'
        }}>
          <strong>Error:</strong> {error}
          <button 
            onClick={() => setError(null)}
            style={{ marginLeft: '1rem', background: 'none', border: 'none', color: '#c62828', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <p>Loading your posts...</p>
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
            placeholder="Share what's on your mind..."
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
                disabled={!postContent.trim() || loading}
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="posts-container">
        {/* User info */}
        <div style={{ 
          fontSize: '14px', 
          color: '#666', 
          marginBottom: '1rem',
          padding: '0.5rem',
          background: '#f5f5f5',
          borderRadius: '4px'
        }}>
          <strong>Your Posts</strong> - Showing {visiblePosts.length} of {posts.length} posts
        </div>

        {!loading && posts.length === 0 ? (
          <div className="empty-posts" style={{ textAlign: 'center', padding: '3rem' }}>
            <p>You haven't posted anything yet.</p>
            <p>Share your first post above!</p>
          </div>
        ) : (
          <>
            {visiblePosts.map((post) => (
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
                {/* Only show delete button for user's own posts */}
                {post.user_id === user.id && (
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(post.id)}
                    title="Delete post"
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
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    padding: '1rem'
                  }}
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