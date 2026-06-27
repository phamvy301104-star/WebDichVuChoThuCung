import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

const products = [
  { id: 1, name: 'Thức ăn mèo Royal Canin 400g', category: 'Thức ăn', price: 185000, oldPrice: 220000, icon: '🐱', rating: 4.8, sold: 124 },
  { id: 2, name: 'Balo vận chuyển thú cưng cao cấp', category: 'Phụ kiện', price: 320000, icon: '🎒', rating: 4.6, sold: 43 },
  { id: 3, name: 'Vitamin tổng hợp cho chó (60 viên)', category: 'Thuốc & Vitamin', price: 180000, icon: '💊', rating: 4.5, sold: 76 },
  { id: 4, name: 'Combo đồ chơi chuột nhỏ cho mèo', category: 'Đồ chơi', price: 55000, oldPrice: 75000, icon: '🐭', rating: 4.7, sold: 89 },
  { id: 5, name: 'Shampoo thú cưng hương lavender 500ml', category: 'Chăm sóc', price: 120000, icon: '🛁', rating: 4.4, sold: 68 },
  { id: 6, name: 'Cát vệ sinh cho mèo 5kg', category: 'Vệ sinh', price: 95000, icon: '🪣', rating: 4.9, sold: 112 },
  { id: 7, name: 'Vòng chống bọ chét & ve cho chó', category: 'Y tế', price: 145000, icon: '🐕', rating: 4.3, sold: 55 },
  { id: 8, name: 'Chuồng sắt gấp gọn cho chó cỡ vừa', category: 'Chuồng & Nhà', price: 750000, icon: '🏠', rating: 4.6, sold: 21 },
];

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

export const ProductListPage: React.FC = () => (
  <>
    <Header />
    <main className="page-container">
      <div style={{ textAlign: 'center', padding: '40px 20px 28px', background: 'linear-gradient(135deg,#f59e0b,#ef4444)', borderRadius: 16, color: '#fff', marginBottom: 32 }}>
        <div style={{ fontSize: '3rem', marginBottom: 10 }}>🛍️</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 8px' }}>Cửa hàng thú cưng</h1>
        <p style={{ opacity: 0.9, margin: 0 }}>Sản phẩm chất lượng cao, giá tốt nhất thị trường</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 18, marginBottom: 48 }}>
        {products.map(p => (
          <Link key={p.id} to={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #f0f0f0' }}>
              <div style={{ height: 130, background: 'linear-gradient(135deg,#fef9f0,#fef3c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', position: 'relative' }}>
                {p.icon}
                {p.oldPrice && <span style={{ position: 'absolute', top: 10, left: 10, background: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '2px 7px', borderRadius: 10 }}>-{Math.round((1 - p.price / p.oldPrice) * 100)}%</span>}
              </div>
              <div style={{ padding: '14px 16px' }}>
                <span style={{ background: '#ede9fe', color: '#6d28d9', fontSize: '0.72rem', fontWeight: 600, padding: '2px 7px', borderRadius: 5 }}>{p.category}</span>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e1b4b', margin: '8px 0 6px', lineHeight: 1.3 }}>{p.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 800, color: '#ef4444', fontSize: '1rem' }}>{fmt(p.price)}</span>
                    {p.oldPrice && <span style={{ fontSize: '0.8rem', color: '#9ca3af', textDecoration: 'line-through', marginLeft: 6 }}>{fmt(p.oldPrice)}</span>}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>⭐ {p.rating}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: 4 }}>Đã bán: {p.sold}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
    <Footer />
  </>
);