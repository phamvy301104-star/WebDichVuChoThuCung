import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@stores/store';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

export const AdminReports: React.FC = () => {
  const { orders } = useSelector((state: RootState) => state.order);

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.totalPrice, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / (totalOrders - cancelledOrders || 1)) : 0;

  // Thống kê sản phẩm bán chạy
  const productMap: Record<string, { name: string; qty: number; revenue: number }> = {};
  orders.filter(o => o.status !== 'cancelled').forEach(o => {
    o.items.forEach(item => {
      if (!productMap[item.productId]) productMap[item.productId] = { name: item.product.name, qty: 0, revenue: 0 };
      productMap[item.productId].qty += item.quantity;
      productMap[item.productId].revenue += item.price * item.quantity;
    });
  });
  const topProducts = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const stats = [
    { icon: '💰', label: 'Tổng doanh thu', value: fmt(totalRevenue), color: '#3BB77E', bg: '#f0fdf4' },
    { icon: '📦', label: 'Tổng đơn hàng', value: totalOrders.toString(), color: '#2563eb', bg: '#dbeafe' },
    { icon: '✅', label: 'Đơn hoàn thành', value: completedOrders.toString(), color: '#16a34a', bg: '#dcfce7' },
    { icon: '❌', label: 'Đơn bị hủy', value: cancelledOrders.toString(), color: '#dc2626', bg: '#fee2e2' },
    { icon: '📊', label: 'Giá trị TB/đơn', value: fmt(avgOrder), color: '#7c3aed', bg: '#ede9fe' },
    { icon: '🔄', label: 'Tỷ lệ hoàn thành', value: totalOrders > 0 ? `${Math.round((completedOrders / totalOrders) * 100)}%` : '0%', color: '#d97706', bg: '#fef3c7' },
  ];

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1e1b4b', marginBottom: 24 }}>📊 Báo cáo & Thống kê</h1>

      {/* Thống kê tổng quan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: '2rem' }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Sản phẩm bán chạy */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 20 }}>
          <h3 style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: 16 }}>🏆 Sản phẩm bán chạy</h3>
          {topProducts.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9ca3af', padding: '30px 0' }}>Chưa có dữ liệu</div>
          ) : topProducts.map((p, i) => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? '#fef3c7' : i === 1 ? '#f3f4f6' : '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', color: i === 0 ? '#d97706' : '#6b7280', flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: '#253D4E', fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>Đã bán: {p.qty} cái</div>
              </div>
              <div style={{ fontWeight: 700, color: '#ef4444', fontSize: '0.9rem', flexShrink: 0 }}>{fmt(p.revenue)}</div>
            </div>
          ))}
        </div>

        {/* Phân bổ trạng thái đơn hàng */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 20 }}>
          <h3 style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: 16 }}>📈 Phân bổ đơn hàng</h3>
          {[
            { label: 'Chờ xác nhận', key: 'pending',    color: '#d97706' },
            { label: 'Đang xử lý',   key: 'processing', color: '#2563eb' },
            { label: 'Đang giao',    key: 'shipped',    color: '#7c3aed' },
            { label: 'Đã giao',      key: 'delivered',  color: '#16a34a' },
            { label: 'Đã hủy',       key: 'cancelled',  color: '#dc2626' },
          ].map(s => {
            const count = orders.filter(o => o.status === s.key).length;
            const pct = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
            return (
              <div key={s.key} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 600 }}>{s.label}</span>
                  <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{count} ({pct}%)</span>
                </div>
                <div style={{ background: '#f3f4f6', borderRadius: 4, height: 8 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: s.color, borderRadius: 4 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
