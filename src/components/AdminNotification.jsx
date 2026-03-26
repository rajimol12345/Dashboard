import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './AdminNotification.css'; 

const AdminNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [fadingId, setFadingId] = useState(null); // For fade-out animation
  const dropdownRef = useRef(null);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/admin/notifications');
      if (Array.isArray(res.data)) {
        setNotifications(res.data);
      } else if (Array.isArray(res.data.notifications)) {
        setNotifications(res.data.notifications);
      } else {
        console.error('Unexpected notifications format:', res.data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (showDropdown) {
      fetchNotifications();
    }
  }, [showDropdown]);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Mark notification as read & remove it with fade
  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/admin/notifications/${id}/read`);
      setFadingId(id);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        setFadingId(null);
      }, 300); // match CSS animation time
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      await axios.delete('/api/admin/notifications/clear');
      setNotifications([]);
    } catch (err) {
      console.error('Error clearing all notifications:', err);
    }
  };

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      {/* Bell Icon with Badge */}
      <div className="notification-icon" onClick={toggleDropdown}>
        <span className="material-symbols-outlined">notifications</span>
        {notifications.length > 0 && (
          <span className="notification-badge">
            {notifications.length}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="notification-dropdown">
          {/* Header with Clear All */}
          <div className="notification-header">
            <span>Notifications</span>
            {notifications.length > 0 && (
              <button className="clear-btn" onClick={clearAllNotifications}>
                Clear All
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="no-notifications">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`notification-item ${fadingId === n._id ? 'fade-out' : ''}`}
                onClick={() => markAsRead(n._id)}
              >
                {n.message}
                <small className="notification-date">
                  {new Date(n.createdAt).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminNotification;
