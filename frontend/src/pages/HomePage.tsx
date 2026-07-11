import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

const featuredPets = [
  { id: 'p1', name: 'Max', species: 'Chó', breed: 'Golden Retriever', age: '3 tuổi', image: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=400&h=260&fit=crop&auto=format' },
  { id: 'p3', name: 'Buddy', species: 'Chó', breed: 'Corgi', age: '1 tuổi', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=260&fit=crop&auto=format' },
  { id: 'p2', name: 'Bella', species: 'Mèo', breed: 'Maine Coon', age: '8 tháng', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=260&fit=crop&auto=format' },
  { id: 'p5', name: 'Coco', species: 'Thỏ', breed: 'Holland Lop', age: '6 tháng', image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=260&fit=crop&auto=format' },
];

const services = [
  { icon: '✂️', name: 'Spa & Grooming', desc: 'Tắm, cắt lông, vệ sinh tai móng', price: 'Từ 150.000đ' },
  { icon: '🩺', name: 'Khám sức khoẻ', desc: 'Kiểm tra toàn diện, tư vấn dinh dưỡng', price: 'Từ 200.000đ' },
  { icon: '💉', name: 'Tiêm phòng', desc: 'Vaccine đầy đủ theo lịch', price: 'Từ 250.000đ' },
  { icon: '🏥', name: 'Phẫu thuật', desc: 'Triệt sản, điều trị nội khoa', price: 'Từ 1.500.000đ' },
];

export const HomePage: React.FC = () => (
  <>
    <Header />

    {/* ===== HERO ===== */}
    <section style={{
      background: 'linear-gradient(135deg, #fce4ec 0%, #fdf6ec 50%, #eaf4f0 100%)',
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      padding: '0 5vw',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Left content */}
      <div style={{ flex: 1, maxWidth: 560, zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.06)', borderRadius: 20, padding: '5px 14px', fontSize: '0.82rem', marginBottom: 24, color: '#555' }}>
          🐾 Chăm sóc thú cưng chuyên nghiệp · Từ 2015
        </div>

        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.2, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
          Tìm người bạn bốn chân<br />
          <span style={{ color: '#c7603a' }}>của cả gia đình</span>
        </h1>

        <p style={{ fontSize: '1.05rem', color: '#555', marginBottom: 12, lineHeight: 1.6 }}>
          <b>PetCare</b> | đồng hành cùng hơn <b style={{ color: '#1a1a1a' }}>+1.000</b> thú cưng về với gia đình mới
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#888', marginBottom: 32 }}>
          📍 Chi nhánh Quận 7, TP.HCM
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
          <Link to="/pets" style={{
            background: '#1a1a1a', color: '#fff', padding: '13px 28px', borderRadius: 50,
            fontWeight: 700, textDecoration: 'none', fontSize: '0.97rem', display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            Xem các bé đang tìm chủ →
          </Link>
          <Link to="/services" style={{
            background: 'transparent', color: '#1a1a1a', padding: '13px 28px', borderRadius: 50,
            fontWeight: 700, textDecoration: 'none', fontSize: '0.97rem', border: '2px solid #1a1a1a',
          }}>
            Đặt lịch Spa
          </Link>
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[['⭐', '4.9/5'], ['🏆', '10 năm uy tín'], ['💊', 'Bảo hành sức khoẻ 1 năm'], ['🚚', 'Giao toàn quốc']].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.83rem', color: '#555', background: 'rgba(255,255,255,0.7)', padding: '6px 14px', borderRadius: 20, backdropFilter: 'blur(4px)' }}>
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Hero image card */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 0' }}>
        <div style={{ position: 'relative', width: 400, height: 440 }}>
          <div style={{ width: '100%', height: '100%', borderRadius: 28, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=520&fit=crop&auto=format"
              alt="Pet Care"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', padding: '8px 20px', borderRadius: 12, fontSize: '0.8rem', color: '#666', whiteSpace: 'nowrap' }}>
            Sắp có bé mới · Since 2015
          </div>
        </div>
      </div>
    </section>

    {/* ===== FEATURED PETS ===== */}
    <section style={{ background: '#fff', padding: '64px 5vw' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a1a', margin: '0 0 6px' }}>Gặp gỡ các bé đang đợi ngôi nhà mới</h2>
            <p style={{ color: '#888', margin: 0 }}>{featuredPets.length} bé đang chờ được yêu thương</p>
          </div>
          <Link to="/pets" style={{ color: '#1a1a1a', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', borderBottom: '2px solid #1a1a1a', paddingBottom: 2 }}>Xem tất cả →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
          {featuredPets.map(p => (
            <Link key={p.id} to="/pets" style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #f0ebe4', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; }}
              >
                <div style={{ height: 200, overflow: 'hidden' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = '')}
                  />
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <h3 style={{ fontWeight: 800, color: '#1a1a1a', margin: 0, fontSize: '1.1rem' }}>{p.name}</h3>
                    <span style={{ background: '#f0ebe4', color: '#8b5e3c', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 10 }}>Nhận nuôi</span>
                  </div>
                  <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>{p.breed} · {p.age}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* ===== SERVICES ===== */}
    <section style={{ background: '#fff9f4', padding: '64px 5vw' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a1a', margin: '0 0 6px' }}>Dịch vụ chăm sóc chuyên nghiệp</h2>
            <p style={{ color: '#888', margin: 0 }}>Đội ngũ bác sĩ & groomer giàu kinh nghiệm</p>
          </div>
          <Link to="/services" style={{ color: '#1a1a1a', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', borderBottom: '2px solid #1a1a1a', paddingBottom: 2 }}>Xem tất cả →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 20 }}>
          {services.map(s => (
            <Link key={s.name} to="/services" style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0ebe4', transition: 'transform 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = '')}
              >
                <div style={{ fontSize: '2.4rem', marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px', fontSize: '1rem' }}>{s.name}</h3>
                <p style={{ color: '#888', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 16px' }}>{s.desc}</p>
                <span style={{ fontWeight: 800, color: '#c7603a', fontSize: '0.95rem' }}>{s.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* ===== STATS BANNER ===== */}
    <section style={{ background: '#1a1a1a', color: '#fff', padding: '48px 5vw' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 32, textAlign: 'center' }}>
        {[['1.000+','Thú cưng đã về nhà'],['500+','Lịch hẹn/tháng'],['50+','Dịch vụ spa'],['4.9★','Đánh giá khách hàng']].map(([v, l]) => (
          <div key={l}>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: 6, color: '#f0c080' }}>{v}</div>
            <div style={{ color: '#aaa', fontSize: '0.9rem' }}>{l}</div>
          </div>
        ))}
      </div>
    </section>

    <Footer />
  </>
);