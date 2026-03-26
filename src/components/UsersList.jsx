import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEdit, FaTrash, FaSearch, FaTimes, FaUser } from 'react-icons/fa';
import './UsersList.css';

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/food-ordering-app/api/user/userslist');
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const results = users.filter(user => 
      (user.fullname || user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const handleDelete = async (userId) => {
    const confirm = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
    if (!confirm) return;

    try {
      const res = await axios.delete(
        `/food-ordering-app/api/user/deleteProfile/${userId}`
      );

      if (res.status === 200) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        alert('User deleted successfully');
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Server error');
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="users-list-page">
        <div className="page-header">
          <h2>Users Info</h2>
        </div>
        <div className="users-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="users-list-page">
      <div className="page-header">
        <h2>Users Info</h2>
        <div className="table-controls">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="users-card">
        {filteredUsers.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            <p>No users found matching your search.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-cell">
                        {user.profilePic ? (
                          <img src={user.profilePic} alt="" className="user-avatar" />
                        ) : (
                          <div className="user-avatar"><FaUser /></div>
                        )}
                        <div className="user-info-cell">
                          <span className="name">{user.fullname || user.name}</span>
                          <span className="email">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${user.role?.toLowerCase() || 'user'}`}>
                        {user.role || 'User'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.status?.toLowerCase() || 'active'}`}>
                        {user.status || 'Active'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td>
                      <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                        <button className="btn-icon view" title="View Details" onClick={() => handleView(user)}>
                          <FaEye />
                        </button>
                        <button className="btn-icon edit" title="Edit User" onClick={() => navigate(`/EditProfile/${user._id}`)}>
                          <FaEdit />
                        </button>
                        <button className="btn-icon delete" title="Delete User" onClick={() => handleDelete(user._id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modern Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Details</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="user-profile-summary">
                {selectedUser.profilePic ? (
                  <img src={selectedUser.profilePic} alt="Profile" className="modal-avatar" />
                ) : (
                  <div className="modal-avatar" style={{ backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#9ca3af' }}>
                    <FaUser />
                  </div>
                )}
                <h4 className="modal-name">{selectedUser.fullname || selectedUser.name}</h4>
                <span className="modal-email">{selectedUser.email}</span>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <label>Phone</label>
                  <p>{selectedUser.phone || 'N/A'}</p>
                </div>
                <div className="detail-item">
                  <label>Role</label>
                  <p>{selectedUser.role || 'User'}</p>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <p>{selectedUser.status || 'Active'}</p>
                </div>
                <div className="detail-item">
                  <label>Joined Date</label>
                  <p>{new Date(selectedUser.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>

                {selectedUser.deliveryAddress && (
                  <div className="address-section">
                    <label>Delivery Address</label>
                    <p>{selectedUser.deliveryAddress.line1}</p>
                    {selectedUser.deliveryAddress.line2 && <p>{selectedUser.deliveryAddress.line2}</p>}
                    <p>{selectedUser.deliveryAddress.city} - {selectedUser.deliveryAddress.pincode}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-primary" onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
