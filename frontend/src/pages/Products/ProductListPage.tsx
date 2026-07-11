import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { addToCart } from '@stores/slices/cartSlice';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

const CAT_ICONS: Record<string, string> = {
  'Thức ăn': '🐱', 'Phụ kiện': '🎒', 'Đồ chơi': '🐭',
  'Chăm sóc': '🛁', 'Y tế': '💊', 'Vệ sinh': '🪣',
  'Chuồng & Nhà': '🏠', 'default': '🐾',
};

const CAT_BG: Record<string, string> = {
  'Thức ăn': 'linear-gradient(135deg,#fef3c7,#fde68a)',
  'Phụ kiện': 'linear-gradient(135deg,#dbeafe,#bfdbfe)',
  'Đồ chơi': 'linear-gradient(135deg,#fce7f3,#fbcfe8)',
  'Chăm sóc': 'linear-gradient(135deg,#d1fae5,#a7f3d0)',
  'Y tế': 'linear-gradient(135deg,#e0e7ff,#c7d2fe)',
  'default': 'linear-gradient(135deg,#f9fafb,#f3f4f6)',
};

const ProductImage: React.FC<{ src: string; alt: string; catName: string }> = ({ src, alt, catName }) => {
  const [err, setErr] = useState(false);
  const icon = CAT_ICONS[catName] || CAT_ICONS.default;
  const bg = CAT_BG[catName] || CAT_BG.default;
  if (err || !src) return (
    <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>{icon}</div>
  );
  return <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setErr(true)} />;
};

export const ProductListPage: React.FC = () => {
  const dispatch = useDispatch();
  const { products, categories } = useSelector((s: RootState) => s.shop);
  const activeProducts = products.filter(p => p.status === 'active');

  const getCatName = (id: string) => categories.find(c => c.id === id)?.name || 'Sản phẩm';

  const handleAddToCart = (p: typeof products[0]) => {
    dispatch(addToCart({ product: { _id: p.id, id: p.id, name: p.name, price: p.price, image: p.image, description: p.description, rating: p.rating } as any, quantity: 1 }));
    alert(`✅ Đã thêm "${p.name}" vào giỏ hàng!`);
  };

  return (
    <>
      <Header />
      <main className="page-container">
        <div style={{ textAlign: 'center', padding: '40px 20px 28px', background: 'linear-gradient(135deg,#fdf6ec,#fce4ec)', borderRadius: 16, color: '#1a1a1a', marginBottom: 32, border: '1px solid #f0ebe4' }}>
          <div style={{ fontSize: '3rem', marginBottom: 10 }}>🛍️</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 8px' }}>Cửa hàng thú cưng</h1>
          <p style={{ opacity: 0.7, margin: 0, color: '#555' }}>Sản phẩm chất lượng cao · {activeProducts.length} sản phẩm</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 18, marginBottom: 48 }}>
          {activeProducts.map(p => (
            <div key={p.id} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #f0ebe4', transition: 'transform 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = '')}>
              <Link to={`/products/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                  {p.originalPrice && <span style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, background: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '2px 7px', borderRadius: 10 }}>-{Math.round((1 - p.price / p.originalPrice) * 100)}%</span>}
                  <ProductImage src={p.image} alt={p.name} catName={getCatName(p.categoryId)} />
                </div>
                <div style={{ padding: '12px 14px 8px' }}>
                  <span style={{ background: '#f0ebe4', color: '#8b5e3c', fontSize: '0.72rem', fontWeight: 600, padding: '2px 7px', borderRadius: 5 }}>{getCatName(p.categoryId)}</span>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a1a1a', margin: '8px 0 4px', lineHeight: 1.3 }}>{p.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontWeight: 800, color: '#ef4444', fontSize: '1rem' }}>{fmt(p.price)}</span>
                    <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>⭐ {p.rating} · Đã bán {p.sold}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: p.stock > 0 ? '#166534' : '#991b1b' }}>
                    {p.stock > 0 ? `Còn ${p.stock} sản phẩm` : 'Hết hàng'}
                  </div>
                </div>
              </Link>
              <div style={{ padding: '0 14px 14px' }}>
                <button disabled={p.stock === 0} onClick={() => handleAddToCart(p)}
                  style={{ width: '100%', background: p.stock > 0 ? '#1a1a1a' : '#e5e7eb', color: p.stock > 0 ? '#fff' : '#9ca3af', border: 'none', padding: '9px', borderRadius: 8, fontWeight: 700, cursor: p.stock > 0 ? 'pointer' : 'not-allowed', fontSize: '0.88rem' }}>
                  {p.stock > 0 ? '🛒 Thêm vào giỏ' : 'Hết hàng'}
                </button>
              </div>
            </div>
          ))}
        </div>
        {activeProducts.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>Chưa có sản phẩm nào.</div>}
      </main>
      <Footer />
    </>
  );
};