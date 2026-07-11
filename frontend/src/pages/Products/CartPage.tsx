import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { removeFromCart, updateCartItem, clearCart } from '@stores/slices/cartSlice';
import { placeOrder } from '@stores/slices/shopSlice';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

export const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((s: RootState) => s.cart);
  const { user } = useSelector((s: RootState) => s.auth);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', address: '', note: '' });
  const [placed, setPlaced] = useState(false);

  const handleOrder = () => {
    if (!form.name || !form.phone || !form.address) return alert('Vui lòng điền đầy đủ thông tin giao hàng.');
    dispatch(placeOrder({
      customerName: form.name, customerEmail: form.email, customerPhone: form.phone,
      address: form.address, note: form.note,
      items: items.map(i => ({
        productId: i.productId,
        productName: i.product?.name || '',
        productImage: i.product?.image || '',
        price: i.price,
        quantity: i.quantity,
      })),
      total,
      status: 'pending',
    }));
    dispatch(clearCart());
    setPlaced(true);
  };

  if (placed) return (
    <>
      <Header />
      <main className="page-container" style={{ maxWidth: 600, margin: '64px auto', textAlign: 'center', padding: '0 20px' }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontWeight: 900, color: '#1a1a1a', marginBottom: 8 }}>Đặt hàng thành công!</h1>
        <p style={{ color: '#6b7280', marginBottom: 32 }}>Đơn hàng của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ xác nhận sớm nhất.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/products" style={{ background: '#1a1a1a', color: '#fff', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Tiếp tục mua sắm</Link>
        </div>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <main className="page-container" style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.8rem', color: '#1a1a1a', marginBottom: 24 }}>🛒 Giỏ hàng ({items.length})</h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#9ca3af' }}>
            <div style={{ fontSize: '4rem', marginBottom: 12 }}>🛒</div>
            <p style={{ marginBottom: 20 }}>Giỏ hàng trống</p>
            <Link to="/products" style={{ background: '#1a1a1a', color: '#fff', padding: '10px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>Khám phá sản phẩm</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
            <div>
              {items.map(item => (
                <div key={item.productId} style={{ display: 'flex', gap: 14, padding: '16px 0', borderBottom: '1px solid #f0ebe4' }}>
                  <img src={item.product?.image} alt={item.product?.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, marginBottom: 4, color: '#1a1a1a' }}>{item.product?.name}</div>
                    <div style={{ color: '#ef4444', fontWeight: 800, marginBottom: 8 }}>{fmt(item.price)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => dispatch(updateCartItem({ productId: item.productId, quantity: item.quantity - 1 }))} style={{ width: 28, height: 28, border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer', background: '#fff' }}>-</button>
                      <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => dispatch(updateCartItem({ productId: item.productId, quantity: item.quantity + 1 }))} style={{ width: 28, height: 28, border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer', background: '#fff' }}>+</button>
                      <button onClick={() => dispatch(removeFromCart(item.productId))} style={{ marginLeft: 8, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>Xóa</button>
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#1a1a1a', fontSize: '1rem' }}>{fmt(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #f0ebe4', position: 'sticky', top: 20 }}>
              <h3 style={{ margin: '0 0 16px', fontWeight: 800 }}>Tổng đơn hàng</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#6b7280' }}>
                <span>Tạm tính</span><span>{fmt(total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#6b7280' }}>
                <span>Phí vận chuyển</span><span style={{ color: '#22c55e' }}>Miễn phí</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid #f0ebe4', fontWeight: 900, fontSize: '1.1rem' }}>
                <span>Tổng cộng</span><span style={{ color: '#ef4444' }}>{fmt(total)}</span>
              </div>
              <button onClick={() => setShowCheckout(true)} style={{ width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', padding: '13px', borderRadius: 10, fontWeight: 800, fontSize: '1rem', cursor: 'pointer', marginTop: 8 }}>
                Đặt hàng ngay →
              </button>
            </div>
          </div>
        )}

        {showCheckout && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={e => { if (e.target === e.currentTarget) setShowCheckout(false); }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 500, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
              <h3 style={{ marginBottom: 20 }}>📦 Thông tin giao hàng</h3>
              {[['Họ và tên *', 'name', 'Nguyễn Văn A', false], ['Email', 'email', 'email@gmail.com', false], ['Số điện thoại *', 'phone', '0901234567', false], ['Địa chỉ giao hàng *', 'address', '123 Đường..., Quận..., TP.HCM', false], ['Ghi chú', 'note', 'Giao buổi sáng...', false]].map(([label, key, placeholder]) => (
                <div key={key as string} style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: '0.9rem' }}>{label as string}</label>
                  {key === 'note' || key === 'address'
                    ? <textarea className="ap-input" rows={2} placeholder={placeholder as string} value={(form as any)[key as string]} onChange={e => setForm({ ...form, [key as string]: e.target.value })} style={{ resize: 'none' }} />
                    : <input className="ap-input" placeholder={placeholder as string} value={(form as any)[key as string]} onChange={e => setForm({ ...form, [key as string]: e.target.value })} />
                  }
                </div>
              ))}
              <div style={{ background: '#f9fafb', borderRadius: 10, padding: 14, marginBottom: 20 }}>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: 4 }}>Tổng thanh toán</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ef4444' }}>{fmt(total)}</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="ap-btn ap-btn-ghost" onClick={() => setShowCheckout(false)}>Quay lại</button>
                <button className="ap-btn ap-btn-primary" style={{ flex: 1 }} onClick={handleOrder}>✅ Xác nhận đặt hàng</button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};