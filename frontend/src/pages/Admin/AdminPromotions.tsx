import React, { useState } from 'react';

interface Promo { id: string; code: string; discount: number; type: 'percent' | 'fixed'; minOrder: number; usedCount: number; maxUse: number; expiry: string; active: boolean; }

const INIT: Promo[] = [
  { id: '1', code: 'PETCARE10', discount: 10, type: 'percent', minOrder: 200000, usedCount: 45, maxUse: 100, expiry: '2024-12-31', active: true },
  { id: '2', code: 'WELCOME50K', discount: 50000, type: 'fixed', minOrder: 300000, usedCount: 20, maxUse: 50, expiry: '2024-12-25', active: true },
  { id: '3', code: 'SALE20', discount: 20, type: 'percent', minOrder: 500000, usedCount: 10, maxUse: 30, expiry: '2024-12-20', active: false },
];

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';
const EMPTY: Promo = { id: '', code: '', discount: 0, type: 'percent', minOrder: 0, usedCount: 0, maxUse: 100, expiry: '', active: true };

export const AdminPromotions: React.FC = () => {
  const [items, setItems] = useState(INIT);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const openAdd = () => { setForm({ ...EMPTY, id: Date.now().toString() }); setModal(true); };
  const openEdit = (p: Promo) => { setForm(p); setModal(true); };
  const save = () => {
    setItems(prev => prev.find(p => p.id === form.id) ? prev.map(p => p.id === form.id ? form : p) : [...prev, form]);
    setModal(false);
  };
  const remove = (id: string) => { if (confirm('Xóa mã này?')) setItems(prev => prev.filter(p => p.id !== id)); };
  const toggle = (id: string) => setItems(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1e1b4b', margin: 0 }}>🎁 Quản lý khuyến mãi</h1>
        <button onClick={openAdd} style={{ background: 'linear-gradient(135deg,#3BB77E,#2D9B6A)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>+ Tạo mã</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
        {items.map(p => (
          <div key={p.id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: `4px solid ${p.active ? '#3BB77E' : '#e5e7eb'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 800, color: '#1e1b4b', fontSize: '1.1rem', letterSpacing: 1 }}>{p.code}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ef4444', marginTop: 4 }}>
                  {p.type === 'percent' ? `-${p.discount}%` : `-${fmt(p.discount)}`}
                </div>
              </div>
              <span style={{ background: p.active ? '#dcfce7' : '#fee2e2', color: p.active ? '#16a34a' : '#dc2626', padding: '3px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>
                {p.active ? 'Đang hoạt động' : 'Tắt'}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#6b7280', display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 14 }}>
              <span>Đơn tối thiểu: {fmt(p.minOrder)}</span>
              <span>Đã dùng: {p.usedCount}/{p.maxUse}</span>
              <span>Hết hạn: {p.expiry}</span>
            </div>
            <div style={{ background: '#f3f4f6', borderRadius: 6, height: 6, marginBottom: 14 }}>
              <div style={{ width: `${Math.min((p.usedCount / p.maxUse) * 100, 100)}%`, height: '100%', background: '#3BB77E', borderRadius: 6 }} />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => toggle(p.id)} style={{ flex: 1, background: p.active ? '#fef3c7' : '#dcfce7', color: p.active ? '#d97706' : '#16a34a', border: 'none', padding: '6px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
                {p.active ? 'Tắt' : 'Bật'}
              </button>
              <button onClick={() => openEdit(p)} style={{ flex: 1, background: '#dbeafe', color: '#2563eb', border: 'none', padding: '6px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>Sửa</button>
              <button onClick={() => remove(p.id)} style={{ flex: 1, background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>Xóa</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 460, maxWidth: '90vw' }}>
            <h3 style={{ fontWeight: 800, color: '#1e1b4b', marginBottom: 20 }}>Mã khuyến mãi</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[{ label: 'Mã code', key: 'code', type: 'text' }, { label: 'Giá trị giảm', key: 'discount', type: 'number' }, { label: 'Đơn tối thiểu (đ)', key: 'minOrder', type: 'number' }, { label: 'Số lần dùng tối đa', key: 'maxUse', type: 'number' }, { label: 'Ngày hết hạn', key: 'expiry', type: 'date' }].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 4, fontSize: '0.88rem' }}>{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: f.type === 'number' ? +e.target.value : e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e7eb', boxSizing: 'border-box', outline: 'none' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 4, fontSize: '0.88rem' }}>Loại giảm</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e7eb', outline: 'none' }}>
                  <option value="percent">Phần trăm (%)</option>
                  <option value="fixed">Số tiền cố định (đ)</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={save} style={{ flex: 1, background: 'linear-gradient(135deg,#3BB77E,#2D9B6A)', color: '#fff', border: 'none', padding: '11px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Lưu</button>
              <button onClick={() => setModal(false)} style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: 'none', padding: '11px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
