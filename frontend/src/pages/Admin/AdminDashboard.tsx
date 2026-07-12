import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@stores/store';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: 'Chờ xác nhận', color: '#d97706', bg: '#fef3c7' },
  processing: { label: 'Đang xử lý',   color: '#2563eb', bg: '#dbeafe' },
  shipped:    { label: 'Đang giao',     color: '#7c3aed', bg: '#ede9fe' },
  delivered:  { label: 'Đã giao',       color: '#16a34a', bg: '#dcfce7' },
  cancelled:  { label: 'Đã hủy',        color: '#dc2626', bg: '#fee2e2' },
};

const QUICK_LINKS = [
  { to: '/admin/products',    icon: '🛍️', label: 'Sản phẩm',    color: '#fef3c7' },
  { to: '/admin/orders',      icon: '📋', label: 'Đơn hàng',    color: '#dbeafe' },
  { to: '/admin/appointments',icon: '📅', label: 'Lịch hẹn',    color: '#ede9fe' },
  { to: '/admin/users',       icon: '👥', label: 'Tài khoản',   color: '#dcfce7' },
  { to: '/admin/pets',        icon: '🐾', label: 'Thú cưng',    color: '#fce7f3' },
  { to: '/admin/promotions',  icon: '🎁', label: 'Khuyến mãi',  color: '#ffedd5' },
  { to: '/admin/reports',     icon: '📊', label: 'Báo cáo',     color: '#f0fdf4' },
  { to: '/admin/settings',    icon: '⚙️', label: 'Cài đặt',     color: '#f3f4f6' },
];

export const AdminDashboard: React.FC = () => {
  const { orders } = useSelector((state: RootState) => state.order);

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.totalPrice, 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length;

  const recentOrders = orders.slice(0, 5);

  const stats = [
    { icon: '💰', label: 'Tổng doanh thu',   value: fmt(totalRevenue),          color: '#3BB77E', bg: '#f0fdf4' },
    { icon: '📦', label: 'Tổng đơn hàng',    value: orders.length.toString(),   color: '#2563eb', bg: '#dbeafe' },
    { icon: '⏳', label: 'Chờ xác nhận',     value: pendingCount.toString(),    color: '#d97706', bg: '#fef3c7' },
    { icon: '✅', label: 'Đã giao thành công',value: deliveredCount.toString(),  color: '#16a34a', bg: '#dcfce7' },
  ];

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.6rem', color: '#1e1b4b', margin: 0 }}>📊 Dashboard</h1>
        <p style={{ color: '#6b7280', marginTop: 4 }}>Tổng quan hệ thống PetCare</p>
      </div>

      {/* Thống kê */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: '2rem' }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, marginBottom: 28 }}>
        {/* Đơn hàng gần đây */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: '#1e1b4b' }}>📋 Đơn hàng gần đây</span>
            <Link to="/admin/orders" style={{ fontSize: '0.85rem', color: '#3BB77E', textDecoration: 'none', fontWeight: 600 }}>Xem tất cả →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9ca3af' }}>Chưa có đơn hàng nào</div>
          ) : (
            recentOrders.map(order => {
              const st = STATUS_MAP[order.status];
              return (
                <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid #f9fafb' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#253D4E', fontSize: '0.9rem' }}>{order.id}</div>
                    <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{order.name} · {new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{st.label}</span>
                    <span style={{ fontWeight: 700, color: '#ef4444', fontSize: '0.9rem' }}>{fmt(order.totalPrice)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Thống kê trạng thái */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 20 }}>
          <div style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: 16 }}>📈 Trạng thái đơn hàng</div>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px 0' }}>Chưa có dữ liệu</div>
          ) : (
            Object.entries(STATUS_MAP).map(([key, st]) => {
              const count = orders.filter(o => o.status === key).length;
              const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
              return (
                <div key={key} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 600 }}>{st.label}</span>
                    <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ background: '#f3f4f6', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: st.color, borderRadius: 4, transition: 'width 0.3s' }} />
                  </div>
                </div>
              );
            })
          )}
          {cancelledCount > 0 && (
            <div style={{ marginTop: 16, padding: '10px 14px', background: '#fee2e2', borderRadius: 8, fontSize: '0.85rem', color: '#dc2626', fontWeight: 600 }}>
              ⚠️ {cancelledCount} đơn hàng đã bị hủy
            </div>
          )}
        </div>
      </div>

      {/* Truy cập nhanh */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 20 }}>
        <div style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: 16 }}>⚡ Truy cập nhanh</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 12 }}>
          {QUICK_LINKS.map(l => (
            <Link key={l.to} to={l.to} style={{ textDecoration: 'none' }}>
              <div style={{ background: l.color, borderRadius: 10, padding: '16px 12px', textAlign: 'center', transition: 'transform 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{l.icon}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>{l.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
