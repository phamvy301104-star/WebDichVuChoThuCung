import React, { useState } from 'react';

interface Service { id: string; name: string; price: number; duration: number; description: string; status: 'active' | 'inactive'; }

const INIT: Service[] = [
  { id: '1', name: 'Tắm & Cắt lông', price: 150000, duration: 60, description: 'Tắm sạch, sấy khô, cắt tỉa lông theo yêu cầu', status: 'active' },
  { id: '2', name: 'Khám sức khoẻ', price: 200000, duration: 30, description: 'Kiểm tra tổng quát sức khoẻ thú cưng', status: 'active' },
  { id: '3', name: 'Tiêm phòng', price: 250000, duration: 20, description: 'Tiêm các loại vaccine phòng bệnh', status: 'active' },
  { id: '4', name: 'Phẫu thuật', price: 1500000, duration: 120, description: 'Phẫu thuật các ca nhỏ và trung bình', status: 'active' },
  { id: '5', name: 'Cắt móng', price: 50000, duration: 15, description: 'Cắt và mài móng cho thú cưng', status: 'active' },
  { id: '6', name: 'Vệ sinh tai', price: 80000, duration: 20, description: 'Làm sạch tai, ngăn ngừa viêm tai', status: 'inactive' },
];

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';
const EMPTY: Service = { id: '', name: '', price: 0, duration: 30, description: '', status: 'active' };

export const AdminServices: React.FC = () => {
  const [items, setItems] = useState(INIT);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const openAdd = () => { setForm({ ...EMPTY, id: Date.now().toString() }); setModal(true); };
  const openEdit = (s: Service) => { setForm(s); setModal(true); };
  const save = () => {
    setItems(prev => prev.find(s => s.id === form.id) ? prev.map(s => s.id === form.id ? form : s) : [...prev, form]);
    setModal(false);
  };
  const remove = (id: string) => { if (confirm('Xóa dịch vụ này?')) setItems(prev => prev.filter(s => s.id !== id)); };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1e1b4b', margin: 0 }}>✂️ Quản lý dịch vụ</h1>
        <button onClick={openAdd} style={{ background: 'linear-gradient(135deg,#3BB77E,#2D9B6A)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>+ Thêm dịch vụ</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
        {items.map(s => (
          <div key={s.id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>{s.name}</div>
                <span style={{ background: s.status === 'active' ? '#dcfce7' : '#fee2e2', color: s.status === 'active' ? '#16a34a' : '#dc2626', padding: '2px 8px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
                  {s.status === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => openEdit(s)} style={{ background: '#dbeafe', color: '#2563eb', border: 'none', padding: '4px 10px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>Sửa</button>
                <button onClick={() => remove(s.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 10px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>Xóa</button>
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: 12 }}>{s.description}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 800, color: '#ef4444', fontSize: '1rem' }}>{fmt(s.price)}</span>
              <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>⏱ {s.duration} phút</span>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 460, maxWidth: '90vw' }}>
            <h3 style={{ fontWeight: 800, color: '#1e1b4b', marginBottom: 20 }}>Dịch vụ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[{ label: 'Tên dịch vụ', key: 'name', type: 'text' }, { label: 'Giá (đ)', key: 'price', type: 'number' }, { label: 'Thời gian (phút)', key: 'duration', type: 'number' }, { label: 'Mô tả', key: 'description', type: 'text' }].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 4, fontSize: '0.88rem' }}>{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: f.type === 'number' ? +e.target.value : e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e7eb', boxSizing: 'border-box', outline: 'none' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 4, fontSize: '0.88rem' }}>Trạng thái</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as any }))} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e7eb', outline: 'none' }}>
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Tạm dừng</option>
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
