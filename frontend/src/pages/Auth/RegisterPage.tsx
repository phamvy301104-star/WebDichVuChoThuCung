import React from 'react';
import { Link } from 'react-router-dom';
import { RegisterForm } from '@components/Auth/RegisterForm';

export const RegisterPage: React.FC = () => (
  <div style={{ minHeight: '100vh', display: 'flex', background: '#fff9f4' }}>
    {/* Left panel */}
    <div style={{ flex: 1, background: 'linear-gradient(160deg,#c7603a 0%,#1a1a1a 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 360, textAlign: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
          <span style={{ fontSize: '2.5rem' }}>🐾</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.02em' }}>PetCare</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em' }}>SINCE 2015 · PEACE OF MIND</div>
          </div>
        </Link>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.2 }}>Tạo tài khoản<br />ngay hôm nay! 🎉</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 40 }}>Tham gia cùng hơn 1.000 gia đình đang tin tưởng PetCare.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
          {[['🎁', 'Nhận ưu đãi 10% cho đơn đầu tiên'],['🛡️', 'Bảo hành thú cưng đến 1 năm'],['📞', 'Hỗ trợ 24/7 từ đội ngũ chuyên gia']].map(([icon,text])=>(
            <div key={text as string} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.2rem' }}>{icon}</span>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{text as string}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    {/* Right panel */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', overflowY: 'auto' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <RegisterForm />
      </div>
    </div>
  </div>
);
