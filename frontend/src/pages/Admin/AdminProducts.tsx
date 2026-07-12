import React, { useState } from 'react';

interface Product { id: string; name: string; category: string; price: number; stock: number; status: 'active' | 'inactive'; }

const INIT: Product[] = [
  { id: '1', name: 'Thức ăn mèo Royal Canin 400g', category: 'Thức ăn', price: 185000, stock: 50, status: 'active' },
  { id: '2', name: 'Balo vận chuyển thú cưng', category: 'Phụ kiện', price: 320000, stock: 20, status: 'active' },
  { id: '3', name: 'Vitamin tổng hợp cho chó', category: 'Thuốc & Vitamin', price: 180000, stock: 35, status: 'active' },
  { id: '4', name: 'Combo đồ chơi chuột cho mèo', category: 'Đồ chơi', price: 55000, stock: 80, status: 'active' },
  { id: '5', name: 'Shampoo thú cưng 500ml', category: 'Chăm sóc', price: 120000, stock: 45, status: 'inactive' },
];

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';
const EMPTY = { id: '', name: '', category: 'Thức ăn', price: 0, stock: 0, status: 'active' as const };
const CATS = ['Thức ăn', 'Phụ kiện', 'Thuốc & Vitamin', 'Đồ chơi', 'Chăm sóc', 'Vệ sinh', 'Y tế', 'Chuồng & Nhà'];

export const AdminProducts: React.FC = () => {
  const [items, setItems] = useState<Product[]>(INIT);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Product>(EMPTY);
  const [search, setSearch] = useState('');

  const filtered = items.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm({ ...EMPTY, id: Date.now().toString() }); setModal(true); };
  const openEdit = (p: Product) => { setForm(p); setModal(true); };
  const save = () => {
    setItems(prev => prev.find(p => p.id === form.id) ? prev.map(p => p.id === form.id ? form : p) : [...prev, form]);
    setModal(false);
  };
  const remove = (id: string) => { if (confirm('Xóa sản phẩm này?')) setItems(prev => prev.filter(p => p.id !== id)); };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1e1b4b', margin: 0 }}>🛍️ Quản lý sản phẩm</h1>
        <button onClick={openAdd} style={{ background: 'linear-gradient(135deg,#3BB77E,#2D9B6A)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>+ Thêm sản phẩm</button>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Tìm sản phẩm..." style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #e5e7eb', width: 280, outline: 'none' }} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['Tên sản phẩm', 'Danh mục', 'Giá', 'Tồn kho', 'Trạng thái', 'Thao tác'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#6b7280', borderBottom: '1px solid #f0f0f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#253D4E' }}>{p.name}</td>
                <td style={{ padding: '12px 16px' }}><span style={{ background: '#E8F5EF', color: '#166534', padding: '2px 8px', borderRadius: 5, fontSize: '0.8rem', fontWeight: 600 }}>{p.category}</span></td>
                <td style={{ padding: '12px 16px', color: '#ef4444', fontWeight: 700 }}>{fmt(p.price)}</td>
                <td style={{ padding: '12px 16px', color: p.stock < 10 ? '#ef4444' : '#374151', fontWeight: 600 }}>{p.stock}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: p.status === 'active' ? '#dcfce7' : '#fee2e2', color: p.status === 'active' ? '#16a34a' : '#dc2626', padding: '3px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>
                    {p.status === 'active' ? 'Đang bán' : 'Ẩn'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => openEdit(p)} style={{ background: '#dbeafe', color: '#2563eb', border: 'none', padding: '5px 12px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', marginRight: 6, fontSize: '0.82rem' }}>Sửa</button>
                  <button onClick={() => remove(p.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '5px 12px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 480, maxWidth: '90vw' }}>
            <h3 style={{ fontWeight: 800, color: '#1e1b4b', marginBottom: 20 }}>{form.id && items.find(p => p.id === form.id) ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[{ label: 'Tên sản phẩm', key: 'name', type: 'text' }, { label: 'Giá (đ)', key: 'price', type: 'number' }, { label: 'Tồn kho', key: 'stock', type: 'number' }].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 4, fontSize: '0.88rem' }}>{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: f.type === 'number' ? +e.target.value : e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e7eb', boxSizing: 'border-box', outline: 'none' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 4, fontSize: '0.88rem' }}>Danh mục</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e7eb', outline: 'none' }}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 4, fontSize: '0.88rem' }}>Trạng thái</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as any }))} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e7eb', outline: 'none' }}>
                  <option value="active">Đang bán</option>
                  <option value="inactive">Ẩn</option>
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
