import React, { useEffect, lazy, Suspense } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { store } from "@stores/store";
import { loginSuccess } from "@stores/slices/authSlice";
import { AppProvider } from "@/contexts/AppContext";

// User pages (static import — tải ngay)
import { HomePage } from "@pages/HomePage";
import { LoginPage } from "@pages/Auth/LoginPage";
import { RegisterPage } from "@pages/Auth/RegisterPage";
import { ProductListPage } from "@pages/Products/ProductListPage";
import { ProductDetailPage } from "@pages/Products/ProductDetailPage";
import { CartPage } from "@pages/Products/CartPage";
import { CheckoutPage } from "@pages/Products/CheckoutPage";
import { OrderHistoryPage } from "@pages/Products/OrderHistoryPage";
import { ServiceListPage } from "@pages/Services/ServiceListPage";
import { ServiceDetailPage } from "@pages/Services/ServiceDetailPage";
import { AppointmentFormPage } from "@pages/Services/AppointmentFormPage";
import { MyAppointmentsPage } from "@pages/Services/MyAppointmentsPage";
import { PetListPage } from "@pages/Pets/PetListPage";
import { SubmitPetPage } from "@pages/Pets/SubmitPetPage";
import { UnauthorizedPage } from "@pages/UnauthorizedPage";

// Admin layout & pages — React.lazy (code splitting, Roadmap mục 4)
// Chỉ tải khi người dùng truy cập /admin, giảm bundle size ban đầu
const AdminLayout     = lazy(() => import("@pages/Admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminDashboard  = lazy(() => import("@pages/Admin/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminProducts   = lazy(() => import("@pages/Admin/AdminProducts").then(m => ({ default: m.AdminProducts })));
const AdminOrders     = lazy(() => import("@pages/Admin/AdminOrders").then(m => ({ default: m.AdminOrders })));
const AdminCategories = lazy(() => import("@pages/Admin/AdminCategories").then(m => ({ default: m.AdminCategories })));
const AdminBrands     = lazy(() => import("@pages/Admin/AdminBrands").then(m => ({ default: m.AdminBrands })));
const AdminAppointments = lazy(() => import("@pages/Admin/AdminAppointments").then(m => ({ default: m.AdminAppointments })));
const AdminServices   = lazy(() => import("@pages/Admin/AdminServices").then(m => ({ default: m.AdminServices })));
const AdminStaff      = lazy(() => import("@pages/Admin/AdminStaff").then(m => ({ default: m.AdminStaff })));
const AdminPets       = lazy(() => import("@pages/Admin/AdminPets").then(m => ({ default: m.AdminPets })));
const AdminUsers      = lazy(() => import("@pages/Admin/AdminUsers").then(m => ({ default: m.AdminUsers })));
const AdminReviews    = lazy(() => import("@pages/Admin/AdminReviews").then(m => ({ default: m.AdminReviews })));
const AdminPromotions = lazy(() => import("@pages/Admin/AdminPromotions").then(m => ({ default: m.AdminPromotions })));
const AdminReports    = lazy(() => import("@pages/Admin/AdminReports").then(m => ({ default: m.AdminReports })));
const AdminContact    = lazy(() => import("@pages/Admin/AdminContact").then(m => ({ default: m.AdminContact })));
const AdminSettings   = lazy(() => import("@pages/Admin/AdminSettings").then(m => ({ default: m.AdminSettings })));

// Route guards
import { ProtectedRoute } from "@components/Auth/ProtectedRoute";

// Fallback UI khi lazy component đang tải
const PageLoader: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#3BB77E', fontSize: '1.1rem' }}>
    Đang tải...
  </div>
);

const AppRoutes: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const stored = localStorage.getItem("petcare_user");
    const token = localStorage.getItem("token");
    if (stored && token) {
      try {
        dispatch(loginSuccess({ user: JSON.parse(stored), token }));
      } catch {
        // ignore
      }
    }
  }, [dispatch]);

  return (
    // Suspense: hiển thị fallback khi lazy component đang load (Roadmap mục 4)
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/services" element={<ServiceListPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path="/booking/:serviceId" element={<AppointmentFormPage />} />
        <Route path="/my-appointments" element={<MyAppointmentsPage />} />
        <Route path="/pets" element={<PetListPage />} />
        <Route path="/submit-pet" element={<SubmitPetPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected user routes */}
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />

        {/* Admin routes — lazy loaded */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
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
    </Suspense>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AppProvider>
    </Provider>
  );
};

export default App;
