import React, { useState } from 'react';

type Role = 'user' | 'staff' | 'admin';
interface User { id: string; name: string; email: string; phone: string; role: Role; isActive: boolean; createdAt: string; }

const INIT: User[] = [
  { id: '1', name: 'Admin PetCare', email: 'admin@petcare.com', phone: '0900000000', role: 'admin', isActive: true, createdAt: '2023-01-01' },
  { id: '2', name: 'Nguyễn Văn A', email: 'user@petcare.com', phone: '0901234567', role: 'user', isActive: true, createdAt: '2024-01-15' },
  { id: '3', name: 'Trần Thị B', email: 'b@gmail.com', phone: '0912345678', role: 'user', isActive: true, createdAt: '2024-02-20' },
  { id: '4', name: 'Lê Văn Staff', email: 'staff@petcare.com', phone: '0923456789', role: 'staff', isActive: true, createdAt: '2023-06-01' },
  { id: '5', name: 'Phạm Thị C', email: 'c@gmail.com', phone: '0934567890', role: 'user', isActive: false, createdAt: '2024-03-10' },
];

const ROLE_MAP: Record<Role, { label: string; color: string; bg: string }> = {
  admin: { label: '👑 Admin',    color: '#7c3aed', bg: '#ede9fe' },
  staff: { label: '🔧 Nhân viên', color: '#2563eb', bg: '#dbeafe' },
  user:  { label: '👤 Thành viên', color: '#374151', bg: '#f3f4f6' },
};

export const AdminUsers: React.FC = () => {
  const [items, setItems] = useState(INIT);
  const [search, setSearch] = useState('');

  const filtered = items.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const toggleActive = (id: string) => setItems(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  const changeRole = (id: string, role: Role) => setItems(prev => prev.map(u => u.id === id ? { ...u, role } : u));

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1e1b4b', margin: 0 }}>👥 Quản lý tài khoản</h1>
        <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Tổng: {items.length} tài khoản</span>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Tìm theo tên hoặc email..."
            style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #e5e7eb', width: 300, outline: 'none' }} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['Người dùng', 'Email', 'Số điện thoại', 'Vai trò', 'Trạng thái', 'Ngày tạo', 'Thao tác'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.82rem', fontWeight: 700, color: '#6b7280', borderBottom: '1px solid #f0f0f0' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const r = ROLE_MAP[u.role];
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#3BB77E,#2D9B6A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                        {u.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600, color: '#1e1b4b' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '0.88rem' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '0.88rem' }}>{u.phone}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <select value={u.role} onChange={e => changeRole(u.id, e.target.value as Role)}
                      style={{ background: r.bg, color: r.color, border: 'none', padding: '4px 8px', borderRadius: 6, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', outline: 'none' }}>
                      <option value="user">👤 Thành viên</option>
                      <option value="staff">🔧 Nhân viên</option>
                      <option value="admin">👑 Admin</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: u.isActive ? '#dcfce7' : '#fee2e2', color: u.isActive ? '#16a34a' : '#dc2626', padding: '3px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>
                      {u.isActive ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#9ca3af', fontSize: '0.85rem' }}>{u.createdAt}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => toggleActive(u.id)}
                      style={{ background: u.isActive ? '#fee2e2' : '#dcfce7', color: u.isActive ? '#dc2626' : '#16a34a', border: 'none', padding: '5px 12px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
                      {u.isActive ? 'Khóa' : 'Mở khóa'}
                    </button>
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
