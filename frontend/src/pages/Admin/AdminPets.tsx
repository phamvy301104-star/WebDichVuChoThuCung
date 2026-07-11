import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { addPet, updatePet, deletePet, approvePet, rejectPet, ManagedPet } from '@stores/slices/petMgmtSlice';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';
const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 };

const PUBLISH_MAP = {
  pending:  { label: 'Chờ duyệt', color: '#92400e', bg: '#fef3c7' },
  approved: { label: 'Đã duyệt',  color: '#166534', bg: '#dcfce7' },
  rejected: { label: 'Từ chối',   color: '#991b1b', bg: '#fee2e2' },
};

const EMPTY: Omit<ManagedPet, 'id' | 'createdAt'> = {
  name: '', species: 'Chó', breed: '', ageLabel: '', gender: '♂', image: '',
  tags: [], price: 0, listingType: 'adoption', vaccinated: false, vaccineCount: 0,
  weight: '', color: '', description: '', health: '', status: 'available',
  publishStatus: 'approved', submittedBy: 'admin@petcare.com', submittedByName: 'Admin',
};

export const AdminPets: React.FC = () => {
  const dispatch = useDispatch();
  const { pets } = useSelector((s: RootState) => s.petMgmt);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPublish, setFilterPublish] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit' | 'view'; data?: ManagedPet }>({ open: false, mode: 'add' });
  const [form, setForm] = useState<Omit<ManagedPet, 'id' | 'createdAt'>>({ ...EMPTY });
  const [del, setDel] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState('');

  const filtered = pets.filter(p =>
    (!filterStatus || p.publishStatus === filterStatus) &&
    (!filterPublish || p.listingType === filterPublish)
  );

  const open = (mode: 'add' | 'edit' | 'view', d?: ManagedPet) => {
    if (d) { const { id, createdAt, ...rest } = d; setForm(rest); setTagsInput(d.tags.join(', ')); }
    else { setForm({ ...EMPTY }); setTagsInput(''); }
    setModal({ open: true, mode, data: d });
  };
  const close = () => setModal({ open: false, mode: 'add' });

  const save = () => {
    if (!form.name || !form.breed) return alert('Vui lòng nhập tên và giống.');
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    if (modal.mode === 'add') dispatch(addPet({ ...form, tags }));
    else if (modal.data) dispatch(updatePet({ id: modal.data.id, createdAt: modal.data.createdAt, ...form, tags }));
    close();
  };

  const pendingCount = pets.filter(p => p.publishStatus === 'pending').length;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">🐾 Quản lý thú cưng</h1>
          <p className="admin-page-sub">Tổng {pets.length} thú cưng {pendingCount > 0 && <span style={{ color: '#f59e0b', fontWeight: 700 }}>· {pendingCount} chờ duyệt</span>}</p>
        </div>
        <button className="ap-btn ap-btn-primary" onClick={() => open('add')}>+ Thêm thú cưng</button>
      </div>

      <div className="ap-card">
        <div className="ap-filters">
          <select className="ap-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tất cả trạng thái duyệt</option>
            {Object.entries(PUBLISH_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select className="ap-select" value={filterPublish} onChange={e => setFilterPublish(e.target.value)}>
            <option value="">Tất cả loại</option>
            <option value="adoption">Nhận nuôi</option>
            <option value="sale">Bán</option>
          </select>
        </div>
        <table className="admin-table">
          <thead><tr><th>Ảnh</th><th>Thú cưng</th><th>Giống</th><th>Loại</th><th>Giá</th><th>Người đăng</th><th>Trạng thái duyệt</th><th>Hành động</th></tr></thead>
          <tbody>
            {filtered.map(p => {
              const pub = PUBLISH_MAP[p.publishStatus];
              return (
                <tr key={p.id}>
                  <td><img src={p.image} alt={p.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} /></td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{p.name} <span style={{ color: p.gender === '♀' ? '#ec4899' : '#3b82f6' }}>{p.gender}</span></div>
                    <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{p.species} · {p.ageLabel}</div>
                  </td>
                  <td>{p.breed}</td>
                  <td><span className="ap-tag">{p.listingType === 'adoption' ? '🏠 Nhận nuôi' : '🏷️ Bán'}</span></td>
                  <td>{p.price === 0 ? <span style={{ color: '#166534', fontWeight: 700 }}>Miễn phí</span> : <b style={{ color: '#c7603a' }}>{fmt(p.price)}</b>}</td>
                  <td>
                    <div style={{ fontSize: '0.82rem' }}>{p.submittedByName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{p.submittedBy}</div>
                  </td>
                  <td><span style={{ padding: '3px 10px', borderRadius: 12, fontSize: '0.78rem', fontWeight: 600, color: pub.color, background: pub.bg }}>{pub.label}</span></td>
                  <td>
                    <div className="ap-actions">
                      <button className="ap-action-btn" title="Xem chi tiết" onClick={() => open('view', p)}>👁️</button>
                      <button className="ap-action-btn" title="Sửa" onClick={() => open('edit', p)}>✏️</button>
                      {p.publishStatus === 'pending' && <>
                        <button className="ap-action-btn" style={{ background: '#dcfce7', color: '#166534' }} title="Duyệt" onClick={() => dispatch(approvePet(p.id))}>✅</button>
                        <button className="ap-action-btn" style={{ background: '#fee2e2', color: '#991b1b' }} title="Từ chối" onClick={() => dispatch(rejectPet(p.id))}>❌</button>
                      </>}
                      {p.publishStatus === 'approved' && <button className="ap-action-btn" style={{ background: '#fee2e2', color: '#991b1b' }} title="Ẩn" onClick={() => dispatch(rejectPet(p.id))}>🚫</button>}
                      {p.publishStatus === 'rejected' && <button className="ap-action-btn" style={{ background: '#dcfce7', color: '#166534' }} title="Duyệt lại" onClick={() => dispatch(approvePet(p.id))}>✅</button>}
                      <button className="ap-action-btn ap-action-del" title="Xóa" onClick={() => setDel(p.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="ap-empty">Không có thú cưng nào</div>}
      </div>

      {/* Delete confirm */}
      {del && (<div style={overlay}><div style={{ background: '#fff', borderRadius: 16, padding: 24, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
        <h3 style={{ marginBottom: 12 }}>⚠️ Xóa thú cưng?</h3>
        <p style={{ color: '#6b7280', marginBottom: 20 }}>Hành động này không thể hoàn tác.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="ap-btn ap-btn-ghost" onClick={() => setDel(null)}>Hủy</button>
          <button className="ap-btn" style={{ background: '#ef4444', color: '#fff' }} onClick={() => { dispatch(deletePet(del)); setDel(null); }}>Xóa</button>
        </div>
      </div></div>)}

      {/* Add/Edit/View modal */}
      {modal.open && (
        <div style={overlay} onClick={e => { if (e.target === e.currentTarget) close(); }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: 640, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
              <h3 style={{ margin: 0, fontWeight: 800 }}>
                {modal.mode === 'add' ? '➕ Thêm thú cưng' : modal.mode === 'edit' ? '✏️ Sửa thông tin' : '🐾 Chi tiết thú cưng'}
              </h3>
              <button onClick={close} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#9ca3af' }}>✕</button>
            </div>

            {modal.mode === 'view' && modal.data ? (
              <div>
                <img src={modal.data.image} alt={modal.data.name} style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 14, marginBottom: 20 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900 }}>{modal.data.name} <span style={{ color: modal.data.gender === '♀' ? '#ec4899' : '#3b82f6' }}>{modal.data.gender}</span></h2>
                    <p style={{ color: '#888', margin: '4px 0 0' }}>{modal.data.breed} · {modal.data.ageLabel}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, color: modal.data.price === 0 ? '#166534' : '#c7603a', fontSize: '1.2rem' }}>{modal.data.price === 0 ? 'Miễn phí' : fmt(modal.data.price)}</div>
                    <span style={{ background: modal.data.listingType === 'adoption' ? '#dcfce7' : '#dbeafe', color: modal.data.listingType === 'adoption' ? '#166534' : '#1e40af', padding: '3px 10px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 700 }}>{modal.data.listingType === 'adoption' ? '🏠 Nhận nuôi' : '🏷️ Bán'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {modal.data.tags.map(t => <span key={t} style={{ background: '#f0ebe4', color: '#8b5e3c', padding: '4px 10px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 600 }}>{t}</span>)}
                  {modal.data.vaccinated && <span style={{ background: '#f0fdf4', color: '#166534', padding: '4px 10px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 700 }}>💉 Đã tiêm {modal.data.vaccineCount} mũi</span>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                  {[['Cân nặng', modal.data.weight || '—'], ['Màu lông', modal.data.color || '—'], ['Loài', modal.data.species], ['Sức khoẻ', modal.data.health || '—']].map(([k, v]) => (
                    <div key={k as string} style={{ background: '#f9fafb', padding: '10px 14px', borderRadius: 10 }}>
                      <div style={{ fontSize: '0.73rem', color: '#9ca3af' }}>{k}</div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{v}</div>
                    </div>
                  ))}
                </div>
                <p style={{ color: '#555', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: 14 }}>{modal.data.description}</p>
                <div style={{ background: '#fef3c7', borderRadius: 10, padding: '10px 14px', fontSize: '0.82rem', color: '#92400e' }}>
                  Người đăng: <b>{modal.data.submittedByName}</b> ({modal.data.submittedBy}) · {new Date(modal.data.createdAt).toLocaleDateString('vi-VN')}
                </div>
                {modal.data.publishStatus === 'pending' && (
                  <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                    <button className="ap-btn ap-btn-primary" onClick={() => { dispatch(approvePet(modal.data!.id)); close(); }}>✅ Duyệt đăng bài</button>
                    <button className="ap-btn" style={{ background: '#fee2e2', color: '#991b1b' }} onClick={() => { dispatch(rejectPet(modal.data!.id)); close(); }}>❌ Từ chối</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="ap-form-row">
                <div className="ap-form-group"><label>Tên thú cưng *</label><input className="ap-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="ap-form-group"><label>Loài</label>
                  <select className="ap-input" value={form.species} onChange={e => setForm({ ...form, species: e.target.value })}>
                    {['Chó', 'Mèo', 'Thỏ', 'Khác'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="ap-form-group"><label>Giống *</label><input className="ap-input" value={form.breed} onChange={e => setForm({ ...form, breed: e.target.value })} placeholder="Golden Retriever..." /></div>
                <div className="ap-form-group"><label>Tuổi</label><input className="ap-input" value={form.ageLabel} onChange={e => setForm({ ...form, ageLabel: e.target.value })} placeholder="3 tuổi / 6 tháng" /></div>
                <div className="ap-form-group"><label>Giới tính</label>
                  <select className="ap-input" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value as '♂' | '♀' })}>
                    <option value="♂">♂ Đực</option><option value="♀">♀ Cái</option>
                  </select>
                </div>
                <div className="ap-form-group"><label>Loại đăng</label>
                  <select className="ap-input" value={form.listingType} onChange={e => setForm({ ...form, listingType: e.target.value as any })}>
                    <option value="adoption">🏠 Cho nhận nuôi</option><option value="sale">🏷️ Bán</option>
                  </select>
                </div>
                {form.listingType === 'sale' && <div className="ap-form-group"><label>Giá (VND)</label><input className="ap-input" type="number" value={form.price || ''} onChange={e => setForm({ ...form, price: +e.target.value })} /></div>}
                <div className="ap-form-group"><label>Cân nặng</label><input className="ap-input" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="4 kg" /></div>
                <div className="ap-form-group"><label>Màu lông</label><input className="ap-input" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} placeholder="Vàng kem" /></div>
                <div className="ap-form-group"><label>Đã tiêm phòng</label>
                  <select className="ap-input" value={form.vaccinated ? 'yes' : 'no'} onChange={e => setForm({ ...form, vaccinated: e.target.value === 'yes' })}>
                    <option value="yes">Đã tiêm</option><option value="no">Chưa tiêm</option>
                  </select>
                </div>
                {form.vaccinated && <div className="ap-form-group"><label>Số mũi đã tiêm</label><input className="ap-input" type="number" value={form.vaccineCount || ''} onChange={e => setForm({ ...form, vaccineCount: +e.target.value })} /></div>}
                <div className="ap-form-group ap-form-full">
                  <label>Ảnh thú cưng</label>
                  <div style={{ border: '2px dashed #d1d5db', borderRadius: 10, padding: '16px', textAlign: 'center', cursor: 'pointer', background: '#faf9f7', marginBottom: 8 }}
                    onClick={() => { const inp = document.createElement('input'); inp.type='file'; inp.accept='image/*'; inp.onchange=(ev)=>{ const f=(ev.target as HTMLInputElement).files?.[0]; if(f){ const r=new FileReader(); r.onload=e=>setForm(prev=>({...prev,image:e.target?.result as string})); r.readAsDataURL(f); } }; inp.click(); }}>
                    {form.image && form.image.startsWith('data:')
                      ? <img src={form.image} alt="preview" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8 }} />
                      : <div><div style={{ fontSize: '1.8rem', marginBottom: 4 }}>📷</div><div style={{ fontSize: '0.82rem', color: '#9ca3af' }}>Click để tải ảnh lên</div></div>
                    }
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><div style={{ flex:1, height:1, background:'#e5e7eb' }} /><span style={{ color:'#9ca3af', fontSize:'0.75rem', whiteSpace:'nowrap' }}>hoặc URL</span><div style={{ flex:1, height:1, background:'#e5e7eb' }} /></div>
                  <input className="ap-input" value={form.image.startsWith('data:') ? '' : form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://images.unsplash.com/..." disabled={form.image.startsWith('data:')} />
                  {form.image && !form.image.startsWith('data:') && <img src={form.image} alt="preview" style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8, marginTop: 6 }} onError={e => (e.currentTarget.style.display='none')} />}
                  {form.image.startsWith('data:') && <button type="button" onClick={() => setForm(f=>({...f,image:''}))} style={{ marginTop: 6, background:'#fee2e2', color:'#991b1b', border:'none', padding:'5px 14px', borderRadius:20, cursor:'pointer', fontSize:'0.8rem', fontWeight:600 }}>🗑️ Xóa ảnh</button>}
                </div>
                {form.image && <div className="ap-form-group"><label>Xem trước</label><img src={form.image} alt="preview" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10 }} /></div>}
                <div className="ap-form-group ap-form-full"><label>Tags tính cách (cách nhau bằng dấu phẩy)</label><input className="ap-input" value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="Thân thiện, Thông minh, Vâng lời" /></div>
                <div className="ap-form-group ap-form-full"><label>Mô tả</label><textarea className="ap-input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                <div className="ap-form-group ap-form-full"><label>Tình trạng sức khoẻ</label><input className="ap-input" value={form.health} onChange={e => setForm({ ...form, health: e.target.value })} placeholder="Tốt - Đã khám tổng quát..." /></div>
                <div className="ap-form-group"><label>Trạng thái duyệt</label>
                  <select className="ap-input" value={form.publishStatus} onChange={e => setForm({ ...form, publishStatus: e.target.value as any })}>
                    <option value="approved">✅ Duyệt đăng ngay</option>
                    <option value="pending">⏳ Chờ duyệt</option>
                    <option value="rejected">❌ Từ chối</option>
                  </select>
                </div>
                <div className="ap-form-group ap-form-full">
                  <div className="ap-form-actions">
                    <button className="ap-btn ap-btn-primary" onClick={save}>{modal.mode === 'add' ? 'Thêm thú cưng' : 'Lưu thay đổi'}</button>
                    <button className="ap-btn ap-btn-ghost" onClick={close}>Hủy</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};