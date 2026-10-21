import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBell } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import logo from '../assets/greeno.jpg';
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
    <nav className="w-full bg-black px-4 py-2 border-b border-neutral-800">
      <div className="flex items-center justify-between">
        {/* Left side - Profile */}
        <div className="flex items-center">
          <div ref={profileRef} className="relative">
            <CgProfile
              className="cursor-pointer text-white hover:opacity-80 transition-opacity"
              size={30}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            />

            {showProfileMenu && (
              <div className="absolute left-0 mt-2 w-40 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl z-50 overflow-hidden">
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors"
                >
                  Change Name
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-800 hover:text-red-400 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right side content */}
        <div className="flex items-center gap-3">
          {/* Notification Button */}
          <button className="relative p-1 text-white hover:text-neutral-300 transition-colors" title="Notifications">
            <FiBell size={22} />
            <span
              className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-[10px]"
              style={{
                width: '18px',
                height: '18px',
                lineHeight: '1',
              }}
            >
              11
            </span>
          </button>

          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search on Greeno..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 sm:w-56 pl-9 pr-3 py-1.5 text-sm bg-neutral-900 border border-neutral-700 rounded-full text-white placeholder-neutral-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
            />
          </div>

          {/* Logo */}
          <img
            src={logo}
            alt="Company Logo"
            className="w-10 h-10 rounded-full object-cover border border-neutral-700"
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
