import React from 'react';
import { Link } from 'react-router-dom';
import AdminNotification from './AdminNotification';

const Header = ({ toggleSidebar, collapsed }) => {
  return (
    <header className="admin-header">
      {/* === Left Section === */}
      <div className="header-left">
        <button onClick={toggleSidebar} className="sidebar-toggle-btn">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      {/* === Center Section === */}
      <div className="header-center">
        <div className="search-box">
          <input type="text" placeholder="Search orders, users..." />
          <span className="material-symbols-outlined">search</span>
        </div>
      </div>

      {/* === Right Section === */}
      <div className="header-right">
        <Link to="/admin/allorders" title="Orders">
          <span className="material-symbols-outlined">shopping_bag</span>
        </Link>

        <AdminNotification />

        <Link to="/admin/settings" title="Settings">
          <span className="material-symbols-outlined">settings</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
