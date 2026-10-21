import React, { useState, useEffect, useCallback } from 'react';
import { FaEllipsisH, FaImage, FaVideo, FaSmile, FaUser, FaUsers } from 'react-icons/fa';
import profile_blue from '../assets/profile-blue.png';

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
  const [nextIndex, setNextIndex] = useState(10);
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
        url = 'http://localhost:3000/api/posts';
      }

      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      setPosts(data);
      setVisiblePosts(data.slice(0, 10));
      setNextIndex(10);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, [profileUserId, user?.id]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const getFilteredPosts = () => {
    if (profileUserId) {
      return visiblePosts.filter(p => p.user_id === parseInt(profileUserId));
    }
    if (viewMode === 'my-posts') {
      return visiblePosts.filter(p => p.user_id === user.id);
    }
    return visiblePosts;
  };

  const handleViewModeChange = (mode) => {
    if (viewMode !== mode) {
      setViewMode(mode);
      setVisiblePosts(posts.slice(0, 10));
      setNextIndex(10);
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
      console.error('Error posting:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/posts/${id}`, { method: 'DELETE', credentials: 'include' });
      const updatedPosts = posts.filter(p => p.id !== id);
      setPosts(updatedPosts);
      setVisiblePosts(updatedPosts.slice(0, nextIndex));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleShowMore = () => {
    const nextPosts = posts.slice(visiblePosts.length, visiblePosts.length + 10);
    setVisiblePosts(prev => [...prev, ...nextPosts]);
    setNextIndex(prev => prev + 10);
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
      console.error('Error uploading avatar:', err);
    }
  };

  if (!user) {
    return (
      <div className="w-full text-center py-8 text-neutral-400">
        <p>Please log in to see posts.</p>
      </div>
    );
  }

  const displayPosts = getFilteredPosts();

  return (
    <div className="w-full flex flex-col box-border">
      {loading && (
        <div className="text-center py-4 text-[#a0cc3a]">
          <p className="animate-pulse">Loading posts...</p>
        </div>
      )}

      {/* Post Composer */}
      <div className="flex gap-4 bg-[#111] p-4 sm:p-5 rounded-xl mb-5 border border-[#262626]">
        {/* Avatar with upload */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 border-[#a0cc3a] shrink-0 group cursor-pointer">
          <label htmlFor="avatar-upload" className="w-full h-full cursor-pointer block relative">
            <img
              src={user?.avatar ? `http://localhost:3000/${user.avatar}` : profile_blue}
              alt="User"
              className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity text-xl">
              <FaImage />
            </div>
          </label>

          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Input area */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <strong className="text-[#a0cc3a] text-xl font-bold truncate">
              {user?.name || user?.username || 'Guest'}
            </strong>

            {/* View Mode Buttons */}
            {!profileUserId && (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleViewModeChange('my-posts')}
                  title="My Posts"
                  className={`p-2.5 rounded-lg transition-colors flex items-center justify-center cursor-pointer border ${
                    viewMode === 'my-posts'
                      ? 'bg-[#a0cc3a] text-black border-[#8db834]'
                      : 'bg-transparent text-[#a0cc3a] border-[#a0cc3a] hover:bg-[#a0cc3a] hover:text-black'
                  }`}
                >
                  <FaUser size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => handleViewModeChange('all-friends')}
                  title="All Friends"
                  className={`p-2.5 rounded-lg transition-colors flex items-center justify-center cursor-pointer border ${
                    viewMode === 'all-friends'
                      ? 'bg-[#a0cc3a] text-black border-[#8db834]'
                      : 'bg-transparent text-[#a0cc3a] border-[#a0cc3a] hover:bg-[#a0cc3a] hover:text-black'
                  }`}
                >
                  <FaUsers size={18} />
                </button>
              </div>
            )}
          </div>

          <textarea
            className="w-full h-24 bg-[#222] text-white border border-[#a0cc3a] rounded-lg p-3 text-base resize-y focus:outline-none focus:ring-1 focus:ring-[#a0cc3a] placeholder:text-neutral-500 box-border"
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

          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-2">
              <button type="button" className="bg-[#111] border border-[#a0cc3a] text-[#a0cc3a] p-2.5 rounded-lg text-sm hover:bg-[#1a1a1a] cursor-pointer flex items-center justify-center transition-colors" title="More options">
                <FaEllipsisH />
              </button>
              <button type="button" className="bg-[#111] border border-[#a0cc3a] text-[#a0cc3a] p-2.5 rounded-lg text-sm hover:bg-[#1a1a1a] cursor-pointer flex items-center justify-center transition-colors" title="Add Emoji">
                <FaSmile />
              </button>
              <button type="button" className="bg-[#111] border border-[#a0cc3a] text-[#a0cc3a] p-2.5 rounded-lg text-sm hover:bg-[#1a1a1a] cursor-pointer flex items-center justify-center transition-colors" title="Add Image">
                <FaImage />
              </button>
              <button type="button" className="bg-[#111] border border-[#a0cc3a] text-[#a0cc3a] p-2.5 rounded-lg text-sm hover:bg-[#1a1a1a] cursor-pointer flex items-center justify-center transition-colors" title="Add Video">
                <FaVideo />
              </button>
            </div>

            <button
              type="button"
              onClick={handlePost}
              disabled={!postContent.trim()}
              className="bg-[#a0cc3a] hover:bg-[#8db834] text-black font-bold px-6 py-2 rounded-lg text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="flex flex-col gap-4">
        {!loading && displayPosts.length === 0 ? (
          <div className="text-center py-10 text-neutral-400 bg-[#111] rounded-xl border border-[#262626]">
            <p className="text-base font-medium">No posts found.</p>
            <p className="text-sm text-neutral-500 mt-1">
              {profileUserId
                ? "This user hasn't posted anything yet."
                : viewMode === 'my-posts'
                ? "You haven't posted anything yet. Share your first post!"
                : "No posts from friends yet."}
            </p>
          </div>
        ) : (
          <>
            {displayPosts.map((post) => (
              <div key={post.id} className="relative bg-[#111] p-5 sm:p-6 rounded-xl border border-[#a0cc3a] transition-all">
                <div className="flex items-center gap-3.5 mb-3">
                  <img
                    src={post.avatar ? `http://localhost:3000/${post.avatar}` : profile_blue}
                    alt="User"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    <strong className="text-[#a0cc3a] font-bold text-lg">{post.author}</strong>
                    <span className="text-neutral-400 text-xs">{formatTimestamp(post.timestamp)}</span>
                  </div>
                </div>

                <p className="text-neutral-200 text-base whitespace-pre-wrap leading-relaxed mt-2">{post.post}</p>

                {post.user_id === user.id && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="absolute top-3.5 right-4 text-red-500 hover:text-red-400 font-bold text-lg bg-transparent border-0 cursor-pointer p-1"
                    title="Delete post"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {visiblePosts.length < posts.length && (
              <div className="text-center py-3">
                <button
                  onClick={handleShowMore}
                  className="bg-transparent border-0 cursor-pointer p-2 flex items-center justify-center gap-1.5 mx-auto group"
                  title="Load more posts"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:bg-[#a0cc3a] transition-colors"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:bg-[#a0cc3a] transition-colors"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:bg-[#a0cc3a] transition-colors"></span>
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