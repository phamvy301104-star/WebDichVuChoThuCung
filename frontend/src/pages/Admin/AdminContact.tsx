import React, { useState } from 'react';

interface Contact { id: string; name: string; email: string; phone: string; subject: string; message: string; date: string; read: boolean; replied: boolean; }

const INIT: Contact[] = [
  { id: '1', name: 'Nguyễn Văn A', email: 'a@gmail.com', phone: '0901234567', subject: 'Hỏi về dịch vụ tắm', message: 'Cho tôi hỏi dịch vụ tắm cho chó lớn giá bao nhiêu?', date: '2024-12-15', read: false, replied: false },
  { id: '2', name: 'Trần Thị B', email: 'b@gmail.com', phone: '0912345678', subject: 'Đặt lịch khám', message: 'Tôi muốn đặt lịch khám cho mèo vào thứ 7 tuần này được không?', date: '2024-12-16', read: true, replied: false },
  { id: '3', name: 'Lê Văn C', email: 'c@gmail.com', phone: '0923456789', subject: 'Phản hồi dịch vụ', message: 'Dịch vụ rất tốt, nhân viên thân thiện. Tôi sẽ quay lại!', date: '2024-12-17', read: true, replied: true },
  { id: '4', name: 'Phạm Thị D', email: 'd@gmail.com', phone: '0934567890', subject: 'Hỏi về sản phẩm', message: 'Thức ăn Royal Canin có phù hợp cho mèo 3 tháng tuổi không?', date: '2024-12-18', read: false, replied: false },
];

export const AdminContact: React.FC = () => {
  const [items, setItems] = useState(INIT);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [reply, setReply] = useState('');

  const markRead = (id: string) => setItems(prev => prev.map(c => c.id === id ? { ...c, read: true } : c));
  const handleSelect = (c: Contact) => { setSelected(c); markRead(c.id); setReply(''); };
  const sendReply = () => {
    if (!reply.trim() || !selected) return;
    setItems(prev => prev.map(c => c.id === selected.id ? { ...c, replied: true } : c));
    setSelected(prev => prev ? { ...prev, replied: true } : null);
    setReply('');
    alert('Đã gửi phản hồi!');
  };
  const remove = (id: string) => { setItems(prev => prev.filter(c => c.id !== id)); if (selected?.id === id) setSelected(null); };

  const unread = items.filter(c => !c.read).length;

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1e1b4b', margin: 0 }}>
          💬 Liên hệ {unread > 0 && <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.75rem', padding: '2px 8px', borderRadius: 20, marginLeft: 8 }}>{unread} mới</span>}
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, height: 600 }}>
        {/* Danh sách */}
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'auto' }}>
          {items.map(c => (
            <div key={c.id} onClick={() => handleSelect(c)}
              style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', background: selected?.id === c.id ? '#f0fdf4' : !c.read ? '#fefce8' : '#fff', borderLeft: selected?.id === c.id ? '3px solid #3BB77E' : '3px solid transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: c.read ? 600 : 800, color: '#1e1b4b', fontSize: '0.9rem' }}>{c.name}</span>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{c.date}</span>
              </div>
              <div style={{ fontWeight: 600, color: '#374151', fontSize: '0.85rem', marginBottom: 2 }}>{c.subject}</div>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.message}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                {!c.read && <span style={{ background: '#fef3c7', color: '#d97706', padding: '1px 6px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700 }}>Mới</span>}
                {c.replied && <span style={{ background: '#dcfce7', color: '#16a34a', padding: '1px 6px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700 }}>Đã trả lời</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Chi tiết */}
        {selected ? (
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 24, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontWeight: 800, color: '#1e1b4b', margin: '0 0 4px' }}>{selected.subject}</h3>
                <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{selected.name} · {selected.email} · {selected.phone} · {selected.date}</div>
              </div>
              <button onClick={() => remove(selected.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>Xóa</button>
            </div>
            <div style={{ background: '#f9fafb', borderRadius: 10, padding: 16, marginBottom: 20, flex: 1, color: '#374151', lineHeight: 1.7 }}>
              {selected.message}
            </div>
            {!selected.replied ? (
              <div>
                <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Nhập nội dung phản hồi..." rows={4}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb', resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: 10 }} />
                <button onClick={sendReply} style={{ background: 'linear-gradient(135deg,#3BB77E,#2D9B6A)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                  Gửi phản hồi
                </button>
              </div>
            ) : (
              <div style={{ background: '#dcfce7', borderRadius: 8, padding: '12px 16px', color: '#16a34a', fontWeight: 600 }}>✅ Đã gửi phản hồi cho khách hàng</div>
            )}
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '1rem' }}>
            Chọn một tin nhắn để xem chi tiết
          </div>
        )}
      </div>
    </div>
  );
};
