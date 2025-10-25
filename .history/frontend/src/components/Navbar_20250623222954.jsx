import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // <-- import useNavigate
import { FiSearch, FiBell } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import logo from '../assets/greeno.jpg';
import '../styles/Navbar.css';

function Navbar({ searchQuery, setSearchQuery }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();  // <-- initialize navigate

  // Your existing useEffect for click outside...

  // Your handleLogout goes here
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setShowProfileMenu(false);
        navigate('/login');
      } else {
        alert(data.error || 'Logout failed');
      }
    } catch (err) {
      console.error('Error during logout:', err);
      alert('NETWORK ISSUE. CHECK YOUR INTERNET CONNECTION');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div
          className="navbar-section navbar-left"
          ref={profileRef}
          style={{ position: 'relative' }}
        >
          <CgProfile
            className="navbar-profile"
            size={30}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{ cursor: 'pointer' }}
          />
          {showProfileMenu && (
            <div className="profile-menu">
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          )}
        </div>
        {/* Rest of your navbar... */}
      </div>
    </nav>
  );
}

export default Navbar;
