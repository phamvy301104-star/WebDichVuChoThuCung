import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';
import { RootState } from '@stores/store';
import { removeFromCart, updateCartItem, clearCart } from '@stores/slices/cartSlice';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

export const CartPage: React.FC = () => {
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQty = (productId: string, qty: number) => {
    if (qty < 1) return;
    dispatch(updateCartItem({ productId, quantity: qty }));
  };

  return (
    <>
      <Header />
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.8rem', color: '#1e1b4b', marginBottom: 24 }}>🛒 Giỏ hàng</h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🛒</div>
            <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: 24 }}>Giỏ hàng của bạn đang trống</p>
            <Link to="/products" style={{ background: '#3BB77E', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 700, textDecoration: 'none' }}>
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
            {/* Danh sách sản phẩm */}
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#374151' }}>{items.length} sản phẩm</span>
                <button onClick={() => dispatch(clearCart())} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                  🗑️ Xóa tất cả
                </button>
              </div>

              {items.map(item => (
                <div key={item.productId} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: '1px solid #f9fafb' }}>
                  <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg,#fef9f0,#fef3c7)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>
                    🐾
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: '#1e1b4b', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</div>
                    <div style={{ color: '#ef4444', fontWeight: 700 }}>{fmt(item.price)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <button onClick={() => handleQty(item.productId, item.quantity - 1)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' }}>−</button>
                    <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>{item.quantity}</span>
                    <button onClick={() => handleQty(item.productId, item.quantity + 1)} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' }}>+</button>
                  </div>
                  <div style={{ fontWeight: 800, color: '#3BB77E', minWidth: 90, textAlign: 'right', flexShrink: 0 }}>{fmt(item.price * item.quantity)}</div>
                  <button onClick={() => dispatch(removeFromCart(item.productId))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#9ca3af', flexShrink: 0 }}>✕</button>
                </div>
              ))}
            </div>

            {/* Tổng tiền */}
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 24, position: 'sticky', top: 20 }}>
              <h3 style={{ fontWeight: 800, color: '#1e1b4b', marginBottom: 20, fontSize: '1.1rem' }}>Tóm tắt đơn hàng</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#6b7280' }}>
                <span>Tạm tính</span>
                <span>{fmt(totalPrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, color: '#6b7280' }}>
                <span>Phí vận chuyển</span>
                <span style={{ color: '#3BB77E', fontWeight: 600 }}>Miễn phí</span>
              </div>
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontWeight: 700, color: '#1e1b4b' }}>Tổng cộng</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ef4444' }}>{fmt(totalPrice)}</span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                style={{ width: '100%', background: 'linear-gradient(135deg,#3BB77E,#2D9B6A)', color: '#fff', border: 'none', padding: '14px', borderRadius: 10, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginBottom: 10 }}
              >
                Đặt hàng ngay
              </button>
              <Link to="/products" style={{ display: 'block', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem', textDecoration: 'none' }}>
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};
