import React, { useState } from 'react';

type PetStatus = 'owned' | 'for_sale' | 'for_adoption';
interface Pet { id: string; name: string; species: string; breed: string; age: number; owner: string; status: PetStatus; price?: number; }

const INIT: Pet[] = [
  { id: '1', name: 'Mimi', species: 'Mèo', breed: 'Anh lông ngắn', age: 2, owner: 'Nguyễn Văn A', status: 'owned' },
  { id: '2', name: 'Buddy', species: 'Chó', breed: 'Golden Retriever', age: 1, owner: 'Trần Thị B', status: 'for_sale', price: 5000000 },
  { id: '3', name: 'Luna', species: 'Mèo', breed: 'Ba Tư', age: 3, owner: 'Lê Văn C', status: 'for_adoption' },
  { id: '4', name: 'Max', species: 'Chó', breed: 'Poodle', age: 2, owner: 'Phạm Thị D', status: 'for_sale', price: 3500000 },
  { id: '5', name: 'Coco', species: 'Chó', breed: 'Chihuahua', age: 1, owner: 'Hoàng Văn E', status: 'for_adoption' },
];

const STATUS_MAP: Record<PetStatus, { label: string; color: string; bg: string }> = {
  owned:        { label: 'Đang nuôi',    color: '#374151', bg: '#f3f4f6' },
  for_sale:     { label: 'Đang bán',     color: '#d97706', bg: '#fef3c7' },
  for_adoption: { label: 'Cho nhận nuôi', color: '#2563eb', bg: '#dbeafe' },
};

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

export const AdminPets: React.FC = () => {
  const [items, setItems] = useState(INIT);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? items : items.filter(p => p.status === filter);
  const remove = (id: string) => { if (confirm('Xóa thú cưng này?')) setItems(prev => prev.filter(p => p.id !== id)); };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1e1b4b', margin: 0 }}>🐾 Quản lý thú cưng</h1>
        <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Tổng: {items.length} thú cưng</span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['all', 'Tất cả'], ...Object.entries(STATUS_MAP).map(([k, v]) => [k, v.label])].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            style={{ padding: '7px 16px', borderRadius: 20, border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
              background: filter === k ? '#1e1b4b' : '#f3f4f6', color: filter === k ? '#fff' : '#374151' }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['Tên', 'Loài', 'Giống', 'Tuổi', 'Chủ sở hữu', 'Trạng thái', 'Giá', 'Thao tác'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#6b7280', borderBottom: '1px solid #f0f0f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const st = STATUS_MAP[p.status];
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1e1b4b' }}>🐾 {p.name}</td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{p.species}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{p.breed}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{p.age} tuổi</td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{p.owner}</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>{st.label}</span></td>
                  <td style={{ padding: '12px 16px', color: '#ef4444', fontWeight: 700 }}>{p.price ? fmt(p.price) : '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => remove(p.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '5px 12px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>Xóa</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
