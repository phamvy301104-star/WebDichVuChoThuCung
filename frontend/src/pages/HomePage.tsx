import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@stores/store';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

const WHY_US = [
  { icon: '🛡️', title: 'Bảo hành sức khoẻ đến 1 năm',   desc: '3 gói: Standard 30 ngày · Gold 6 tháng · Premium 1 năm' },
  { icon: '✅', title: 'Cam kết thuần chủng trọn đời',    desc: 'Hoàn tiền hoặc đổi trả bất kỳ lúc nào' },
  { icon: '💉', title: 'Đồng hành 100% 2 mũi tiêm đầu',  desc: 'PetCare chi trả toàn bộ chi phí tiêm phòng' },
  { icon: '🎁', title: 'Hậu mãi trọn đời',               desc: 'Giảm 15–20% dịch vụ spa và phụ kiện' },
];

const STEPS = [
  { num: 1, title: 'Chọn bé', desc: 'Khám phá profile và chọn bé phù hợp với lối sống của bạn.' },
  { num: 2, title: 'Tư vấn & Đặt cọc', desc: 'Chốt lịch nhận bé, hỗ trợ hồ sơ và thanh toán minh bạch.' },
  { num: 3, title: 'Kiểm tra sức khoẻ', desc: 'Khám tổng quát, tiêm phòng đúng lịch trước bàn giao.' },
  { num: 4, title: 'Bàn giao', desc: 'Bé về nhà mới cùng đầy đủ sổ, hướng dẫn và quà tặng.' },
  { num: 5, title: 'Hậu mãi trọn đời', desc: 'Tư vấn liên tục và ưu đãi dịch vụ cho cả vòng đời.' },
];

