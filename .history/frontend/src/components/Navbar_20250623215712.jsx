import React from 'react';
import { FiSearch, FiBell } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import logo from '../assets/greeno.jpg'; // adjust path as needed
import '../styles/Navbar.css';

function Navbar({ searchQuery, setSearchQuery }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-section navbar-left">
          <CgProfile className="navbar-profile" />
        </div>
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
