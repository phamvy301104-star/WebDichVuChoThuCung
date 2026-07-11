import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { removeFromCart, updateCartItem, clearCart } from '@stores/slices/cartSlice';
import { placeOrder } from '@stores/slices/shopSlice';
import { usePromo, validatePromo } from '@stores/slices/promoSlice';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

const PAYMENT_METHODS = [
  { id: 'cod',  icon: '💵', label: 'Thanh toán khi nhận hàng', sub: 'COD — Nhận hàng rồi trả tiền' },
  { id: 'bank', icon: '🏦', label: 'Chuyển khoản ngân hàng',   sub: 'Vietcombank · MB Bank · Techcombank' },
  { id: 'momo', icon: '💜', label: 'Ví MoMo',                   sub: 'Thanh toán nhanh qua MoMo' },
];

export const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((s: RootState) => s.cart);
  const { user } = useSelector((s: RootState) => s.auth);
  const { codes: promoCodes } = useSelector((s: RootState) => s.promo);
  const { data: settings } = useSelector((s: RootState) => s.settings);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', address: (user as any)?.address || '', note: '' });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank' | 'momo'>('cod');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [placed, setPlaced] = useState(false);

  const discount = appliedPromo?.discount || 0;
  const shipping = subtotal - discount >= settings.freeShipMinOrder ? 0 : settings.shippingFee;
  const total = Math.max(0, subtotal - discount + shipping);

  // Dynamic payment methods from settings
  const PAYMENT_METHODS = [
    settings.codEnabled  && { id: 'cod',  icon: '💵', label: 'Thanh toán khi nhận hàng', sub: settings.codNote || 'COD — Nhận hàng rồi trả tiền' },
    settings.bankEnabled && { id: 'bank', icon: '🏦', label: `Chuyển khoản ${settings.bankName}`, sub: `STK: ${settings.bankNumber} — ${settings.bankOwner}` },
    settings.momoEnabled && { id: 'momo', icon: '💜', label: 'Ví MoMo', sub: `SĐT: ${settings.momoPhone} — ${settings.momoName}` },
  ].filter(Boolean) as { id: string; icon: string; label: string; sub: string }[];

  const applyPromo = () => {
    const code = promoInput.toUpperCase().trim();
    const result = validatePromo(promoCodes, code, subtotal);
    if (!result.valid) { setPromoError(result.error || 'Mã không hợp lệ.'); setAppliedPromo(null); return; }
    setAppliedPromo({ code, discount: result.discount, label: result.label });
    setPromoError('');
  };

  const removePromo = () => { setAppliedPromo(null); setPromoInput(''); setPromoError(''); };

  const handleOrder = () => {
    if (!form.name || !form.phone || !form.address) return alert('Vui lòng điền đầy đủ thông tin giao hàng.');
    if (appliedPromo) dispatch(usePromo(appliedPromo.code));
    dispatch(placeOrder({
      customerName: form.name, customerEmail: form.email, customerPhone: form.phone,
      address: form.address, note: form.note,
      items: items.map(i => ({ productId: i.productId, productName: i.product?.name || '', productImage: i.product?.image || '', price: i.price, quantity: i.quantity })),
      subtotal, discount, promoCode: appliedPromo?.code || '', total, paymentMethod,
      status: 'pending',
    }));
    dispatch(clearCart());
    setPlaced(true);
  };

  // ─── Order success ───
  if (placed) return (
    <>
      <Header />
      <main className="page-container" style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontWeight: 900, color: '#1a1a1a', marginBottom: 8 }}>Đặt hàng thành công!</h1>
        <p style={{ color: '#6b7280', marginBottom: 6 }}>Đơn hàng của bạn đã được ghi nhận.</p>
        <p style={{ color: '#6b7280', marginBottom: 32 }}>Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.</p>
        {paymentMethod === 'bank' && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 20, marginBottom: 24, textAlign: 'left' }}>
            <div style={{ fontWeight: 700, color: '#166534', marginBottom: 10 }}>🏦 Thông tin chuyển khoản</div>
            <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 2 }}>
              <div>Ngân hàng: <b>{settings.bankName}</b></div>
              <div>Số tài khoản: <b>{settings.bankNumber}</b></div>
              <div>Chủ tài khoản: <b>{settings.bankOwner}</b></div>
              {settings.bankBranch && <div>Chi nhánh: <b>{settings.bankBranch}</b></div>}
              <div>Nội dung CK: <b>DH {Date.now()}</b></div>
              <div>Số tiền: <b style={{ color: '#ef4444' }}>{fmt(total)}</b></div>
            </div>
          </div>
        )}
        {paymentMethod === 'momo' && (
          <div style={{ background: '#fdf2ff', border: '1px solid #e879f9', borderRadius: 12, padding: 20, marginBottom: 24, textAlign: 'left' }}>
            <div style={{ fontWeight: 700, color: '#86198f', marginBottom: 10 }}>💜 Thanh toán MoMo</div>
            <div style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 2 }}>
              <div>Số điện thoại MoMo: <b>{settings.momoPhone}</b></div>
              <div>Tên: <b>{settings.momoName}</b></div>
              <div>Số tiền: <b style={{ color: '#ef4444' }}>{fmt(total)}</b></div>
              {settings.momoNote && <div style={{ color: '#86198f', fontSize: '0.82rem', marginTop: 4 }}>{settings.momoNote}</div>}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/products" style={{ background: '#1a1a1a', color: '#fff', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Tiếp tục mua sắm</Link>
        </div>
      </main>
      <Footer />
    </>
  );

  // ─── Main cart ───
  return (
    <>
      <Header />
      <main className="page-container" style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.8rem', color: '#1a1a1a', marginBottom: 24 }}>🛒 Giỏ hàng ({items.length})</h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#9ca3af' }}>
            <div style={{ fontSize: '4rem', marginBottom: 12 }}>🛒</div>
            <p style={{ marginBottom: 20 }}>Giỏ hàng trống</p>
            <Link to="/products" style={{ background: '#1a1a1a', color: '#fff', padding: '10px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>Khám phá sản phẩm</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
            {/* Cart items */}
            <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0ebe4' }}>
              {items.map(item => (
                <div key={item.productId} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid #f0ebe4' }}>
                  <img src={item.product?.image} alt={item.product?.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, marginBottom: 4, color: '#1a1a1a', fontSize: '0.95rem' }}>{item.product?.name}</div>
                    <div style={{ color: '#ef4444', fontWeight: 800, marginBottom: 8 }}>{fmt(item.price)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => dispatch(updateCartItem({ productId: item.productId, quantity: item.quantity - 1 }))} style={{ width: 28, height: 28, border: '1.5px solid #e5e7eb', borderRadius: 6, cursor: 'pointer', background: '#fff', fontWeight: 700 }}>−</button>
                      <span style={{ fontWeight: 700, minWidth: 28, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => dispatch(updateCartItem({ productId: item.productId, quantity: item.quantity + 1 }))} style={{ width: 28, height: 28, border: '1.5px solid #e5e7eb', borderRadius: 6, cursor: 'pointer', background: '#fff', fontWeight: 700 }}>+</button>
                      <button onClick={() => dispatch(removeFromCart(item.productId))} style={{ marginLeft: 8, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>Xóa</button>
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#1a1a1a', fontSize: '1rem', alignSelf: 'center' }}>{fmt(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Promo code */}
              <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0ebe4' }}>
                <div style={{ fontWeight: 700, marginBottom: 12, color: '#1a1a1a' }}>🏷️ Mã giảm giá</div>
                {!appliedPromo ? (
                  <>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input value={promoInput} onChange={e => setPromoInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyPromo()}
                        placeholder="Nhập mã (VD: PETCARE10)"
                        style={{ flex: 1, padding: '9px 14px', border: `1.5px solid ${promoError ? '#ef4444' : '#e5e7eb'}`, borderRadius: 8, fontSize: '0.9rem', outline: 'none' }} />
                      <button onClick={applyPromo} style={{ background: '#1a1a1a', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Áp dụng</button>
                    </div>
                    {promoError && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: 6 }}>{promoError}</div>}
                    <div style={{ marginTop: 10, fontSize: '0.78rem', color: '#9ca3af' }}>
                      Mã hiện có: {promoCodes.filter(c => c.status === 'active' && c.to >= new Date().toISOString().split('T')[0] && c.used < c.limit).map(c => c.code).join(' · ')}
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0fdf4', padding: '10px 14px', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                    <div>
                      <span style={{ fontWeight: 700, color: '#166534' }}>✅ {appliedPromo.code}</span>
                      <span style={{ color: '#166534', fontSize: '0.85rem', marginLeft: 8 }}>{appliedPromo.label}</span>
                    </div>
                    <button onClick={removePromo} style={{ color: '#991b1b', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                  </div>
                )}
              </div>

              {/* Total summary */}
              <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0ebe4' }}>
                <div style={{ fontWeight: 700, marginBottom: 12, color: '#1a1a1a' }}>📋 Tóm tắt đơn hàng</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#6b7280', fontSize: '0.9rem' }}><span>Tạm tính</span><span>{fmt(subtotal)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#6b7280', fontSize: '0.9rem' }}>
                  <span>Phí vận chuyển</span>
                  <span style={{ color: shipping === 0 ? '#22c55e' : undefined }}>{shipping === 0 ? 'Miễn phí 🎉' : fmt(shipping)}</span>
                </div>
                {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#166534', fontSize: '0.9rem', fontWeight: 600 }}><span>Giảm giá ({appliedPromo?.code})</span><span>−{fmt(discount)}</span></div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid #f0ebe4', fontWeight: 900, fontSize: '1.1rem' }}>
                  <span>Tổng cộng</span><span style={{ color: '#ef4444' }}>{fmt(total)}</span>
                </div>
                <button onClick={() => setShowCheckout(true)} style={{ width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', padding: '13px', borderRadius: 10, fontWeight: 800, fontSize: '1rem', cursor: 'pointer', marginTop: 4 }}>
                  Tiến hành đặt hàng →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Checkout modal ─── */}
        {showCheckout && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
            onClick={e => { if (e.target === e.currentTarget) setShowCheckout(false); }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: 560, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1.2rem' }}>📦 Thông tin đặt hàng</h3>
                <button onClick={() => setShowCheckout(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#9ca3af' }}>✕</button>
              </div>

              {/* Customer info */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, color: '#1a1a1a', marginBottom: 12, fontSize: '0.95rem' }}>👤 Thông tin người nhận</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[['Họ và tên *','name','Nguyễn Văn A'],['Số điện thoại *','phone','0901234567'],['Email','email','email@gmail.com']].map(([l,k,p]) => (
                    <div key={k as string} style={{ gridColumn: k === 'email' ? '1 / -1' : 'auto' }}>
                      <label style={{ display: 'block', fontWeight: 600, marginBottom: 5, fontSize: '0.85rem' }}>{l as string}</label>
                      <input className="ap-input" placeholder={p as string} value={(form as any)[k as string]} onChange={e => setForm({...form,[k as string]:e.target.value})} />
                    </div>
                  ))}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: 5, fontSize: '0.85rem' }}>Địa chỉ giao hàng *</label>
                    <textarea className="ap-input" rows={2} placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành" value={form.address} onChange={e => setForm({...form,address:e.target.value})} style={{ resize: 'none' }} />
                  </div>
                </div>
              </div>

              {/* Note */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontWeight: 700, color: '#1a1a1a', marginBottom: 8, fontSize: '0.95rem' }}>📝 Ghi chú đơn hàng</label>
                <textarea className="ap-input" rows={2} placeholder="VD: Giao buổi sáng, gọi trước khi giao, để trước cửa..." value={form.note} onChange={e => setForm({...form,note:e.target.value})} style={{ resize: 'none' }} />
              </div>

              {/* Payment method */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontWeight: 700, color: '#1a1a1a', marginBottom: 12, fontSize: '0.95rem' }}>💳 Phương thức thanh toán</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {PAYMENT_METHODS.map(pm => (
                    <div key={pm.id} onClick={() => setPaymentMethod(pm.id as any)}
                      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 12, border: `2px solid ${paymentMethod === pm.id ? '#1a1a1a' : '#e5e7eb'}`, background: paymentMethod === pm.id ? '#f9f9f9' : '#fff', cursor: 'pointer', transition: 'all 0.15s' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${paymentMethod === pm.id ? '#1a1a1a' : '#d1d5db'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {paymentMethod === pm.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1a1a1a' }} />}
                      </div>
                      <span style={{ fontSize: '1.4rem' }}>{pm.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '0.9rem' }}>{pm.label}</div>
                        <div style={{ color: '#9ca3af', fontSize: '0.78rem' }}>{pm.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order total */}
              <div style={{ background: '#f9fafb', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.88rem', marginBottom: 4 }}><span>Tạm tính</span><span>{fmt(subtotal)}</span></div>
                {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534', fontSize: '0.88rem', fontWeight: 600, marginBottom: 4 }}><span>Giảm giá ({appliedPromo?.code})</span><span>−{fmt(discount)}</span></div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.15rem', paddingTop: 8, borderTop: '1px solid #e5e7eb', marginTop: 4 }}>
                  <span>Tổng thanh toán</span><span style={{ color: '#ef4444' }}>{fmt(total)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowCheckout(false)} style={{ padding: '12px 20px', border: '2px solid #e5e7eb', borderRadius: 10, background: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>Quay lại</button>
                <button onClick={handleOrder} style={{ flex: 1, background: '#1a1a1a', color: '#fff', border: 'none', padding: '12px', borderRadius: 10, fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer' }}>
                  ✅ Xác nhận đặt hàng
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};