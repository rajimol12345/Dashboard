import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMenus(menus);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = menus.filter((menu) =>
        menu.name.toLowerCase().includes(lowerSearch) ||
        menu.restaurantId?.name?.toLowerCase().includes(lowerSearch)
      );
      setFilteredMenus(filtered);
    }
  }, [searchTerm, menus]);

  const fetchMenus = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/menu/admin/menus');
      const menuData = Array.isArray(res.data) ? res.data : [];
      setMenus(menuData);
      setFilteredMenus(menuData);
    } catch (err) {
      console.error('Error fetching menus:', err);
      setMenus([]);
      setFilteredMenus([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this menu?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/menu/admin/menus/${id}`);
      const updatedMenus = menus.filter((menu) => menu._id !== id);
      setMenus(updatedMenus);
      setFilteredMenus(updatedMenus);
      alert('Menu deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete menu');
    }
  };

  return (
    <div className="menu-container p-3">
      <div className="menu-header d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">All Menus</h2>
        <button className="btn btn-primary" onClick={() => navigate('/admin/addmenu')}>
          Add Menu
        </button>
      </div>

      {/* 🔍 Search Box */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by menu or restaurant name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading menu items...</p>
      ) : filteredMenus.length === 0 ? (
        <p>No menu items found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Menu Name</th>
                <th>Restaurant</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMenus.map((menu, index) => (
                <tr key={menu._id}>
                  <td>{index + 1}</td>
                  <td>
                    {menu.image ? (
                      <img
                        src={menu.image}
                        alt={menu.name}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                        }}
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td>{menu.name}</td>
                  <td>{menu.restaurantId?.name || 'N/A'}</td>
                  <td>₹{menu.price}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm mx-1"
                      onClick={() => navigate(`/admin/menus/view/${menu._id}`)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-warning btn-sm mx-1"
                      onClick={() => navigate(`/admin/menus/edit/${menu._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm mx-1"
                      onClick={() => handleDelete(menu._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MenuList;
