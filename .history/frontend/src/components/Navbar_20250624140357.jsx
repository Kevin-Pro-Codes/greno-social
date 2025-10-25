import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBell } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import logo from '../assets/greeno.jpg';
import '../styles/Navbar.css';

function Navbar({ searchQuery, setSearchQuery }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userName, setUserName] = useState('');
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage on mount
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Assuming user has 'name' or 'username'
        setUserName(user.name || user.username || '');
      } catch {
        setUserName('');
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      if (res.ok) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Network error during logout:', error);
    }
    setShowProfileMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div
          className="navbar-section navbar-left"
          ref={profileRef}
          style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <CgProfile
            className="navbar-profile"
            size={30}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{ cursor: 'pointer' }}
          />
          {/* Show user name next to profile icon */}
          {userName && <span className="navbar-username">{userName}</span>}

          {showProfileMenu && (
            <div className="profile-menu">
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Right side content */}
        <div className="navbar-section navbar-right">
          <button className="notification-btn">
            <FiBell size={20} />
            <span className="notification-badge">11</span>
          </button>
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search on Greeno..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <img src={logo} alt="Company Logo" className="navbar-logo" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
