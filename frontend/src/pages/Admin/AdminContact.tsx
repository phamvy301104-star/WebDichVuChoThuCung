import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { markRead, replyMessage, deleteMessage, ContactMessage } from '@stores/slices/contactSlice';

const STATUS_MAP = {
  new:     { label: '🔴 Mới',        color: '#991b1b', bg: '#fee2e2' },
  read:    { label: '🟡 Đã đọc',     color: '#92400e', bg: '#fef3c7' },
  replied: { label: '🟢 Đã trả lời', color: '#166534', bg: '#dcfce7' },
};

const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 };

export const AdminContact: React.FC = () => {
  const dispatch = useDispatch();
  const { messages } = useSelector((s: RootState) => s.contact);
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [del, setDel] = useState<string | null>(null);

  const filtered = messages.filter(m => !filterStatus || m.status === filterStatus);
  const newCount = messages.filter(m => m.status === 'new').length;

  const openMsg = (m: ContactMessage) => {
    setSelected(m);
    setReplyText(m.reply || '');
    if (m.status === 'new') dispatch(markRead(m.id));
  };

  const sendReply = () => {
    if (!replyText.trim()) return alert('Vui lòng nhập nội dung trả lời.');
    dispatch(replyMessage({ id: selected!.id, reply: replyText }));
    setSelected(prev => prev ? { ...prev, status: 'replied', reply: replyText } : null);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">💬 Quản lý liên hệ</h1>
          <p className="admin-page-sub">Tổng {messages.length} tin nhắn {newCount > 0 && <span style={{ color: '#ef4444', fontWeight: 700 }}>· {newCount} tin mới chưa đọc</span>}</p>
        </div>
      </div>

      <div className="ap-card">
        <div className="ap-filters">
          <select className="ap-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <table className="admin-table">
          <thead><tr><th>Người gửi</th><th>Chủ đề</th><th>Nội dung</th><th>Ngày gửi</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
          <tbody>
            {filtered.map(m => {
              const st = STATUS_MAP[m.status];
              return (
                <tr key={m.id} style={{ background: m.status === 'new' ? '#fffbeb' : undefined }}>
                  <td>
                    <div style={{ fontWeight: m.status === 'new' ? 800 : 600 }}>{m.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{m.email}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{m.phone}</div>
                  </td>
                  <td><span className="ap-tag">{m.subject}</span></td>
                  <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#555', fontSize: '0.87rem' }}>{m.message}</td>
                  <td style={{ fontSize: '0.8rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>{new Date(m.createdAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                  <td><span style={{ padding: '3px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700, color: st.color, background: st.bg }}>{st.label}</span></td>
                  <td>
                    <div className="ap-actions">
                      <button className="ap-action-btn" title="Xem & Trả lời" onClick={() => openMsg(m)}>💬</button>
                      <button className="ap-action-btn ap-action-del" title="Xóa" onClick={() => setDel(m.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="ap-empty">Không có tin nhắn nào</div>}
      </div>

      {/* Delete confirm */}
      {del && (<div style={overlay}><div style={{ background:'#fff', borderRadius:16, padding:24, width:400, boxShadow:'0 20px 60px rgba(0,0,0,.2)' }}>
        <h3 style={{ marginBottom:12 }}>⚠️ Xóa tin nhắn?</h3>
        <p style={{ color:'#6b7280', marginBottom:20 }}>Hành động này không thể hoàn tác.</p>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button className="ap-btn ap-btn-ghost" onClick={() => setDel(null)}>Hủy</button>
          <button className="ap-btn" style={{ background:'#ef4444', color:'#fff' }} onClick={() => { dispatch(deleteMessage(del)); setDel(null); if (selected?.id === del) setSelected(null); }}>Xóa</button>
        </div>
      </div></div>)}

      {/* Message detail + reply modal */}
      {selected && (
        <div style={overlay} onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div style={{ background:'#fff', borderRadius:20, padding:28, width:580, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 64px rgba(0,0,0,.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h3 style={{ margin:0, fontWeight:800 }}>💬 Chi tiết tin nhắn</h3>
              <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', fontSize:'1.4rem', cursor:'pointer', color:'#9ca3af' }}>✕</button>
            </div>

            {/* Sender info */}
            <div style={{ background:'#f9fafb', borderRadius:12, padding:'14px 18px', marginBottom:16 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {[['Người gửi', selected.name], ['Email', selected.email], ['Điện thoại', selected.phone || '—'], ['Ngày gửi', new Date(selected.createdAt).toLocaleString('vi-VN')]].map(([k,v]) => (
                  <div key={k as string}><div style={{ fontSize:'0.72rem', color:'#9ca3af' }}>{k}</div><div style={{ fontWeight:600, fontSize:'0.88rem' }}>{v}</div></div>
                ))}
              </div>
            </div>

            {/* Subject + message */}
            <div style={{ marginBottom:16 }}>
              <div style={{ display:'inline-block', marginBottom:10 }}><span className="ap-tag">{selected.subject}</span></div>
              <div style={{ background:'#faf9f7', borderRadius:12, padding:'14px 18px', lineHeight:1.7, color:'#374151', fontSize:'0.9rem', whiteSpace:'pre-wrap' }}>{selected.message}</div>
            </div>

            {/* Previous reply */}
            {selected.status === 'replied' && selected.reply && (
              <div style={{ background:'#f0fdf4', borderRadius:12, padding:'14px 18px', marginBottom:16, border:'1px solid #bbf7d0' }}>
                <div style={{ fontSize:'0.75rem', fontWeight:700, color:'#166534', marginBottom:6 }}>✅ Đã trả lời:</div>
                <div style={{ color:'#374151', fontSize:'0.88rem', lineHeight:1.7, whiteSpace:'pre-wrap' }}>{selected.reply}</div>
              </div>
            )}

            {/* Reply form */}
            <div>
              <label style={{ display:'block', fontWeight:700, marginBottom:8, fontSize:'0.9rem' }}>📝 {selected.status === 'replied' ? 'Cập nhật trả lời' : 'Trả lời khách hàng'}</label>
              <textarea className="ap-input" rows={4} value={replyText} onChange={e => setReplyText(e.target.value)}
                placeholder={`Trả lời ${selected.name} về: ${selected.subject}...`} style={{ marginBottom:12 }} />
              <div style={{ display:'flex', gap:10 }}>
                <button className="ap-btn ap-btn-ghost" onClick={() => setSelected(null)}>Đóng</button>
                <button className="ap-btn ap-btn-primary" style={{ flex:1 }} onClick={sendReply}>
                  📤 {selected.status === 'replied' ? 'Cập nhật trả lời' : 'Gửi trả lời'}
                </button>
              </div>
              <p style={{ fontSize:'0.75rem', color:'#9ca3af', marginTop:8 }}>💡 Trong hệ thống thực, tin nhắn này sẽ được gửi qua email đến {selected.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};