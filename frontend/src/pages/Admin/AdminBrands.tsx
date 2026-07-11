import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { addBrand, updateBrand, deleteBrand, Brand } from '@stores/slices/shopSlice';

const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const dialog: React.CSSProperties = { background: '#fff', borderRadius: 16, padding: 28, width: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' };

export const AdminBrands: React.FC = () => {
  const dispatch = useDispatch();
  const { brands, products } = useSelector((s: RootState) => s.shop);
  const [modal, setModal] = useState<{ open: boolean; data?: Brand }>({ open: false });
  const [form, setForm] = useState({ name: '', description: '', logo: '' });
  const [del, setDel] = useState<string | null>(null);

  const open = (b?: Brand) => { setForm(b ? { name: b.name, description: b.description, logo: b.logo || '' } : { name: '', description: '', logo: '' }); setModal({ open: true, data: b }); };
  const close = () => setModal({ open: false });
  const save = () => {
    if (!form.name.trim()) return alert('Nhập tên thương hiệu');
    if (modal.data) dispatch(updateBrand({ ...modal.data, ...form }));
    else dispatch(addBrand(form));
    close();
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">🏷️ Quản lý thương hiệu</h1><p className="admin-page-sub">Tổng {brands.length} thương hiệu</p></div>
        <button className="ap-btn ap-btn-primary" onClick={() => open()}>+ Thêm thương hiệu</button>
      </div>
      <div className="ap-card">
        <table className="admin-table">
          <thead><tr><th>Logo</th><th>Tên thương hiệu</th><th>Mô tả</th><th>Số sản phẩm</th><th>Hành động</th></tr></thead>
          <tbody>
            {brands.map(b => (
              <tr key={b.id}>
                <td style={{ fontSize: '1.6rem' }}>{b.logo || '🏷️'}</td>
                <td style={{ fontWeight: 700 }}>{b.name}</td>
                <td style={{ color: '#6b7280' }}>{b.description}</td>
                <td>{products.filter(p => p.brandId === b.id).length}</td>
                <td><div className="ap-actions">
                  <button className="ap-action-btn" onClick={() => open(b)}>✏️</button>
                  <button className="ap-action-btn ap-action-del" onClick={() => setDel(b.id)}>🗑️</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {del && (<div style={overlay}><div style={dialog}><h3 style={{ marginBottom: 12 }}>⚠️ Xóa thương hiệu?</h3><p style={{ color: '#6b7280', marginBottom: 20 }}>Các sản phẩm thuộc thương hiệu này sẽ mất thương hiệu.</p><div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}><button className="ap-btn ap-btn-ghost" onClick={() => setDel(null)}>Hủy</button><button className="ap-btn" style={{ background: '#ef4444', color: '#fff' }} onClick={() => { dispatch(deleteBrand(del)); setDel(null); }}>Xóa</button></div></div></div>)}
      {modal.open && (<div style={overlay} onClick={e => { if (e.target === e.currentTarget) close(); }}><div style={dialog}><h3 style={{ marginBottom: 20 }}>{modal.data ? '✏️ Sửa thương hiệu' : '➕ Thêm thương hiệu'}</h3><div className="ap-form-group" style={{ marginBottom: 14 }}><label>Tên thương hiệu *</label><input className="ap-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div><div className="ap-form-group" style={{ marginBottom: 14 }}><label>Mô tả</label><input className="ap-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div><div className="ap-form-group" style={{ marginBottom: 20 }}><label>Logo (emoji hoặc URL)</label><input className="ap-input" value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })} placeholder="🐾 hoặc https://..." /></div><div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}><button className="ap-btn ap-btn-ghost" onClick={close}>Hủy</button><button className="ap-btn ap-btn-primary" onClick={save}>Lưu</button></div></div></div>)}
    </div>
  );
};