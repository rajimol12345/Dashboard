import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:5000/food-ordering-app/api/user/userslist')
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setUsers([]);
      });
  }, []);

  const handleDelete = async (userId) => {
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if (!confirm) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/food-ordering-app/api/user/deleteProfile/${userId}`
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

  return (
    <div className="admin-users-container">
      <h2>Users Info</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th> {/* ✅ Added Status Header */}
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.fullname || user.name}</td>
                <td>{user.email}</td>
                <td>{user.role || 'User'}</td>
                <td>{user.status || 'Active'}</td> {/* ✅ Show status or default */}
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleView(user)}>View</button>
                  <button onClick={() => navigate(`/EditProfile/${user._id}`)}>Edit</button>
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>User Details</h3>
            <p><strong>Name:</strong> {selectedUser.fullname || selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
            <p><strong>Role:</strong> {selectedUser.role || 'User'}</p>
            <p><strong>Status:</strong> {selectedUser.status || 'Active'}</p> 
            <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
           {selectedUser.deliveryAddress && (
           <div>
            <strong>Address:</strong>
            <p>{selectedUser.deliveryAddress.line1}</p>
            <p>{selectedUser.deliveryAddress.line2}</p>
            <p>{selectedUser.deliveryAddress.city} - {selectedUser.deliveryAddress.pincode}</p>
          </div>
          )}

            {selectedUser.profilePic && (
              <img
                src={selectedUser.profilePic}
                alt="Profile"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  marginTop: '10px',
                }}
              />
            )}
            <br />
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;

