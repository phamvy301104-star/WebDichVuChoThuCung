import React, { useState } from 'react';

export const AdminSettings: React.FC = () => {
  const [shop, setShop] = useState({ name: 'PetCare', address: '123 Đường ABC, Quận 1, TP.HCM', phone: '0901234567', email: 'contact@petcare.com', openTime: '08:00', closeTime: '20:00' });
  const [notify, setNotify] = useState({ newOrder: true, newBooking: true, newContact: true, lowStock: true });
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1e1b4b', marginBottom: 24 }}>⚙️ Cài đặt hệ thống</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Thông tin cửa hàng */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: 20 }}>🏪 Thông tin cửa hàng</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Tên cửa hàng', key: 'name' },
              { label: 'Địa chỉ', key: 'address' },
              { label: 'Số điện thoại', key: 'phone' },
              { label: 'Email', key: 'email' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 5, fontSize: '0.88rem' }}>{f.label}</label>
                <input value={(shop as any)[f.key]} onChange={e => setShop(s => ({ ...s, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e7eb', boxSizing: 'border-box', outline: 'none' }} />
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[{ label: 'Giờ mở cửa', key: 'openTime' }, { label: 'Giờ đóng cửa', key: 'closeTime' }].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 5, fontSize: '0.88rem' }}>{f.label}</label>
                  <input type="time" value={(shop as any)[f.key]} onChange={e => setShop(s => ({ ...s, [f.key]: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e7eb', boxSizing: 'border-box', outline: 'none' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cài đặt thông báo */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: 20 }}>🔔 Cài đặt thông báo</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { key: 'newOrder', label: 'Đơn hàng mới', desc: 'Nhận thông báo khi có đơn hàng mới' },
              { key: 'newBooking', label: 'Lịch hẹn mới', desc: 'Nhận thông báo khi có lịch hẹn mới' },
              { key: 'newContact', label: 'Tin nhắn liên hệ', desc: 'Nhận thông báo khi có tin nhắn mới' },
              { key: 'lowStock', label: 'Tồn kho thấp', desc: 'Cảnh báo khi sản phẩm sắp hết hàng' },
            ].map(n => (
              <div key={n.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f9fafb', borderRadius: 10 }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>{n.label}</div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: 2 }}>{n.desc}</div>
                </div>
                <div onClick={() => setNotify(p => ({ ...p, [n.key]: !(p as any)[n.key] }))}
                  style={{ width: 44, height: 24, borderRadius: 12, background: (notify as any)[n.key] ? '#3BB77E' : '#d1d5db', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: (notify as any)[n.key] ? 23 : 3, transition: 'left 0.2s' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, padding: '16px', background: '#f9fafb', borderRadius: 10 }}>
            <h4 style={{ fontWeight: 700, color: '#374151', marginBottom: 12, fontSize: '0.9rem' }}>📊 Thông tin hệ thống</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.85rem', color: '#6b7280' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Phiên bản</span><span style={{ fontWeight: 600, color: '#374151' }}>v1.0.0</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Framework</span><span style={{ fontWeight: 600, color: '#374151' }}>React + TypeScript</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Môi trường</span><span style={{ fontWeight: 600, color: '#16a34a' }}>Development</span></div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={save}
          style={{ background: saved ? '#16a34a' : 'linear-gradient(135deg,#3BB77E,#2D9B6A)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 10, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s' }}>
          {saved ? '✓ Đã lưu!' : 'Lưu cài đặt'}
        </button>
      </div>
    </div>
  );
};
