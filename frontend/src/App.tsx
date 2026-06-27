import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@stores/store';
import { setUser } from '@stores/slices/authSlice';

// User pages
import { HomePage } from '@pages/HomePage';
import { LoginPage } from '@pages/Auth/LoginPage';
import { RegisterPage } from '@pages/Auth/RegisterPage';
import { ProductListPage } from '@pages/Products/ProductListPage';
import { ProductDetailPage } from '@pages/Products/ProductDetailPage';
import { CartPage } from '@pages/Products/CartPage';
import { ServiceListPage } from '@pages/Services/ServiceListPage';
import { PetListPage } from '@pages/Pets/PetListPage';
import { UnauthorizedPage } from '@pages/UnauthorizedPage';

// Admin layout & pages
import { AdminLayout } from '@pages/Admin/AdminLayout';
import { AdminDashboard } from '@pages/Admin/AdminDashboard';
import { AdminProducts } from '@pages/Admin/AdminProducts';
import { AdminOrders } from '@pages/Admin/AdminOrders';
import { AdminCategories } from '@pages/Admin/AdminCategories';
import { AdminBrands } from '@pages/Admin/AdminBrands';
import { AdminAppointments } from '@pages/Admin/AdminAppointments';
import { AdminServices } from '@pages/Admin/AdminServices';
import { AdminStaff } from '@pages/Admin/AdminStaff';
import { AdminPets } from '@pages/Admin/AdminPets';
import { AdminUsers } from '@pages/Admin/AdminUsers';
import { AdminReviews } from '@pages/Admin/AdminReviews';
import { AdminPromotions } from '@pages/Admin/AdminPromotions';
import { AdminReports } from '@pages/Admin/AdminReports';
import { AdminContact } from '@pages/Admin/AdminContact';
import { AdminSettings } from '@pages/Admin/AdminSettings';

// Route guards
import { ProtectedRoute } from '@components/Auth/ProtectedRoute';

import './App.css';
import './index.css';

const AppRoutes: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const stored = localStorage.getItem('petcare_user');
    const token = localStorage.getItem('token');
    if (stored && token) {
      try {
        dispatch(setUser(JSON.parse(stored)));
      } catch {
        // ignore
      }
    }
  }, [dispatch]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/services" element={<ServiceListPage />} />
      <Route path="/pets" element={<PetListPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected user routes */}
      <Route path="/cart" element={
        <ProtectedRoute>
          <CartPage />
        </ProtectedRoute>
      } />

      {/* Admin routes — nested inside AdminLayout */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="brands" element={<AdminBrands />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="staff" element={<AdminStaff />} />
        <Route path="pets" element={<AdminPets />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="promotions" element={<AdminPromotions />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="contact" element={<AdminContact />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
};

export default App;

