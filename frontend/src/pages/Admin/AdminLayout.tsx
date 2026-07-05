import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@components/Admin/AdminSidebar';

export const AdminLayout: React.FC = () => {
  return (
    <div className="admin-app">
      <AdminSidebar />
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
};
