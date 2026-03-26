import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Admin
import Adminlogin from './components/Adminlogin';
import AdminRegister from './components/AdminRegister.jsx';
import AdminDashboard from './components/AdminDashboard';
import AdminLayout from './components/AdminLayout';
import Overview from './components/Overview';
import RestaurantForm from './components/RestaurantForm';
import AddMenu from './components/AddMenu';
import AllOrders from './components/AllOrders';
import ActiveOrders from './components/ActiveOrders';
import Settings from './components/Settings';
import UsersList from './components/UsersList';
import AdminLogout from './components/AdminLogout';
import Resturants from './components/Resturants';
import MenuList from './components/MenuList';
import EditRestaurant from './components/EditRestaurant';
import EditMenu from './components/EditMenu.jsx';
import AnalyticsDashboard from './components/AnalyticsDashboard.jsx';
import ViewMenu from './components/ViewMenu.jsx';
import EditOrder from './components/EditOrder.jsx';
import Logout from './components/Logout.jsx';
import SupportChat from './components/SupportChat.jsx';

// Set global API base URL
axios.defaults.baseURL = 'http://localhost:5000';

function App() {
  return (
    <>
      {/* Toast container must be outside Routes */}
      <ToastContainer position="bottom-left" autoClose={3000} pauseOnHover />

      <Routes>
        {/* Admin login/register routes */}
        <Route path="/admin/login" element={<Adminlogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Admin Layout & nested routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="allorders" element={<AllOrders />} />
          <Route path="edit-order/:orderId" element={<EditOrder />} />
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="overview" element={<Overview />} />
          <Route path="addrestaurant" element={<RestaurantForm />} />
          <Route path="addmenu" element={<AddMenu />} />
          <Route path="activeorders" element={<ActiveOrders />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<UsersList />} />
          <Route path="adminlogout" element={<AdminLogout />} />
          <Route path="restaurant" element={<Resturants />} />
          <Route path="menulist" element={<MenuList />} />
          <Route path="restaurants/edit/:id" element={<EditRestaurant />} />
          <Route path="menus/edit/:id" element={<EditMenu />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="menus/view/:id" element={<ViewMenu />} />
          <Route path="support" element={<SupportChat />} />
          <Route path="logout" element={<Logout />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
