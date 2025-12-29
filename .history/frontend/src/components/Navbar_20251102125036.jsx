import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBell } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import logo from '../assets/greeno.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Navbar.css';

function Navbar({ searchQuery, setSearchQuery }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

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
    <nav className="navbar navbar-dark bg-black border-bottom border-secondary">
      <div className="container-fluid">
        {/* Left side - Profile */}
        <div className="d-flex align-items-center">
          <div ref={profileRef} className="position-relative">
            <CgProfile
              className="navbar-profile cursor-pointer"
              size={30}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ cursor: 'pointer', filter: 'brightness(0) invert(1)' }}
            />
            
            {showProfileMenu && (
              <div className="profile-menu position-absolute start-0 mt-1 bg-black border border-secondary rounded shadow">
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="change-name-button btn btn-link text-white text-decoration-none p-2 w-100 text-start"
                >
                  Change Name
                </button>
                <button 
                  onClick={handleLogout} 
                  className="logout-button btn btn-link text-white text-decoration-none p-2 w-100 text-start"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right side content */}
        <div className="d-flex align-items-center gap-3">
          {/* Notification Button */}
         <button className="btn btn-link text-white position-relative p-1">
  <FiBell size={22} />

  <span
    className="position-absolute top-0 start-100 translate-middle bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
    style={{
      width: '14px',
      height: '14px',
      fontSize: '0.55rem',
      lineHeight: '1',
    }}
  >
    11
  </span>
</button>


          {/* Search */}
          <div className="position-relative">
            <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-2 text-black" />
            <input
              type="text"
              placeholder="Search on Greeno..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control ps-4"
              style={{width: '200px', fontSize: '0.85rem'}}
            />
          </div>

          {/* Logo */}
          <img 
            src={logo} 
            alt="Company Logo" 
            className="navbar-logo rounded"
            style={{width: '40px', height: '40px', objectFit: 'cover'}}
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;