import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FaChevronLeft, FaSave, FaSpinner, FaMapMarkerAlt, FaClipboardList } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './EditOrder.css';

const EditOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [address, setAddress] = useState({ line1: '', city: '', pincode: '' });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // 🔐 Simple client-side ObjectId validator
  const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

  useEffect(() => {
    if (!isValidObjectId(orderId)) {
      setNotFound(true);
      toast.error("Invalid Order ID format");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/order/${orderId}`);
        const data = res.data.order;
        if (!data) {
          setNotFound(true);
          toast.error('Order not found');
          return;
        }
        setOrder(data);
        setStatus(data.status || 'Pending');
        setAddress(data.address || { line1: '', city: '', pincode: '' });
      } catch (err) {
        console.error(err);
        if (err.response?.status === 404) {
          setNotFound(true);
          toast.error('Order not found');
        } else {
          toast.error('Failed to load order data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!address.line1 || !address.city || !address.pincode) {
      toast.warn("Please fill in all address fields");
      return;
    }

    setUpdating(true);
    try {
      const res = await axios.put(`/api/order/${orderId}`, {
        status,
        address,
      });
      if (res.data.success) {
        toast.success('Order updated successfully');
        setTimeout(() => navigate('/admin/allorders'), 1500);
      } else {
        toast.error(res.data.error || 'Update failed');
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error('Error occurred while updating order');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-order-page">
        <div className="edit-order-container" style={{ textAlign: 'center', padding: '4rem' }}>
          <FaSpinner className="spinner-icon" style={{ fontSize: '2rem', color: '#fc8019', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem', color: '#6b7280' }}>Fetching order details...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="edit-order-page">
        <div className="edit-order-container" style={{ textAlign: 'center', padding: '4rem' }}>
          <h2 style={{ color: '#ef4444' }}>Order Not Found</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>The order you're trying to edit does not exist or has an invalid ID.</p>
          <button className="submit-btn" onClick={() => navigate('/admin/allorders')}>
            Go Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-order-page">
      <div className="edit-order-header">
        <button className="back-btn" onClick={() => navigate('/admin/allorders')} title="Go Back">
          <FaChevronLeft />
        </button>
        <h2>Edit Order</h2>
      </div>

      <div className="edit-order-container">
        {order && (
          <div className="order-info-banner">
            <div className="info-item">
              <span className="label">Order ID</span>
              <span className="value">{order.orderId}</span>
            </div>
            <div className="info-item">
              <span className="label">Total Amount</span>
              <span className="value">₹{order.total}</span>
            </div>
            <div className="info-item">
              <span className="label">Restaurant</span>
              <span className="value">
                {order.restaurantName}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <div className="section-title">
            <FaClipboardList style={{ marginRight: '8px' }} />
            Order Status
          </div>
          <div className="form-group">
            <label>Current Status</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="form-control-custom"
            >
              {["Pending", "Processing", "Delivered", "Cancelled"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="section-title">
            <FaMapMarkerAlt style={{ marginRight: '8px' }} />
            Delivery Address
          </div>
          <div className="form-group">
            <label>Address Line 1</label>
            <input
              type="text"
              className="form-control-custom"
              placeholder="e.g. 123 Street Name"
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                className="form-control-custom"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                className="form-control-custom"
                placeholder="e.g. 600001"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={updating}>
            {updating ? (
              <>
                <FaSpinner className="spin" /> Updating...
              </>
            ) : (
              <>
                <FaSave /> Save Changes
              </>
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>

      <ToastContainer />
    </div>
  );
};

export default EditOrder;
