import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddMenu = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItem, setMenuItem] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    restaurantId: ''
    // Removed category field
  });

  // Fetch all restaurants on mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/restaurants/list')
      .then(res => {
        setRestaurants(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error('Failed to load restaurants:', err);
        toast.error('Failed to load restaurants');
        setRestaurants([]);
      });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setMenuItem({ ...menuItem, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenuItem((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/menu/addmenu', menuItem);
      console.log('Menu added:', res.data);
      toast.success('Menu added successfully');

      // Reset form
      setMenuItem({
        name: '',
        price: '',
        description: '',
        image: '',
        restaurantId: ''
      });
    } catch (error) {
      console.error('Error adding menu:', error);
      toast.error('Failed to add menu');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Add Menu</h2>

        {/* Restaurant Selection */}
        <select
          name="restaurantId"
          value={menuItem.restaurantId}
          onChange={handleChange}
          required
        >
          <option value="">Select Restaurant</option>
          {restaurants.map((rest) => (
            <option key={rest._id} value={rest._id}>
              {rest.name}
            </option>
          ))}
        </select>

        {/* Menu Name */}
        <input
          type="text"
          name="name"
          placeholder="Menu Name"
          value={menuItem.name}
          onChange={handleChange}
          required
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={menuItem.price}
          onChange={handleChange}
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={menuItem.description}
          onChange={handleChange}
          required
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        {/* Preview */}
        {menuItem.image && (
          <img
            src={menuItem.image}
            alt="Preview"
            width="150"
            style={{ marginTop: '10px', display: 'block' }}
          />
        )}

        {/* Submit */}
        <button type="submit">Add Menu</button>
      </form>

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default AddMenu;
