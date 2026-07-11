import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { approveReview, rejectReview, replyReview, deleteReview, Review } from '@stores/slices/reviewsSlice';

const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5-n);
const STATUS = {
  pending:  { l:'⏳ Chờ duyệt', c:'#92400e', bg:'#fef3c7' },
  approved: { l:'✅ Đã duyệt',  c:'#166534', bg:'#dcfce7' },
  rejected: { l:'❌ Từ chối',   c:'#991b1b', bg:'#fee2e2' },
};
const overlay: React.CSSProperties = { position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:16 };

export const AdminReviews: React.FC = () => {
  const dispatch = useDispatch();
  const { reviews } = useSelector((s: RootState) => s.reviews);
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState<Review|null>(null);
  const [replyText, setReplyText] = useState('');
  const [del, setDel] = useState<string|null>(null);

  const filtered = reviews.filter(r => !filterStatus || r.status === filterStatus);
  const pendingCount = reviews.filter(r => r.status === 'pending').length;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">⭐ Quản lý đánh giá</h1><p className="admin-page-sub">Tổng {reviews.length} đánh giá {pendingCount>0&&<span style={{color:'#f59e0b',fontWeight:700}}>· {pendingCount} chờ duyệt</span>}</p></div>
      </div>
      <div className="ap-card">
        <div className="ap-filters">
          <select className="ap-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="">Tất cả</option>
            {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}
          </select>
        </div>
        <table className="admin-table">
          <thead><tr><th>Người đánh giá</th><th>Sản phẩm</th><th>Điểm</th><th>Tiêu đề</th><th>Ngày</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
          <tbody>
            {filtered.map(r => {
              const s = STATUS[r.status];
              return (
                <tr key={r.id} style={{background:r.status==='pending'?'#fffbeb':undefined}}>
                  <td><div style={{fontWeight:r.status==='pending'?800:600}}>{r.userName}</div><div style={{fontSize:'0.75rem',color:'#9ca3af'}}>{r.userEmail}</div></td>
                  <td style={{maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'0.85rem'}}>{r.productName}</td>
                  <td><span style={{color:'#f59e0b',fontSize:'0.9rem'}}>{stars(r.rating)}</span><div style={{fontSize:'0.72rem',color:'#9ca3af'}}>{r.rating}/5 sao</div></td>
                  <td style={{maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'0.85rem',fontWeight:600}}>{r.title}</td>
                  <td style={{fontSize:'0.78rem',color:'#9ca3af',whiteSpace:'nowrap'}}>{new Date(r.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td><span style={{padding:'3px 10px',borderRadius:12,fontSize:'0.75rem',fontWeight:700,color:s.c,background:s.bg}}>{s.l}</span></td>
                  <td>
                    <div className="ap-actions">
                      <button className="ap-action-btn" onClick={()=>{setSelected(r);setReplyText(r.adminReply||'');}}>💬</button>
                      {r.status!=='approved'&&<button className="ap-action-btn" style={{background:'#dcfce7',color:'#166534'}} onClick={()=>dispatch(approveReview(r.id))}>✅</button>}
                      {r.status!=='rejected'&&<button className="ap-action-btn" style={{background:'#fee2e2',color:'#991b1b'}} onClick={()=>dispatch(rejectReview(r.id))}>❌</button>}
                      <button className="ap-action-btn ap-action-del" onClick={()=>setDel(r.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length===0&&<div className="ap-empty">Không có đánh giá nào</div>}
      </div>

      {del&&(<div style={overlay}><div style={{background:'#fff',borderRadius:16,padding:24,width:380,boxShadow:'0 20px 60px rgba(0,0,0,.2)'}}><h3 style={{marginBottom:12}}>⚠️ Xóa đánh giá?</h3><p style={{color:'#6b7280',marginBottom:20}}>Hành động này không thể hoàn tác.</p><div style={{display:'flex',gap:10,justifyContent:'flex-end'}}><button className="ap-btn ap-btn-ghost" onClick={()=>setDel(null)}>Hủy</button><button className="ap-btn" style={{background:'#ef4444',color:'#fff'}} onClick={()=>{dispatch(deleteReview(del));setDel(null);}}>Xóa</button></div></div></div>)}

      {selected&&(
        <div style={overlay} onClick={e=>{if(e.target===e.currentTarget)setSelected(null);}}>
          <div style={{background:'#fff',borderRadius:20,padding:28,width:540,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 64px rgba(0,0,0,.2)'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}><h3 style={{margin:0,fontWeight:800}}>⭐ Chi tiết đánh giá</h3><button onClick={()=>setSelected(null)} style={{background:'none',border:'none',fontSize:'1.4rem',cursor:'pointer',color:'#9ca3af'}}>✕</button></div>
            <div style={{background:'#f9fafb',borderRadius:12,padding:'14px 18px',marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                <div><div style={{fontWeight:700}}>{selected.userName}</div><div style={{fontSize:'0.78rem',color:'#9ca3af'}}>{selected.userEmail}</div></div>
                <div style={{textAlign:'right'}}><div style={{color:'#f59e0b',fontSize:'1.1rem'}}>{stars(selected.rating)}</div><div style={{fontSize:'0.75rem',color:'#9ca3af'}}>{new Date(selected.createdAt).toLocaleString('vi-VN')}</div></div>
              </div>
              <div style={{fontSize:'0.8rem',color:'#888',marginBottom:10}}>Sản phẩm: <b>{selected.productName}</b></div>
              <div style={{fontWeight:700,marginBottom:6}}>{selected.title}</div>
              <div style={{color:'#555',lineHeight:1.7,fontSize:'0.88rem'}}>{selected.comment}</div>
            </div>
            {selected.adminReply&&<div style={{background:'#f0fdf4',borderRadius:12,padding:'12px 16px',marginBottom:16,border:'1px solid #bbf7d0'}}><div style={{fontSize:'0.75rem',fontWeight:700,color:'#166534',marginBottom:4}}>✅ Phản hồi admin:</div><div style={{fontSize:'0.88rem',color:'#374151'}}>{selected.adminReply}</div></div>}
            <div>
              <label style={{display:'block',fontWeight:700,marginBottom:8,fontSize:'0.9rem'}}>📝 {selected.adminReply?'Cập nhật phản hồi':'Phản hồi đánh giá'}</label>
              <textarea className="ap-input" rows={3} value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Cảm ơn bạn đã đánh giá..." style={{marginBottom:12}} />
              <div style={{display:'flex',gap:10}}>
                <button className="ap-btn ap-btn-ghost" onClick={()=>setSelected(null)}>Đóng</button>
                {selected.status!=='approved'&&<button className="ap-btn" style={{background:'#dcfce7',color:'#166534',fontWeight:700}} onClick={()=>{dispatch(approveReview(selected.id));setSelected({...selected,status:'approved'});}}>✅ Duyệt</button>}
                <button className="ap-btn ap-btn-primary" style={{flex:1}} onClick={()=>{dispatch(replyReview({id:selected.id,reply:replyText}));setSelected({...selected,adminReply:replyText,status:'approved'});}}>📤 Lưu phản hồi</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};