import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@stores/store';
import {
  ShoppingBag, ClipboardList, Calendar, PawPrint, Users,
  MessageSquare, TrendingUp, Package, Plus, Eye, CheckCircle,
  ArrowRight, Star, Gift, Scissors, BarChart2
} from 'lucide-react';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

export const AdminDashboard: React.FC = () => {
  const { user } = useSelector((s: RootState) => s.auth);
  const { orders, products } = useSelector((s: RootState) => s.shop);
  const { appointments } = useSelector((s: RootState) => s.booking);
  const { pets } = useSelector((s: RootState) => s.petMgmt);
  const { users } = useSelector((s: RootState) => s.adminUsers);
  const { messages } = useSelector((s: RootState) => s.contact);
  const { codes: promos } = useSelector((s: RootState) => s.promo);
  const { reviews } = useSelector((s: RootState) => s.reviews);

  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const todayAppts = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;
  const newMessages = messages.filter(m => m.status === 'new').length;
  const pendingPets = pets.filter(p => p.publishStatus === 'pending').length;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  const STATS = [
    { icon: <TrendingUp size={22} />, label: 'Doanh thu', value: fmt(totalRevenue), sub: `${orders.filter(o=>o.status==='completed').length} đơn hoàn thành`, color: '#22c55e', bgColor: '#dcfce7' },
    { icon: <ClipboardList size={22} />, label: 'Đơn hàng', value: String(orders.length), sub: `${pendingOrders} chờ xác nhận`, color: '#f59e0b', bgColor: '#fef3c7', badge: pendingOrders },
    { icon: <Calendar size={22} />, label: 'Lịch hẹn', value: String(appointments.length), sub: `${todayAppts} đang chờ`, color: '#8b5cf6', bgColor: '#ede9fe', badge: todayAppts },
    { icon: <ShoppingBag size={22} />, label: 'Sản phẩm', value: String(products.length), sub: `${outOfStock} hết hàng · ${lowStock} sắp hết`, color: '#3b82f6', bgColor: '#dbeafe', badge: outOfStock + lowStock },
    { icon: <Users size={22} />, label: 'Tài khoản', value: String(users.length), sub: `${users.filter(u=>u.status==='active').length} hoạt động`, color: '#ec4899', bgColor: '#fce7f3' },
    { icon: <PawPrint size={22} />, label: 'Thú cưng', value: String(pets.filter(p=>p.publishStatus==='approved').length), sub: `${pendingPets} chờ duyệt`, color: '#c7603a', bgColor: '#fef3e8', badge: pendingPets },
    { icon: <MessageSquare size={22} />, label: 'Liên hệ', value: String(messages.length), sub: `${newMessages} chưa đọc`, color: '#06b6d4', bgColor: '#cffafe', badge: newMessages },
    { icon: <Star size={22} />, label: 'Đánh giá', value: String(reviews.length), sub: `${pendingReviews} chờ duyệt`, color: '#f59e0b', bgColor: '#fef3c7', badge: pendingReviews },
  ];

  const QUICK_ACTIONS = [
    { icon: <Plus size={18} />, label: 'Thêm sản phẩm',    to: '/admin/products',    color: '#3b82f6' },
    { icon: <Plus size={18} />, label: 'Tạo lịch hẹn',     to: '/admin/appointments',color: '#8b5cf6' },
    { icon: <Plus size={18} />, label: 'Thêm dịch vụ',     to: '/admin/services',    color: '#22c55e' },
    { icon: <Plus size={18} />, label: 'Thêm thú cưng',    to: '/admin/pets',        color: '#c7603a' },
    { icon: <Gift size={18} />,  label: 'Tạo khuyến mãi',  to: '/admin/promotions',  color: '#ec4899' },
    { icon: <Eye size={18} />,   label: 'Xem đơn hàng',    to: '/admin/orders',      color: '#f59e0b' },
    { icon: <CheckCircle size={18} />, label: 'Duyệt thú cưng', to: '/admin/pets',   color: '#10b981' },
    { icon: <BarChart2 size={18} />, label: 'Xem báo cáo', to: '/admin/reports',     color: '#6366f1' },
  ];

  const recentOrders = orders.slice(0, 5);
  const upcomingAppts = appointments.filter(a => a.status !== 'cancelled' && a.status !== 'completed').slice(0, 4);

  const STATUS_ORDER: Record<string, { l: string; c: string; bg: string }> = {
    pending:    { l: 'Chờ xác nhận', c: '#92400e', bg: '#fef3c7' },
    confirmed:  { l: 'Đã xác nhận',  c: '#1e40af', bg: '#dbeafe' },
    processing: { l: 'Đang xử lý',   c: '#5b21b6', bg: '#ede9fe' },
    completed:  { l: 'Hoàn thành',   c: '#166534', bg: '#dcfce7' },
    cancelled:  { l: 'Đã hủy',       c: '#991b1b', bg: '#fee2e2' },
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Bảng điều khiển</h1>
          <p className="admin-page-sub">
            Xin chào, <b>{user?.name}</b> 👋 —{' '}
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="ap-stats-grid" style={{ marginBottom: 24 }}>
        {STATS.map(s => (
          <div key={s.label} className="ap-stat" style={{ borderLeft: `4px solid ${s.color}`, position: 'relative' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
              {s.icon}
            </div>
            <div className="ap-stat-body">
              <div className="ap-stat-value">{s.value}</div>
              <div className="ap-stat-label">{s.label}</div>
              <div className="ap-stat-sub">{s.sub}</div>
            </div>
            {s.badge && s.badge > 0 && (
              <span style={{ position: 'absolute', top: 10, right: 12, background: '#ef4444', color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 7px', borderRadius: 10, minWidth: 20, textAlign: 'center' }}>{s.badge}</span>
            )}
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="ap-card" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a1a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          ⚡ Tác vụ nhanh
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 10 }}>
          {QUICK_ACTIONS.map(a => (
            <Link key={a.to + a.label} to={a.to} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12, border: '1.5px solid #f0ebe4', background: '#faf9f7', cursor: 'pointer', transition: 'all 0.15s', fontWeight: 600, fontSize: '0.85rem', color: '#1a1a1a' }}
                onMouseEnter={e => { e.currentTarget.style.background = a.color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = a.color; (e.currentTarget.querySelector('.qa-icon') as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#faf9f7'; e.currentTarget.style.color = '#1a1a1a'; e.currentTarget.style.borderColor = '#f0ebe4'; (e.currentTarget.querySelector('.qa-icon') as HTMLElement).style.color = a.color; }}>
                <span className="qa-icon" style={{ color: a.color, display: 'flex', flexShrink: 0, transition: 'color 0.15s' }}>{a.icon}</span>
                {a.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent orders + Upcoming appointments */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Recent orders */}
        <div className="ap-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <ClipboardList size={18} /> Đơn hàng gần đây
            </div>
            <Link to="/admin/orders" style={{ color: '#6b7280', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>
          {recentOrders.length === 0
            ? <div style={{ textAlign: 'center', padding: 20, color: '#9ca3af', fontSize: '0.88rem' }}>Chưa có đơn hàng</div>
            : recentOrders.map(o => {
                const s = STATUS_ORDER[o.status] || STATUS_ORDER.pending;
                return (
                  <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{o.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{o.id} · {new Date(o.createdAt).toLocaleDateString('vi-VN')}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: '#c7603a', fontSize: '0.88rem' }}>{fmt(o.total)}</div>
                      <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: '0.7rem', fontWeight: 600, color: s.c, background: s.bg }}>{s.l}</span>
                    </div>
                  </div>
                );
              })
          }
        </div>

        {/* Upcoming appointments */}
        <div className="ap-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={18} /> Lịch hẹn sắp tới
            </div>
            <Link to="/admin/appointments" style={{ color: '#6b7280', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>
          {upcomingAppts.length === 0
            ? <div style={{ textAlign: 'center', padding: 20, color: '#9ca3af', fontSize: '0.88rem' }}>Không có lịch hẹn</div>
            : upcomingAppts.map((a, i) => (
                <div key={a.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: i < upcomingAppts.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <div style={{ background: '#f0ebe4', padding: '8px 10px', borderRadius: 10, textAlign: 'center', minWidth: 54, flexShrink: 0 }}>
                    <div style={{ fontWeight: 900, color: '#1a1a1a', fontSize: '0.9rem' }}>{a.time}</div>
                    <div style={{ fontSize: '0.65rem', color: '#9ca3af' }}>{a.date?.slice(5)}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.serviceName} · {a.petName}</div>
                  </div>
                  <span style={{ padding: '3px 9px', borderRadius: 10, fontSize: '0.7rem', fontWeight: 600, color: a.status === 'confirmed' ? '#1e40af' : '#92400e', background: a.status === 'confirmed' ? '#dbeafe' : '#fef3c7', whiteSpace: 'nowrap' }}>
                    {a.status === 'confirmed' ? 'Đã XN' : 'Chờ XN'}
                  </span>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
};