export const HomePage: React.FC = () => {
  const { products } = useSelector((s: RootState) => s.shop);
  const { services } = useSelector((s: RootState) => s.booking);
  const topProducts = products.filter(p => p.status === 'active').slice(0, 4);
  const topServices = services.filter(s => s.status === 'active').slice(0, 4);

  return (
    <>
      <Header />

      {/* ===== HERO ===== */}
      <section style={{ background: 'linear-gradient(135deg, #fce4ec 0%, #fdf6ec 55%, #eaf4f0 100%)', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 48px 40px', display: 'flex', alignItems: 'center', gap: 48, minHeight: '88vh' }}>
          {/* Left */}
          <div style={{ flex: 1, maxWidth: 580 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.06)', borderRadius: 20, padding: '5px 14px', fontSize: '0.8rem', marginBottom: 28, color: '#555' }}>
              🐾 Chăm sóc thú cưng chuyên nghiệp · Từ 2015
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', fontWeight: 900, color: '#111', lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-0.03em' }}>
              Tìm người bạn bốn chân<br />
              <span style={{ color: '#c7603a', fontStyle: 'italic' }}>của cả gia đình</span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#555', marginBottom: 8, lineHeight: 1.6 }}>
              <b style={{ color: '#111' }}>PetCare</b> | đồng hành cùng hơn <b style={{ color: '#111' }}>+1.000</b> thú cưng về với gia đình mới
            </p>
            <div style={{ fontSize: '0.82rem', color: '#888', marginBottom: 36, display: 'flex', alignItems: 'center', gap: 6 }}>
              📍 Chi nhánh Quận 7, TP.HCM
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              <Link to="/pets" style={{ background: '#111', color: '#fff', padding: '13px 28px', borderRadius: 50, fontWeight: 700, textDecoration: 'none', fontSize: '0.97rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Xem các bé đang tìm chủ →
              </Link>
              <Link to="/services" style={{ background: 'transparent', color: '#111', padding: '13px 28px', borderRadius: 50, fontWeight: 700, textDecoration: 'none', fontSize: '0.97rem', border: '2px solid #111' }}>
                Đặt lịch Spa
              </Link>
            </div>
            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[['⭐', '4.9/5'], ['🏆', '10 năm uy tín'], ['🛡️', 'Bảo hành 1 năm'], ['🚚', 'Giao toàn quốc']].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#555', background: 'rgba(255,255,255,0.75)', padding: '6px 12px', borderRadius: 20, backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.5)' }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Right image */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: 420 }}>
              <div style={{ borderRadius: 28, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.14)', aspectRatio: '4/5' }}>
                <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=700&fit=crop&auto=format" alt="Pet Care" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', padding: '8px 20px', borderRadius: 12, fontSize: '0.78rem', color: '#666', whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                Sắp Mai & Mật · Since 2015
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PETS ===== */}
      <section style={{ background: '#fff', padding: '72px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Gặp gỡ các bé đang đợi ngôi nhà mới</h2>
              <p style={{ color: '#888', margin: 0, fontSize: '0.95rem' }}>Mỗi bé đều xứng đáng có một gia đình yêu thương ❤️</p>
            </div>
            <Link to="/pets" style={{ color: '#111', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', borderBottom: '2px solid #111', paddingBottom: 2, whiteSpace: 'nowrap' }}>Xem tất cả →</Link>
          </div>
          <PetCards />
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section style={{ background: '#faf9f7', padding: '72px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Vì sao chọn PetCare?</h2>
          <p style={{ color: '#888', marginBottom: 40, fontSize: '0.95rem' }}>Cam kết minh bạch, chăm sóc tận tâm</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {WHY_US.map(w => (
              <div key={w.title} style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f0ebe4' }}>
                <div style={{ fontSize: '2rem', marginBottom: 14 }}>{w.icon}</div>
                <h3 style={{ fontWeight: 800, color: '#111', margin: '0 0 8px', fontSize: '0.97rem', lineHeight: 1.4 }}>{w.title}</h3>
                <p style={{ color: '#888', fontSize: '0.86rem', lineHeight: 1.6, margin: 0 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section style={{ background: '#fff', padding: '72px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Dịch vụ chăm sóc chuyên nghiệp</h2>
              <p style={{ color: '#888', margin: 0, fontSize: '0.95rem' }}>Đội ngũ bác sĩ & groomer giàu kinh nghiệm</p>
            </div>
            <Link to="/services" style={{ color: '#111', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', borderBottom: '2px solid #111', paddingBottom: 2, whiteSpace: 'nowrap' }}>Xem tất cả →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
            {topServices.map(s => (
              <Link key={s.id} to={`/booking/${s.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#faf9f7', borderRadius: 20, overflow: 'hidden', border: '1px solid #f0ebe4', transition: 'transform 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = '')}>
                  {s.image && <div style={{ height: 160, overflow: 'hidden' }}><img src={s.image} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                  <div style={{ padding: '16px 18px' }}>
                    <span style={{ background: '#f0ebe4', color: '#8b5e3c', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 10 }}>{s.category}</span>
                    <h3 style={{ fontWeight: 800, color: '#111', margin: '8px 0 4px', fontSize: '0.95rem' }}>{s.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 900, color: '#c7603a' }}>{fmt(s.price)}</span>
                      <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>⏱ {s.duration} phút</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS ===== */}
      <section style={{ background: '#faf9f7', padding: '72px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36 }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Cửa hàng thú cưng</h2>
              <p style={{ color: '#888', margin: 0, fontSize: '0.95rem' }}>Sản phẩm chất lượng cao, giá tốt nhất thị trường</p>
            </div>
            <Link to="/products" style={{ color: '#111', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', borderBottom: '2px solid #111', paddingBottom: 2, whiteSpace: 'nowrap' }}>Xem tất cả →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
            {topProducts.map(p => (
              <Link key={p.id} to={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #f0ebe4', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}>
                  <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                    {p.originalPrice && (
                      <span style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, background: '#ef4444', color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: 8 }}>
                        -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                      </span>
                    )}
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={e => {
                        const t = e.target as HTMLImageElement;
                        t.style.display = 'none';
                        if (t.parentElement) t.parentElement.style.background = 'linear-gradient(135deg,#fef9f0,#fef3c7)';
                        const span = document.createElement('span');
                        span.style.cssText = 'font-size:4rem;display:flex;align-items:center;justify-content:center;height:100%;';
                        span.textContent = '🐾';
                        t.parentElement?.appendChild(span);
                      }} />
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <h3 style={{ fontWeight: 700, color: '#111', margin: '0 0 6px', fontSize: '0.9rem', lineHeight: 1.3, overflow: 'hidden', maxHeight: '2.6rem' }}>{p.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: 800, color: '#c7603a', fontSize: '1rem' }}>{fmt(p.price)}</span>
                        {p.originalPrice && <span style={{ fontSize: '0.78rem', color: '#9ca3af', textDecoration: 'line-through', marginLeft: 6 }}>{fmt(p.originalPrice)}</span>}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>⭐ {p.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section style={{ background: '#fff', padding: '72px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Quy trình nhận bé về nhà</h2>
          <p style={{ color: '#888', marginBottom: 48, fontSize: '0.95rem' }}>Đơn giản · Minh bạch · An tâm</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 24 }}>
            {STEPS.map(s => (
              <div key={s.num} style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem', margin: '0 auto 16px' }}>{s.num}</div>
                <h3 style={{ fontWeight: 800, color: '#111', marginBottom: 8, fontSize: '0.95rem' }}>{s.title}</h3>
                <p style={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section style={{ background: '#111', color: '#fff', padding: '64px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 32, textAlign: 'center' }}>
          {[['1.000+', 'Thú cưng đã về nhà'], ['500+', 'Lịch hẹn/tháng'], ['10+', 'Năm kinh nghiệm'], ['4.9★', 'Đánh giá khách hàng']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: 6, color: '#f0c080', letterSpacing: '-0.02em' }}>{v}</div>
              <div style={{ color: '#aaa', fontSize: '0.88rem' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CONTACT CTA ===== */}
      <section style={{ background: '#fff', padding: '72px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 20 }}>🐾</div>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#111', marginBottom: 12, letterSpacing: '-0.02em' }}>Sẵn sàng đón người bạn mới về nhà?</h2>
          <p style={{ color: '#888', marginBottom: 32, lineHeight: 1.7 }}>Liên hệ qua Zalo hoặc gọi hotline — PetCare luôn sẵn sàng tư vấn</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:0900123456" style={{ background: '#111', color: '#fff', padding: '13px 28px', borderRadius: 50, fontWeight: 700, textDecoration: 'none', fontSize: '0.97rem' }}>📞 0900.123.456</a>
            <Link to="/pets" style={{ background: 'transparent', color: '#111', padding: '13px 28px', borderRadius: 50, fontWeight: 700, textDecoration: 'none', fontSize: '0.97rem', border: '2px solid #111' }}>Xem các bé →</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

// Pet cards component reading from Redux
const PetCards: React.FC = () => {
  const pets = [
    { id: 'p1', name: 'Max', breed: 'Golden Retriever', age: '3 tuổi', gender: '♂', price: 0, status: 'Nhận nuôi', tags: ['Thân thiện', 'Thích trẻ em'], image: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=400&h=320&fit=crop&auto=format', vaccinated: true },
    { id: 'p2', name: 'Bella', breed: 'Maine Coon', age: '8 tháng', gender: '♀', price: 0, status: 'Nhận nuôi', tags: ['Lanh lợi', 'Tình cảm'], image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=320&fit=crop&auto=format', vaccinated: true },
    { id: 'p3', name: 'Buddy', breed: 'Corgi', age: '1 tuổi', gender: '♂', price: 5000000, status: 'Mua', tags: ['Năng động', 'Thông minh'], image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=320&fit=crop&auto=format', vaccinated: true },
    { id: 'p4', name: 'Rocky', breed: 'Siberian Husky', age: '2 tuổi', gender: '♂', price: 8000000, status: 'Mua', tags: ['Năng động', 'Trung thành'], image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400&h=320&fit=crop&auto=format', vaccinated: true },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20 }}>
      {pets.map(p => (
        <Link key={p.id} to="/pets" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #f0ebe4', transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; }}>
            <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 1, background: p.price === 0 ? '#dcfce7' : '#fef3c7', color: p.price === 0 ? '#166534' : '#92400e', fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: 10 }}>
              {p.status === 'Nhận nuôi' ? '🏠 Nhận nuôi' : '🏷️ Có sẵn'}
            </div>
            <div style={{ height: 200, overflow: 'hidden' }}><img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
            <div style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <h3 style={{ fontWeight: 900, color: '#111', margin: 0, fontSize: '1.15rem' }}>{p.name} <span style={{ color: p.gender === '♀' ? '#ec4899' : '#3b82f6', fontSize: '0.9rem' }}>{p.gender}</span></h3>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#d1d5db' }}>♡</button>
              </div>
              <p style={{ color: '#888', fontSize: '0.82rem', marginBottom: 10 }}>{p.breed} · {p.age}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {p.tags.map(t => <span key={t} style={{ background: '#f0ebe4', color: '#8b5e3c', padding: '3px 10px', borderRadius: 10, fontSize: '0.72rem', fontWeight: 600 }}>{t}</span>)}
                {p.vaccinated && <span style={{ background: '#f0fdf4', color: '#166534', padding: '3px 10px', borderRadius: 10, fontSize: '0.72rem', fontWeight: 600 }}>✓ Tiêm phòng</span>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 900, color: p.price === 0 ? '#166534' : '#c7603a', fontSize: '1rem' }}>{p.price === 0 ? 'Miễn phí' : fmt(p.price)}</span>
                <span style={{ color: '#111', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>Xem bé →</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};