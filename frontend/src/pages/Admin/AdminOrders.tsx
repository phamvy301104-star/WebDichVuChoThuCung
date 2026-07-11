import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { updateOrderStatus, Order } from '@stores/slices/shopSlice';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';
const STATUS_MAP: Record<Order['status'], { label: string; color: string; bg: string }> = {
  pending:    { label: 'Chờ xác nhận', color: '#92400e', bg: '#fef3c7' },
  confirmed:  { label: 'Đã xác nhận',  color: '#1e40af', bg: '#dbeafe' },
  processing: { label: 'Đang xử lý',   color: '#5b21b6', bg: '#ede9fe' },
  completed:  { label: 'Hoàn thành',   color: '#166534', bg: '#dcfce7' },
  cancelled:  { label: 'Đã hủy',       color: '#991b1b', bg: '#fee2e2' },
};

const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 };

export const AdminOrders: React.FC = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((s: RootState) => s.shop);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = orders.filter(o => !filterStatus || o.status === filterStatus);

  const badge = (s: Order['status']) => {
    const m = STATUS_MAP[s];
    return <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: '0.78rem', fontWeight: 600, color: m.color, background: m.bg }}>{m.label}</span>;
  };

  const nextStatus: Partial<Record<Order['status'], Order['status']>> = {
    pending: 'confirmed', confirmed: 'processing', processing: 'completed',
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">📋 Quản lý đơn hàng</h1>
          <p className="admin-page-sub">Tổng {orders.length} đơn · {orders.filter(o => o.status === 'pending').length} chờ xác nhận</p>
        </div>
      </div>

      <div className="ap-card">
        <div className="ap-filters">
          <select className="ap-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <table className="admin-table">
          <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Sản phẩm</th><th>Tổng tiền</th><th>Ngày đặt</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td><b style={{ color: '#1a1a1a' }}>{o.id}</b></td>
                <td>
                  <div style={{ fontWeight: 600 }}>{o.customerName}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{o.customerPhone}</div>
                </td>
                <td style={{ fontSize: '0.85rem', color: '#6b7280' }}>{o.items.length} sản phẩm</td>
                <td><b style={{ color: '#ef4444' }}>{fmt(o.total)}</b></td>
                <td style={{ fontSize: '0.82rem' }}>{new Date(o.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>{badge(o.status)}</td>
                <td>
                  <div className="ap-actions">
                    <button className="ap-action-btn" onClick={() => setSelected(o)}>👁️</button>
                    {nextStatus[o.status] && (
                      <button className="ap-action-btn" style={{ background: '#dcfce7', color: '#166534' }}
                        onClick={() => dispatch(updateOrderStatus({ id: o.id, status: nextStatus[o.status]! }))}>
                        {nextStatus[o.status] === 'confirmed' ? '✅ Xác nhận' : nextStatus[o.status] === 'processing' ? '🔄 Xử lý' : '🏁 Hoàn thành'}
                      </button>
                    )}
                    {o.status === 'pending' && (
                      <button className="ap-action-btn ap-action-del"
                        onClick={() => dispatch(updateOrderStatus({ id: o.id, status: 'cancelled' }))}>
                        ❌ Hủy
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="ap-empty">Không có đơn hàng nào</div>}
      </div>

      {selected && (
        <div style={overlay} onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: 580, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>📄 Chi tiết đơn hàng #{selected.id}</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[['Khách hàng', selected.customerName], ['Email', selected.customerEmail], ['Điện thoại', selected.customerPhone], ['Địa chỉ', selected.address], ['Ngày đặt', new Date(selected.createdAt).toLocaleString('vi-VN')], ['Ghi chú', selected.note || '—']].map(([k, v]) => (
                <div key={k} style={{ background: '#f9fafb', padding: '10px 14px', borderRadius: 8 }}>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{k}</div>
                  <div style={{ fontWeight: 600, wordBreak: 'break-all' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>🛒 Sản phẩm đã đặt</div>
              {selected.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <img src={item.productImage} alt={item.productName} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.productName}</div>
                    <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>x{item.quantity} · {fmt(item.price)} / sp</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#ef4444' }}>{fmt(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '2px solid #f0f0f0' }}>
              <div>Trạng thái: {badge(selected.status)}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>Tổng: <span style={{ color: '#ef4444' }}>{fmt(selected.total)}</span></div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              {nextStatus[selected.status] && (
                <button className="ap-btn ap-btn-primary" onClick={() => { dispatch(updateOrderStatus({ id: selected.id, status: nextStatus[selected.status]! })); setSelected({ ...selected, status: nextStatus[selected.status]! }); }}>
                  {nextStatus[selected.status] === 'confirmed' ? '✅ Xác nhận đơn' : nextStatus[selected.status] === 'processing' ? '🔄 Bắt đầu xử lý' : '🏁 Hoàn thành đơn'}
                </button>
              )}
              {selected.status === 'pending' && (
                <button className="ap-btn" style={{ background: '#fee2e2', color: '#991b1b' }} onClick={() => { dispatch(updateOrderStatus({ id: selected.id, status: 'cancelled' })); setSelected({ ...selected, status: 'cancelled' }); }}>
                  ❌ Hủy đơn
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};