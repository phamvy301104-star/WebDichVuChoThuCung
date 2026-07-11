import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { addPromo, updatePromo, deletePromo, PromoCode } from '@stores/slices/promoSlice';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';
const today = () => new Date().toISOString().split('T')[0];
const addDays = (n: number) => { const d = new Date(); d.setDate(d.getDate()+n); return d.toISOString().split('T')[0]; };
const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 };

const EMPTY: Omit<PromoCode, 'id' | 'used'> = {
  code: '', type: 'percent', value: 10, minOrder: 200000, limit: 100,
  from: today(), to: addDays(30), status: 'active', description: '',
};

const isExpired = (to: string) => to < today();
const isNotStarted = (from: string) => from > today();

export const AdminPromotions: React.FC = () => {
  const dispatch = useDispatch();
  const { codes } = useSelector((s: RootState) => s.promo);
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit' | 'view'; data?: PromoCode }>({ open: false, mode: 'add' });
  const [form, setForm] = useState<Omit<PromoCode, 'id' | 'used'>>({ ...EMPTY });
  const [del, setDel] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = codes.filter(c => !filterStatus || c.status === filterStatus);

  const open = (mode: 'add' | 'edit' | 'view', d?: PromoCode) => {
    if (d) { const { id, used, ...rest } = d; setForm(rest); } else setForm({ ...EMPTY });
    setModal({ open: true, mode, data: d });
  };
  const close = () => setModal({ open: false, mode: 'add' });

  const save = () => {
    if (!form.code.trim()) return alert('Vui lòng nhập mã giảm giá.');
    if (form.value <= 0) return alert('Giá trị giảm phải lớn hơn 0.');
    const codeUpper = { ...form, code: form.code.toUpperCase().trim() };
    if (modal.mode === 'add') dispatch(addPromo(codeUpper));
    else if (modal.data) dispatch(updatePromo({ id: modal.data.id, used: modal.data.used, ...codeUpper }));
    close();
  };

  const getBadge = (p: PromoCode) => {
    if (isExpired(p.to)) return { label: '⌛ Hết hạn', color: '#9ca3af', bg: '#f3f4f6' };
    if (isNotStarted(p.from)) return { label: '🕐 Chưa bắt đầu', color: '#92400e', bg: '#fef3c7' };
    if (p.status === 'inactive') return { label: '🚫 Vô hiệu', color: '#991b1b', bg: '#fee2e2' };
    if (p.used >= p.limit) return { label: '❌ Hết lượt', color: '#991b1b', bg: '#fee2e2' };
    return { label: '✅ Đang hoạt động', color: '#166534', bg: '#dcfce7' };
  };

  const daysLeft = (to: string) => {
    const diff = Math.ceil((new Date(to).getTime() - Date.now()) / 86400000);
    if (diff < 0) return <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Đã hết hạn</span>;
    if (diff === 0) return <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.75rem' }}>Hết hạn hôm nay!</span>;
    if (diff <= 3) return <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.75rem' }}>Còn {diff} ngày</span>;
    return <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>Còn {diff} ngày</span>;
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">🎁 Quản lý khuyến mãi</h1>
          <p className="admin-page-sub">Tổng {codes.length} mã · {codes.filter(c => c.status === 'active' && !isExpired(c.to) && c.used < c.limit).length} đang hoạt động</p>
        </div>
        <button className="ap-btn ap-btn-primary" onClick={() => open('add')}>+ Tạo mã giảm giá</button>
      </div>

      <div className="ap-card">
        <div className="ap-filters">
          <select className="ap-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Vô hiệu</option>
          </select>
        </div>
        <table className="admin-table">
          <thead>
            <tr><th>Mã code</th><th>Loại & Giá trị</th><th>Đơn tối thiểu</th><th>Đã dùng / Giới hạn</th><th>Thời hạn</th><th>Trạng thái</th><th>Hành động</th></tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const badge = getBadge(p);
              const usedPct = p.limit > 0 ? (p.used / p.limit) * 100 : 0;
              return (
                <tr key={p.id}>
                  <td>
                    <code style={{ background: '#f3f4f6', padding: '3px 10px', borderRadius: 6, fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.05em' }}>{p.code}</code>
                    {p.description && <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>{p.description}</div>}
                  </td>
                  <td>
                    <b style={{ color: p.type === 'percent' ? '#c7603a' : '#3b82f6' }}>
                      {p.type === 'percent' ? `-${p.value}%` : `-${fmt(p.value)}`}
                    </b>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{p.type === 'percent' ? 'Phần trăm' : 'Cố định'}</div>
                  </td>
                  <td>{fmt(p.minOrder)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
                      <div style={{ flex: 1, background: '#e5e7eb', borderRadius: 9999, height: 6 }}>
                        <div style={{ width: `${Math.min(usedPct, 100)}%`, background: usedPct >= 90 ? '#ef4444' : usedPct >= 60 ? '#f59e0b' : '#22c55e', borderRadius: 9999, height: '100%' }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#6b7280', whiteSpace: 'nowrap' }}>{p.used}/{p.limit}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem' }}>{p.from} → {p.to}</div>
                    {daysLeft(p.to)}
                  </td>
                  <td><span style={{ padding: '3px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600, color: badge.color, background: badge.bg }}>{badge.label}</span></td>
                  <td>
                    <div className="ap-actions">
                      <button className="ap-action-btn" title="Xem chi tiết" onClick={() => open('view', p)}>👁️</button>
                      <button className="ap-action-btn" title="Sửa" onClick={() => open('edit', p)}>✏️</button>
                      <button className="ap-action-btn" title={p.status === 'active' ? 'Vô hiệu hoá' : 'Kích hoạt'}
                        style={{ background: p.status === 'active' ? '#fef3c7' : '#dcfce7', color: p.status === 'active' ? '#92400e' : '#166534' }}
                        onClick={() => dispatch(updatePromo({ ...p, status: p.status === 'active' ? 'inactive' : 'active' }))}>
                        {p.status === 'active' ? '🚫' : '✅'}
                      </button>
                      <button className="ap-action-btn ap-action-del" title="Xóa" onClick={() => setDel(p.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="ap-empty">Không có mã khuyến mãi nào</div>}
      </div>

      {/* Delete */}
      {del && (<div style={overlay}><div style={{ background:'#fff', borderRadius:16, padding:24, width:400, boxShadow:'0 20px 60px rgba(0,0,0,.2)' }}>
        <h3 style={{ marginBottom:12 }}>⚠️ Xóa mã khuyến mãi?</h3>
        <p style={{ color:'#6b7280', marginBottom:20 }}>Mã sẽ bị xóa vĩnh viễn. Người dùng đã lưu sẽ không dùng được nữa.</p>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button className="ap-btn ap-btn-ghost" onClick={() => setDel(null)}>Hủy</button>
          <button className="ap-btn" style={{ background:'#ef4444', color:'#fff' }} onClick={() => { dispatch(deletePromo(del)); setDel(null); }}>Xóa</button>
        </div>
      </div></div>)}

      {/* Add/Edit/View Modal */}
      {modal.open && (
        <div style={overlay} onClick={e => { if (e.target === e.currentTarget) close(); }}>
          <div style={{ background:'#fff', borderRadius:20, padding:28, width:580, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 64px rgba(0,0,0,.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:22 }}>
              <h3 style={{ margin:0, fontWeight:800 }}>
                {modal.mode==='add' ? '➕ Tạo mã giảm giá' : modal.mode==='edit' ? '✏️ Sửa mã giảm giá' : '👁️ Chi tiết mã'}
              </h3>
              <button onClick={close} style={{ background:'none', border:'none', fontSize:'1.4rem', cursor:'pointer', color:'#9ca3af' }}>✕</button>
            </div>

            {modal.mode === 'view' && modal.data ? (
              <div>
                <div style={{ textAlign:'center', marginBottom:24 }}>
                  <code style={{ background:'#f3f4f6', padding:'10px 28px', borderRadius:12, fontWeight:900, fontSize:'1.4rem', letterSpacing:'0.08em', display:'inline-block' }}>{modal.data.code}</code>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
                  {[
                    ['Loại giảm', modal.data.type === 'percent' ? 'Phần trăm (%)' : 'Cố định (VND)'],
                    ['Giá trị', modal.data.type === 'percent' ? `-${modal.data.value}%` : `-${fmt(modal.data.value)}`],
                    ['Đơn tối thiểu', fmt(modal.data.minOrder)],
                    ['Đã dùng / Giới hạn', `${modal.data.used} / ${modal.data.limit} lượt`],
                    ['Ngày bắt đầu', modal.data.from],
                    ['Ngày hết hạn', modal.data.to],
                    ['Trạng thái', modal.data.status === 'active' ? '✅ Kích hoạt' : '🚫 Vô hiệu'],
                  ].map(([k,v]) => (
                    <div key={k as string} style={{ background:'#f9fafb', padding:'10px 14px', borderRadius:10 }}>
                      <div style={{ fontSize:'0.72rem', color:'#9ca3af' }}>{k}</div>
                      <div style={{ fontWeight:700, fontSize:'0.88rem' }}>{v}</div>
                    </div>
                  ))}
                </div>
                {modal.data.description && <p style={{ color:'#555', fontSize:'0.88rem', lineHeight:1.6 }}>{modal.data.description}</p>}
                <div style={{ marginTop:16 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                    <div style={{ flex:1, background:'#e5e7eb', borderRadius:9999, height:10 }}>
                      <div style={{ width:`${Math.min((modal.data.used/modal.data.limit)*100,100)}%`, background:'#22c55e', borderRadius:9999, height:'100%' }} />
                    </div>
                    <span style={{ fontSize:'0.85rem', fontWeight:700 }}>{Math.round((modal.data.used/modal.data.limit)*100)}%</span>
                  </div>
                  <div style={{ fontSize:'0.75rem', color:'#9ca3af' }}>Đã sử dụng {modal.data.used}/{modal.data.limit} lượt</div>
                </div>
              </div>
            ) : (
              <div className="ap-form-row">
                <div className="ap-form-group ap-form-full">
                  <label>Mã giảm giá * <span style={{ fontSize:'0.75rem', color:'#9ca3af' }}>(tự động chuyển in hoa)</span></label>
                  <input className="ap-input" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} placeholder="PETCARE10" style={{ textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:700 }} />
                </div>
                <div className="ap-form-group">
                  <label>Loại giảm giá</label>
                  <select className="ap-input" value={form.type} onChange={e => setForm({...form, type: e.target.value as any})}>
                    <option value="percent">📊 Phần trăm (%)</option>
                    <option value="fixed">💰 Cố định (VND)</option>
                  </select>
                </div>
                <div className="ap-form-group">
                  <label>Giá trị giảm *</label>
                  <div style={{ position:'relative' }}>
                    <input className="ap-input" type="number" min={1} max={form.type==='percent'?100:undefined} value={form.value||''} onChange={e => setForm({...form, value: +e.target.value})} placeholder={form.type==='percent'?'10':'50000'} />
                    <span style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:'0.85rem', pointerEvents:'none' }}>{form.type==='percent'?'%':'đ'}</span>
                  </div>
                </div>
                <div className="ap-form-group">
                  <label>Đơn hàng tối thiểu (VND)</label>
                  <input className="ap-input" type="number" value={form.minOrder||''} onChange={e => setForm({...form, minOrder: +e.target.value})} placeholder="200000" />
                </div>
                <div className="ap-form-group">
                  <label>Giới hạn số lượt dùng</label>
                  <input className="ap-input" type="number" value={form.limit||''} onChange={e => setForm({...form, limit: +e.target.value})} placeholder="100" />
                </div>
                <div className="ap-form-group">
                  <label>Ngày bắt đầu</label>
                  <input className="ap-input" type="date" value={form.from} onChange={e => setForm({...form, from: e.target.value})} />
                </div>
                <div className="ap-form-group">
                  <label>Ngày hết hạn *</label>
                  <input className="ap-input" type="date" value={form.to} min={form.from} onChange={e => setForm({...form, to: e.target.value})} />
                  {form.to && <div style={{ fontSize:'0.75rem', color: form.to < today() ? '#ef4444' : '#9ca3af', marginTop:4 }}>
                    {form.to < today() ? '⚠️ Ngày đã qua — mã sẽ hết hạn ngay' : `Còn ${Math.ceil((new Date(form.to).getTime()-Date.now())/86400000)} ngày`}
                  </div>}
                </div>
                <div className="ap-form-group"><label>Trạng thái</label>
                  <select className="ap-input" value={form.status} onChange={e => setForm({...form, status: e.target.value as any})}>
                    <option value="active">✅ Kích hoạt ngay</option>
                    <option value="inactive">🚫 Vô hiệu hoá</option>
                  </select>
                </div>
                <div className="ap-form-group ap-form-full">
                  <label>Mô tả (hiển thị cho khách)</label>
                  <input className="ap-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Giảm 10% cho đơn hàng từ 200.000đ" />
                </div>

                {/* Live preview */}
                {form.code && (
                  <div className="ap-form-group ap-form-full">
                    <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:12, padding:'14px 18px' }}>
                      <div style={{ fontWeight:700, color:'#166534', marginBottom:6, fontSize:'0.85rem' }}>👁️ Xem trước mã</div>
                      <code style={{ background:'#fff', padding:'6px 16px', borderRadius:8, fontWeight:900, fontSize:'1rem', letterSpacing:'0.06em', display:'inline-block', marginBottom:8 }}>{form.code.toUpperCase()}</code>
                      <div style={{ fontSize:'0.82rem', color:'#374151' }}>
                        {form.type==='percent' ? `Giảm ${form.value}%` : `Giảm ${fmt(form.value)}`}
                        {' · '}Đơn từ {fmt(form.minOrder)}
                        {' · '}{form.limit} lượt
                        {' · '}Hết hạn: {form.to}
                      </div>
                    </div>
                  </div>
                )}

                <div className="ap-form-group ap-form-full">
                  <div className="ap-form-actions">
                    <button className="ap-btn ap-btn-primary" onClick={save}>{modal.mode==='add'?'Tạo mã giảm giá':'Lưu thay đổi'}</button>
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