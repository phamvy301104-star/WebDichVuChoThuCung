import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@stores/store';
import { useAuth } from '@hooks/useAuth';
import {
  LayoutDashboard, ShoppingBag, ClipboardList, FolderOpen, Tag,
  Calendar, Scissors, Users, PawPrint, Star, Gift, BarChart2,
  MessageSquare, Settings, LogOut, ChevronLeft, ChevronRight,
  UserCircle, Home, Package
} from 'lucide-react';

interface NavItem { to: string; icon: React.ReactNode; label: string; badge?: number; }
interface NavSection { title: string; items: NavItem[]; }

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'QUẢN LÝ BÁN HÀNG',
    items: [
      { to: '/admin/products',   icon: <ShoppingBag size={16} />,   label: 'Sản phẩm' },
      { to: '/admin/orders',     icon: <ClipboardList size={16} />, label: 'Đơn hàng', badge: 7 },
      { to: '/admin/categories', icon: <FolderOpen size={16} />,    label: 'Danh mục' },
      { to: '/admin/brands',     icon: <Tag size={16} />,           label: 'Thương hiệu' },
    ],
  },
  {
    title: 'QUẢN LÝ DỊCH VỤ',
    items: [
      { to: '/admin/appointments', icon: <Calendar size={16} />,  label: 'Lịch hẹn', badge: 8 },
      { to: '/admin/services',     icon: <Scissors size={16} />,  label: 'Dịch vụ' },
      { to: '/admin/staff',        icon: <Users size={16} />,     label: 'Nhân viên' },
    ],
  },
  {
    title: 'THÚ CƯNG',
    items: [
      { to: '/admin/pets', icon: <PawPrint size={16} />, label: 'Quản lý thú cưng' },
    ],
  },
  {
    title: 'TÀI KHOẢN',
    items: [
      { to: '/admin/users',   icon: <UserCircle size={16} />, label: 'Quản lý tài khoản' },
      { to: '/admin/reviews', icon: <Star size={16} />,       label: 'Đánh giá' },
    ],
  },
  {
    title: 'TIẾP THỊ',
    items: [
      { to: '/admin/promotions', icon: <Gift size={16} />, label: 'Khuyến mãi' },
    ],
  },
  {
    title: 'BÁO CÁO',
    items: [
      { to: '/admin/reports', icon: <BarChart2 size={16} />, label: 'Báo cáo' },
    ],
  },
  {
    title: 'HỖ TRỢ',
    items: [
      { to: '/admin/contact', icon: <MessageSquare size={16} />, label: 'Liên hệ', badge: 6 },
    ],
  },
  {
    title: 'CÀI ĐẶT',
    items: [
      { to: '/admin/settings', icon: <Settings size={16} />, label: 'Cài đặt' },
    ],
  },
];

export const AdminSidebar: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className={`admin-sidebar-new ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="asn-logo">
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#c7603a,#e8884a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <PawPrint size={18} color="#fff" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div className="asn-logo-text">PetCare</div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>ADMIN PANEL</div>
          </div>
        )}
        <button className="asn-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* User info */}
      <div className="asn-user">
        <div className="asn-user-avatar">
          {user?.avatar
            ? <img src={user.avatar} alt={user?.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            : <span>{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
          }
        </div>
        {!collapsed && (
          <div className="asn-user-info" style={{ overflow: 'hidden', flex: 1 }}>
            <div className="asn-user-name">{user?.name || 'Admin'}</div>
            <div className="asn-user-role">{user?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</div>
          </div>
        )}
      </div>

      {/* Dashboard link */}
      <div className="asn-dashboard-link">
        <NavLink to="/admin" end className={({ isActive }) => `asn-item ${isActive ? 'active' : ''}`}>
          <span className="asn-item-icon"><LayoutDashboard size={16} /></span>
          {!collapsed && <span className="asn-item-label">Dashboard</span>}
        </NavLink>
      </div>

      {/* Nav */}
      <nav className="asn-nav">
        {NAV_SECTIONS.map(section => (
          <div key={section.title} className="asn-section">
            {!collapsed && <div className="asn-section-title">{section.title}</div>}
            {section.items.map(item => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `asn-item ${isActive ? 'active' : ''}`}>
                <span className="asn-item-icon">{item.icon}</span>
                {!collapsed && <span className="asn-item-label">{item.label}</span>}
                {!collapsed && item.badge && <span className="asn-badge">{item.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="asn-bottom">
        <NavLink to="/" className="asn-item asn-item-home">
          <span className="asn-item-icon"><Home size={16} /></span>
          {!collapsed && <span className="asn-item-label">Về trang chủ</span>}
        </NavLink>
        <button onClick={handleLogout} className="asn-item asn-logout">
          <span className="asn-item-icon"><LogOut size={16} /></span>
          {!collapsed && <span className="asn-item-label">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
};