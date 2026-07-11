import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@stores/store';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

export const ServiceListPage: React.FC = () => {
  const { services } = useSelector((s: RootState) => s.booking);
  const active = services.filter(s => s.status === 'active');

  return (
    <>
      <Header />
      <main className="page-container">
        <div style={{ textAlign: 'center', padding: '48px 20px 32px', background: 'linear-gradient(135deg,#fce4ec,#fdf6ec)', borderRadius: 16, color: '#1a1a1a', marginBottom: 32, border: '1px solid #f0ebe4' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>✂️</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 10px', color: '#1a1a1a' }}>Dịch vụ chăm sóc thú cưng</h1>
          <p style={{ fontSize: '1.05rem', opacity: 0.7, margin: 0, color: '#555' }}>{active.length} dịch vụ · Đội ngũ chuyên nghiệp, tận tâm</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20, marginBottom: 48 }}>
          {active.map(s => (
            <div key={s.id} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #f0ebe4', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = '')}>
              {s.image && <div style={{ height: 180, overflow: 'hidden' }}><img src={s.image} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ background: '#f0ebe4', color: '#8b5e3c', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 10 }}>{s.category}</span>
                  <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>⏱ {s.duration} phút</span>
                </div>
                <h3 style={{ fontWeight: 800, color: '#1a1a1a', margin: '8px 0 6px', fontSize: '1rem' }}>{s.name}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.86rem', lineHeight: 1.6, margin: '0 0 12px' }}>{s.description}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {s.petTypes.map(t => <span key={t} style={{ background: '#f0ebe4', color: '#8b5e3c', padding: '2px 8px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>{t}</span>)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 900, color: '#c7603a', fontSize: '1.1rem' }}>{fmt(s.price)}</span>
                  <Link to={`/booking/${s.id}`} style={{ background: '#1a1a1a', color: '#fff', padding: '8px 18px', borderRadius: 50, textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}>Đặt lịch →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {active.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>Chưa có dịch vụ nào.</div>}
      </main>
      <Footer />
    </>
  );
};