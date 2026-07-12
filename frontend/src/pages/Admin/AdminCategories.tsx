import React, { useState } from 'react';

interface Category { id: string; name: string; description: string; productCount: number; }

const INIT: Category[] = [
  { id: '1', name: 'Thức ăn', description: 'Thức ăn cho thú cưng', productCount: 12 },
  { id: '2', name: 'Phụ kiện', description: 'Phụ kiện và đồ dùng', productCount: 8 },
  { id: '3', name: 'Thuốc & Vitamin', description: 'Thuốc và vitamin bổ sung', productCount: 6 },
  { id: '4', name: 'Đồ chơi', description: 'Đồ chơi cho thú cưng', productCount: 10 },
  { id: '5', name: 'Chăm sóc', description: 'Sản phẩm chăm sóc lông, da', productCount: 7 },
  { id: '6', name: 'Vệ sinh', description: 'Sản phẩm vệ sinh', productCount: 5 },
];

const EMPTY: Category = { id: '', name: '', description: '', productCount: 0 };

export const AdminCategories: React.FC = () => {
  const [items, setItems] = useState(INIT);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const openAdd = () => { setForm({ ...EMPTY, id: Date.now().toString() }); setModal(true); };
  const openEdit = (c: Category) => { setForm(c); setModal(true); };
  const save = () => {
    setItems(prev => prev.find(c => c.id === form.id) ? prev.map(c => c.id === form.id ? form : c) : [...prev, form]);
    setModal(false);
  };
  const remove = (id: string) => { if (confirm('Xóa danh mục này?')) setItems(prev => prev.filter(c => c.id !== id)); };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1e1b4b', margin: 0 }}>📁 Quản lý danh mục</h1>
        <button onClick={openAdd} style={{ background: 'linear-gradient(135deg,#3BB77E,#2D9B6A)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>+ Thêm danh mục</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {items.map(c => (
          <div key={c.id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ fontSize: '2rem' }}>📁</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => openEdit(c)} style={{ background: '#dbeafe', color: '#2563eb', border: 'none', padding: '4px 10px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>Sửa</button>
                <button onClick={() => remove(c.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 10px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>Xóa</button>
              </div>
            </div>
            <div style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>{c.name}</div>
            <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: 10 }}>{c.description}</div>
            <span style={{ background: '#E8F5EF', color: '#166534', padding: '3px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600 }}>{c.productCount} sản phẩm</span>
          </div>
        ))}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 420, maxWidth: '90vw' }}>
            <h3 style={{ fontWeight: 800, color: '#1e1b4b', marginBottom: 20 }}>Danh mục</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[{ label: 'Tên danh mục', key: 'name' }, { label: 'Mô tả', key: 'description' }].map(f => (
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
