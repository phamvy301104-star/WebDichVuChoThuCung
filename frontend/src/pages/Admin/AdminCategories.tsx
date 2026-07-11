import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { addCategory, updateCategory, deleteCategory, Category } from '@stores/slices/shopSlice';

const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const dialog: React.CSSProperties = { background: '#fff', borderRadius: 16, padding: 28, width: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' };

export const AdminCategories: React.FC = () => {
  const dispatch = useDispatch();
  const { categories, products } = useSelector((s: RootState) => s.shop);
  const [modal, setModal] = useState<{ open: boolean; data?: Category }>({ open: false });
  const [form, setForm] = useState({ name: '', description: '' });
  const [del, setDel] = useState<string | null>(null);

  const open = (c?: Category) => { setForm(c ? { name: c.name, description: c.description } : { name: '', description: '' }); setModal({ open: true, data: c }); };
  const close = () => setModal({ open: false });
  const save = () => {
    if (!form.name.trim()) return alert('Nhập tên danh mục');
    if (modal.data) dispatch(updateCategory({ ...modal.data, ...form }));
    else dispatch(addCategory(form));
    close();
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">📁 Quản lý danh mục</h1><p className="admin-page-sub">Tổng {categories.length} danh mục</p></div>
        <button className="ap-btn ap-btn-primary" onClick={() => open()}>+ Thêm danh mục</button>
      </div>
      <div className="ap-card">
        <table className="admin-table">
          <thead><tr><th>Tên danh mục</th><th>Mô tả</th><th>Số sản phẩm</th><th>Hành động</th></tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 700 }}>{c.name}</td>
                <td style={{ color: '#6b7280' }}>{c.description}</td>
                <td>{products.filter(p => p.categoryId === c.id).length}</td>
                <td><div className="ap-actions">
                  <button className="ap-action-btn" onClick={() => open(c)}>✏️</button>
                  <button className="ap-action-btn ap-action-del" onClick={() => setDel(c.id)}>🗑️</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {del && (<div style={overlay}><div style={dialog}><h3 style={{ marginBottom: 12 }}>⚠️ Xóa danh mục?</h3><p style={{ color: '#6b7280', marginBottom: 20 }}>Các sản phẩm thuộc danh mục này sẽ không còn danh mục.</p><div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}><button className="ap-btn ap-btn-ghost" onClick={() => setDel(null)}>Hủy</button><button className="ap-btn" style={{ background: '#ef4444', color: '#fff' }} onClick={() => { dispatch(deleteCategory(del)); setDel(null); }}>Xóa</button></div></div></div>)}
      {modal.open && (<div style={overlay} onClick={e => { if (e.target === e.currentTarget) close(); }}><div style={dialog}><h3 style={{ marginBottom: 20 }}>{modal.data ? '✏️ Sửa danh mục' : '➕ Thêm danh mục'}</h3><div className="ap-form-group" style={{ marginBottom: 14 }}><label>Tên danh mục *</label><input className="ap-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div><div className="ap-form-group" style={{ marginBottom: 20 }}><label>Mô tả</label><input className="ap-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div><div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}><button className="ap-btn ap-btn-ghost" onClick={close}>Hủy</button><button className="ap-btn ap-btn-primary" onClick={save}>Lưu</button></div></div></div>)}
    </div>
  );
};