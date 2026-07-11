import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@stores/store';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

export const PetListPage: React.FC = () => {
  const { pets } = useSelector((s: RootState) => s.petMgmt);
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);
  const [filter, setFilter] = useState<string>('all');
  const [type, setType] = useState<string>('all');

  // Only show approved pets
  const approved = pets.filter(p => p.publishStatus === 'approved');
  const displayed = useMemo(() => approved.filter(p =>
    (filter === 'all' || p.species === filter) &&
    (type === 'all' || p.listingType === type)
  ), [approved, filter, type]);

  const FILTERS = [{ k: 'all', l: 'Tất cả' }, { k: 'Chó', l: '🐕 Chó' }, { k: 'Mèo', l: '🐱 Mèo' }, { k: 'Thỏ', l: '🐇 Thỏ' }];
  const TYPES = [{ k: 'all', l: 'Tất cả' }, { k: 'adoption', l: '🏠 Nhận nuôi' }, { k: 'sale', l: '🏷️ Mua bé' }];

  return (
    <>
      <Header />
      <main className="page-container">
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '56px 20px 40px', background: 'linear-gradient(135deg,#fce4ec,#f0e8f8)', borderRadius: 20, color: '#111', marginBottom: 40, border: '1px solid #f0ebe4' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 14 }}>🐾</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, margin: '0 0 12px', letterSpacing: '-0.02em' }}>Nhận nuôi & Mua thú cưng</h1>
          <p style={{ opacity: 0.7, margin: '0 auto 24px', maxWidth: 480, lineHeight: 1.6 }}>Mỗi thú cưng đều xứng đáng có một ngôi nhà yêu thương ❤️</p>
          <Link to="/submit-pet" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#111', color: '#fff', padding: '11px 24px', borderRadius: 50, textDecoration: 'none', fontWeight: 700, fontSize: '0.92rem' }}>
            📤 Đăng thú cưng của bạn
          </Link>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {FILTERS.map(f => (
            <button key={f.k} onClick={() => setFilter(f.k)}
              style={{ padding: '8px 18px', borderRadius: 50, border: `2px solid ${filter === f.k ? '#111' : '#e5e7eb'}`, background: filter === f.k ? '#111' : '#fff', color: filter === f.k ? '#fff' : '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>
              {f.l}
            </button>
          ))}
          <div style={{ width: 1, height: 24, background: '#e5e7eb', margin: '0 4px' }} />
          {TYPES.map(t => (
            <button key={t.k} onClick={() => setType(t.k)}
              style={{ padding: '8px 18px', borderRadius: 50, border: `2px solid ${type === t.k ? '#c7603a' : '#e5e7eb'}`, background: type === t.k ? '#c7603a' : '#fff', color: type === t.k ? '#fff' : '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>
              {t.l}
            </button>
          ))}
        </div>
        <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: 28 }}>{displayed.length} bé đang chờ bạn</p>

        {/* Grid */}
        {displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px', color: '#9ca3af' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🐾</div>
            <p>Chưa có thú cưng nào phù hợp bộ lọc này.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 22, marginBottom: 56 }}>
            {displayed.map(p => (
              <div key={p.id} style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #f0ebe4', transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; }}>
                <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, background: p.status === 'rescue' ? '#fef3c7' : p.listingType === 'adoption' ? '#dcfce7' : '#dbeafe', color: p.status === 'rescue' ? '#92400e' : p.listingType === 'adoption' ? '#166534' : '#1e40af', fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: 10 }}>
                  {p.status === 'rescue' ? '🆘 Cần cứu hộ' : p.listingType === 'adoption' ? '🏠 Nhận nuôi' : '🏷️ Có sẵn'}
                </div>
                <div style={{ height: 210, overflow: 'hidden' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = '')} />
                </div>
                <div style={{ padding: '16px 18px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <h3 style={{ fontWeight: 900, color: '#111', margin: 0, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
                      {p.name} <span style={{ color: p.gender === '♀' ? '#ec4899' : '#3b82f6', fontSize: '0.88rem' }}>{p.gender}</span>
                    </h3>
                  </div>
                  <p style={{ color: '#888', fontSize: '0.82rem', marginBottom: 10 }}>{p.breed} · {p.ageLabel}</p>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                    {p.tags.slice(0, 3).map(t => <span key={t} style={{ background: '#f0ebe4', color: '#8b5e3c', padding: '3px 9px', borderRadius: 10, fontSize: '0.7rem', fontWeight: 600 }}>{t}</span>)}
                  </div>
                  {p.vaccinated && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: '#166534', marginBottom: 12, background: '#f0fdf4', padding: '4px 10px', borderRadius: 8 }}>
                      💉 Đã tiêm {p.vaccineCount} mũi
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                    <span style={{ fontWeight: 900, color: p.price === 0 ? '#166534' : '#c7603a', fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
                      {p.price === 0 ? 'Miễn phí' : fmt(p.price)}
                    </span>
                    <button style={{ background: '#111', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 50, fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}>
                      Xem bé →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA for submitting */}
        <div style={{ background: 'linear-gradient(135deg,#fce4ec,#fdf6ec)', borderRadius: 20, padding: '40px 32px', textAlign: 'center', border: '1px solid #f0ebe4', marginBottom: 40 }}>
          <h3 style={{ fontWeight: 900, color: '#111', marginBottom: 10, fontSize: '1.4rem' }}>Bạn có thú cưng cần tìm nhà mới?</h3>
          <p style={{ color: '#888', marginBottom: 20, lineHeight: 1.6 }}>Đăng bài tìm nhà hoặc bán thú cưng. Admin sẽ xét duyệt trong 24 giờ.</p>
          <Link to="/submit-pet" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#111', color: '#fff', padding: '12px 28px', borderRadius: 50, textDecoration: 'none', fontWeight: 700 }}>
            📤 Đăng bài ngay
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
};