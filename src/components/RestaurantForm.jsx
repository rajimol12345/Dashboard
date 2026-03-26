import React, { useState } from 'react';
import axios from 'axios';

const RestaurantForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    cuisine: '',
    email: '',
    openingHours: '',
    image: '' // store base64 here
  });

  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/restaurants/restaurants', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      setSuccess('Restaurant added successfully!');
      setError('');
      setFormData({
        name: '',
        address: '',
        phone: '',
        cuisine: '',
        email: '',
        openingHours: '',
        image: '',
      });
      setPreview(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong.');
      setSuccess('');
    }
  };

  return (
    <div className="restaurant-form-wrapper">
      <div className="restaurant-form-container">
        <h2 className="form-title mb-4">Add New Restaurant</h2>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-sm">
          {/* Image Upload */}
          <div className="mb-3">
            <label className="form-label">Image</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleImageChange}
              required
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                style={{
                  height: '100px',
                  marginTop: '10px',
                  borderRadius: '5px',
                  objectFit: 'cover',
                }}
              />
            )}
          </div>

          {/* Text Fields */}
          {['name', 'address', 'cuisine', 'phone', 'email', 'openingHours'].map((field) => (
            <div className="mb-3" key={field}>
              <label className="form-label">
                {field === 'openingHours'
                  ? 'Opening Hours'
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                className="form-control"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <button type="submit" className="btn btn-primary mt-2">
            Add Restaurant
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantForm;
