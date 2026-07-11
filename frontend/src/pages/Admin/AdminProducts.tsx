import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { addProduct, updateProduct, deleteProduct, ShopProduct } from '@stores/slices/shopSlice';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

const EMPTY: Omit<ShopProduct, 'id' | 'rating' | 'sold'> = {
  name: '', price: 0, originalPrice: undefined, image: '', categoryId: '', brandId: '',
  description: '', stock: 0, status: 'active',
};

const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 };
const dialog: React.CSSProperties = { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', width: 480 };

export const AdminProducts: React.FC = () => {
  const dispatch = useDispatch();
  const { products, categories, brands } = useSelector((s: RootState) => s.shop);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit' | 'view'; product?: ShopProduct }>({ open: false, mode: 'add' });
  const [form, setForm] = useState<Omit<ShopProduct, 'id' | 'rating' | 'sold'>>(EMPTY);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY); setModal({ open: true, mode: 'add' }); };
  const openEdit = (p: ShopProduct) => { const { id, rating, sold, ...rest } = p; setForm(rest); setModal({ open: true, mode: 'edit', product: p }); };
  const openView = (p: ShopProduct) => setModal({ open: true, mode: 'view', product: p });
  const close = () => setModal({ open: false, mode: 'add' });

  const handleSave = () => {
    if (!form.name.trim() || !form.price) return alert('Vui lòng nhập tên và giá sản phẩm.');
    if (modal.mode === 'add') dispatch(addProduct(form));
    else if (modal.mode === 'edit' && modal.product) dispatch(updateProduct({ ...form, id: modal.product.id, rating: modal.product.rating, sold: modal.product.sold }));
    close();
  };

  const getCatName = (id: string) => categories.find(c => c.id === id)?.name || '—';
  const getBrandName = (id: string) => brands.find(b => b.id === id)?.name || '—';

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">🛍️ Quản lý sản phẩm</h1>
          <p className="admin-page-sub">Tổng {products.length} sản phẩm</p>
        </div>
        <button className="ap-btn ap-btn-primary" onClick={openAdd}>+ Thêm sản phẩm</button>
      </div>
      <div className="ap-card">
        <div className="ap-filters">
          <input className="ap-search" placeholder="🔍 Tìm sản phẩm..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <table className="admin-table">
          <thead><tr><th>Ảnh</th><th>Tên sản phẩm</th><th>Danh mục</th><th>Thương hiệu</th><th>Giá</th><th>Kho</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td><img src={p.image} alt={p.name} style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8 }} /></td>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td><span className="ap-tag">{getCatName(p.categoryId)}</span></td>
                <td>{getBrandName(p.brandId)}</td>
                <td><b style={{ color: '#ef4444' }}>{fmt(p.price)}</b></td>
                <td>{p.stock}</td>
                <td><span style={{ padding: '3px 10px', borderRadius: 12, fontSize: '0.78rem', fontWeight: 600, color: p.status === 'active' ? '#166534' : '#991b1b', background: p.status === 'active' ? '#dcfce7' : '#fee2e2' }}>{p.status === 'active' ? 'Đang bán' : 'Ẩn'}</span></td>
                <td>
                  <div className="ap-actions">
                    <button className="ap-action-btn" onClick={() => openView(p)}>👁️</button>
                    <button className="ap-action-btn" onClick={() => openEdit(p)}>✏️</button>
                    <button className="ap-action-btn ap-action-del" onClick={() => setDeleteConfirm(p.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="ap-empty">Không có sản phẩm nào</div>}
      </div>

      {deleteConfirm && (
        <div style={overlay}>
          <div style={dialog}>
            <h3 style={{ marginBottom: 12 }}>⚠️ Xác nhận xóa</h3>
            <p style={{ color: '#6b7280', marginBottom: 20 }}>Bạn có chắc muốn xóa sản phẩm này?</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="ap-btn ap-btn-ghost" onClick={() => setDeleteConfirm(null)}>Hủy</button>
              <button className="ap-btn" style={{ background: '#ef4444', color: '#fff' }} onClick={() => { dispatch(deleteProduct(deleteConfirm)); setDeleteConfirm(null); }}>Xóa</button>
            </div>
          </div>
        </div>
      )}

      {modal.open && (
        <div style={overlay} onClick={e => { if (e.target === e.currentTarget) close(); }}>
          <div style={{ ...dialog, width: 640, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>{modal.mode === 'add' ? '➕ Thêm sản phẩm' : modal.mode === 'edit' ? '✏️ Sửa sản phẩm' : '👁️ Chi tiết'}</h3>
              <button onClick={close} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
            </div>
            {modal.mode === 'view' && modal.product ? (
              <div>
                <img src={modal.product.image} alt={modal.product.name} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 10, marginBottom: 16 }} />
                <h2 style={{ marginBottom: 12 }}>{modal.product.name}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                  {([['Giá bán', fmt(modal.product.price)], ['Giá gốc', modal.product.originalPrice ? fmt(modal.product.originalPrice) : '—'], ['Danh mục', getCatName(modal.product.categoryId)], ['Thương hiệu', getBrandName(modal.product.brandId)], ['Tồn kho', String(modal.product.stock)], ['Đã bán', String(modal.product.sold)]] as [string, string][]).map(([k, v]) => (
                    <div key={k} style={{ background: '#f9fafb', padding: '10px 14px', borderRadius: 8 }}>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{k}</div>
                      <div style={{ fontWeight: 600 }}>{v}</div>
                    </div>
                  ))}
                </div>
                <p style={{ color: '#555', lineHeight: 1.6 }}>{modal.product.description}</p>
              </div>
            ) : (
              <div className="ap-form-row">
                <div className="ap-form-group ap-form-full"><label>Tên sản phẩm *</label><input className="ap-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="ap-form-group"><label>Giá bán (VND) *</label><input className="ap-input" type="number" value={form.price || ''} onChange={e => setForm({ ...form, price: +e.target.value })} /></div>
                <div className="ap-form-group"><label>Giá gốc (VND)</label><input className="ap-input" type="number" value={form.originalPrice || ''} onChange={e => setForm({ ...form, originalPrice: e.target.value ? +e.target.value : undefined })} /></div>
                <div className="ap-form-group"><label>Danh mục</label>
                  <select className="ap-input" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                    <option value="">— Chọn danh mục —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="ap-form-group"><label>Thương hiệu</label>
                  <select className="ap-input" value={form.brandId} onChange={e => setForm({ ...form, brandId: e.target.value })}>
                    <option value="">— Chọn thương hiệu —</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="ap-form-group"><label>Tồn kho</label><input className="ap-input" type="number" value={form.stock || ''} onChange={e => setForm({ ...form, stock: +e.target.value })} /></div>
                <div className="ap-form-group ap-form-full"><label>URL ảnh</label><input className="ap-input" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></div>
                <div className="ap-form-group ap-form-full"><label>Mô tả</label><textarea className="ap-input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                <div className="ap-form-group"><label>Trạng thái</label>
                  <select className="ap-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}>
                    <option value="active">Đang bán</option>
                    <option value="inactive">Ẩn</option>
                  </select>
                </div>
                {form.image && <div className="ap-form-group"><label>Xem trước</label><img src={form.image} alt="preview" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8 }} /></div>}
                <div className="ap-form-group ap-form-full">
                  <div className="ap-form-actions">
                    <button className="ap-btn ap-btn-primary" onClick={handleSave}>{modal.mode === 'add' ? 'Thêm sản phẩm' : 'Lưu thay đổi'}</button>
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