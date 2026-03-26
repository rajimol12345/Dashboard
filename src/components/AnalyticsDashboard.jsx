import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const AnalyticsDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  // Fetch Orders
  useEffect(() => {
    axios
      .get('/api/order/all')
      .then((res) => setOrders(res.data || []))
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch orders data");
      });
  }, []);

  // Calculate totals
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order?.totalAmount || 0),
    0
  );

  // Status Count
  const statusCounts = orders.reduce((acc, order) => {
    const status = order?.status || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Pie Chart Data
  const pieData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "# of Orders",
        data: Object.values(statusCounts),
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverOffset: 20,
      },
    ],
  };

  // Get Last 7 Days Labels
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();

  // Orders Count per Day
  const ordersPerDay = last7Days.map((day) =>
    orders.filter((order) =>
      order?.createdAt?.startsWith(day)
    ).length
  );

  // Bar Chart Data
  const barData = {
    labels: last7Days,
    datasets: [
      {
        label: "Orders per Day",
        data: ordersPerDay,
        backgroundColor: "#36A2EB",
      },
    ],
  };

  return (
    <div className="analytics-dashboard">
      <h2>Analytics Dashboard</h2>

      {error && <p className="error-message">{error}</p>}

      {/* Summary Cards */}
      <div className="analytics-cards">
        <div className="analytics-card">
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>

        <div className="analytics-card">
          <h3>Total Revenue</h3>
          <p>₹{totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-charts">
        <div className="chart-box">
          <h3>Order Status Distribution</h3>
          <Pie data={pieData} />
        </div>

        <div className="chart-box">
          <h3>Orders in Last 7 Days</h3>
          <Bar
            data={barData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
