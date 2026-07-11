import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '@stores/slices/contactSlice';
import { RootState } from '@stores/store';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';
const WARRANTY_PET = [
  { icon: '🥉', title: 'Gói Standard', duration: '30 ngày', desc: 'Bảo hành sức khoẻ cơ bản, hỗ trợ tư vấn 24/7' },
  { icon: '🥇', title: 'Gói Gold', duration: '6 tháng', desc: 'Khám miễn phí định kỳ, tiêm phòng nhắc lại' },
  { icon: '💎', title: 'Gói Premium', duration: '1 năm', desc: 'Bảo hành toàn diện, hoàn tiền nếu bé có vấn đề sức khoẻ nghiêm trọng' },
];

const WARRANTY_PRODUCT = [
  { icon: '🔄', title: 'Đổi trả 30 ngày', desc: 'Sản phẩm lỗi hoặc bé không phù hợp được đổi trả trong 30 ngày' },
  { icon: '🛡️', title: 'Cam kết chất lượng', desc: 'Tất cả sản phẩm đều có xuất xứ rõ ràng, không hàng giả' },
  { icon: '🚚', title: 'Giao hàng toàn quốc', desc: 'Miễn phí vận chuyển cho đơn từ 300.000đ' },
];

const SUBJECTS = ['Bảo hành thú cưng', 'Bảo hành sản phẩm', 'Tư vấn dịch vụ', 'Khiếu nại', 'Góp ý & phản hồi', 'Hợp tác kinh doanh', 'Khác'];

