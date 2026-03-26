import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`/api/menu/item/${id}`);
        setMenu(res.data);
      } catch (err) {
        console.error('Fetch failed:', err);
        alert('Menu not found');
        navigate('/admin/menus');
      }
    };

    fetchMenu();
  }, [id, navigate]);

  if (!menu) return <p className="loading-text">Loading...</p>;

  // Determine image source safely
  const getImageSrc = (image) => {
    if (!image) return 'https://via.placeholder.com/150'; // fallback image
    return image.startsWith('data:image')
      ? image
      : `data:image/jpeg;base64,${image}`;
  };

  return (
    <div className="container mt-4 view-menu">
      <h2>Menu Details</h2>
      <div className="card p-3">
        <img
          src={getImageSrc(menu.image)}
          alt={menu.name}
          className="menu-image"
        />
        <h4 className="mt-3">{menu.name}</h4>
        <p><strong>Price:</strong> ₹{menu.price}</p>
        <p><strong>Description:</strong> {menu.description}</p>
        <p><strong>Restaurant:</strong> {menu.restaurantId?.name || 'N/A'}</p>
        <button className="btn btn-secondary mt-2" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default ViewMenu;
