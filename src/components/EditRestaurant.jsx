import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
const EditRestaurant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    cuisine: '',
    email: '',
    openingHours: '',
    rating: '',
    image: '',
  });

  useEffect(() => {
    axios
      .get(`/api/restaurants/list/${id}`)
      .then((res) => setFormData(res.data))
      .catch((err) => console.error('Fetch failed', err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/restaurants/edit/${id}`, formData);
      alert('Restaurant updated successfully');
      navigate('/admin/restaurant');
    } catch (err) {
      console.error('Update error:', err);
      alert('Update failed');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Restaurant</h2>
      <form onSubmit={handleSubmit}>
        {['name', 'address', 'phone', 'cuisine', 'email', 'openingHours'].map((field) => (
          <div className="mb-3" key={field}>
            <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        ))}

        <div className="mb-3">
          <label className="form-label">Rating</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="form-control"
            min="1"
            max="5"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-control"
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              style={{ marginTop: '10px', maxWidth: '150px', borderRadius: '6px' }}
            />
          )}
        </div>

        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
};

export default EditRestaurant;
