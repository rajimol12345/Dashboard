import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaSearch, FaPlus, FaChevronLeft, FaChevronRight, FaStore, FaTimes } from 'react-icons/fa';
import './Resturants.css';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  
  // Modal
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const results = restaurants.filter((rest) =>
      rest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rest.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRestaurants(results);
    setCurrentPage(1);
  }, [searchTerm, restaurants]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/restaurants/list');
      setRestaurants(res.data);
      setFilteredRestaurants(res.data);
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant? This will remove all associated menu items.')) {
      try {
        await axios.delete(`/api/restaurants/${id}`);
        fetchRestaurants();
      } catch (err) {
        alert('Delete failed');
        console.error(err);
      }
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(`/api/restaurants/list/${id}`);
      setSelectedRestaurant(res.data);
      setShowModal(true);
    } catch (err) {
      console.error('Failed to view restaurant:', err);
    }
  };

  const handleCloseModal = () => {
    setSelectedRestaurant(null);
    setShowModal(false);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRestaurants.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="restaurants-page">
        <div className="page-header">
          <h2>All Restaurants</h2>
        </div>
        <div className="restaurants-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p>Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurants-page">
      <div className="page-header">
        <h2>All Restaurants</h2>
        <button className="btn-add" onClick={() => navigate('/admin/addrestaurant')}>
          <FaPlus /> Add Restaurant
        </button>
      </div>

      <div className="table-controls">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search restaurants by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="restaurants-card">
        {filteredRestaurants.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
            <FaStore style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }} />
            <p>No restaurants found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Email</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((rest) => (
                  <tr key={rest._id}>
                    <td>
                      <img 
                        src={rest.image} 
                        alt={rest.name} 
                        className="restaurant-img-table"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=No+Image'; }}
                      />
                    </td>
                    <td>
                      <span className="restaurant-name">{rest.name}</span>
                    </td>
                    <td>
                      <div className="address-cell" title={rest.address}>
                        {rest.address}
                      </div>
                    </td>
                    <td>
                      <a href={`mailto:${rest.email}`} className="email-cell">
                        {rest.email}
                      </a>
                    </td>
                    <td>
                      <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                        <button className="btn-icon view" title="View Details" onClick={() => handleView(rest._id)}>
                          <FaEye />
                        </button>
                        <button className="btn-icon edit" title="Edit Restaurant" onClick={() => navigate(`/admin/restaurants/edit/${rest._id}`)}>
                          <FaEdit />
                        </button>
                        <button className="btn-icon delete" title="Delete Restaurant" onClick={() => handleDelete(rest._id)}>
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
      {showModal && selectedRestaurant && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Restaurant Profile</h3>
              <button className="btn-icon" onClick={handleCloseModal} style={{ border: 'none' }}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-img-container">
                <img src={selectedRestaurant.image} alt={selectedRestaurant.name} />
              </div>
              
              <div className="detail-grid">
                <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                  <label>Restaurant Name</label>
                  <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>{selectedRestaurant.name}</p>
                </div>
                
                <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                  <label>Full Address</label>
                  <p>{selectedRestaurant.address}</p>
                </div>
                
                <div className="detail-item">
                  <label>Email Address</label>
                  <p>{selectedRestaurant.email}</p>
                </div>
                
                <div className="detail-item">
                  <label>Phone Number</label>
                  <p>{selectedRestaurant.phone}</p>
                </div>
                
                <div className="detail-item">
                  <label>Cuisine Type</label>
                  <p>{selectedRestaurant.cuisine}</p>
                </div>
                
                <div className="detail-item">
                  <label>Average Rating</label>
                  <p>⭐ {selectedRestaurant.rating}</p>
                </div>
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

export default Restaurants;
