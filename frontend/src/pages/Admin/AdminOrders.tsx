import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { cancelOrder, updateOrderStatus, Order } from '@stores/slices/orderSlice';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

const STATUS_MAP: Record<Order['status'], { label: string; color: string; bg: string }> = {
  pending:    { label: 'Chờ xác nhận', color: '#d97706', bg: '#fef3c7' },
  processing: { label: 'Đang xử lý',   color: '#2563eb', bg: '#dbeafe' },
  shipped:    { label: 'Đang giao',     color: '#7c3aed', bg: '#ede9fe' },
  delivered:  { label: 'Đã giao',       color: '#16a34a', bg: '#dcfce7' },
  cancelled:  { label: 'Đã hủy',        color: '#dc2626', bg: '#fee2e2' },
};

const PAYMENT_LABEL: Record<string, string> = { cod: 'COD', bank: 'Chuyển khoản', momo: 'MoMo', vnpay: 'VNPay' };

export const AdminOrders: React.FC = () => {
  const { orders } = useSelector((state: RootState) => state.order);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState<string>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1e1b4b', margin: 0 }}>📋 Quản lý đơn hàng</h1>
        <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Tổng: {orders.length} đơn</span>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['all', 'Tất cả'], ...Object.entries(STATUS_MAP).map(([k, v]) => [k, v.label])].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            style={{ padding: '7px 16px', borderRadius: 20, border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
              background: filter === k ? '#1e1b4b' : '#f3f4f6', color: filter === k ? '#fff' : '#374151' }}>
            {l} {k !== 'all' && `(${orders.filter(o => o.status === k).length})`}
          </button>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#9ca3af' }}>Không có đơn hàng nào</div>
        ) : filtered.map(order => {
          const st = STATUS_MAP[order.status];
          const isOpen = expanded === order.id;
          return (
            <div key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <div onClick={() => setExpanded(isOpen ? null : order.id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '0.92rem' }}>{order.id}</div>
                  <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: 2 }}>
                    {order.name} · {order.phone} · {PAYMENT_LABEL[order.paymentMethod]} · {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>{st.label}</span>
                  <span style={{ fontWeight: 800, color: '#ef4444' }}>{fmt(order.totalPrice)}</span>
                  <span style={{ color: '#9ca3af' }}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>
              {isOpen && (
                <div style={{ padding: '0 20px 16px', borderTop: '1px solid #f9fafb' }}>
                  <div style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: '0.85rem', color: '#6b7280' }}>
                    📍 {order.address} {order.note && `· Ghi chú: ${order.note}`}
                  </div>
                  {order.items.map(item => (
                    <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '0.88rem' }}>
                      <span style={{ color: '#374151' }}>{item.product.name} x{item.quantity}</span>
                      <span style={{ fontWeight: 700, color: '#ef4444' }}>{fmt(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    {order.status === 'pending' && (
                      <button onClick={() => dispatch(updateOrderStatus({ id: order.id, status: 'processing' }))}
                        style={{ background: '#dbeafe', color: '#2563eb', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
                        ✅ Xác nhận
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button onClick={() => dispatch(updateOrderStatus({ id: order.id, status: 'shipped' }))}
                        style={{ background: '#ede9fe', color: '#7c3aed', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
                        🚚 Giao hàng
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button onClick={() => dispatch(updateOrderStatus({ id: order.id, status: 'delivered' }))}
                        style={{ background: '#dcfce7', color: '#16a34a', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
                        📦 Đã giao
                      </button>
                    )}
                    {(order.status === 'pending' || order.status === 'processing') && (
                      <button onClick={() => dispatch(cancelOrder(order.id))}
                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
                        ❌ Hủy đơn
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
