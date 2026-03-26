import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 992);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 992) {
      setIsSidebarOpen(false);
    }
  };

  // Close sidebar on location change for mobile
  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Paths that should hide layout (login/register)
  const hideLayout = ['/admin/login', '/admin/register'].includes(location.pathname);

  return (
    <div className={`admin-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {!hideLayout && (
        <>
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <div 
            className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} 
            onClick={closeSidebar}
          ></div>
        </>
      )}

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
