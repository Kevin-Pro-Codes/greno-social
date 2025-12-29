import React, { useState, useEffect } from 'react';
import { FaEllipsisH, FaImage, FaSmile } from 'react-icons/fa';
import profile_blue from '../assets/profile-blue.png';
import '../styles/PostContainer.css';

function formatTimestamp(isoString) {
  if (!isoString) return 'Agora mesmo';
  const date = new Date(isoString);
  date.setHours(date.getHours() - 3);
  return date.toLocaleString('en-US', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
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
    if (postContent.trim() === '') return;

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

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch(`http://localhost:3000/api/users/${user.id}/avatar`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload avatar');

      const data = await res.json();
      const updatedUser = { ...user, avatar: data.filePath };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setPosts(prev => prev.map(post => 
        post.user_id === user.id ? { ...post, avatar: data.filePath } : post
      ));
      setVisiblePosts(prev => prev.map(post => 
        post.user_id === user.id ? { ...post, avatar: data.filePath } : post
      ));
    } catch (err) {
      console.error('Error uploading avatar:', err);
    }
  };

  const filteredPosts = profileUserId
    ? visiblePosts.filter(post => post.user_id === profileUserId)
    : visiblePosts;

  return (
    <div className="center-box">
      {/* Post Composer - Bootstrap responsive classes */}
      <div className="post-composer d-flex flex-column flex-md-row gap-3">
        <div className="avatar-wrapper flex-shrink-0 mx-auto mx-md-0">
          <label htmlFor="avatar-upload" className="avatar-label d-block m-0 p-0">
            <img
              src={user?.avatar ? `http://localhost:3000/${user.avatar}` : profile_blue}
              alt="User"
              className="post-avatar w-100 h-100"
            />
            <div className="icon-overlay">
              <FaImage />
            </div>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="d-none"
            onChange={handleAvatarChange}
          />
        </div>
        
        <div className="post-input-area flex-grow-1">
          <strong className="nickname text-center text-md-start">{user?.name}</strong>

          <textarea
            className="post-text-area w-100"
            placeholder="You can post something..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handlePost()}
          />

          <div className="post-action-row d-flex justify-content-between align-items-center gap-2">
            <div className="toolbar-buttons d-flex gap-2">
              <button className="toolbar-btn" title="Dots"><FaEllipsisH /></button>
              <button className="toolbar-btn" title="Add Emoji"><FaSmile /></button>
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

      {/* Posts Container */}
      <div className="posts-container">
        {filteredPosts.length === 0 ? (
          <div className="empty-posts">
            {/*<p>No posts to show.</p>*/}
          </div>
        ) : (
          <>
            {filteredPosts.map((post) => (
              <div className="post-sample position-relative" key={post.id}>
                <div className="post-header d-flex align-items-center gap-3">
                  <img
                    src={
                      post.user_id === user?.id && user?.avatar
                        ? `http://localhost:3000/${user.avatar}`
                        : post.avatar
                          ? `http://localhost:3000/${post.avatar}`
                          : profile_blue
                    }
                    alt="User"
                    className="post-avatar-members"
                  />
                  <div className="post-user-info d-flex align-items-baseline gap-2 flex-wrap">
                    <strong className="post-nickname">{post.author}</strong>
                    <span className="timestamp-inline">{formatTimestamp(post.timestamp)}</span>
                  </div>
                </div>
                <p className="post-body mt-2 mb-0">{post.post}</p>

                <button
                  className="delete-button"
                  onClick={() => handleDelete(post.id)}
                >
                  ✕
                </button>
              </div>
            ))}

            {visiblePosts.length < posts.length && (
              <div className="text-center mt-3">
                <button
                  onClick={handleShowMore}
                  className="post-dots border-0 bg-transparent"
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