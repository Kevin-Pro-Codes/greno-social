import React, { useState, useEffect } from 'react';
import { FaEllipsisH, FaImage, FaVideo, FaSmile } from 'react-icons/fa';
import profile_blue from '../assets/profile-blue.png';
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

function CenterBox({ profileUserId }) {
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [visiblePosts, setVisiblePosts] = useState([]); // what’s currently shown
  const [nextIndex, setNextIndex] = useState(6); // how many posts to show next

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


useEffect(() => {
  if (user && user.id) {
    fetchUserPosts(user.avatar); // 👈 Pass current avatar
  }
}, [user?.id]);

const fetchUserPosts = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/posts/user/${user.id}`, {
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to fetch user posts');

    const userPosts = await res.json();
    setPosts(userPosts);
    setVisiblePosts(userPosts.slice(0, nextIndex));
  } catch (err) {
    console.error(err);
  }
};


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
  const nextPosts = posts.slice(visiblePosts.length, visiblePosts.length + 6).map(post =>
    post.user_id === user.id && user.avatar
      ? { ...post, avatar: user.avatar }
      : post
  );

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

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.message || 'Failed to upload avatar');
    }

    const data = await res.json();

    const updatedUser = {
      ...user,
      avatar: data.filePath, // Adjust this to match your backend's response
    };

    // 🔁 Update user state
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // 🔁 Update all posts with the new avatar
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.user_id === user.id ? { ...post, avatar: data.filePath } : post
      )
    );

    setVisiblePosts(prevVisible =>
      prevVisible.map(post =>
        post.user_id === user.id ? { ...post, avatar: data.filePath } : post
      )
    );

  } catch (err) {
    console.error('Error uploading avatar:', err);
  }
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
  <strong className="nickname">{user.name}</strong>

  <div className="input-wrapper">
    <textarea
      className="post-text-area"
      placeholder="You can post something..."
      value={postContent}
      onChange={(e) => setPostContent(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && handlePost()}
    />

    <div className="toolbar-floating">
      <button className="toolbar-btn" title="Dots"><FaEllipsisH /></button>
      <button className="toolbar-btn" title="Add Emoji"><FaSmile /></button>
    </div>
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
        </div>

      <div className="posts-container">
        {filteredPosts.length === 0 ? (
          <div className="empty-posts">
            {/*<p>No posts to show.</p>*/}
          </div>
        ) : (
          <>
            {filteredPosts.map((post) => (
              <div className="post-sample" key={post.id}>
                <div className="post-header">
 <img
  src={
    post.user_id === user.id && user.avatar
      ? `http://localhost:3000/${user.avatar}`
      : post.avatar
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

                {(
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
