import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { addUser, updateUser, toggleUserStatus, deleteUser, AdminUser } from '@stores/slices/adminUsersSlice';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';
const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 };
const ROLE = { admin: { l:'👑 Admin', c:'#92400e', bg:'#fef3c7' }, staff: { l:'🔧 Nhân viên', c:'#1e40af', bg:'#dbeafe' }, user: { l:'👤 Thành viên', c:'#374151', bg:'#f3f4f6' } };
const EMPTY: Omit<AdminUser,'id'> = { name:'', email:'', phone:'', role:'user', status:'active', address:'', avatar:'', joinedAt: new Date().toISOString().split('T')[0], ordersCount:0, totalSpent:0, notes:'' };

export const AdminUsers: React.FC = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((s: RootState) => s.adminUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [modal, setModal] = useState<{open:boolean;mode:'add'|'edit'|'view';data?:AdminUser}>({open:false,mode:'add'});
  const [form, setForm] = useState<Omit<AdminUser,'id'>>({...EMPTY});
  const [del, setDel] = useState<string|null>(null);

  const filtered = users.filter(u =>
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
    (!filterRole || u.role === filterRole)
  );

  const open = (mode: 'add'|'edit'|'view', d?: AdminUser) => {
    if (d) { const {id,...r} = d; setForm(r); } else setForm({...EMPTY});
    setModal({open:true,mode,data:d});
  };
  const close = () => setModal({open:false,mode:'add'});
  const save = () => {
    if (!form.name || !form.email) return alert('Nhập tên và email.');
    if (modal.mode==='add') dispatch(addUser(form));
    else if (modal.data) dispatch(updateUser({id:modal.data.id,...form}));
    close();
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">👥 Quản lý tài khoản</h1><p className="admin-page-sub">Tổng {users.length} tài khoản · {users.filter(u=>u.status==='blocked').length} bị khóa</p></div>
        <button className="ap-btn ap-btn-primary" onClick={() => open('add')}>+ Thêm tài khoản</button>
      </div>
      <div className="ap-card">
        <div className="ap-filters">
          <input className="ap-search" placeholder="🔍 Tìm tên / email..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="ap-select" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
            <option value="">Tất cả vai trò</option>
            <option value="admin">Admin</option><option value="staff">Nhân viên</option><option value="user">Thành viên</option>
          </select>
        </div>
        <table className="admin-table">
          <thead><tr><th>Tài khoản</th><th>Vai trò</th><th>Điện thoại</th><th>Đơn hàng</th><th>Đã chi</th><th>Ngày tham gia</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
          <tbody>
            {filtered.map(u => {
              const role = ROLE[u.role];
              return (
                <tr key={u.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{width:38,height:38,borderRadius:'50%',background:'#f0ebe4',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'1rem',color:'#8b5e3c',flexShrink:0}}>
                        {u.name.charAt(0)}
                      </div>
                      <div><div style={{fontWeight:700}}>{u.name}</div><div style={{fontSize:'0.75rem',color:'#9ca3af'}}>{u.email}</div></div>
                    </div>
                  </td>
                  <td><span style={{padding:'3px 10px',borderRadius:12,fontSize:'0.75rem',fontWeight:700,color:role.c,background:role.bg}}>{role.l}</span></td>
                  <td>{u.phone||'—'}</td>
                  <td>{u.ordersCount}</td>
                  <td><b style={{color:'#c7603a'}}>{fmt(u.totalSpent)}</b></td>
                  <td style={{fontSize:'0.8rem',color:'#9ca3af'}}>{u.joinedAt}</td>
                  <td><span style={{padding:'3px 10px',borderRadius:12,fontSize:'0.75rem',fontWeight:700,color:u.status==='active'?'#166534':'#991b1b',background:u.status==='active'?'#dcfce7':'#fee2e2'}}>{u.status==='active'?'Hoạt động':'Bị khóa'}</span></td>
                  <td>
                    <div className="ap-actions">
                      <button className="ap-action-btn" onClick={() => open('view',u)}>👁️</button>
                      <button className="ap-action-btn" onClick={() => open('edit',u)}>✏️</button>
                      <button className="ap-action-btn" style={{background:u.status==='active'?'#fee2e2':'#dcfce7',color:u.status==='active'?'#991b1b':'#166534'}} title={u.status==='active'?'Khóa':'Mở khóa'} onClick={() => dispatch(toggleUserStatus(u.id))}>{u.status==='active'?'🔒':'🔓'}</button>
                      {u.role!=='admin' && <button className="ap-action-btn ap-action-del" onClick={() => setDel(u.id)}>🗑️</button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length===0 && <div className="ap-empty">Không tìm thấy tài khoản</div>}
      </div>

      {del && (<div style={overlay}><div style={{background:'#fff',borderRadius:16,padding:24,width:400,boxShadow:'0 20px 60px rgba(0,0,0,.2)'}}>
        <h3 style={{marginBottom:12}}>⚠️ Xóa tài khoản?</h3><p style={{color:'#6b7280',marginBottom:20}}>Hành động này không thể hoàn tác.</p>
        <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}><button className="ap-btn ap-btn-ghost" onClick={()=>setDel(null)}>Hủy</button><button className="ap-btn" style={{background:'#ef4444',color:'#fff'}} onClick={()=>{dispatch(deleteUser(del));setDel(null);}}>Xóa</button></div>
      </div></div>)}

      {modal.open && (
        <div style={overlay} onClick={e=>{if(e.target===e.currentTarget)close();}}>
          <div style={{background:'#fff',borderRadius:20,padding:28,width:560,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 64px rgba(0,0,0,.2)'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:22}}>
              <h3 style={{margin:0,fontWeight:800}}>{modal.mode==='add'?'➕ Thêm tài khoản':modal.mode==='edit'?'✏️ Sửa tài khoản':'👁️ Chi tiết tài khoản'}</h3>
              <button onClick={close} style={{background:'none',border:'none',fontSize:'1.4rem',cursor:'pointer',color:'#9ca3af'}}>✕</button>
            </div>
            {modal.mode==='view' && modal.data ? (
              <div>
                <div style={{textAlign:'center',marginBottom:20}}>
                  <div style={{width:72,height:72,borderRadius:'50%',background:'#f0ebe4',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:'1.8rem',color:'#8b5e3c',margin:'0 auto 10px'}}>
                    {modal.data.name.charAt(0)}
                  </div>
                  <h2 style={{margin:'0 0 4px',fontWeight:900}}>{modal.data.name}</h2>
                  <p style={{color:'#888',margin:0}}>{modal.data.email}</p>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
                  {[['Vai trò',ROLE[modal.data.role].l],['Trạng thái',modal.data.status==='active'?'✅ Hoạt động':'🔒 Bị khóa'],['Điện thoại',modal.data.phone||'—'],['Ngày tham gia',modal.data.joinedAt],['Đơn hàng',String(modal.data.ordersCount)],['Tổng chi',fmt(modal.data.totalSpent)]].map(([k,v])=>(
                    <div key={k as string} style={{background:'#f9fafb',padding:'10px 14px',borderRadius:10}}><div style={{fontSize:'0.72rem',color:'#9ca3af'}}>{k}</div><div style={{fontWeight:600,fontSize:'0.88rem'}}>{v}</div></div>
                  ))}
                </div>
                {modal.data.address && <div style={{background:'#f9fafb',padding:'10px 14px',borderRadius:10,marginBottom:10}}><div style={{fontSize:'0.72rem',color:'#9ca3af'}}>Địa chỉ</div><div style={{fontWeight:600}}>{modal.data.address}</div></div>}
                {modal.data.notes && <div style={{background:'#fef3c7',padding:'10px 14px',borderRadius:10}}><div style={{fontSize:'0.72rem',color:'#92400e'}}>Ghi chú</div><div style={{fontWeight:600}}>{modal.data.notes}</div></div>}
              </div>
            ) : (
              <div className="ap-form-row">
                <div className="ap-form-group"><label>Họ và tên *</label><input className="ap-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                <div className="ap-form-group"><label>Email *</label><input className="ap-input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
                <div className="ap-form-group"><label>Điện thoại</label><input className="ap-input" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
                <div className="ap-form-group"><label>Vai trò</label>
                  <select className="ap-input" value={form.role} onChange={e=>setForm({...form,role:e.target.value as any})}>
                    <option value="user">👤 Thành viên</option><option value="staff">🔧 Nhân viên</option><option value="admin">👑 Admin</option>
                  </select>
                </div>
                <div className="ap-form-group"><label>Trạng thái</label>
                  <select className="ap-input" value={form.status} onChange={e=>setForm({...form,status:e.target.value as any})}>
                    <option value="active">✅ Hoạt động</option><option value="blocked">🔒 Khóa</option>
                  </select>
                </div>
                <div className="ap-form-group ap-form-full"><label>Địa chỉ</label><input className="ap-input" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} /></div>
                <div className="ap-form-group ap-form-full"><label>Ghi chú nội bộ</label><input className="ap-input" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Khách thân thiết, VIP..." /></div>
                <div className="ap-form-group ap-form-full"><div className="ap-form-actions"><button className="ap-btn ap-btn-primary" onClick={save}>{modal.mode==='add'?'Thêm tài khoản':'Lưu'}</button><button className="ap-btn ap-btn-ghost" onClick={close}>Hủy</button></div></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};