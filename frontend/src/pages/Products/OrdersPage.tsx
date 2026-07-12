import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';
import { RootState } from '@stores/store';
import { cancelOrder, Order } from '@stores/slices/orderSlice';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

const STATUS_MAP: Record<Order['status'], { label: string; color: string; bg: string }> = {
  pending:    { label: 'Chờ xác nhận', color: '#d97706', bg: '#fef3c7' },
  processing: { label: 'Đang xử lý',   color: '#2563eb', bg: '#dbeafe' },
  shipped:    { label: 'Đang giao',     color: '#7c3aed', bg: '#ede9fe' },
  delivered:  { label: 'Đã giao',       color: '#16a34a', bg: '#dcfce7' },
  cancelled:  { label: 'Đã hủy',        color: '#dc2626', bg: '#fee2e2' },
};

const PAYMENT_LABEL: Record<string, string> = {
  cod: '💵 COD', bank: '🏦 Chuyển khoản', momo: '💜 MoMo', vnpay: '💳 VNPay',
};

export const OrdersPage: React.FC = () => {
  const { orders } = useSelector((state: RootState) => state.order);
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) => setExpanded(e => e === id ? null : id);

  return (
    <>
      <Header />
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.8rem', color: '#1e1b4b', marginBottom: 24 }}>📦 Lịch sử đơn hàng</h1>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>📭</div>
            <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: 24 }}>Bạn chưa có đơn hàng nào</p>
            <Link to="/products" style={{ background: '#3BB77E', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 700, textDecoration: 'none' }}>
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map(order => {
              const st = STATUS_MAP[order.status];
              const isExpanded = expanded === order.id;
              return (
                <div key={order.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                  {/* Header đơn hàng */}
                  <div
                    onClick={() => toggle(order.id)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer', borderBottom: isExpanded ? '1px solid #f0f0f0' : 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '0.95rem' }}>{order.id}</div>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: 2 }}>
                          {new Date(order.createdAt).toLocaleString('vi-VN')} · {order.items.length} sản phẩm · {PAYMENT_LABEL[order.paymentMethod] || order.paymentMethod}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                      <span style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 700 }}>{st.label}</span>
                      <span style={{ fontWeight: 800, color: '#ef4444', fontSize: '1rem' }}>{fmt(order.totalPrice)}</span>
                      <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* Chi tiết đơn hàng */}
                  {isExpanded && (
                    <div style={{ padding: '16px 20px' }}>
                      {/* Địa chỉ */}
                      <div style={{ background: '#f9fafb', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: '0.9rem' }}>
                        <div style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>📍 Thông tin giao hàng</div>
                        <div style={{ color: '#6b7280' }}>{order.name} · {order.phone}</div>
                        <div style={{ color: '#6b7280' }}>{order.address}</div>
                        {order.note && <div style={{ color: '#9ca3af', marginTop: 4 }}>Ghi chú: {order.note}</div>}
                      </div>

                      {/* Sản phẩm */}
                      <div style={{ marginBottom: 16 }}>
                        {order.items.map(item => (
                          <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, color: '#253D4E', fontSize: '0.9rem' }}>{item.product.name}</div>
                              <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>x{item.quantity} · {fmt(item.price)}/cái</div>
                            </div>
                            <div style={{ fontWeight: 700, color: '#ef4444' }}>{fmt(item.price * item.quantity)}</div>
                          </div>
                        ))}
                      </div>

                      {/* Tổng & nút hủy */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 800, color: '#1e1b4b' }}>
                          Tổng: <span style={{ color: '#ef4444', fontSize: '1.1rem' }}>{fmt(order.totalPrice)}</span>
                        </div>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => dispatch(cancelOrder(order.id))}
                            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 18px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}
                          >
                            Hủy đơn hàng
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};
