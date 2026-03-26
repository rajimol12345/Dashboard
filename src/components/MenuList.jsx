import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEdit, FaTrash, FaSearch, FaPlus, FaChevronLeft, FaChevronRight, FaUtensils } from 'react-icons/fa';
import './MenuList.css';

const MenuList = () => {
  const [menus, setMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  
  // Modal
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = menus.filter((menu) =>
      menu.name.toLowerCase().includes(lowerSearch) ||
      (menu.restaurantId?.name || '').toLowerCase().includes(lowerSearch)
    );
    setFilteredMenus(filtered);
    setCurrentPage(1);
  }, [searchTerm, menus]);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/menu/admin/menus');
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
    const confirmDelete = window.confirm('Are you sure you want to delete this menu? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/menu/admin/menus/${id}`);
      const updatedMenus = menus.filter((menu) => menu._id !== id);
      setMenus(updatedMenus);
      setFilteredMenus(updatedMenus);
      alert('Menu deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete menu');
    }
  };

  const handleView = (menu) => {
    setSelectedMenu(menu);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedMenu(null);
    setShowModal(false);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMenus.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMenus.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="menu-list-page">
        <div className="page-header">
          <h2>All Menus</h2>
        </div>
        <div className="menu-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p>Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-list-page">
      <div className="page-header">
        <h2>All Menus</h2>
        <div className="header-actions">
          <button className="btn-add" onClick={() => navigate('/admin/addmenu')}>
            <FaPlus /> Add Menu
          </button>
        </div>
      </div>

      <div className="table-controls">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by menu or restaurant name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="menu-card">
        {filteredMenus.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
            <FaUtensils style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }} />
            <p>No menu items found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Restaurant</th>
                  <th>Price</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((menu) => (
                  <tr key={menu._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={menu.image} alt={menu.name} className="menu-img" />
                        <span className="menu-name-cell">{menu.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="restaurant-cell">{menu.restaurantId?.name || 'N/A'}</span>
                    </td>
                    <td>
                      <span className="price-cell">₹{menu.price}</span>
                    </td>
                    <td>
                      <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                        <button className="btn-icon view" title="View Details" onClick={() => handleView(menu)}>
                          <FaEye />
                        </button>
                        <button className="btn-icon edit" title="Edit Menu" onClick={() => navigate(`/admin/menus/edit/${menu._id}`)}>
                          <FaEdit />
                        </button>
                        <button className="btn-icon delete" title="Delete Menu" onClick={() => handleDelete(menu._id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </button>
          ))}

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
      {showModal && selectedMenu && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Menu Details</h3>
              <button className="btn-icon" onClick={handleCloseModal} style={{ border: 'none' }}>
                <FaPlus style={{ transform: 'rotate(45deg)' }} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-img-container">
                <img src={selectedMenu.image} alt={selectedMenu.name} />
              </div>
              <div className="detail-item">
                <label>Menu Name</label>
                <p>{selectedMenu.name}</p>
              </div>
              <div className="detail-item">
                <label>Restaurant</label>
                <p>{selectedMenu.restaurantId?.name || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <label>Price</label>
                <p className="price-cell">₹{selectedMenu.price}</p>
              </div>
              <div className="detail-item">
                <label>Description</label>
                <p>{selectedMenu.description || 'No description available.'}</p>
              </div>
              <div className="detail-item">
                <label>Category</label>
                <p>{selectedMenu.category || 'N/A'}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-close" onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuList;
