import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@stores/store';
import { useAuth } from '@hooks/useAuth';

interface NavItem {
  to: string;
  icon: string;
  label: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'QUẢN LÝ BÁN HÀNG',
    items: [
      { to: '/admin/products', icon: '🛍️', label: 'Sản phẩm' },
      { to: '/admin/orders', icon: '📋', label: 'Đơn hàng', badge: 7 },
      { to: '/admin/categories', icon: '📁', label: 'Danh mục' },
      { to: '/admin/brands', icon: '🏷️', label: 'Thương hiệu' },
    ],
  },
  {
    title: 'QUẢN LÝ DỊCH VỤ',
    items: [
      { to: '/admin/appointments', icon: '📅', label: 'Lịch hẹn', badge: 8 },
      { to: '/admin/services', icon: '✂️', label: 'Dịch vụ' },
      { to: '/admin/staff', icon: '👨‍💼', label: 'Nhân viên' },
    ],
  },
  {
    title: 'THÚ CƯNG',
    items: [
      { to: '/admin/pets', icon: '🐾', label: 'Quản lý thú cưng' },
    ],
  },
  {
    title: 'TÀI KHOẢN',
    items: [
      { to: '/admin/users', icon: '👥', label: 'Quản lý tài khoản' },
      { to: '/admin/reviews', icon: '⭐', label: 'Đánh giá' },
    ],
  },
  {
    title: 'MARKETING',
    items: [
      { to: '/admin/promotions', icon: '🎁', label: 'Khuyến mãi' },
    ],
  },
  {
    title: 'BÁO CÁO',
    items: [
      { to: '/admin/reports', icon: '📊', label: 'Báo cáo' },
    ],
  },
  {
    title: 'HỖ TRỢ',
    items: [
      { to: '/admin/contact', icon: '💬', label: 'Liên hệ', badge: 6 },
    ],
  },
  {
    title: 'CÀI ĐẶT',
    items: [
      { to: '/admin/settings', icon: '⚙️', label: 'Cài đặt liên hệ' },
    ],
  },
];

export const AdminSidebar: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`admin-sidebar-new ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="asn-logo">
        <span className="asn-logo-icon">🐾</span>
        {!collapsed && <span className="asn-logo-text">UME Admin</span>}
        <button className="asn-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* User info */}
      <div className="asn-user">
        <div className="asn-user-avatar">
          {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
        </div>
        {!collapsed && (
          <div className="asn-user-info">
            <div className="asn-user-name">{user?.name ?? 'Admin'}</div>
            <div className="asn-user-role">Quản trị viên</div>
          </div>
        )}
      </div>

      {/* Dashboard link */}
      <div className="asn-dashboard-link">
        <NavLink to="/admin" end className={({ isActive }) => `asn-item ${isActive ? 'active' : ''}`}>
          <span className="asn-item-icon">📊</span>
          {!collapsed && <span className="asn-item-label">Dashboard</span>}
        </NavLink>
      </div>

      {/* Navigation sections */}
      <nav className="asn-nav">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="asn-section">
            {!collapsed && <div className="asn-section-title">{section.title}</div>}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `asn-item ${isActive ? 'active' : ''}`}
              >
                <span className="asn-item-icon">{item.icon}</span>
                {!collapsed && <span className="asn-item-label">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="asn-badge">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="asn-bottom">
        <NavLink to="/" className="asn-item asn-item-home">
          <span className="asn-item-icon">🏠</span>
          {!collapsed && <span className="asn-item-label">Xem trang chủ</span>}
        </NavLink>
        <button className="asn-item asn-logout" onClick={handleLogout}>
          <span className="asn-item-icon">🚪</span>
          {!collapsed && <span className="asn-item-label">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};
