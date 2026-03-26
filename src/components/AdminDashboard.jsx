import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const AdminOverviewDashboard = () => {
  const [overviewStats, setOverviewStats] = useState({
    users: 0,
    restaurants: 0,
    orders: 0,
    revenue: 0,
  });

  const [activities, setActivities] = useState([]);
  const [orderTrends, setOrderTrends] = useState([]);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const res = await axios.get('/api/admin/overview');

        // Ensure safe values even if backend returns null or undefined
        setOverviewStats({
          users: res.data.stats?.users ?? 0,
          restaurants: res.data.stats?.restaurants ?? 0,
          orders: res.data.stats?.orders ?? 0,
          revenue: res.data.stats?.revenue ?? 0,
        });

        setActivities(res.data.activities || []);
      } catch (err) {
        console.error('Error fetching overview data:', err);
      }
    };

    const fetchOrderTrends = async () => {
      try {
        const res = await axios.get('/api/admin/stats');
        setOrderTrends(res.data.orderTrends || []);
      } catch (err) {
        console.error('Error fetching order trends:', err);
      }
    };

    fetchOverviewData();
    fetchOrderTrends();
  }, []);

  return (
    <div className="dashboard-main">
      <h1>Dashboard</h1>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Users</h3>
          <div className="value">
            {(overviewStats.users ?? 0).toLocaleString()}
          </div>
          <div className="sub-value">+5.2% this month</div>
        </div>

        <div className="card">
          <h3>Restaurants</h3>
          <div className="value">
            {(overviewStats.restaurants ?? 0).toLocaleString()}
          </div>
          <div className="sub-value">+3 added</div>
        </div>

        <div className="card">
          <h3>Orders</h3>
          <div className="value">
            {(overviewStats.orders ?? 0).toLocaleString()}
          </div>
          <div className="sub-value">+8.7% this month</div>
        </div>

        <div className="card">
          <h3>Revenue</h3>
          <div className="value">
            ₹{(overviewStats.revenue ?? 0).toLocaleString()}
          </div>
          <div className="sub-value">+10.4% from last month</div>
        </div>
      </div>

      {/* Render chart only if data is available */}
      {orderTrends.length > 0 && (
        <div className="dashboard-chart">
          <h3>Order Trends This Week</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#ff6600"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

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

export default AdminOverviewDashboard;
