import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { addStaff, updateStaff, deleteStaff, Staff } from '@stores/slices/bookingSlice';

const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 };
const EMPTY: Omit<Staff, 'id'> = { name:'', role:'Groomer', phone:'', email:'', schedule:'', avatar:'', specialties:[], status:'active' };

export const AdminStaff: React.FC = () => {
  const dispatch = useDispatch();
  const { staff } = useSelector((s: RootState) => s.booking);
  const [modal, setModal] = useState<{open:boolean; data?: Staff}>({open:false});
  const [form, setForm] = useState<Omit<Staff,'id'>>({...EMPTY});
  const [del, setDel] = useState<string|null>(null);

  const open = (d?: Staff) => { if (d) { const {id,...r} = d; setForm(r); } else setForm({...EMPTY}); setModal({open:true,data:d}); };
  const close = () => setModal({open:false});
  const save = () => {
    if (!form.name) return alert('Nhập tên nhân viên');
    if (modal.data) dispatch(updateStaff({id:modal.data.id,...form}));
    else dispatch(addStaff(form));
    close();
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">👨‍💼 Quản lý nhân viên</h1><p className="admin-page-sub">Tổng {staff.length} nhân viên · {staff.filter(s=>s.status==='active').length} đang làm việc</p></div>
        <button className="ap-btn ap-btn-primary" onClick={() => open()}>+ Thêm nhân viên</button>
      </div>
      <div className="ap-card">
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}}>
          {staff.map(s => (
            <div key={s.id} style={{background:'#fff',borderRadius:16,padding:20,boxShadow:'0 2px 12px rgba(0,0,0,0.07)',border:'1px solid #f0ebe4',position:'relative'}}>
              <div style={{position:'absolute',top:12,right:12}}><span style={{padding:'3px 10px',borderRadius:12,fontSize:'0.72rem',fontWeight:600,color:s.status==='active'?'#166534':'#991b1b',background:s.status==='active'?'#dcfce7':'#fee2e2'}}>{s.status==='active'?'Đang làm':'Nghỉ'}</span></div>
              <div style={{display:'flex',gap:14,alignItems:'center',marginBottom:14}}>
                {s.avatar
                  ? <img src={s.avatar} alt={s.name} style={{width:60,height:60,objectFit:'cover',borderRadius:'50%',border:'3px solid #f0ebe4'}} onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                  : <div style={{width:60,height:60,borderRadius:'50%',background:'#1a1a1a',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',fontWeight:700}}>{s.name.charAt(0)}</div>
                }
                <div>
                  <div style={{fontWeight:800,color:'#1a1a1a',fontSize:'1rem'}}>{s.name}</div>
                  <div style={{color:'#c7603a',fontWeight:600,fontSize:'0.85rem'}}>{s.role}</div>
                </div>
              </div>
              <div style={{fontSize:'0.82rem',color:'#6b7280',marginBottom:4}}>📞 {s.phone}</div>
              <div style={{fontSize:'0.82rem',color:'#6b7280',marginBottom:4}}>⏰ {s.schedule}</div>
              {s.specialties.length > 0 && <div style={{display:'flex',gap:4,flexWrap:'wrap',marginTop:8}}>{s.specialties.map(sp => <span key={sp} style={{background:'#f0ebe4',color:'#8b5e3c',padding:'2px 8px',borderRadius:10,fontSize:'0.72rem',fontWeight:600}}>{sp}</span>)}</div>}
              <div style={{display:'flex',gap:8,marginTop:14}}>
                <button className="ap-action-btn" style={{flex:1,justifyContent:'center'}} onClick={() => open(s)}>✏️ Sửa</button>
                <button className="ap-action-btn ap-action-del" onClick={() => setDel(s.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {del && (<div style={overlay}><div style={{background:'#fff',borderRadius:16,padding:24,width:400,boxShadow:'0 20px 60px rgba(0,0,0,.2)'}}><h3 style={{marginBottom:12}}>⚠️ Xóa nhân viên?</h3><p style={{color:'#6b7280',marginBottom:20}}>Các lịch hẹn liên quan sẽ không bị ảnh hưởng.</p><div style={{display:'flex',gap:10,justifyContent:'flex-end'}}><button className="ap-btn ap-btn-ghost" onClick={() => setDel(null)}>Hủy</button><button className="ap-btn" style={{background:'#ef4444',color:'#fff'}} onClick={() => { dispatch(deleteStaff(del)); setDel(null); }}>Xóa</button></div></div></div>)}

      {modal.open && (
        <div style={overlay} onClick={e => { if (e.target === e.currentTarget) close(); }}>
          <div style={{background:'#fff',borderRadius:16,padding:24,width:520,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,.2)'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
              <h3 style={{margin:0}}>{modal.data?'✏️ Sửa nhân viên':'➕ Thêm nhân viên'}</h3>
              <button onClick={close} style={{background:'none',border:'none',fontSize:'1.4rem',cursor:'pointer'}}>✕</button>
            </div>
            <div className="ap-form-row">
              <div className="ap-form-group"><label>Họ và tên *</label><input className="ap-input" value={form.name} onChange={e => setForm({...form,name:e.target.value})} /></div>
              <div className="ap-form-group"><label>Vai trò</label>
                <select className="ap-input" value={form.role} onChange={e => setForm({...form,role:e.target.value})}>
                  {['Groomer chính','Groomer','Bác sĩ thú y','Kỹ thuật viên spa','Lễ tân & tư vấn'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="ap-form-group"><label>Điện thoại</label><input className="ap-input" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} /></div>
              <div className="ap-form-group"><label>Email</label><input className="ap-input" value={form.email} onChange={e => setForm({...form,email:e.target.value})} /></div>
              <div className="ap-form-group ap-form-full"><label>Lịch làm việc</label><input className="ap-input" value={form.schedule} onChange={e => setForm({...form,schedule:e.target.value})} placeholder="VD: Thứ 2 – Thứ 7 · 08:00–17:00" /></div>
              <div className="ap-form-group ap-form-full"><label>URL ảnh đại diện</label><input className="ap-input" value={form.avatar} onChange={e => setForm({...form,avatar:e.target.value})} placeholder="https://images.unsplash.com/..." /></div>
              <div className="ap-form-group ap-form-full"><label>Chuyên môn (cách nhau bằng dấu phẩy)</label><input className="ap-input" value={form.specialties.join(', ')} onChange={e => setForm({...form,specialties:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} placeholder="Spa, Cắt lông, Khám bệnh" /></div>
              <div className="ap-form-group"><label>Trạng thái</label>
                <select className="ap-input" value={form.status} onChange={e => setForm({...form,status:e.target.value as any})}>
                  <option value="active">Đang làm việc</option><option value="inactive">Nghỉ việc</option>
                </select>
              </div>
              <div className="ap-form-group ap-form-full"><div className="ap-form-actions"><button className="ap-btn ap-btn-primary" onClick={save}>{modal.data?'Lưu thay đổi':'Thêm nhân viên'}</button><button className="ap-btn ap-btn-ghost" onClick={close}>Hủy</button></div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};