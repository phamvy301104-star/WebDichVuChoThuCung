import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

export const UnauthorizedPage: React.FC = () => (
  <>
    <Header />
    <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ fontSize: '5rem' }}>🚫</div>
      <h1 style={{ color: '#ef4444', fontSize: '2rem', margin: 0 }}>Truy cập bị từ chối</h1>
      <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Bạn không có quyền truy cập trang này.</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Link to="/" style={{ padding: '0.6rem 1.5rem', background: '#6366f1', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
          🏠 Về trang chủ
        </Link>
        <Link to="/auth/login" style={{ padding: '0.6rem 1.5rem', background: '#f1f5f9', color: '#374151', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
          🔐 Đăng nhập
        </Link>
      </div>
    </main>
    <Footer />
  </>
);
