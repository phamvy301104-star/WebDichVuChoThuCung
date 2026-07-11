import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { updateAppointmentStatus, deleteAppointment, bookAppointment, Appointment } from '@stores/slices/bookingSlice';

const STATUS_MAP: Record<Appointment['status'], { label: string; color: string; bg: string }> = {
  pending:   { label: 'Chờ xác nhận', color: '#92400e', bg: '#fef3c7' },
  confirmed: { label: 'Đã xác nhận',  color: '#1e40af', bg: '#dbeafe' },
  completed: { label: 'Hoàn thành',   color: '#166534', bg: '#dcfce7' },
  cancelled: { label: 'Đã hủy',       color: '#991b1b', bg: '#fee2e2' },
};
const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 };

const EMPTY_FORM = { customerName:'', customerEmail:'', customerPhone:'', petName:'', petType:'Chó', serviceId:'', serviceName:'', staffId:'', staffName:'', date:'', time:'', note:'' };

export const AdminAppointments: React.FC = () => {
  const dispatch = useDispatch();
  const { appointments, services, staff } = useSelector((s: RootState) => s.booking);
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [delId, setDelId] = useState<string | null>(null);

  const filtered = appointments.filter(a => !filterStatus || a.status === filterStatus);
  const badge = (s: Appointment['status']) => { const m = STATUS_MAP[s]; return <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: '0.78rem', fontWeight: 600, color: m.color, background: m.bg }}>{m.label}</span>; };
  const next: Partial<Record<Appointment['status'], Appointment['status']>> = { pending: 'confirmed', confirmed: 'completed' };

  const handleAdd = () => {
    if (!form.customerName || !form.date || !form.serviceId) return alert('Vui lòng điền tên, dịch vụ và ngày hẹn.');
    const svc = services.find(s => s.id === form.serviceId);
    const st  = staff.find(s => s.id === form.staffId);
    dispatch(bookAppointment({ ...form, serviceName: svc?.name || '', staffName: st?.name || '', status: 'pending' }));
    setShowAdd(false); setForm({ ...EMPTY_FORM });
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">📅 Quản lý lịch hẹn</h1><p className="admin-page-sub">Tổng {appointments.length} lịch · {appointments.filter(a => a.status === 'pending').length} chờ xác nhận</p></div>
        <button className="ap-btn ap-btn-primary" onClick={() => setShowAdd(true)}>+ Tạo lịch hẹn</button>
      </div>
      <div className="ap-card">
        <div className="ap-filters">
          <select className="ap-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <table className="admin-table">
          <thead><tr><th>Mã</th><th>Khách hàng</th><th>Thú cưng</th><th>Dịch vụ</th><th>Nhân viên</th><th>Ngày & Giờ</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td><b>{a.id}</b></td>
                <td><div style={{fontWeight:600}}>{a.customerName}</div><div style={{fontSize:'0.78rem',color:'#6b7280'}}>{a.customerPhone}</div></td>
                <td>{a.petName} <span style={{color:'#9ca3af',fontSize:'0.78rem'}}>({a.petType})</span></td>
                <td><span className="ap-tag">{a.serviceName}</span></td>
                <td>{a.staffName}</td>
                <td><b>{a.date}</b> <span style={{color:'#6b7280'}}>{a.time}</span></td>
                <td>{badge(a.status)}</td>
                <td>
                  <div className="ap-actions">
                    <button className="ap-action-btn" onClick={() => setSelected(a)}>👁️</button>
                    {next[a.status] && <button className="ap-action-btn" style={{background:'#dcfce7',color:'#166534'}} onClick={() => dispatch(updateAppointmentStatus({ id: a.id, status: next[a.status]! }))}>{next[a.status] === 'confirmed' ? '✅' : '🏁'}</button>}
                    {a.status === 'pending' && <button className="ap-action-btn ap-action-del" onClick={() => dispatch(updateAppointmentStatus({ id: a.id, status: 'cancelled' }))}>❌</button>}
                    <button className="ap-action-btn ap-action-del" onClick={() => setDelId(a.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="ap-empty">Không có lịch hẹn nào</div>}
      </div>

      {delId && (<div style={overlay}><div style={{background:'#fff',borderRadius:16,padding:24,width:400,boxShadow:'0 20px 60px rgba(0,0,0,.2)'}}><h3 style={{marginBottom:12}}>⚠️ Xóa lịch hẹn?</h3><p style={{color:'#6b7280',marginBottom:20}}>Hành động này không thể hoàn tác.</p><div style={{display:'flex',gap:10,justifyContent:'flex-end'}}><button className="ap-btn ap-btn-ghost" onClick={() => setDelId(null)}>Hủy</button><button className="ap-btn" style={{background:'#ef4444',color:'#fff'}} onClick={() => { dispatch(deleteAppointment(delId)); setDelId(null); }}>Xóa</button></div></div></div>)}

      {selected && (
        <div style={overlay} onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div style={{background:'#fff',borderRadius:16,padding:24,width:540,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,.2)'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}><h3 style={{margin:0}}>📋 Chi tiết lịch hẹn #{selected.id}</h3><button onClick={() => setSelected(null)} style={{background:'none',border:'none',fontSize:'1.4rem',cursor:'pointer'}}>✕</button></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
              {[['Khách hàng', selected.customerName],['Email', selected.customerEmail],['Điện thoại', selected.customerPhone],['Thú cưng', `${selected.petName} (${selected.petType})`],['Dịch vụ', selected.serviceName],['Nhân viên', selected.staffName],['Ngày hẹn', selected.date],['Giờ hẹn', selected.time],['Ghi chú', selected.note || '—']].map(([k,v]) => (
                <div key={k as string} style={{background:'#f9fafb',padding:'10px 14px',borderRadius:8}}><div style={{fontSize:'0.75rem',color:'#9ca3af'}}>{k}</div><div style={{fontWeight:600}}>{v}</div></div>
              ))}
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
              <div>Trạng thái: {badge(selected.status)}</div>
              <div style={{display:'flex',gap:8}}>
                {next[selected.status] && <button className="ap-btn ap-btn-primary" onClick={() => { dispatch(updateAppointmentStatus({id:selected.id,status:next[selected.status]!})); setSelected({...selected,status:next[selected.status]!}); }}>{next[selected.status]==='confirmed'?'✅ Xác nhận':'🏁 Hoàn thành'}</button>}
                {selected.status==='pending' && <button className="ap-btn" style={{background:'#fee2e2',color:'#991b1b'}} onClick={() => { dispatch(updateAppointmentStatus({id:selected.id,status:'cancelled'})); setSelected({...selected,status:'cancelled'}); }}>❌ Hủy lịch</button>}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <div style={overlay} onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }}>
          <div style={{background:'#fff',borderRadius:16,padding:24,width:560,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,.2)'}}>
            <h3 style={{marginBottom:20}}>➕ Tạo lịch hẹn mới</h3>
            <div className="ap-form-row">
              <div className="ap-form-group"><label>Tên khách hàng *</label><input className="ap-input" value={form.customerName} onChange={e => setForm({...form,customerName:e.target.value})} /></div>
              <div className="ap-form-group"><label>Điện thoại</label><input className="ap-input" value={form.customerPhone} onChange={e => setForm({...form,customerPhone:e.target.value})} /></div>
              <div className="ap-form-group"><label>Email</label><input className="ap-input" value={form.customerEmail} onChange={e => setForm({...form,customerEmail:e.target.value})} /></div>
              <div className="ap-form-group"><label>Tên thú cưng</label><input className="ap-input" value={form.petName} onChange={e => setForm({...form,petName:e.target.value})} /></div>
              <div className="ap-form-group"><label>Loài</label>
                <select className="ap-input" value={form.petType} onChange={e => setForm({...form,petType:e.target.value})}>
                  {['Chó','Mèo','Thỏ','Khác'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="ap-form-group"><label>Dịch vụ *</label>
                <select className="ap-input" value={form.serviceId} onChange={e => setForm({...form,serviceId:e.target.value})}>
                  <option value="">— Chọn dịch vụ —</option>
                  {services.filter(s=>s.status==='active').map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="ap-form-group"><label>Nhân viên</label>
                <select className="ap-input" value={form.staffId} onChange={e => setForm({...form,staffId:e.target.value})}>
                  <option value="">— Chọn nhân viên —</option>
                  {staff.filter(s=>s.status==='active').map(s => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
                </select>
              </div>
              <div className="ap-form-group"><label>Ngày hẹn *</label><input className="ap-input" type="date" value={form.date} onChange={e => setForm({...form,date:e.target.value})} /></div>
              <div className="ap-form-group"><label>Giờ hẹn</label><input className="ap-input" type="time" value={form.time} onChange={e => setForm({...form,time:e.target.value})} /></div>
              <div className="ap-form-group ap-form-full"><label>Ghi chú</label><textarea className="ap-input" rows={2} value={form.note} onChange={e => setForm({...form,note:e.target.value})} /></div>
              <div className="ap-form-group ap-form-full"><div className="ap-form-actions"><button className="ap-btn ap-btn-primary" onClick={handleAdd}>Tạo lịch hẹn</button><button className="ap-btn ap-btn-ghost" onClick={() => setShowAdd(false)}>Hủy</button></div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};