import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import "@styles/global.css";
import { useSelector } from "react-redux";
import { RootState } from "@stores/store";
export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, it) => sum + (it.quantity || 0), 0),
  );
  const phone = useSelector((s: RootState) => s.settings.data.phone);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🐾</span>
          <div>
            <span className="logo-text">PetCare</span>
            <div style={{ fontSize: '0.6rem', color: '#9ca3af', fontWeight: 400, letterSpacing: '0.12em', marginTop: -2 }}>SINCE 2015 · PEACE OF MIND</div>
          </div>
        </Link>

        <nav className="nav">
          <Link to="/">Trang chủ</Link>
          <Link to="/pets">Thú cưng</Link>
          <Link to="/nhan-dien-thu-cung" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ background: '#f0fdf4', color: '#166534', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: 6 }}>AI</span>
            Nhận diện
          </Link>
          <Link to="/services">Spa & Dịch vụ</Link>
          <Link to="/products">Cửa hàng</Link>
          <Link to="/contact">Liên hệ</Link>
        </nav>

        <div className="header-actions" style={{ gap: '12px', alignItems: 'center' }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <Link to="/cart" title="Giỏ hàng" style={{ fontSize: '1.3rem', textDecoration: 'none' }}>🛒</Link>
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: -6, right: -6, minWidth: 18, height: 18, padding: "0 5px", borderRadius: 9, background: "#ef4444", color: "#fff", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {cartCount}
              </span>
            )}
          </div>

          <a href={`tel:${phone.replace(/\./g,'')}`} style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#111', color: '#fff', padding: '8px 16px', borderRadius: 50, textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
            📞 {phone}
          </a>

          {isAuthenticated && user ? (
            <div className="user-menu" ref={dropdownRef}>
              <button
                className="user-avatar-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="avatar-circle">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <span>{user.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="user-name-header">
                  {user.name.split(" ").pop()}
                </span>
                <span className="dropdown-arrow">
                  {dropdownOpen ? "▲" : "▼"}
                </span>
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
                        {user.role === "admin"
                          ? "👑 Admin"
                          : user.role === "staff"
                            ? "🔧 Nhân viên"
                            : "👤 Thành viên"}
                      </span>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    👤 Hồ sơ của tôi
                  </Link>
                  <Link
                    to="/orders"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    📦 Đơn hàng
                  </Link>
                  <Link
                    to="/bookings"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    📅 Lịch đặt
                  </Link>
                  {(user.role === "admin" || user.role === "staff") && (
                    <>
                      <div className="dropdown-divider" />
                      <Link
                        to="/admin"
                        className="dropdown-item dropdown-admin"
                        onClick={() => setDropdownOpen(false)}
                      >
                        ⚙️ Quản trị hệ thống
                      </Link>
                    </>
                  )}
                  <div className="dropdown-divider" />
                  <button
                    className="dropdown-item dropdown-logout"
                    onClick={handleLogout}
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/auth/login" className="btn-login">
                Đăng nhập
              </Link>
              <Link to="/auth/register" className="btn-register">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
