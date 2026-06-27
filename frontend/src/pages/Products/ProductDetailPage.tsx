import React from 'react';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

export const ProductDetailPage: React.FC = () => (
  <>
    <Header />
    <main className="page-container" style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        <div style={{ background: 'linear-gradient(135deg,#fef9f0,#fef3c7)', borderRadius: 16, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8rem' }}>🐱</div>
        <div>
          <span style={{ background: '#ede9fe', color: '#6d28d9', fontSize: '0.78rem', fontWeight: 600, padding: '3px 10px', borderRadius: 6 }}>Thức ăn</span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e1b4b', margin: '12px 0 8px' }}>Thức ăn mèo Royal Canin 400g</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ef4444' }}>185.000đ</span>
            <span style={{ fontSize: '1rem', color: '#9ca3af', textDecoration: 'line-through' }}>220.000đ</span>
            <span style={{ background: '#fee2e2', color: '#ef4444', padding: '2px 8px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700 }}>-16%</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <span style={{ background: '#f0fdf4', color: '#166534', padding: '4px 10px', borderRadius: 8, fontSize: '0.82rem' }}>⭐ 4.8</span>
            <span style={{ background: '#f3f4f6', color: '#374151', padding: '4px 10px', borderRadius: 8, fontSize: '0.82rem' }}>Đã bán: 124</span>
          </div>
          <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: 24 }}>Thức ăn hạt cao cấp dành cho mèo trưởng thành, bổ sung đầy đủ dinh dưỡng, tốt cho tiêu hoá và lông mượt.</p>
          <div style={{ background: '#f9fafb', borderRadius: 10, padding: 16, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: '#6b7280' }}>Thương hiệu</span><b>Royal Canin</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: '#6b7280' }}>Trọng lượng</span><b>400g</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6b7280' }}>Xuất xứ</span><b>Pháp</b></div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </>
);