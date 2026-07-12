import React, { useState } from 'react';

interface Review { id: string; user: string; target: string; type: 'product' | 'service'; rating: number; comment: string; date: string; visible: boolean; }

const INIT: Review[] = [
  { id: '1', user: 'Nguyễn Văn A', target: 'Thức ăn mèo Royal Canin', type: 'product', rating: 5, comment: 'Sản phẩm rất tốt, mèo nhà mình rất thích!', date: '2024-12-10', visible: true },
  { id: '2', user: 'Trần Thị B', target: 'Tắm & Cắt lông', type: 'service', rating: 4, comment: 'Dịch vụ tốt, nhân viên thân thiện.', date: '2024-12-12', visible: true },
  { id: '3', user: 'Lê Văn C', target: 'Vitamin tổng hợp cho chó', type: 'product', rating: 3, comment: 'Bình thường, không thấy hiệu quả rõ rệt.', date: '2024-12-14', visible: true },
  { id: '4', user: 'Phạm Thị D', target: 'Khám sức khoẻ', type: 'service', rating: 5, comment: 'Bác sĩ rất tận tâm, chuyên nghiệp!', date: '2024-12-15', visible: true },
  { id: '5', user: 'Hoàng Văn E', target: 'Balo vận chuyển', type: 'product', rating: 2, comment: 'Chất lượng không như mô tả, hơi thất vọng.', date: '2024-12-16', visible: false },
];

export const AdminReviews: React.FC = () => {
  const [items, setItems] = useState(INIT);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? items : filter === 'product' ? items.filter(r => r.type === 'product') : filter === 'service' ? items.filter(r => r.type === 'service') : items.filter(r => !r.visible);
  const toggle = (id: string) => setItems(prev => prev.map(r => r.id === id ? { ...r, visible: !r.visible } : r));
  const remove = (id: string) => { if (confirm('Xóa đánh giá này?')) setItems(prev => prev.filter(r => r.id !== id)); };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1e1b4b', margin: 0 }}>⭐ Quản lý đánh giá</h1>
        <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Tổng: {items.length} đánh giá</span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['all', 'Tất cả'], ['product', 'Sản phẩm'], ['service', 'Dịch vụ'], ['hidden', 'Đã ẩn']].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            style={{ padding: '7px 16px', borderRadius: 20, border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
              background: filter === k ? '#1e1b4b' : '#f3f4f6', color: filter === k ? '#fff' : '#374151' }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(r => (
          <div key={r.id} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', opacity: r.visible ? 1 : 0.6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: '#1e1b4b' }}>{r.user}</span>
                  <span style={{ background: r.type === 'product' ? '#fef3c7' : '#dbeafe', color: r.type === 'product' ? '#d97706' : '#2563eb', padding: '2px 8px', borderRadius: 5, fontSize: '0.75rem', fontWeight: 600 }}>
                    {r.type === 'product' ? '🛍️ Sản phẩm' : '✂️ Dịch vụ'}
                  </span>
                  <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>{r.date}</span>
                  {!r.visible && <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: 5, fontSize: '0.75rem', fontWeight: 600 }}>Đã ẩn</span>}
                </div>
                <div style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: 6 }}>📦 {r.target}</div>
                <div style={{ color: '#f59e0b', marginBottom: 6 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <div style={{ color: '#374151', fontSize: '0.9rem' }}>{r.comment}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 16 }}>
                <button onClick={() => toggle(r.id)}
                  style={{ background: r.visible ? '#fef3c7' : '#dcfce7', color: r.visible ? '#d97706' : '#16a34a', border: 'none', padding: '5px 12px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
                  {r.visible ? 'Ẩn' : 'Hiện'}
                </button>
                <button onClick={() => remove(r.id)}
                  style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '5px 12px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
