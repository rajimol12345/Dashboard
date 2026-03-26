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
    restaurantId: '',
    category: ''   // ✅ category added
  });

  const categories = [
    "Starter",
    "Main Course",
    "Dessert",
    "Beverage",
    "Seafood",
    "Vegetarian",
    "Non-Veg"
  ];

  // Fetch all restaurants on mount
  useEffect(() => {
    axios.get('/api/restaurants/list')
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
      const res = await axios.post('/api/menu/addmenu', menuItem);
      console.log('Menu added:', res.data);
      toast.success('Menu added successfully');

      // Reset form
      setMenuItem({
        name: '',
        price: '',
        description: '',
        image: '',
        restaurantId: '',
        category: ''
      });
    } catch (error) {
      console.error('Error adding menu:', error);
      toast.error('Failed to add menu');
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <form onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: "10px" }}>Add Menu</h2>

        {/* Restaurant Selection */}
        <select
          name="restaurantId"
          value={menuItem.restaurantId}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        >
          <option value="">Select Restaurant</option>
          {restaurants.map((rest) => (
            <option key={rest._id} value={rest._id}>
              {rest.name}
            </option>
          ))}
        </select>

        {/* Category */}
        <select
          name="category"
          value={menuItem.category}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        >
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
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
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={menuItem.price}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={menuItem.description}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px", height: "80px" }}
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          style={{ marginBottom: "10px" }}
        />

        {/* Preview */}
        {menuItem.image && (
          <img
            src={menuItem.image}
            alt="Preview"
            width="150"
            style={{ marginTop: '10px', display: 'block', borderRadius: "6px" }}
          />
        )}

        {/* Submit */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
            marginTop: "15px"
          }}
        >
          Add Menu
        </button>
      </form>

      {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default AddMenu;
