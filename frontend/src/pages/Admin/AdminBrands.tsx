import React, { useState } from 'react';

interface Brand { id: string; name: string; origin: string; productCount: number; }

const INIT: Brand[] = [
  { id: '1', name: 'Royal Canin', origin: 'Pháp', productCount: 8 },
  { id: '2', name: 'Pedigree', origin: 'Mỹ', productCount: 6 },
  { id: '3', name: 'Whiskas', origin: 'Mỹ', productCount: 5 },
  { id: '4', name: 'VetPlus', origin: 'Anh', productCount: 4 },
  { id: '5', name: 'PetCare VN', origin: 'Việt Nam', productCount: 10 },
];

const EMPTY: Brand = { id: '', name: '', origin: '', productCount: 0 };

export const AdminBrands: React.FC = () => {
  const [items, setItems] = useState(INIT);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const openAdd = () => { setForm({ ...EMPTY, id: Date.now().toString() }); setModal(true); };
  const openEdit = (b: Brand) => { setForm(b); setModal(true); };
  const save = () => {
    setItems(prev => prev.find(b => b.id === form.id) ? prev.map(b => b.id === form.id ? form : b) : [...prev, form]);
    setModal(false);
  };
  const remove = (id: string) => { if (confirm('Xóa thương hiệu này?')) setItems(prev => prev.filter(b => b.id !== id)); };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1e1b4b', margin: 0 }}>🏷️ Quản lý thương hiệu</h1>
        <button onClick={openAdd} style={{ background: 'linear-gradient(135deg,#3BB77E,#2D9B6A)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>+ Thêm thương hiệu</button>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['Thương hiệu', 'Xuất xứ', 'Số sản phẩm', 'Thao tác'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#6b7280', borderBottom: '1px solid #f0f0f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                <td style={{ padding: '14px 20px', fontWeight: 700, color: '#1e1b4b' }}>🏷️ {b.name}</td>
                <td style={{ padding: '14px 20px', color: '#6b7280' }}>{b.origin}</td>
                <td style={{ padding: '14px 20px' }}><span style={{ background: '#E8F5EF', color: '#166534', padding: '3px 10px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>{b.productCount} sản phẩm</span></td>
                <td style={{ padding: '14px 20px' }}>
                  <button onClick={() => openEdit(b)} style={{ background: '#dbeafe', color: '#2563eb', border: 'none', padding: '5px 12px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', marginRight: 6, fontSize: '0.82rem' }}>Sửa</button>
                  <button onClick={() => remove(b.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '5px 12px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 400, maxWidth: '90vw' }}>
            <h3 style={{ fontWeight: 800, color: '#1e1b4b', marginBottom: 20 }}>Thương hiệu</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[{ label: 'Tên thương hiệu', key: 'name' }, { label: 'Xuất xứ', key: 'origin' }].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 4, fontSize: '0.88rem' }}>{f.label}</label>
                  <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e7eb', boxSizing: 'border-box', outline: 'none' }} />
                </div>
              ))}
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
