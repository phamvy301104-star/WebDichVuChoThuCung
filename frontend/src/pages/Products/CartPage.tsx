import React from 'react';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

const cartItems = [
  { id: 1, icon: '🐱', name: 'Thức ăn mèo Royal Canin 400g', price: 185000, qty: 2 },
  { id: 2, icon: '🐭', name: 'Combo đồ chơi chuột nhỏ cho mèo', price: 55000, qty: 1 },
];

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';
const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

export const CartPage: React.FC = () => (
  <>
    <Header />
    <main className="page-container" style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontWeight: 800, fontSize: '1.8rem', color: '#1e1b4b', marginBottom: 24 }}>🛒 Giỏ hàng</h1>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden', marginBottom: 20 }}>
        {cartItems.map(item => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ width: 64, height: 64, background: '#fef3c7', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#1e1b4b', marginBottom: 4 }}>{item.name}</div>
              <div style={{ color: '#ef4444', fontWeight: 700 }}>{fmt(item.price)}</div>
            </div>
            <div style={{ color: '#374151', fontWeight: 600 }}>x{item.qty}</div>
            <div style={{ fontWeight: 800, color: '#6366f1', minWidth: 90, textAlign: 'right' }}>{fmt(item.price * item.qty)}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#6b7280', marginBottom: 4 }}>Tổng cộng</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ef4444' }}>{fmt(total)}</div>
        </div>
        <button style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 10, fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Đặt hàng</button>
      </div>
    </main>
    <Footer />
  </>
);