export const ContactPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s: RootState) => s.auth);
  const { data: settings } = useSelector((s: RootState) => s.settings);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', subject: 'Tư vấn dịch vụ', message: '' });
  const [sent, setSent] = useState(false);
  const [activeWarranty, setActiveWarranty] = useState<'pet' | 'product'>('pet');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return alert('Vui lòng điền tên và nội dung tin nhắn.');
    dispatch(sendMessage(form));
    setSent(true);
  };

  return (
    <>
      <Header />
      <main className="page-container">

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '52px 20px 36px', background: 'linear-gradient(135deg,#fdf6ec,#fce4ec)', borderRadius: 20, marginBottom: 48, border: '1px solid #f0ebe4' }}>
          <div style={{ fontSize: '3rem', marginBottom: 14 }}>💬</div>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 900, margin: '0 0 10px', color: '#111' }}>Liên hệ & Hỗ trợ</h1>
          <p style={{ color: '#888', lineHeight: 1.6, maxWidth: 500, margin: '0 auto' }}>Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Gửi tin nhắn và nhận phản hồi trong 2–4 giờ làm việc.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 40, alignItems: 'start' }}>

          {/* Left: Contact form + warranty */}
          <div>
            {/* Warranty tabs */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #f0ebe4', marginBottom: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontWeight: 800, color: '#111', margin: '0 0 20px', fontSize: '1.2rem' }}>🛡️ Chính sách bảo hành</h2>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {[{ k: 'pet' as const, l: '🐾 Thú cưng' }, { k: 'product' as const, l: '🛍️ Sản phẩm' }].map(t => (
                  <button key={t.k} onClick={() => setActiveWarranty(t.k)}
                    style={{ padding: '8px 20px', borderRadius: 50, border: `2px solid ${activeWarranty === t.k ? '#111' : '#e5e7eb'}`, background: activeWarranty === t.k ? '#111' : '#fff', color: activeWarranty === t.k ? '#fff' : '#374151', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>
                    {t.l}
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                {(activeWarranty === 'pet' ? WARRANTY_PET : WARRANTY_PRODUCT).map(w => (
                  <div key={w.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: '#faf9f7', padding: '14px 18px', borderRadius: 14 }}>
                    <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{w.icon}</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#111', marginBottom: 3 }}>
                        {w.title} {'duration' in w && <span style={{ background: '#f0ebe4', color: '#8b5e3c', fontSize: '0.72rem', padding: '2px 8px', borderRadius: 10, marginLeft: 8, fontWeight: 700 }}>{(w as any).duration}</span>}
                      </div>
                      <div style={{ color: '#888', fontSize: '0.85rem', lineHeight: 1.6 }}>{w.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #f0ebe4', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontWeight: 800, color: '#111', margin: '0 0 20px', fontSize: '1.2rem' }}>📨 Gửi tin nhắn</h2>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: 14 }}>✅</div>
                  <h3 style={{ fontWeight: 900, color: '#111', marginBottom: 10 }}>Tin nhắn đã được gửi!</h3>
                  <p style={{ color: '#888', lineHeight: 1.7, marginBottom: 24 }}>Chúng tôi sẽ phản hồi qua email <b>{form.email}</b> trong vòng 2–4 giờ làm việc.</p>
                  <button onClick={() => setSent(false)} style={{ background: '#111', color: '#fff', border: 'none', padding: '11px 28px', borderRadius: 50, fontWeight: 700, cursor: 'pointer' }}>Gửi tin nhắn khác</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="ap-form-row">
                    <div className="ap-form-group"><label>Họ và tên *</label><input className="ap-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nguyễn Văn A" required /></div>
                    <div className="ap-form-group"><label>Số điện thoại</label><input className="ap-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0901234567" /></div>
                    <div className="ap-form-group ap-form-full"><label>Email</label><input className="ap-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@gmail.com" /></div>
                    <div className="ap-form-group ap-form-full">
                      <label>Chủ đề *</label>
                      <select className="ap-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                        {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="ap-form-group ap-form-full">
                      <label>Nội dung tin nhắn *</label>
                      <textarea className="ap-input" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Mô tả chi tiết vấn đề hoặc câu hỏi của bạn..." required />
                    </div>
                    <div className="ap-form-group ap-form-full">
                      <button type="submit" style={{ width: '100%', background: '#111', color: '#fff', border: 'none', padding: '14px', borderRadius: 50, fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>
                        📤 Gửi tin nhắn
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right: Contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Info card */}
            <div style={{ background: '#111', color: '#fff', borderRadius: 20, padding: 28 }}>
              <h3 style={{ fontWeight: 800, marginBottom: 20, fontSize: '1.05rem' }}>📍 Thông tin liên hệ</h3>
              {[
                ['📞', 'Hotline', settings.phone, `Hỗ trợ ${settings.hoursWeekend} hàng ngày`],
                ['📧', 'Email', settings.emailSupport, 'Phản hồi trong 2–4 giờ'],
                ['📍', 'Địa chỉ', `${settings.address}, ${settings.district}`, settings.city],
                ['🕐', 'Giờ làm việc', `T2–T6: ${settings.hoursWeekday}`, `T7–CN: ${settings.hoursWeekend}`],
              ].map(([icon, label, value, sub]) => (
                <div key={label as string} style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{value}</div>
                    <div style={{ fontSize: '0.78rem', color: '#aaa' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick warranty claim */}
            <div style={{ background: '#fef3c7', borderRadius: 20, padding: 24, border: '1px solid #fcd34d' }}>
              <h3 style={{ fontWeight: 800, color: '#92400e', marginBottom: 10, fontSize: '1rem' }}>⚡ Yêu cầu bảo hành nhanh</h3>
              <p style={{ color: '#78350f', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 16 }}>Gọi hotline hoặc gửi tin nhắn ngay bên trái với chủ đề <b>Bảo hành thú cưng</b> hoặc <b>Bảo hành sản phẩm</b>.</p>
              <a href={`tel:${settings.phone.replace(/\./g,'')}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#92400e', color: '#fff', padding: '11px 20px', borderRadius: 50, textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                📞 Gọi ngay {settings.phone}
              </a>
            </div>

            {/* FAQ quick */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #f0ebe4', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontWeight: 800, color: '#111', marginBottom: 16, fontSize: '1rem' }}>❓ Câu hỏi thường gặp</h3>
              {[
                ['Bảo hành thú cưng bao lâu?', 'Có 3 gói: 30 ngày, 6 tháng và 1 năm tuỳ khi mua.'],
                ['Có thể đổi trả sản phẩm không?', 'Được, trong vòng 30 ngày nếu sản phẩm lỗi hoặc bé không phù hợp.'],
                ['Giao hàng mất bao lâu?', 'TP.HCM: 1–2 ngày. Tỉnh thành khác: 2–4 ngày làm việc.'],
              ].map(([q, a]) => (
                <div key={q as string} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #f0ebe4' }}>
                  <div style={{ fontWeight: 700, color: '#111', fontSize: '0.88rem', marginBottom: 4 }}>{q}</div>
                  <div style={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.6 }}>{a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};