import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Overview = () => {
  const [stats, setStats] = useState({
    users: 0,
    restaurants: 0,
    orders: 0,
    revenue: 0,
  });

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/overview');
        setStats(res.data.stats);
        setActivities(res.data.activities);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-main">
      <h1>Overview</h1>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Users</h3>
          <div className="value">{stats.users.toLocaleString()}</div>
          <div className="sub-value">+5.2% this month</div>
        </div>

        <div className="card">
          <h3>Restaurants</h3>
          <div className="value">{stats.restaurants}</div>
          <div className="sub-value">+3 added</div>
        </div>

        <div className="card">
          <h3>Orders</h3>
          <div className="value">{stats.orders.toLocaleString()}</div>
          <div className="sub-value">+8.7% this month</div>
        </div>

        <div className="card">
          <h3>Revenue</h3>
          <div className="value">₹{stats.revenue.toLocaleString()}</div>
          <div className="sub-value">+10.4% from last month</div>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Recent Activity</h3>
        <ul>
          {activities.map((act, index) => (
            <li key={index}>{act}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Overview;
