import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { updateSettings, resetSettings, StoreSettings } from '@stores/slices/settingsSlice';

type Tab = 'contact' | 'store' | 'social' | 'payment' | 'policy';

const TABS: { k: Tab; l: string; icon: string }[] = [
  { k: 'contact', l: 'Liên hệ',      icon: '📞' },
  { k: 'store',   l: 'Cửa hàng',     icon: '🏪' },
  { k: 'payment', l: 'Thanh toán',   icon: '💳' },
  { k: 'social',  l: 'Mạng xã hội',  icon: '🌐' },
  { k: 'policy',  l: 'Bảo hành',     icon: '🛡️' },
];

export const AdminSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((s: RootState) => s.settings);
  const [tab, setTab] = useState<Tab>('contact');
  const [form, setForm] = useState<StoreSettings>({ ...data });
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm({ ...data }); }, [data]);

  const set = (key: keyof StoreSettings, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleSave = () => {
    dispatch(updateSettings(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (!confirm('Khôi phục về cài đặt mặc định?')) return;
    dispatch(resetSettings());
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">⚙️ Cài đặt hệ thống</h1>
          <p className="admin-page-sub">Cấu hình thông tin & liên hệ cửa hàng</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="ap-btn ap-btn-ghost" onClick={handleReset}>↩️ Mặc định</button>
          <button className="ap-btn ap-btn-primary" onClick={handleSave}>
            {saved ? '✅ Đã lưu!' : '💾 Lưu cài đặt'}
          </button>
        </div>
      </div>

      {saved && (
        <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 600, fontSize: '0.9rem' }}>
          ✅ Cài đặt đã được lưu thành công!
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.k} onClick={() => setTab(t.k)}
            style={{ padding: '9px 20px', borderRadius: 50, border: `2px solid ${tab === t.k ? '#1a1a1a' : '#e5e7eb'}`, background: tab === t.k ? '#1a1a1a' : '#fff', color: tab === t.k ? '#fff' : '#374151', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>
            {t.icon} {t.l}
          </button>
        ))}
      </div>

      {/* ─── CONTACT TAB ─── */}
      {tab === 'contact' && (
        <div className="ap-card ap-form-card">
          <h3 style={{ marginBottom: 20, color: '#1a1a1a', fontSize: '1rem', fontWeight: 800 }}>📞 Thông tin liên hệ</h3>
          <div className="ap-form-row">
            <div className="ap-form-group">
              <label>Số điện thoại chính *</label>
              <input className="ap-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0900.123.456" />
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 4 }}>Hiển thị trên Header và trang Liên hệ</div>
            </div>
            <div className="ap-form-group">
              <label>Số điện thoại phụ</label>
              <input className="ap-input" value={form.phone2} onChange={e => set('phone2', e.target.value)} placeholder="0900.789.012" />
            </div>
            <div className="ap-form-group">
              <label>Email thông tin</label>
              <input className="ap-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="info@petcare.vn" />
            </div>
            <div className="ap-form-group">
              <label>Email hỗ trợ</label>
              <input className="ap-input" type="email" value={form.emailSupport} onChange={e => set('emailSupport', e.target.value)} placeholder="support@petcare.vn" />
            </div>
            <div className="ap-form-group">
              <label>Giờ làm việc T2–T6</label>
              <input className="ap-input" value={form.hoursWeekday} onChange={e => set('hoursWeekday', e.target.value)} placeholder="08:00 – 20:00" />
            </div>
            <div className="ap-form-group">
              <label>Giờ làm việc T7–CN</label>
              <input className="ap-input" value={form.hoursWeekend} onChange={e => set('hoursWeekend', e.target.value)} placeholder="08:00 – 21:00" />
            </div>
            <div className="ap-form-group ap-form-full">
              <label>Số Zalo</label>
              <input className="ap-input" value={form.zalo} onChange={e => set('zalo', e.target.value)} placeholder="0900123456" />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <h4 style={{ fontWeight: 700, marginBottom: 14, color: '#374151', fontSize: '0.9rem' }}>📍 Địa chỉ cửa hàng</h4>
            <div className="ap-form-row">
              <div className="ap-form-group ap-form-full">
                <label>Số nhà, tên đường</label>
                <input className="ap-input" value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Nguyễn Văn Linh" />
              </div>
              <div className="ap-form-group">
                <label>Quận / Huyện</label>
                <input className="ap-input" value={form.district} onChange={e => set('district', e.target.value)} placeholder="Quận 7" />
              </div>
              <div className="ap-form-group">
                <label>Tỉnh / Thành phố</label>
                <input className="ap-input" value={form.city} onChange={e => set('city', e.target.value)} placeholder="TP. Hồ Chí Minh" />
              </div>
              <div className="ap-form-group ap-form-full">
                <label>Link Google Maps</label>
                <input className="ap-input" value={form.mapLink} onChange={e => set('mapLink', e.target.value)} placeholder="https://maps.google.com/..." />
              </div>
            </div>
          </div>
          {/* Preview */}
          <div style={{ marginTop: 20, background: '#f9fafb', borderRadius: 12, padding: '16px 18px', border: '1px solid #f0ebe4' }}>
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: '0.85rem', color: '#374151' }}>👁️ Xem trước hiển thị</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.85rem' }}>
              <div>📞 <b>{form.phone}</b>{form.phone2 && ` / ${form.phone2}`}</div>
              <div>📧 <b>{form.emailSupport}</b></div>
              <div>📍 <b>{form.address}, {form.district}, {form.city}</b></div>
              <div>🕐 T2–T6: <b>{form.hoursWeekday}</b> · T7–CN: <b>{form.hoursWeekend}</b></div>
            </div>
          </div>
        </div>
      )}

      {/* ─── STORE TAB ─── */}
      {tab === 'store' && (
        <div className="ap-card ap-form-card">
          <h3 style={{ marginBottom: 20, color: '#1a1a1a', fontSize: '1rem', fontWeight: 800 }}>🏪 Thông tin cửa hàng</h3>
          <div className="ap-form-row">
            <div className="ap-form-group ap-form-full">
              <label>Tên cửa hàng</label>
              <input className="ap-input" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="ap-form-group ap-form-full">
              <label>Slogan</label>
              <input className="ap-input" value={form.slogan} onChange={e => set('slogan', e.target.value)} />
            </div>
            <div className="ap-form-group ap-form-full">
              <label>Mô tả cửa hàng</label>
              <textarea className="ap-input" rows={4} value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* ─── PAYMENT TAB ─── */}
      {tab === 'payment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* COD */}
          <div className="ap-card ap-form-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>💵 Thanh toán khi nhận hàng (COD)</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.codEnabled} onChange={e => setForm({ ...form, codEnabled: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: '#22c55e', cursor: 'pointer' }} />
                <span style={{ fontWeight: 700, color: form.codEnabled ? '#166534' : '#9ca3af', fontSize: '0.88rem' }}>{form.codEnabled ? 'Đang bật' : 'Đã tắt'}</span>
              </label>
            </div>
            <div className="ap-form-row">
              <div className="ap-form-group ap-form-full">
                <label>Ghi chú cho khách hàng</label>
                <textarea className="ap-input" rows={2} value={form.codNote} onChange={e => setForm({ ...form, codNote: e.target.value })} disabled={!form.codEnabled} />
              </div>
            </div>
          </div>

          {/* Bank Transfer */}
          <div className="ap-card ap-form-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>🏦 Chuyển khoản ngân hàng</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.bankEnabled} onChange={e => setForm({ ...form, bankEnabled: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: '#22c55e', cursor: 'pointer' }} />
                <span style={{ fontWeight: 700, color: form.bankEnabled ? '#166534' : '#9ca3af', fontSize: '0.88rem' }}>{form.bankEnabled ? 'Đang bật' : 'Đã tắt'}</span>
              </label>
            </div>
            <div className="ap-form-row">
              <div className="ap-form-group"><label>Tên ngân hàng</label><input className="ap-input" value={form.bankName} onChange={e => setForm({ ...form, bankName: e.target.value })} placeholder="Vietcombank" disabled={!form.bankEnabled} /></div>
              <div className="ap-form-group"><label>Số tài khoản</label><input className="ap-input" value={form.bankNumber} onChange={e => setForm({ ...form, bankNumber: e.target.value })} placeholder="1234567890" disabled={!form.bankEnabled} /></div>
              <div className="ap-form-group"><label>Chủ tài khoản</label><input className="ap-input" value={form.bankOwner} onChange={e => setForm({ ...form, bankOwner: e.target.value })} placeholder="PETCARE VN" disabled={!form.bankEnabled} /></div>
              <div className="ap-form-group"><label>Chi nhánh</label><input className="ap-input" value={form.bankBranch} onChange={e => setForm({ ...form, bankBranch: e.target.value })} placeholder="Chi nhánh Q7, TP.HCM" disabled={!form.bankEnabled} /></div>
            </div>
            {form.bankEnabled && (
              <div style={{ marginTop: 8, background: '#f0fdf4', borderRadius: 10, padding: '12px 16px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontWeight: 700, color: '#166534', marginBottom: 6, fontSize: '0.82rem' }}>👁️ Hiển thị cho khách sau khi đặt hàng:</div>
                <div style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.8 }}>
                  Ngân hàng: <b>{form.bankName}</b> · STK: <b>{form.bankNumber}</b> · Chủ TK: <b>{form.bankOwner}</b>
                </div>
              </div>
            )}
          </div>

          {/* MoMo */}
          <div className="ap-card ap-form-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>💜 Ví MoMo</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.momoEnabled} onChange={e => setForm({ ...form, momoEnabled: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: '#22c55e', cursor: 'pointer' }} />
                <span style={{ fontWeight: 700, color: form.momoEnabled ? '#166534' : '#9ca3af', fontSize: '0.88rem' }}>{form.momoEnabled ? 'Đang bật' : 'Đã tắt'}</span>
              </label>
            </div>
            <div className="ap-form-row">
              <div className="ap-form-group"><label>Số điện thoại MoMo</label><input className="ap-input" value={form.momoPhone} onChange={e => setForm({ ...form, momoPhone: e.target.value })} placeholder="0900123456" disabled={!form.momoEnabled} /></div>
              <div className="ap-form-group"><label>Tên tài khoản MoMo</label><input className="ap-input" value={form.momoName} onChange={e => setForm({ ...form, momoName: e.target.value })} placeholder="PETCARE VN" disabled={!form.momoEnabled} /></div>
              <div className="ap-form-group ap-form-full"><label>Hướng dẫn cho khách</label><textarea className="ap-input" rows={2} value={form.momoNote} onChange={e => setForm({ ...form, momoNote: e.target.value })} disabled={!form.momoEnabled} /></div>
            </div>
          </div>

          {/* Shipping */}
          <div className="ap-card ap-form-card">
            <h3 style={{ marginBottom: 18, fontSize: '1rem', fontWeight: 800 }}>🚚 Phí vận chuyển</h3>
            <div className="ap-form-row">
              <div className="ap-form-group">
                <label>Phí giao hàng mặc định (VND)</label>
                <input className="ap-input" type="number" value={form.shippingFee} onChange={e => setForm({ ...form, shippingFee: +e.target.value })} placeholder="30000" />
              </div>
              <div className="ap-form-group">
                <label>Miễn phí khi đơn từ (VND)</label>
                <input className="ap-input" type="number" value={form.freeShipMinOrder} onChange={e => setForm({ ...form, freeShipMinOrder: +e.target.value })} placeholder="300000" />
              </div>
            </div>
            <div style={{ background: '#f9fafb', borderRadius: 10, padding: '10px 14px', fontSize: '0.85rem', color: '#555' }}>
              Đơn dưới <b>{form.freeShipMinOrder.toLocaleString('vi-VN')}đ</b> tính phí <b>{form.shippingFee.toLocaleString('vi-VN')}đ</b>. Đơn từ <b>{form.freeShipMinOrder.toLocaleString('vi-VN')}đ</b> miễn phí ship 🎉
            </div>
          </div>
        </div>
      )}

      {/* ─── SOCIAL TAB ─── */}
      {tab === 'social' && (
        <div className="ap-card ap-form-card">
          <h3 style={{ marginBottom: 20, color: '#1a1a1a', fontSize: '1rem', fontWeight: 800 }}>🌐 Mạng xã hội</h3>
          <div className="ap-form-row">
            {[
              ['📘 Facebook', 'facebook', 'https://facebook.com/petcare.vn'],
              ['📸 Instagram', 'instagram', 'https://instagram.com/petcare.vn'],
              ['🎵 TikTok', 'tiktok', 'https://tiktok.com/@petcare'],
              ['▶️ YouTube', 'youtube', 'https://youtube.com/@petcare'],
            ].map(([label, key, placeholder]) => (
              <div key={key as string} className="ap-form-group ap-form-full">
                <label>{label as string}</label>
                <input className="ap-input" value={(form as any)[key as string]} onChange={e => set(key as keyof StoreSettings, e.target.value)} placeholder={placeholder as string} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── POLICY TAB ─── */}
      {tab === 'policy' && (
        <div className="ap-card ap-form-card">
          <h3 style={{ marginBottom: 20, color: '#1a1a1a', fontSize: '1rem', fontWeight: 800 }}>🛡️ Chính sách bảo hành</h3>
          <div className="ap-form-row">
            <div className="ap-form-group ap-form-full">
              <label>Nội dung chính sách bảo hành</label>
              <textarea className="ap-input" rows={6} value={form.warranty} onChange={e => set('warranty', e.target.value)} placeholder="Mô tả chính sách bảo hành..." />
            </div>
          </div>
        </div>
      )}

      <div className="ap-form-actions" style={{ marginTop: 24 }}>
        <button className="ap-btn ap-btn-primary" onClick={handleSave}>
          {saved ? '✅ Đã lưu!' : '💾 Lưu cài đặt'}
        </button>
        <button className="ap-btn ap-btn-ghost" onClick={handleReset}>↩️ Khôi phục mặc định</button>
      </div>
    </div>
  );
};