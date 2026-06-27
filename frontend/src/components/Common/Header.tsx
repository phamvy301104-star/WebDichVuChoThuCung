import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import '@styles/global.css';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🐾</span>
          <span className="logo-text">PetCare</span>
        </Link>

        <nav className="nav">
          <Link to="/">Trang chủ</Link>
          <Link to="/services">Dịch vụ</Link>
          <Link to="/products">Sản phẩm</Link>
          <Link to="/pets">Thú cưng</Link>
          <Link to="/bookings">Đặt lịch</Link>
          <Link to="/contact">Liên hệ</Link>
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="cart-icon" title="Giỏ hàng">🛒</Link>

          {isAuthenticated && user ? (
            <div className="user-menu" ref={dropdownRef}>
              <button
                className="user-avatar-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="avatar-circle">
                  {user.avatar
                    ? <img src={user.avatar} alt={user.name} />
                    : <span>{user.name.charAt(0).toUpperCase()}</span>
                  }
                </div>
                <span className="user-name-header">{user.name.split(' ').pop()}</span>
                <span className="dropdown-arrow">{dropdownOpen ? '▲' : '▼'}</span>
              </button>

              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="dropdown-name">{user.name}</div>
                      <div className="dropdown-email">{user.email}</div>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role === 'admin' ? '👑 Admin' : user.role === 'staff' ? '🔧 Nhân viên' : '👤 Thành viên'}
                      </span>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    👤 Hồ sơ của tôi
                  </Link>
                  <Link to="/orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    📦 Đơn hàng
                  </Link>
                  <Link to="/bookings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    📅 Lịch đặt
                  </Link>
                  {(user.role === 'admin' || user.role === 'staff') && (
                    <>
                      <div className="dropdown-divider" />
                      <Link to="/admin" className="dropdown-item dropdown-admin" onClick={() => setDropdownOpen(false)}>
                        ⚙️ Quản trị hệ thống
                      </Link>
                    </>
                  )}
                  <div className="dropdown-divider" />
                  <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/auth/login" className="btn-login">Đăng nhập</Link>
              <Link to="/auth/register" className="btn-register">Đăng ký</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
