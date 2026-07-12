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

const getStockStatus = (stock: number) => {
  if (stock === 0) return { label: 'Hết hàng', color: '#991b1b', bg: '#fee2e2', bar: '#ef4444' };
  if (stock <= 5) return { label: 'Sắp hết', color: '#92400e', bg: '#fef3c7', bar: '#f59e0b' };
  if (stock <= 20) return { label: 'Còn ít', color: '#1e40af', bg: '#dbeafe', bar: '#3b82f6' };
  return { label: 'Còn hàng', color: '#166534', bg: '#dcfce7', bar: '#22c55e' };
};

export const AdminProducts: React.FC = () => {
  const dispatch = useDispatch();
  const { products, categories, brands } = useSelector((s: RootState) => s.shop);
  const [view, setView] = useState<'products' | 'inventory'>('products');
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'add' | 'edit' | 'view'; product?: ShopProduct }>({ open: false, mode: 'add' });
  const [form, setForm] = useState<Omit<ShopProduct, 'id' | 'rating' | 'sold'>>(EMPTY);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [stockEdit, setStockEdit] = useState<{ id: string; value: number } | null>(null);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const inventoryFiltered = products.filter(p => {
    if (!stockFilter) return true;
    if (stockFilter === 'out') return p.stock === 0;
    if (stockFilter === 'low') return p.stock > 0 && p.stock <= 5;
    if (stockFilter === 'medium') return p.stock > 5 && p.stock <= 20;
    if (stockFilter === 'ok') return p.stock > 20;
    return true;
  }).filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const totalStock = products.reduce((s, p) => s + p.stock, 0);

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

  const handleStockUpdate = (p: ShopProduct, newStock: number) => {
    dispatch(updateProduct({ ...p, stock: Math.max(0, newStock) }));
    setStockEdit(null);
  };

  const getCatName = (id: string) => categories.find(c => c.id === id)?.name || '—';
  const getBrandName = (id: string) => brands.find(b => b.id === id)?.name || '—';

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">🛍️ Quản lý sản phẩm</h1>
          <p className="admin-page-sub">
            Tổng {products.length} sản phẩm · Tồn kho: {totalStock}
            {outOfStock > 0 && <span style={{ color: '#ef4444', fontWeight: 700 }}> · {outOfStock} hết hàng</span>}
            {lowStock > 0 && <span style={{ color: '#f59e0b', fontWeight: 700 }}> · {lowStock} sắp hết</span>}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 10, padding: 3 }}>
            <button onClick={() => setView('products')} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', background: view === 'products' ? '#fff' : 'transparent', color: view === 'products' ? '#111' : '#6b7280', boxShadow: view === 'products' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
              📦 Sản phẩm
            </button>
            <button onClick={() => setView('inventory')} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', background: view === 'inventory' ? '#fff' : 'transparent', color: view === 'inventory' ? '#111' : '#6b7280', boxShadow: view === 'inventory' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', position: 'relative' }}>
              📊 Tồn kho
              {(outOfStock + lowStock) > 0 && <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{outOfStock + lowStock}</span>}
            </button>
          </div>
          <button className="ap-btn ap-btn-primary" onClick={openAdd}>+ Thêm sản phẩm</button>
        </div>
      </div>

      {/* ─── PRODUCTS VIEW ─── */}
      {view === 'products' && (
        <div className="ap-card">
          <div className="ap-filters">
            <input className="ap-search" placeholder="🔍 Tìm sản phẩm..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <table className="admin-table">
            <thead><tr><th>Ảnh</th><th>Tên sản phẩm</th><th>Danh mục</th><th>Thương hiệu</th><th>Giá</th><th>Kho</th><th>Đã bán</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
            <tbody>
              {filtered.map(p => {
                const st = getStockStatus(p.stock);
                return (
                  <tr key={p.id}>
                    <td><img src={p.image} alt={p.name} style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8 }} onError={e => (e.currentTarget.style.display = 'none')} /></td>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td><span className="ap-tag">{getCatName(p.categoryId)}</span></td>
                    <td>{getBrandName(p.brandId)}</td>
                    <td><b style={{ color: '#ef4444' }}>{fmt(p.price)}</b></td>
                    <td>
                      <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: '0.78rem', fontWeight: 700, color: st.color, background: st.bg }}>{p.stock}</span>
                    </td>
                    <td style={{ color: '#6b7280' }}>{p.sold}</td>
                    <td><span style={{ padding: '3px 10px', borderRadius: 12, fontSize: '0.78rem', fontWeight: 600, color: p.status === 'active' ? '#166534' : '#991b1b', background: p.status === 'active' ? '#dcfce7' : '#fee2e2' }}>{p.status === 'active' ? 'Đang bán' : 'Ẩn'}</span></td>
                    <td>
                      <div className="ap-actions">
                        <button className="ap-action-btn" onClick={() => openView(p)}>👁️</button>
                        <button className="ap-action-btn" onClick={() => openEdit(p)}>✏️</button>
                        <button className="ap-action-btn ap-action-del" onClick={() => setDeleteConfirm(p.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="ap-empty">Không có sản phẩm nào</div>}
        </div>
      )}

      {/* ─── INVENTORY VIEW ─── */}
      {view === 'inventory' && (
        <>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
            {[
              { label: 'Tổng tồn kho', value: totalStock, icon: '📦', color: '#3b82f6', bg: '#dbeafe' },
              { label: 'Còn hàng', value: products.filter(p => p.stock > 20).length, icon: '✅', color: '#166534', bg: '#dcfce7' },
              { label: 'Sắp hết (≤5)', value: lowStock, icon: '⚠️', color: '#92400e', bg: '#fef3c7' },
              { label: 'Hết hàng', value: outOfStock, icon: '❌', color: '#991b1b', bg: '#fee2e2' },
            ].map(s => (
              <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '16px 18px', border: '1px solid #f0ebe4', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '1.6rem' }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="ap-card">
            <div className="ap-filters">
              <input className="ap-search" placeholder="🔍 Tìm sản phẩm..." value={search} onChange={e => setSearch(e.target.value)} />
              <select className="ap-select" value={stockFilter} onChange={e => setStockFilter(e.target.value)}>
                <option value="">Tất cả</option>
                <option value="out">❌ Hết hàng</option>
                <option value="low">⚠️ Sắp hết (1-5)</option>
                <option value="medium">🔵 Còn ít (6-20)</option>
                <option value="ok">✅ Còn nhiều (&gt;20)</option>
              </select>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>Sản phẩm</th><th>Danh mục</th><th>Giá bán</th><th>Đã bán</th><th>Tồn kho</th><th>Mức tồn</th><th>Cập nhật kho</th></tr>
              </thead>
              <tbody>
                {inventoryFiltered.map(p => {
                  const st = getStockStatus(p.stock);
                  const maxStock = Math.max(p.stock + p.sold, 50);
                  const pct = Math.min((p.stock / maxStock) * 100, 100);
                  const isEditing = stockEdit?.id === p.id;
                  return (
                    <tr key={p.id} style={{ background: p.stock === 0 ? '#fff5f5' : p.stock <= 5 ? '#fffbeb' : undefined }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={p.image} alt={p.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} onError={e => (e.currentTarget.style.display = 'none')} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{p.name}</div>
                            <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>ID: {p.id}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="ap-tag">{getCatName(p.categoryId)}</span></td>
                      <td><b style={{ color: '#c7603a' }}>{fmt(p.price)}</b></td>
                      <td style={{ color: '#6b7280', fontWeight: 600 }}>{p.sold}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ padding: '4px 12px', borderRadius: 12, fontSize: '0.82rem', fontWeight: 800, color: st.color, background: st.bg, minWidth: 32, textAlign: 'center' }}>{p.stock}</span>
                          <span style={{ padding: '3px 10px', borderRadius: 10, fontSize: '0.72rem', fontWeight: 600, color: st.color, background: st.bg }}>{st.label}</span>
                        </div>
                      </td>
                      <td style={{ minWidth: 140 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ flex: 1, background: '#e5e7eb', borderRadius: 999, height: 8, overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, background: st.bar, borderRadius: 999, height: '100%', transition: 'width 0.3s' }} />
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>{Math.round(pct)}%</span>
                        </div>
                      </td>
                      <td>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <input type="number" min={0} value={stockEdit.value}
                              onChange={e => setStockEdit({ id: p.id, value: +e.target.value })}
                              style={{ width: 70, padding: '5px 8px', border: '1.5px solid #3b82f6', borderRadius: 8, fontSize: '0.88rem', fontWeight: 700, outline: 'none' }}
                              onKeyDown={e => { if (e.key === 'Enter') handleStockUpdate(p, stockEdit.value); if (e.key === 'Escape') setStockEdit(null); }}
                              autoFocus />
                            <button onClick={() => handleStockUpdate(p, stockEdit.value)} style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}>✓</button>
                            <button onClick={() => setStockEdit(null)} style={{ background: '#f3f4f6', color: '#6b7280', border: 'none', padding: '5px 8px', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem' }}>✕</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => setStockEdit({ id: p.id, value: p.stock })}
                              style={{ background: '#dbeafe', color: '#1e40af', border: 'none', padding: '5px 12px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}>
                              ✏️ Sửa kho
                            </button>
                            <button onClick={() => handleStockUpdate(p, p.stock + 10)}
                              style={{ background: '#dcfce7', color: '#166534', border: 'none', padding: '5px 10px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}>
                              +10
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {inventoryFiltered.length === 0 && <div className="ap-empty">Không có sản phẩm nào</div>}
          </div>
        </>
      )}

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
                <div className="ap-form-group ap-form-full">
                  <label>Ảnh sản phẩm</label>
                  <div style={{ border: '2px dashed #d1d5db', borderRadius: 10, padding: '16px', textAlign: 'center', cursor: 'pointer', background: '#faf9f7', marginBottom: 8 }}
                    onClick={() => { const inp = document.createElement('input'); inp.type='file'; inp.accept='image/*'; inp.onchange=(ev)=>{ const f=(ev.target as HTMLInputElement).files?.[0]; if(f){ if(f.size>5*1024*1024)return alert('Ảnh tối đa 5MB.'); const r=new FileReader(); r.onload=e=>setForm(prev=>({...prev,image:e.target?.result as string})); r.readAsDataURL(f); } }; inp.click(); }}>
                    {form.image && form.image.startsWith('data:')
                      ? <div><img src={form.image} alt="preview" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} /><div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 6 }}>Click để đổi ảnh</div></div>
                      : <div><div style={{ fontSize: '2rem', marginBottom: 6 }}>📷</div><div style={{ fontWeight: 600, color: '#374151', fontSize: '0.88rem' }}>Click để tải ảnh lên</div><div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>JPG, PNG, WEBP · Tối đa 5MB</div></div>
                    }
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><div style={{ flex:1, height:1, background:'#e5e7eb' }} /><span style={{ color:'#9ca3af', fontSize:'0.75rem', whiteSpace:'nowrap' }}>hoặc dán URL</span><div style={{ flex:1, height:1, background:'#e5e7eb' }} /></div>
                  <input className="ap-input" value={form.image.startsWith('data:') ? '' : form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://images.unsplash.com/..." disabled={form.image.startsWith('data:')} />
                  {form.image.startsWith('data:') && <button type="button" onClick={() => setForm(f=>({...f,image:''}))} style={{ marginTop: 6, background:'#fee2e2', color:'#991b1b', border:'none', padding:'5px 14px', borderRadius:20, cursor:'pointer', fontSize:'0.8rem', fontWeight:600 }}>🗑️ Xóa ảnh</button>}
                  {form.image && !form.image.startsWith('data:') && <img src={form.image} alt="preview" style={{ width:'100%', height: 80, objectFit:'cover', borderRadius:8, marginTop:6 }} onError={e=>(e.currentTarget.style.display='none')} />}
                </div>
                <div className="ap-form-group ap-form-full"><label>Mô tả sản phẩm</label><textarea className="ap-input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                <div className="ap-form-group"><label>Trạng thái</label>
                  <select className="ap-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}>
                    <option value="active">Đang bán</option>
                    <option value="inactive">Ẩn</option>
                  </select>
                </div>
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