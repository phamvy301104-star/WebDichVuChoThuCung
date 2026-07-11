import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { addService, updateService, deleteService, BookingService } from '@stores/slices/bookingSlice';

const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 };
const EMPTY: Omit<BookingService, 'id'> = { name:'', category:'Spa', price:0, duration:60, petTypes:['Chó','Mèo'], image:'', description:'', status:'active' };
const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

export const AdminServices: React.FC = () => {
  const dispatch = useDispatch();
  const { services } = useSelector((s: RootState) => s.booking);
  const [modal, setModal] = useState<{open:boolean; mode:'add'|'edit'|'view'; data?: BookingService}>({open:false,mode:'add'});
  const [form, setForm] = useState<Omit<BookingService,'id'>>({...EMPTY});
  const [del, setDel] = useState<string|null>(null);

  const open = (mode: 'add'|'edit'|'view', d?: BookingService) => {
    if (d) { const {id, ...rest} = d; setForm(rest); } else setForm({...EMPTY});
    setModal({open:true,mode,data:d});
  };
  const close = () => setModal({open:false,mode:'add'});
  const save = () => {
    if (!form.name || !form.price) return alert('Vui lòng nhập tên và giá dịch vụ.');
    if (modal.mode==='add') dispatch(addService(form));
    else if (modal.data) dispatch(updateService({id:modal.data.id,...form}));
    close();
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">✂️ Quản lý dịch vụ</h1><p className="admin-page-sub">Tổng {services.length} dịch vụ</p></div>
        <button className="ap-btn ap-btn-primary" onClick={() => open('add')}>+ Thêm dịch vụ</button>
      </div>
      <div className="ap-card">
        <table className="admin-table">
          <thead><tr><th>Ảnh</th><th>Tên dịch vụ</th><th>Danh mục</th><th>Giá</th><th>Thời gian</th><th>Loài</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id}>
                <td>{s.image ? <img src={s.image} alt={s.name} style={{width:52,height:52,objectFit:'cover',borderRadius:8}} /> : <div style={{width:52,height:52,background:'#f0ebe4',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem'}}>✂️</div>}</td>
                <td style={{fontWeight:600}}>{s.name}</td>
                <td><span className="ap-tag">{s.category}</span></td>
                <td><b style={{color:'#c7603a'}}>{fmt(s.price)}</b></td>
                <td>{s.duration} phút</td>
                <td style={{fontSize:'0.82rem',color:'#6b7280'}}>{s.petTypes.join(', ')}</td>
                <td><span style={{padding:'3px 10px',borderRadius:12,fontSize:'0.78rem',fontWeight:600,color:s.status==='active'?'#166534':'#991b1b',background:s.status==='active'?'#dcfce7':'#fee2e2'}}>{s.status==='active'?'Đang cung cấp':'Tạm dừng'}</span></td>
                <td><div className="ap-actions">
                  <button className="ap-action-btn" onClick={() => open('view', s)}>👁️</button>
                  <button className="ap-action-btn" onClick={() => open('edit', s)}>✏️</button>
                  <button className="ap-action-btn ap-action-del" onClick={() => setDel(s.id)}>🗑️</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {del && (<div style={overlay}><div style={{background:'#fff',borderRadius:16,padding:24,width:400,boxShadow:'0 20px 60px rgba(0,0,0,.2)'}}><h3 style={{marginBottom:12}}>⚠️ Xóa dịch vụ?</h3><p style={{color:'#6b7280',marginBottom:20}}>Các lịch hẹn đã đặt sẽ không bị ảnh hưởng.</p><div style={{display:'flex',gap:10,justifyContent:'flex-end'}}><button className="ap-btn ap-btn-ghost" onClick={() => setDel(null)}>Hủy</button><button className="ap-btn" style={{background:'#ef4444',color:'#fff'}} onClick={() => { dispatch(deleteService(del)); setDel(null); }}>Xóa</button></div></div></div>)}

      {modal.open && (
        <div style={overlay} onClick={e => { if (e.target === e.currentTarget) close(); }}>
          <div style={{background:'#fff',borderRadius:16,padding:24,width:580,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,.2)'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
              <h3 style={{margin:0}}>{modal.mode==='add'?'➕ Thêm dịch vụ':modal.mode==='edit'?'✏️ Sửa dịch vụ':'👁️ Chi tiết dịch vụ'}</h3>
              <button onClick={close} style={{background:'none',border:'none',fontSize:'1.4rem',cursor:'pointer'}}>✕</button>
            </div>
            {modal.mode==='view' && modal.data ? (
              <div>
                {modal.data.image && <img src={modal.data.image} alt={modal.data.name} style={{width:'100%',height:200,objectFit:'cover',borderRadius:10,marginBottom:16}} />}
                <h2 style={{marginBottom:12}}>{modal.data.name}</h2>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:12}}>
                  {[['Danh mục',modal.data.category],['Giá',fmt(modal.data.price)],['Thời gian',modal.data.duration+' phút'],['Loài',modal.data.petTypes.join(', ')]].map(([k,v]) => (
                    <div key={k as string} style={{background:'#f9fafb',padding:'10px 14px',borderRadius:8}}><div style={{fontSize:'0.75rem',color:'#9ca3af'}}>{k}</div><div style={{fontWeight:600}}>{v}</div></div>
                  ))}
                </div>
                <p style={{color:'#555',lineHeight:1.6}}>{modal.data.description}</p>
              </div>
            ) : (
              <div className="ap-form-row">
                <div className="ap-form-group ap-form-full"><label>Tên dịch vụ *</label><input className="ap-input" value={form.name} onChange={e => setForm({...form,name:e.target.value})} /></div>
                <div className="ap-form-group"><label>Danh mục</label>
                  <select className="ap-input" value={form.category} onChange={e => setForm({...form,category:e.target.value})}>
                    <option>Spa</option><option>Y tế</option><option>Khác</option>
                  </select>
                </div>
                <div className="ap-form-group"><label>Giá (VND) *</label><input className="ap-input" type="number" value={form.price||''} onChange={e => setForm({...form,price:+e.target.value})} /></div>
                <div className="ap-form-group"><label>Thời gian (phút)</label><input className="ap-input" type="number" value={form.duration||''} onChange={e => setForm({...form,duration:+e.target.value})} /></div>
                <div className="ap-form-group"><label>Trạng thái</label>
                  <select className="ap-input" value={form.status} onChange={e => setForm({...form,status:e.target.value as any})}>
                    <option value="active">Đang cung cấp</option><option value="inactive">Tạm dừng</option>
                  </select>
                </div>
                <div className="ap-form-group ap-form-full"><label>URL ảnh</label><input className="ap-input" value={form.image} onChange={e => setForm({...form,image:e.target.value})} placeholder="https://images.unsplash.com/..." /></div>
                {form.image && <div className="ap-form-group"><label>Xem trước</label><img src={form.image} alt="preview" style={{width:'100%',height:100,objectFit:'cover',borderRadius:8}} /></div>}
                <div className="ap-form-group ap-form-full"><label>Mô tả</label><textarea className="ap-input" rows={3} value={form.description} onChange={e => setForm({...form,description:e.target.value})} /></div>
                <div className="ap-form-group ap-form-full"><div className="ap-form-actions"><button className="ap-btn ap-btn-primary" onClick={save}>{modal.mode==='add'?'Thêm dịch vụ':'Lưu thay đổi'}</button><button className="ap-btn ap-btn-ghost" onClick={close}>Hủy</button></div></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};