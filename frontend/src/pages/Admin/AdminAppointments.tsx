import React, { useState } from 'react';

type Status = 'pending' | 'confirmed' | 'completed' | 'cancelled';
interface Appointment { id: string; customer: string; phone: string; service: string; pet: string; date: string; time: string; status: Status; note: string; }

const INIT: Appointment[] = [
  { id: 'APT001', customer: 'Nguyễn Văn A', phone: '0901234567', service: 'Tắm & Cắt lông', pet: 'Mèo Anh lông ngắn', date: '2024-12-20', time: '09:00', status: 'pending', note: '' },
  { id: 'APT002', customer: 'Trần Thị B', phone: '0912345678', service: 'Khám sức khoẻ', pet: 'Chó Golden', date: '2024-12-20', time: '10:30', status: 'confirmed', note: 'Chó bị ho nhẹ' },
  { id: 'APT003', customer: 'Lê Văn C', phone: '0923456789', service: 'Tiêm phòng', pet: 'Mèo Ba Tư', date: '2024-12-21', time: '14:00', status: 'completed', note: '' },
  { id: 'APT004', customer: 'Phạm Thị D', phone: '0934567890', service: 'Tắm & Cắt lông', pet: 'Chó Poodle', date: '2024-12-22', time: '08:30', status: 'pending', note: 'Cắt kiểu gấu' },
  { id: 'APT005', customer: 'Hoàng Văn E', phone: '0945678901', service: 'Phẫu thuật', pet: 'Mèo Ragdoll', date: '2024-12-23', time: '07:00', status: 'cancelled', note: '' },
];

const STATUS_MAP: Record<Status, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Chờ xác nhận', color: '#d97706', bg: '#fef3c7' },
  confirmed: { label: 'Đã xác nhận',  color: '#2563eb', bg: '#dbeafe' },
  completed: { label: 'Hoàn thành',   color: '#16a34a', bg: '#dcfce7' },
  cancelled: { label: 'Đã hủy',       color: '#dc2626', bg: '#fee2e2' },
};

export const AdminAppointments: React.FC = () => {
  const [items, setItems] = useState(INIT);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? items : items.filter(a => a.status === filter);
  const updateStatus = (id: string, status: Status) => setItems(prev => prev.map(a => a.id === id ? { ...a, status } : a));

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1e1b4b', margin: 0 }}>📅 Quản lý lịch hẹn</h1>
        <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Tổng: {items.length} lịch hẹn</span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['all', 'Tất cả'], ...Object.entries(STATUS_MAP).map(([k, v]) => [k, v.label])].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            style={{ padding: '7px 16px', borderRadius: 20, border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
              background: filter === k ? '#1e1b4b' : '#f3f4f6', color: filter === k ? '#fff' : '#374151' }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(a => {
          const st = STATUS_MAP[a.status];
          return (
            <div key={a.id} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: '#1e1b4b' }}>{a.customer}</span>
                  <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{a.phone}</span>
                  <span style={{ background: st.bg, color: st.color, padding: '2px 8px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{st.label}</span>
                </div>
                <div style={{ fontSize: '0.88rem', color: '#6b7280' }}>
                  ✂️ {a.service} · 🐾 {a.pet} · 📅 {a.date} {a.time}
                  {a.note && <span> · 📝 {a.note}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {a.status === 'pending' && (
                  <button onClick={() => updateStatus(a.id, 'confirmed')}
                    style={{ background: '#dbeafe', color: '#2563eb', border: 'none', padding: '6px 12px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
                    Xác nhận
                  </button>
                )}
                {a.status === 'confirmed' && (
                  <button onClick={() => updateStatus(a.id, 'completed')}
                    style={{ background: '#dcfce7', color: '#16a34a', border: 'none', padding: '6px 12px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
                    Hoàn thành
                  </button>
                )}
                {(a.status === 'pending' || a.status === 'confirmed') && (
                  <button onClick={() => updateStatus(a.id, 'cancelled')}
                    style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
                    Hủy
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
