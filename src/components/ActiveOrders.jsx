import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  // Fetch active (non-delivered) orders from the backend
  useEffect(() => {
    axios
      .get('/api/order/all')
      .then((res) => {
        const active = res.data.filter(order => order.status !== 'Delivered');
        setOrders(active);
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setError('Failed to load active orders.');
      });
  }, []);

  const markAsDelivered = async (orderId) => {
    try {
      const response = await axios.put(`/api/order/${orderId}/deliver`);
      if (response.data.success) {
        setOrders(prev => prev.filter(order => order._id !== orderId));
      } else {
        console.error('Failed to update:', response.data.message);
        alert('Failed to mark as delivered');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Server error while updating status');
    }
  };

  return (
    <div className="restaurant-form-container">
      <h3 className="mb-4">Active Orders</h3>

      <div className="table-responsive bg-white p-3 rounded shadow-sm">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total (₹)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order.address?.name || 'N/A'}</td>
                  <td>
                    {order.items.map((item, idx) => (
                      <div key={idx}>
                        {item.name} × {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    <span className="badge bg-warning">{order.status}</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => markAsDelivered(order._id)}
                    >
                      Mark as Delivered
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-danger">
                  {error || 'No active orders'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveOrders;
