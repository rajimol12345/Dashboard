import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AllOrders.css';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/order/all');
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else if (Array.isArray(res.data.orders)) {
          setOrders(res.data.orders);
        } else {
          setError('Invalid data format from server');
        }
      } catch (err) {
        setError('Failed to load orders');
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/order/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success(`Order marked as ${newStatus}`);
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Error updating status');
    }
  };

  const handleMarkDelivered = (orderId) => {
    updateOrderStatus(orderId, 'Delivered');
  };

  const handleMarkCancelled = (orderId) => {
    updateOrderStatus(orderId, 'Cancelled');
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`http://localhost:5000/api/order/${orderId}`);
        setOrders((prev) => prev.filter((order) => order._id !== orderId));
        toast.success('Order deleted successfully');
      } catch (err) {
        console.error('Failed to delete order:', err);
        toast.error('Failed to delete order.');
      }
    }
  };

  const handleView = (order) => {
    toast.info(
      <>
        <strong>Customer:</strong> {order.address?.name}<br />
        <strong>Address:</strong> {order.address?.line1}, {order.address?.city} - {order.address?.pincode}<br />
        <strong>Items:</strong>
        <ul>
          {order.items?.map((item, i) => (
            <li key={i}>{item.name} × {item.quantity}</li>
          ))}
        </ul>
        <strong>Total:</strong> ₹{order.totalAmount}<br />
        <strong>Status:</strong> {order.status}
      </>,
      {
        position: "top-right",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  return (
    <div className="all-orders-container">
      <h2>All Orders</h2>

      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Items</th>
              <th>Total (₹)</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Delivery</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order.address?.name || 'N/A'}</td>
                  <td>
                    {order.address?.line1}, {order.address?.city} - {order.address?.pincode}
                  </td>
                  <td>
                    {order.items?.map((item, idx) => (
                      <div key={idx}>
                        {item.name} × {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.paymentMethod || 'N/A'}</td>
                  <td className="status-cell">
                    {order.status === 'Delivered' ? (
                      <span className="status-delivered">Delivered</span>
                    ) : order.status === 'Cancelled' ? (
                      <span className="status-cancelled">Cancelled</span>
                    ) : (
                      <span className="status-pending">Pending</span>
                    )}
                  </td>
                  <td>
                    {(order.status !== 'Delivered' && order.status !== 'Cancelled') && (
                      <>
                        <button
                          className="deliver-button"
                          onClick={() => handleMarkDelivered(order._id)}
                        >
                          Mark as Delivered
                        </button>
                        <button
                          className="cancel-button"
                          onClick={() => handleMarkCancelled(order._id)}
                          style={{ marginLeft: '8px' }}
                        >
                          Mark as Cancelled
                        </button>
                      </>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleView(order)}>View</button>
                      <button onClick={() => navigate(`/admin/edit-order/${order._id}`)}>Edit</button>
                      <button onClick={() => handleDelete(order._id)} className="delete-btn">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-orders">
                  {error || 'No orders found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AllOrders;
