import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Paths that should hide layout (login/register)
  const hideLayout = ['/admin/login', '/admin/register'].includes(location.pathname);

  return (
    <div className={`admin-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {!hideLayout && <Sidebar isOpen={isSidebarOpen} />}

      <div className="admin-main">
        {!hideLayout && (
          <Header
            toggleSidebar={toggleSidebar}
            collapsed={!isSidebarOpen} // Pass collapsed state to Header
          />
        )}

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
