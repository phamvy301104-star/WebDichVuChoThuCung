import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@stores/store';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

const BAR_COLORS = ['#111','#c7603a','#3b82f6','#22c55e','#f59e0b','#8b5cf6'];

const BarChart: React.FC<{ data: { label: string; value: number }[]; max: number; color?: string }> = ({ data, max, color = '#111' }) => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 140, padding: '0 4px' }}>
    {data.map((d, i) => (
      <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600 }}>{d.value > 1000000 ? (d.value/1000000).toFixed(1)+'M' : d.value > 1000 ? (d.value/1000).toFixed(0)+'K' : d.value}</div>
        <div style={{ width: '100%', background: BAR_COLORS[i % BAR_COLORS.length] || color, borderRadius: '6px 6px 0 0', height: max > 0 ? `${Math.round((d.value / max) * 110)}px` : '4px', minHeight: 4, transition: 'height 0.3s' }} />
        <div style={{ fontSize: '0.65rem', color: '#6b7280', textAlign: 'center', lineHeight: 1.2 }}>{d.label}</div>
      </div>
    ))}
  </div>
);

export const AdminReports: React.FC = () => {
  const { orders } = useSelector((s: RootState) => s.shop);
  const { products } = useSelector((s: RootState) => s.shop);
  const { appointments } = useSelector((s: RootState) => s.booking);
  const { pets } = useSelector((s: RootState) => s.petMgmt);
  const { messages } = useSelector((s: RootState) => s.contact);

  // Revenue by status
  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0);
  const pendingRevenue = orders.filter(o => o.status === 'pending').reduce((s, o) => s + o.total, 0);
  const ordersByStatus = [
    { label: 'Chờ XN', value: orders.filter(o => o.status === 'pending').length },
    { label: 'Đã XN', value: orders.filter(o => o.status === 'confirmed').length },
    { label: 'Xử lý', value: orders.filter(o => o.status === 'processing').length },
    { label: 'Hoàn thành', value: orders.filter(o => o.status === 'completed').length },
    { label: 'Đã hủy', value: orders.filter(o => o.status === 'cancelled').length },
  ];

  // Top products by sold
  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);

  // Appointments by status
  const apptByStatus = [
    { label: 'Chờ XN', value: appointments.filter(a => a.status === 'pending').length },
    { label: 'Đã XN', value: appointments.filter(a => a.status === 'confirmed').length },
    { label: 'Hoàn thành', value: appointments.filter(a => a.status === 'completed').length },
    { label: 'Đã hủy', value: appointments.filter(a => a.status === 'cancelled').length },
  ];

  // Pet stats
  const petStats = [
    { label: 'Chó', value: pets.filter(p => p.species === 'Chó').length },
    { label: 'Mèo', value: pets.filter(p => p.species === 'Mèo').length },
    { label: 'Thỏ', value: pets.filter(p => p.species === 'Thỏ').length },
    { label: 'Nhận nuôi', value: pets.filter(p => p.listingType === 'adoption' && p.publishStatus === 'approved').length },
    { label: 'Bán', value: pets.filter(p => p.listingType === 'sale' && p.publishStatus === 'approved').length },
  ];

  const STATS = [
    { icon: '💰', label: 'Doanh thu hoàn thành', value: fmt(totalRevenue), sub: `${orders.filter(o=>o.status==='completed').length} đơn`, color: '#22c55e' },
    { icon: '⏳', label: 'Doanh thu chờ xử lý', value: fmt(pendingRevenue), sub: `${orders.filter(o=>o.status==='pending').length} đơn`, color: '#f59e0b' },
    { icon: '📋', label: 'Tổng đơn hàng', value: String(orders.length), sub: `${orders.filter(o=>o.status==='cancelled').length} đã hủy`, color: '#3b82f6' },
    { icon: '📅', label: 'Tổng lịch hẹn', value: String(appointments.length), sub: `${appointments.filter(a=>a.status==='pending').length} chờ xác nhận`, color: '#8b5cf6' },
    { icon: '🐾', label: 'Tổng thú cưng', value: String(pets.filter(p=>p.publishStatus==='approved').length), sub: `${pets.filter(p=>p.publishStatus==='pending').length} chờ duyệt`, color: '#ec4899' },
    { icon: '💬', label: 'Tin nhắn liên hệ', value: String(messages.length), sub: `${messages.filter(m=>m.status==='new').length} chưa đọc`, color: '#c7603a' },
  ];

  const maxOrders = Math.max(...ordersByStatus.map(d => d.value), 1);
  const maxAppts = Math.max(...apptByStatus.map(d => d.value), 1);
  const maxPets = Math.max(...petStats.map(d => d.value), 1);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">📊 Báo cáo & Thống kê</h1>
          <p className="admin-page-sub">Tổng quan hoạt động kinh doanh</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="ap-stats-grid" style={{ marginBottom: 24 }}>
        {STATS.map(s => (
          <div key={s.label} className="ap-stat" style={{ borderLeft: `4px solid ${s.color}` }}>
            <div className="ap-stat-icon">{s.icon}</div>
            <div className="ap-stat-body">
              <div className="ap-stat-value">{s.value}</div>
              <div className="ap-stat-label" style={{ fontSize: '0.78rem' }}>{s.label}</div>
              <div className="ap-stat-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Orders by status */}
        <div className="ap-card">
          <div className="ap-card-header"><span>📋 Đơn hàng theo trạng thái</span></div>
          <BarChart data={ordersByStatus} max={maxOrders} />
        </div>

        {/* Appointments by status */}
        <div className="ap-card">
          <div className="ap-card-header"><span>📅 Lịch hẹn theo trạng thái</span></div>
          <BarChart data={apptByStatus} max={maxAppts} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Pet stats */}
        <div className="ap-card">
          <div className="ap-card-header"><span>🐾 Thống kê thú cưng</span></div>
          <BarChart data={petStats} max={maxPets} />
        </div>

        {/* Top products */}
        <div className="ap-card">
          <div className="ap-card-header"><span>🏆 Top sản phẩm bán chạy</span></div>
          <div style={{ marginTop: 8 }}>
            {topProducts.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < topProducts.length - 1 ? '1px solid #f0ebe4' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : i === 2 ? '#c7603a' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.82rem', color: i < 3 ? '#fff' : '#6b7280', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Đã bán: {p.sold}</div>
                </div>
                <div style={{ fontWeight: 800, color: '#c7603a', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>{fmt(p.price)}</div>
              </div>
            ))}
            {topProducts.length === 0 && <div style={{ color: '#9ca3af', textAlign: 'center', padding: 20 }}>Chưa có dữ liệu</div>}
          </div>
        </div>
      </div>

      {/* Recent orders table */}
      <div className="ap-card">
        <div className="ap-card-header"><span>📋 Đơn hàng gần đây</span></div>
        <table className="admin-table">
          <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Tổng tiền</th><th>Thanh toán</th><th>Trạng thái</th><th>Ngày</th></tr></thead>
          <tbody>
            {orders.slice(0, 8).map(o => {
              const STATUS: Record<string, { label: string; color: string; bg: string }> = {
                pending:    { label: 'Chờ xác nhận', color: '#92400e', bg: '#fef3c7' },
                confirmed:  { label: 'Đã xác nhận',  color: '#1e40af', bg: '#dbeafe' },
                processing: { label: 'Đang xử lý',   color: '#5b21b6', bg: '#ede9fe' },
                completed:  { label: 'Hoàn thành',   color: '#166534', bg: '#dcfce7' },
                cancelled:  { label: 'Đã hủy',       color: '#991b1b', bg: '#fee2e2' },
              };
              const s = STATUS[o.status] || STATUS.pending;
              const PAY: Record<string, string> = { cod: '💵 COD', bank: '🏦 Chuyển khoản', momo: '💜 MoMo' };
              return (
                <tr key={o.id}>
                  <td><b>{o.id}</b></td>
                  <td>{o.customerName}</td>
                  <td><b style={{ color: '#c7603a' }}>{fmt(o.total)}</b></td>
                  <td style={{ fontSize: '0.82rem' }}>{PAY[o.paymentMethod] || o.paymentMethod}</td>
                  <td><span style={{ padding: '3px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600, color: s.color, background: s.bg }}>{s.label}</span></td>
                  <td style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{new Date(o.createdAt).toLocaleDateString('vi-VN')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {orders.length === 0 && <div className="ap-empty">Chưa có đơn hàng nào</div>}
      </div>
    </div>
  );
};