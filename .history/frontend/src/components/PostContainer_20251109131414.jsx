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

  // Fetch posts based on profileUserId
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const url = profileUserId
          ? `http://localhost:3000/api/posts/user/${profileUserId}`
          : 'http://localhost:3000/api/posts';

        console.log('📡 Fetching posts from:', url);

        const res = await fetch(url, {
          credentials: 'include',
        });

        console.log('📨 Response status:', res.status);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log('✅ Posts fetched successfully:', data);

        setPosts(data);
        setVisiblePosts(data.slice(0, 6));
        setNextIndex(6);
      } catch (err) {
        console.error('❌ Failed to fetch posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [profileUserId]);

  const handlePost = async () => {
    if (!user?.id || postContent.trim() === '') return;

    const newPostData = {
      post: postContent,
    };

    try {
      console.log('📤 Sending post:', newPostData);

      const res = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('🗑️ Deleting post:', id);
      
      const res = await fetch(`http://localhost:3000/api/posts/${id}`, { 
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to delete post');
      }

      const updatedPosts = posts.filter(p => p.id !== id);
      setPosts(updatedPosts);
      setVisiblePosts(updatedPosts.slice(0, nextIndex));
      
      console.log('✅ Post deleted successfully');
    } catch (err) {
      console.error('❌ Failed to delete post', err);
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

      // Refresh posts to show updated avatars
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
      setError(err.message);
    }
  };

  const filteredPosts = profileUserId
    ? visiblePosts.filter(post => post.user_id === parseInt(profileUserId))
    : visiblePosts;

  if (!user) {
    return (
      <div className="center-box">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h3>Please log in to see posts</h3>
          <p>You need to be logged in to view and create posts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="center-box">
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
          <strong className="nickname">{user?.name || 'Guest'}</strong>

          <textarea
            className="post-text-area"
            placeholder="You can post something..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlePost()}
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
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '1rem' }}>
          Showing {filteredPosts.length} of {posts.length} posts
          {profileUserId && ` (Filtered for user: ${profileUserId})`}
        </div>

        {filteredPosts.length === 0 && !loading ? (
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