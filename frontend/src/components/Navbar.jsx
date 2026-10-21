import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiBell } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import logo from '../assets/greeno.jpg';

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
    <nav className="w-full bg-black px-4 py-2 border-b border-[#262626] box-border">
      <div className="flex items-center justify-between w-full">
        {/* Left side - Profile */}
        <div className="flex items-center">
          <div ref={profileRef} className="relative flex items-center">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="bg-transparent border-0 p-0 cursor-pointer text-white hover:opacity-80 transition-opacity flex items-center justify-center outline-none"
              title="Profile menu"
            >
              <CgProfile size={30} />
            </button>

            {showProfileMenu && (
              <div className="absolute left-0 top-full mt-2 w-40 bg-[#171717] border border-[#404040] rounded-lg shadow-2xl z-50 overflow-hidden py-1">
                <button
                  type="button"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-200 hover:bg-[#262626] hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
                >
                  Change Name
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-200 hover:bg-[#262626] hover:text-red-400 transition-colors bg-transparent border-0 cursor-pointer"
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
          <button
            type="button"
            className="relative p-1 text-white hover:text-neutral-300 transition-colors bg-transparent border-0 cursor-pointer flex items-center justify-center outline-none"
            title="Notifications"
          >
            <FiBell size={22} />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-[10px] w-[18px] h-[18px] leading-none">
              11
            </span>
          </button>

          {/* Search */}
          <div className="relative flex items-center">
            <FiSearch className="absolute left-3 text-neutral-400 pointer-events-none text-base" />
            <input
              type="text"
              placeholder="Search on Greeno..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 sm:w-56 pl-9 pr-3 py-1.5 text-sm bg-[#171717] border border-[#404040] rounded-full text-white placeholder-neutral-400 focus:outline-none focus:border-[#a0cc3a] transition-all"
            />
          </div>

          {/* Logo */}
          <img
            src={logo}
            alt="Company Logo"
            className="w-10 h-10 min-w-10 min-h-10 max-w-10 max-h-10 rounded-full object-cover border border-[#404040] shrink-0"
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
