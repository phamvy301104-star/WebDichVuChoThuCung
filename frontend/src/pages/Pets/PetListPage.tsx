import React, { useState, useMemo } from 'react';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';
import { useSelector } from 'react-redux';
import { RootState } from '@stores/store';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

const MOCK_PETS = [
  { id: 'p1', name: 'Max', species: 'Chó', breed: 'Golden Retriever', age: 3, ageLabel: '3 tuổi', gender: '♂', image: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=400&h=320&fit=crop&auto=format', tags: ['Thân thiện', 'Thích trẻ em', 'Hiền lành'], price: 0, listingType: 'adoption', vaccinated: true, vaccineCount: 3, status: 'available' },
  { id: 'p2', name: 'Bella', species: 'Mèo', breed: 'Maine Coon', age: 1, ageLabel: '8 tháng', gender: '♀', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=320&fit=crop&auto=format', tags: ['Lanh lợi', 'Tình cảm', 'Thích ôm'], price: 0, listingType: 'adoption', vaccinated: true, vaccineCount: 2, status: 'available' },
  { id: 'p3', name: 'Buddy', species: 'Chó', breed: 'Corgi Pembroke', age: 1, ageLabel: '1 tuổi', gender: '♂', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=320&fit=crop&auto=format', tags: ['Năng động', 'Thông minh', 'Vâng lời'], price: 5000000, listingType: 'sale', vaccinated: true, vaccineCount: 3, status: 'available' },
  { id: 'p4', name: 'Whiskers', species: 'Mèo', breed: 'Ba Tư', age: 4, ageLabel: '4 tuổi', gender: '♂', image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400&h=320&fit=crop&auto=format', tags: ['Điềm tĩnh', 'Sang chảnh'], price: 0, listingType: 'adoption', vaccinated: true, vaccineCount: 2, status: 'rescue' },
  { id: 'p5', name: 'Coco', species: 'Thỏ', breed: 'Holland Lop', age: 1, ageLabel: '6 tháng', gender: '♀', image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=320&fit=crop&auto=format', tags: ['Đáng yêu', 'Im lặng', 'Phù hợp căn hộ'], price: 1200000, listingType: 'sale', vaccinated: false, vaccineCount: 0, status: 'available' },
  { id: 'p6', name: 'Luna', species: 'Mèo', breed: 'Exotic Shorthair', age: 2, ageLabel: '2 tuổi', gender: '♀', image: 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=400&h=320&fit=crop&auto=format', tags: ['Béo tròn', 'Thích âu yếm'], price: 0, listingType: 'adoption', vaccinated: true, vaccineCount: 3, status: 'available' },
  { id: 'p7', name: 'Rocky', species: 'Chó', breed: 'Siberian Husky', age: 2, ageLabel: '2 tuổi', gender: '♂', image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=320&fit=crop&auto=format', tags: ['Năng động', 'Trung thành', 'Ít sủa'], price: 8000000, listingType: 'sale', vaccinated: true, vaccineCount: 3, status: 'available' },
  { id: 'p8', name: 'Milo', species: 'Chó', breed: 'Poodle Tiny', age: 1, ageLabel: '5 tháng', gender: '♂', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=320&fit=crop&auto=format', tags: ['Không rụng lông', 'Thông minh', 'Thân thiện'], price: 6500000, listingType: 'sale', vaccinated: true, vaccineCount: 2, status: 'available' },
];

export const PetListPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'Chó' | 'Mèo' | 'Thỏ'>('all');
  const [type, setType] = useState<'all' | 'adoption' | 'sale'>('all');

  const displayed = useMemo(() => MOCK_PETS.filter(p =>
    (filter === 'all' || p.species === filter) &&
    (type === 'all' || p.listingType === type)
  ), [filter, type]);

  const FILTERS = [{ k: 'all', l: 'Tất cả' }, { k: 'Chó', l: 'Chó' }, { k: 'Mèo', l: 'Mèo' }, { k: 'Thỏ', l: 'Thỏ' }];
  const TYPES = [{ k: 'all', l: 'Tất cả' }, { k: 'adoption', l: '🏠 Nhận nuôi' }, { k: 'sale', l: '🏷️ Mua bé' }];

  return (
    <>
      <Header />
      <main className="page-container">
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '56px 20px 40px', background: 'linear-gradient(135deg,#fce4ec,#f0e8f8)', borderRadius: 20, color: '#111', marginBottom: 40, border: '1px solid #f0ebe4' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 14 }}>🐾</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, margin: '0 0 12px', letterSpacing: '-0.02em' }}>Nhận nuôi & Mua thú cưng</h1>
          <p style={{ opacity: 0.7, margin: '0 auto', maxWidth: 480, lineHeight: 1.6 }}>Mỗi thú cưng đều xứng đáng có một ngôi nhà yêu thương ❤️</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f.k} onClick={() => setFilter(f.k as any)}
              style={{ padding: '8px 18px', borderRadius: 50, border: `2px solid ${filter === f.k ? '#111' : '#e5e7eb'}`, background: filter === f.k ? '#111' : '#fff', color: filter === f.k ? '#fff' : '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem', transition: 'all 0.15s' }}>
              {f.l}
            </button>
          ))}
          <div style={{ width: 1, background: '#e5e7eb', margin: '0 4px' }} />
          {TYPES.map(t => (
            <button key={t.k} onClick={() => setType(t.k as any)}
              style={{ padding: '8px 18px', borderRadius: 50, border: `2px solid ${type === t.k ? '#c7603a' : '#e5e7eb'}`, background: type === t.k ? '#c7603a' : '#fff', color: type === t.k ? '#fff' : '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem', transition: 'all 0.15s' }}>
              {t.l}
            </button>
          ))}
        </div>
        <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: 28 }}>{displayed.length} bé đang chờ bạn</p>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 22, marginBottom: 56 }}>
          {displayed.map(p => (
            <div key={p.id} style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #f0ebe4', transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; }}>

              {/* Status badge */}
              <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, background: p.status === 'rescue' ? '#fef3c7' : p.listingType === 'adoption' ? '#dcfce7' : '#dbeafe', color: p.status === 'rescue' ? '#92400e' : p.listingType === 'adoption' ? '#166534' : '#1e40af', fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: 10 }}>
                {p.status === 'rescue' ? '🆘 Cần cứu hộ' : p.listingType === 'adoption' ? '🏠 Nhận nuôi' : '🏷️ Có sẵn'}
              </div>
              <button style={{ position: 'absolute', top: 10, right: 12, zIndex: 2, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>♡</button>

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
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
                  {p.tags.map(t => <span key={t} style={{ background: '#f0ebe4', color: '#8b5e3c', padding: '3px 9px', borderRadius: 10, fontSize: '0.7rem', fontWeight: 600 }}>{t}</span>)}
                </div>
                {p.vaccinated && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: '#166534', marginBottom: 12, background: '#f0fdf4', padding: '5px 10px', borderRadius: 8, display: 'inline-flex' }}>
                    💉 Đã tiêm {p.vaccineCount} mũi
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
      </main>
      <Footer />
    </>
  );
};