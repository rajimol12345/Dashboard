import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/restaurants/list');
      setRestaurants(res.data);
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await axios.delete(`http://localhost:5000/api/restaurants/${id}`);
        fetchRestaurants();
      } catch (err) {
        alert('Delete failed');
        console.error(err);
      }
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/restaurants/list/${id}`);
      const data = res.data;

      toast.info(
        <div>
          <h5><strong>{data.name}</strong></h5>
          <p><strong>Address:</strong> {data.address}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Phone:</strong> {data.phone}</p>
          <p><strong>Cuisine:</strong> {data.cuisine}</p>
          <p><strong>Rating:</strong> {data.rating}</p>
          <img
            src={data.image}
            alt="restaurant"
            style={{
              width: '100%',
              maxHeight: '150px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginTop: '10px'
            }}
          />
        </div>,
        {
          className: 'custom-toast-box',
          position: 'bottom-left',
          autoClose: false,
          closeOnClick: true,
        }
      );
    } catch (err) {
      console.error('Failed to view restaurant:', err);
    }
  };

  const filteredRestaurants = restaurants.filter((rest) =>
    rest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="table-responsive p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">All Restaurants</h3>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/admin/addrestaurant')}
        >
          Add Restaurant
        </button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search restaurants by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Address</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((rest, index) => (
              <tr key={rest._id}>
                <td>{index + 1}</td>
                <td>{rest.name}</td>
                <td>{rest.address}</td>
                <td>{rest.email}</td>
                <td>
                  <div className="button-group">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleView(rest._id)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => navigate(`/admin/restaurants/edit/${rest._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(rest._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No restaurants found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Restaurants;
