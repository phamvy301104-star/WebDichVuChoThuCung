import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';
import { RootState } from '@stores/store';
import { clearCart } from '@stores/slices/cartSlice';
import { placeOrder } from '@stores/slices/orderSlice';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
  { id: 'bank', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
  { id: 'momo', label: 'Ví MoMo', icon: '💜' },
  { id: 'vnpay', label: 'VNPay', icon: '💳' },
];

export const CheckoutPage: React.FC = () => {
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });
  const [payment, setPayment] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponMsg, setCouponMsg] = useState('');

  const COUPONS: Record<string, { type: 'percent' | 'fixed'; value: number; min: number }> = {
    'PETCARE10': { type: 'percent', value: 10, min: 200000 },
    'WELCOME50K': { type: 'fixed', value: 50000, min: 300000 },
    'SALE20': { type: 'percent', value: 20, min: 500000 },
  };

  const applyCoupon = () => {};

  const applyCouponByCode = (code: string) => {
    const promo = COUPONS[code];
    if (!promo) return;
    const d = promo.type === 'percent' ? Math.round(totalPrice * promo.value / 100) : promo.value;
    setCoupon(code);
    setDiscount(d);
    setCouponMsg(`Áp dụng thành công! Giảm ${fmt(d)}`);
    setCouponOpen(false);
  };

  const finalPrice = Math.max(0, totalPrice - discount);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    dispatch(placeOrder({
      items,
      totalPrice: finalPrice,
      name: form.name,
      phone: form.phone,
      address: form.address,
      note: form.note,
      paymentMethod: payment,
    }));
    setLoading(false);
    setSuccess(true);
    dispatch(clearCart());
  };

  if (items.length === 0 && !success) {
    navigate('/cart');
    return null;
  }

  if (success) {
    return (
      <>
        <Header />
        <main style={{ maxWidth: 500, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 48, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontWeight: 800, color: '#1e1b4b', marginBottom: 8 }}>Đặt hàng thành công!</h2>
            <p style={{ color: '#6b7280', marginBottom: 32 }}>Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ xác nhận đơn hàng sớm nhất.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => navigate('/orders')} style={{ background: 'linear-gradient(135deg,#3BB77E,#2D9B6A)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
                Xem đơn hàng
              </button>
              <button onClick={() => navigate('/products')} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '12px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.8rem', color: '#1e1b4b', marginBottom: 24 }}>📦 Thanh toán</h1>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>

            {/* Cột trái */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Thông tin giao hàng */}
              <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                <h3 style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: 20, fontSize: '1.05rem' }}>📍 Thông tin giao hàng</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { name: 'name', label: 'Họ và tên', placeholder: 'Nguyễn Văn A', type: 'text' },
                    { name: 'phone', label: 'Số điện thoại', placeholder: '0901234567', type: 'tel' },
                    { name: 'address', label: 'Địa chỉ nhận hàng', placeholder: '123 Đường ABC, Quận 1, TP.HCM', type: 'text' },
                  ].map(f => (
                    <div key={f.name}>
                      <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 6, fontSize: '0.9rem' }}>{f.label}</label>
                      <input
                        type={f.type}
                        name={f.name}
                        value={(form as any)[f.name]}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        required
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 6, fontSize: '0.9rem' }}>Ghi chú (tuỳ chọn)</label>
                    <textarea
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      placeholder="Ghi chú cho đơn hàng..."
                      rows={3}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: '0.95rem', boxSizing: 'border-box', resize: 'none', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                <h3 style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: 16, fontSize: '1.05rem' }}>💳 Phương thức thanh toán</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {PAYMENT_METHODS.map(m => (
                    <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, border: `2px solid ${payment === m.id ? '#3BB77E' : '#e5e7eb'}`, background: payment === m.id ? '#f0fdf4' : '#fff', cursor: 'pointer', transition: 'all 0.15s' }}>
                      <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} style={{ accentColor: '#3BB77E' }} />
                      <span style={{ fontSize: '1.2rem' }}>{m.icon}</span>
                      <span style={{ fontWeight: 600, color: '#374151', fontSize: '0.95rem' }}>{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Cột phải - Tóm tắt đơn hàng */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', position: 'sticky', top: 20 }}>
              <h3 style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: 16, fontSize: '1.05rem' }}>🛒 Đơn hàng ({items.length} sản phẩm)</h3>

              <div style={{ maxHeight: 280, overflowY: 'auto', marginBottom: 16 }}>
                {items.map(item => (
                  <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#253D4E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>x{item.quantity}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#ef4444', fontSize: '0.9rem', flexShrink: 0, marginLeft: 8 }}>{fmt(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#6b7280', fontSize: '0.9rem' }}>
                <span>Tạm tính</span><span>{fmt(totalPrice)}</span>
              </div>

              {/* Mã khuyến mãi */}
              <div style={{ marginBottom: 12 }}>
                {/* Trigger */}
                <div onClick={() => setCouponOpen(o => !o)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, border: `2px solid ${coupon ? '#3BB77E' : '#e5e7eb'}`, background: coupon ? '#f0fdf4' : '#f9fafb', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1rem' }}>🎁</span>
                    <span style={{ fontWeight: 600, color: coupon ? '#16a34a' : '#6b7280', fontSize: '0.9rem' }}>
                      {coupon ? `${coupon} — đã áp dụng` : 'Chọn mã khuyến mãi'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {coupon && (
                      <span onClick={e => { e.stopPropagation(); setCoupon(''); setDiscount(0); setCouponMsg(''); }}
                        style={{ color: '#9ca3af', fontWeight: 700, fontSize: '0.85rem', padding: '0 4px' }}>✕</span>
                    )}
                    <span style={{ color: '#9ca3af', fontSize: '0.8rem', transition: 'transform 0.2s', display: 'inline-block', transform: couponOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                  </div>
                </div>

                {/* Dropdown */}
                {couponOpen && (
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, marginTop: 6, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    {Object.entries(COUPONS).map(([code, promo], i) => {
                      const applicable = totalPrice >= promo.min;
                      const isSelected = coupon === code;
                      const discountLabel = promo.type === 'percent' ? `-${promo.value}%` : `-${fmt(promo.value)}`;
                      return (
                        <div key={code}
                          onClick={() => { if (!applicable) return; applyCouponByCode(code); }}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: isSelected ? '#f0fdf4' : '#fff', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', cursor: applicable ? 'pointer' : 'not-allowed', opacity: applicable ? 1 : 0.45 }}>
                          <div>
                            <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '0.88rem' }}>{code}</div>
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>Đơn tối thiểu {fmt(promo.min)}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 800, color: '#ef4444', fontSize: '0.95rem' }}>{discountLabel}</span>
                            {isSelected && <span style={{ color: '#3BB77E', fontWeight: 700 }}>✓</span>}
                            {!applicable && <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Chưa đủ đk</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {couponMsg && (
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#16a34a', marginTop: 6 }}>✓ {couponMsg}</div>
                )}
              </div>

              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#16a34a', fontSize: '0.9rem', fontWeight: 600 }}>
                  <span>🎁 Giảm giá</span><span>-{fmt(discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, color: '#6b7280', fontSize: '0.9rem' }}>
                <span>Phí vận chuyển</span><span style={{ color: '#3BB77E', fontWeight: 600 }}>Miễn phí</span>
              </div>
              <div style={{ borderTop: '2px solid #f0f0f0', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ fontWeight: 700, color: '#1e1b4b' }}>Tổng cộng</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ef4444' }}>{fmt(finalPrice)}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', background: loading ? '#9ca3af' : 'linear-gradient(135deg,#3BB77E,#2D9B6A)', color: '#fff', border: 'none', padding: '14px', borderRadius: 10, fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Đang xử lý...' : '✅ Xác nhận đặt hàng'}
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
};
