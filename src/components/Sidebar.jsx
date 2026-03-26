import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        {isOpen && <h2 className="sidebar-title">EatYoWay</h2>}
        <button className="mobile-close-btn" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <ul className="sidebar-links">
        <li>
          <NavLink to="/admin/dashboard" title="Dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            {isOpen && <span className="link-text">Dashboard</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/analytics" title="Analytics">
            <span className="material-symbols-outlined">monitoring</span>
            {isOpen && <span className="link-text">Analytics</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/restaurant" title="Restaurants">
            <span className="material-symbols-outlined">restaurant</span>
            {isOpen && <span className="link-text">Restaurants</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/menulist" title="Menu">
            <span className="material-symbols-outlined">add_business</span>
            {isOpen && <span className="link-text">Menu</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/allorders" title="Orders">
            <span className="material-symbols-outlined">receipt_long</span>
            {isOpen && <span className="link-text">Orders</span>}
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/support" title="Support">
            <span className="material-symbols-outlined">headset_mic</span>
            {isOpen && <span className="link-text">Support</span>}
          </NavLink>
        </li>

       
        <li>
          <NavLink to="/admin/settings" title="Settings">
            <span className="material-symbols-outlined">settings</span>
            {isOpen && <span className="link-text">Settings</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/users" title="User Info">
            <span className="material-symbols-outlined">account_circle</span>
            {isOpen && <span className="link-text">User Info</span>}
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/logout" title="Logout">
  <span className="material-symbols-outlined">logout</span>
  {isOpen && <span className="link-text">Logout</span>}
</NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
