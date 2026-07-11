import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '@components/Auth/LoginForm';

export const LoginPage: React.FC = () => (
  <div style={{ minHeight: '100vh', display: 'flex', background: '#fff9f4' }}>
    {/* Left panel */}
    <div style={{ flex: 1, background: 'linear-gradient(160deg,#1a1a1a 0%,#2d2d2d 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 30% 70%, rgba(199,96,58,0.15) 0%, transparent 60%)' }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 360, textAlign: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
          <span style={{ fontSize: '2.5rem' }}>🐾</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.02em' }}>PetCare</div>
            <div style={{ fontSize: '0.65rem', color: '#aaa', letterSpacing: '0.12em' }}>SINCE 2015 · PEACE OF MIND</div>
          </div>
        </Link>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2 }}>Chào mừng<br />trở lại! 👋</h2>
        <p style={{ color: '#aaa', lineHeight: 1.7, marginBottom: 40 }}>Đăng nhập để quản lý đơn hàng, lịch hẹn và hồ sơ thú cưng của bạn.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
          {[['🛍️', 'Theo dõi đơn hàng & lịch sử mua sắm'],['📅', 'Quản lý lịch hẹn spa & dịch vụ'],['🐾', 'Hồ sơ thú cưng cá nhân']].map(([icon,text])=>(
            <div key={text as string} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.2rem' }}>{icon}</span>
              <span style={{ color: '#ddd', fontSize: '0.9rem' }}>{text as string}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    {/* Right panel */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <LoginForm />
        <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 20, borderTop: '1px solid #f0ebe4' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#9ca3af', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500, transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#111')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>
            ← Về trang chủ không cần đăng nhập
          </Link>
        </div>
      </div>
    </div>
  </div>
);
