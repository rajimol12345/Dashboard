import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      toast.error("Invalid Order ID");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/order/${orderId}`);
        const data = res.data.order;
        if (!data) {
          setNotFound(true);
          toast.error('Order not found');
          return;
        }
        setOrder(data);
        setStatus(data.status || '');
        setAddress(data.address || { line1: '', city: '', pincode: '' });
      } catch (err) {
        console.error(err);
        if (err.response?.status === 404) {
          setNotFound(true);
          toast.error('Order not found');
        } else {
          toast.error('Failed to load order');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/order/${orderId}`, {
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
      toast.error('Error updating order');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading order...</p>;

  if (notFound) {
    return (
      <div className="text-center mt-5">
        <h2>404 - Order Not Found</h2>
        <p>The order you're trying to edit does not exist or has an invalid ID.</p>
        <button className="btn btn-primary" onClick={() => navigate('/admin/allorders')}>
          Go Back to Orders
        </button>
        <ToastContainer position="bottom-right" autoClose={3000} closeOnClick pauseOnHover />
      </div>
    );
  }

  return (
    <div className="edit-order-container">
      <h2>Edit Order</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label><strong>Status</strong></label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-control">
            {["Pending", "Delivered", "Cancelled"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <h5>Delivery Address</h5>
        <div className="mb-3">
          <label>Line1</label>
          <input
            type="text"
            className="form-control"
            value={address.line1}
            onChange={(e) => setAddress({ ...address, line1: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label>City</label>
          <input
            type="text"
            className="form-control"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label>Pincode</label>
          <input
            type="text"
            className="form-control"
            value={address.pincode}
            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={updating}>
          {updating ? "Updating..." : "Save Changes"}
        </button>
      </form>

      <ToastContainer position="bottom-right" autoClose={3000} closeOnClick pauseOnHover />
    </div>
  );
};

export default EditOrder;
