import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [menu, setMenu] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    restaurantId: '',
  });

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Fetch Restaurants
  useEffect(() => {
    axios.get('/api/restaurants/list')
      .then((res) => {
        setRestaurants(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error('Failed to fetch restaurants:', err);
        setError('Failed to load restaurants');
      });
  }, []);

  // ✅ Fetch Menu by ID
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get('/api/menu/admin/menus');
        const menuList = Array.isArray(res.data) ? res.data : [];
        const found = menuList.find((item) => item._id?.toString() === id?.toString());

        if (!found) {
          setError('Menu not found');
        } else {
          setMenu({
            name: found.name || '',
            price: found.price || '',
            description: found.description || '',
            image: found.image || '',
            restaurantId: found.restaurantId?._id || '',
          });
        }
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError('Failed to fetch menu');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [id]);

  // ✅ Handle Form Inputs
  const handleChange = (e) => {
    setMenu({ ...menu, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setMenu({ ...menu, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/menu/admin/menus/${id}`, menu);
      alert('Menu updated successfully!');
      navigate('/admin/menulist ');
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update menu');
    }
  };

  // ✅ UI Rendering
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <form onSubmit={handleSubmit} className="p-4 container">
      <h2 className="mb-4">Edit Menu Item</h2>

      <div className="mb-3">
        <label className="form-label">Menu Name</label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={menu.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Price (₹)</label>
        <input
          type="number"
          className="form-control"
          name="price"
          value={menu.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          name="description"
          value={menu.description}
          onChange={handleChange}
          rows={3}
          required
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label">Upload Image</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleImageChange}
        />
        {menu.image && (
          <div className="mt-2">
            <img src={menu.image} alt="Preview" width="120" />
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Select Restaurant</label>
        <select
          className="form-control"
          name="restaurantId"
          value={menu.restaurantId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Restaurant --</option>
          {restaurants.map((res) => (
            <option key={res._id} value={res._id}>
              {res.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-success">Update Menu</button>
    </form>
  );
};

export default EditMenu;
