import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { 
  FaEye, FaEdit, FaTrash, FaSearch, FaCheck, 
  FaTimes, FaChevronLeft, FaChevronRight, FaBoxOpen 
} from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './AllOrders.css';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/order/all');
      let data = [];
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (Array.isArray(res.data.orders)) {
        data = res.data.orders;
      } else {
        setError('Invalid data format from server');
      }
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const results = orders.filter(order => 
      (order.orderId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.address?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.restaurantName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(results);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, orders]);

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`/api/order/${orderId}`, {
        status: newStatus,
      });

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
      console.error(err);
      toast.error('Error updating status');
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await axios.delete(`/api/order/${orderId}`);
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      toast.success('Order deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete order');
    }
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'badge delivered';
      case 'cancelled': return 'badge cancelled';
      case 'pending': return 'badge pending';
      case 'processing': return 'badge processing';
      default: return 'badge pending';
    }
  };

  if (loading) {
    return (
      <div className="all-orders-page">
        <div className="page-header">
          <h2>All Orders</h2>
        </div>
        <div className="orders-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="all-orders-page">
      <div className="page-header">
        <h2>All Orders</h2>
        <div className="table-controls">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search ID, customer, restaurant..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="orders-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order Info</th>
                <th>Customer</th>
                <th>Restaurant</th>
                <th>Total</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <div className="order-id-cell">{order.orderId}</div>
                      <div className="items-list">
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <span key={idx} className="item-row">
                            {item.name} × {item.quantity}
                          </span>
                        ))}
                        {order.items?.length > 2 && (
                          <span className="item-row" style={{ fontStyle: 'italic' }}>
                            + {order.items.length - 2} more items
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{order.address?.name || 'N/A'}</td>
                    <td>{order.restaurantName}</td>
                    <td style={{ fontWeight: '600' }}>₹{order.total}</td>
                    <td>
                      <span className={getStatusBadgeClass(order.status)}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                          <>
                            <button 
                              className="btn-icon deliver" 
                              title="Mark Delivered"
                              onClick={() => updateOrderStatus(order._id, 'Delivered')}
                            >
                              <FaCheck />
                            </button>
                            <button 
                              className="btn-icon cancel" 
                              title="Cancel Order"
                              onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                        <button className="btn-icon view" title="View Details" onClick={() => handleView(order)}>
                          <FaEye />
                        </button>
                        <button 
                          className="btn-icon edit" 
                          title="Edit Order" 
                          onClick={() => navigate(`/admin/edit-order/${order._id}`)}
                        >
                          <FaEdit />
                        </button>
                        <button className="btn-icon delete" title="Delete Order" onClick={() => handleDelete(order._id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                    <FaBoxOpen style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }} />
                    <p>{error || 'No orders found.'}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="page-btn" 
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </button>
          
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>

          <button 
            className="page-btn" 
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* View Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details: {selectedOrder.orderId}</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="order-detail-section">
                <h4>Customer Info</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Name</label>
                    <p>{selectedOrder.address?.name || 'N/A'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Phone</label>
                    <p>{selectedOrder.address?.phone || 'N/A'}</p>
                  </div>
                  <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                    <label>Delivery Address</label>
                    <p>{selectedOrder.address?.line1}, {selectedOrder.address?.city} - {selectedOrder.address?.pincode}</p>
                  </div>
                </div>
              </div>

              <div className="order-detail-section">
                <h4>Order Summary</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Restaurant</label>
                    <p>{selectedOrder.restaurantName}</p>
                  </div>
                  <div className="detail-item">
                    <label>Status</label>
                    <span className={getStatusBadgeClass(selectedOrder.status)}>{selectedOrder.status}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ordered On</label>
                    <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="order-detail-section">
                <h4>Items</h4>
                <table className="order-items-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Qty</th>
                      <th style={{ textAlign: 'right' }}>Price</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((item, i) => (
                      <tr key={i}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td style={{ textAlign: 'right' }}>₹{item.price}</td>
                        <td style={{ textAlign: 'right' }}>₹{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="total-row">
                  <span>Grand Total</span>
                  <span>₹{selectedOrder.total}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AllOrders;
