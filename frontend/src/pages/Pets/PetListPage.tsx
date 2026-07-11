import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { ManagedPet } from '@stores/slices/petMgmtSlice';
import { addToCart } from '@stores/slices/cartSlice';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

const PetImg: React.FC<{ src: string; alt: string; style?: React.CSSProperties }> = ({ src, alt, style }) => {
  const [err, setErr] = useState(false);
  const ICONS: Record<string, string> = { Chó: '🐕', Mèo: '🐱', Thỏ: '🐇', default: '🐾' };
  const icon = (alt.toLowerCase().includes('chó') ? '🐕' : alt.toLowerCase().includes('mèo') ? '🐱' : alt.toLowerCase().includes('thỏ') ? '🐇' : '🐾');
  if (err || !src) return <div style={{ ...style, background: 'linear-gradient(135deg,#fce4ec,#f0e8f8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>{icon}</div>;
  return <img src={src} alt={alt} style={{ ...style, objectFit: 'cover', display: 'block' }} onError={() => setErr(true)} />;
};

const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 };

export const PetListPage: React.FC = () => {
  const { pets } = useSelector((s: RootState) => s.petMgmt);
  const { user } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [type, setType] = useState('all');
  const [selected, setSelected] = useState<ManagedPet | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [contactForm, setContactForm] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '', message: '' });
  const [sent, setSent] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const approved = pets.filter(p => p.publishStatus === 'approved');
  const displayed = useMemo(() => approved.filter(p =>
    (filter === 'all' || p.species === filter) &&
    (type === 'all' || p.listingType === type)
  ), [approved, filter, type]);

  const openPet = (p: ManagedPet) => { setSelected(p); setSent(false); setAddedToCart(false); setShowContact(false); setContactForm({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '', message: '' }); };
  const closePet = () => { setSelected(null); setShowContact(false); setSent(false); setAddedToCart(false); };

  const handleAddToCart = (p: ManagedPet) => {
    dispatch(addToCart({
      product: {
        _id: p.id, id: p.id,
        name: `🐾 ${p.name} — ${p.breed}`,
        price: p.price,
        image: p.image,
        description: p.description,
        rating: 5,
      } as any,
      quantity: 1,
    }));
    setAddedToCart(true);
  };

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) return alert('Vui lòng điền họ tên và số điện thoại.');
    setSent(true);
  };

  const FILTERS = [{ k: 'all', l: 'Tất cả' }, { k: 'Chó', l: '🐕 Chó' }, { k: 'Mèo', l: '🐱 Mèo' }, { k: 'Thỏ', l: '🐇 Thỏ' }];
  const TYPES = [{ k: 'all', l: 'Tất cả' }, { k: 'adoption', l: '🏠 Nhận nuôi' }, { k: 'sale', l: '🏷️ Mua bé' }];

  return (
    <>
      <Header />
      <main className="page-container">
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '52px 20px 36px', background: 'linear-gradient(135deg,#fce4ec,#f0e8f8)', borderRadius: 20, marginBottom: 36, border: '1px solid #f0ebe4' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 14 }}>🐾</div>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 900, margin: '0 0 10px', color: '#111' }}>Nhận nuôi & Mua thú cưng</h1>
          <p style={{ opacity: 0.7, margin: '0 auto 24px', maxWidth: 480, lineHeight: 1.6, color: '#444' }}>Mỗi thú cưng đều xứng đáng có một ngôi nhà yêu thương ❤️</p>
          <Link to="/submit-pet" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#111', color: '#fff', padding: '11px 24px', borderRadius: 50, textDecoration: 'none', fontWeight: 700, fontSize: '0.92rem' }}>
            📤 Đăng thú cưng của bạn
          </Link>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {FILTERS.map(f => <button key={f.k} onClick={() => setFilter(f.k)} style={{ padding: '8px 18px', borderRadius: 50, border: `2px solid ${filter === f.k ? '#111' : '#e5e7eb'}`, background: filter === f.k ? '#111' : '#fff', color: filter === f.k ? '#fff' : '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>{f.l}</button>)}
          <div style={{ width: 1, height: 24, background: '#e5e7eb', margin: '0 4px' }} />
          {TYPES.map(t => <button key={t.k} onClick={() => setType(t.k)} style={{ padding: '8px 18px', borderRadius: 50, border: `2px solid ${type === t.k ? '#c7603a' : '#e5e7eb'}`, background: type === t.k ? '#c7603a' : '#fff', color: type === t.k ? '#fff' : '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>{t.l}</button>)}
        </div>
        <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: 28 }}>{displayed.length} bé đang chờ bạn</p>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 22, marginBottom: 48 }}>
          {displayed.map(p => (
            <div key={p.id} onClick={() => openPet(p)}
              style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #f0ebe4', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', position: 'relative' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; }}>
              <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, background: p.status === 'rescue' ? '#fef3c7' : p.listingType === 'adoption' ? '#dcfce7' : '#dbeafe', color: p.status === 'rescue' ? '#92400e' : p.listingType === 'adoption' ? '#166534' : '#1e40af', fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: 10 }}>
                {p.status === 'rescue' ? '🆘 Cần cứu hộ' : p.listingType === 'adoption' ? '🏠 Nhận nuôi' : '🏷️ Có sẵn'}
              </div>
              <PetImg src={p.image} alt={p.name} style={{ width: '100%', height: 210 }} />
              <div style={{ padding: '16px 18px 18px' }}>
                <h3 style={{ fontWeight: 900, color: '#111', margin: '0 0 4px', fontSize: '1.1rem' }}>{p.name} <span style={{ color: p.gender === '♀' ? '#ec4899' : '#3b82f6', fontSize: '0.88rem' }}>{p.gender}</span></h3>
                <p style={{ color: '#888', fontSize: '0.82rem', marginBottom: 10 }}>{p.breed} · {p.ageLabel}</p>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                  {p.tags.slice(0, 3).map(t => <span key={t} style={{ background: '#f0ebe4', color: '#8b5e3c', padding: '3px 9px', borderRadius: 10, fontSize: '0.7rem', fontWeight: 600 }}>{t}</span>)}
                </div>
                {p.vaccinated && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: '#166534', marginBottom: 12, background: '#f0fdf4', padding: '4px 10px', borderRadius: 8 }}>💉 Đã tiêm {p.vaccineCount} mũi</div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  <span style={{ fontWeight: 900, color: p.price === 0 ? '#166534' : '#c7603a', fontSize: '1.05rem' }}>{p.price === 0 ? 'Miễn phí' : fmt(p.price)}</span>
                  <button onClick={e => { e.stopPropagation(); openPet(p); }} style={{ background: '#111', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 50, fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}>Xem bé →</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayed.length === 0 && <div style={{ textAlign: 'center', padding: '48px 20px', color: '#9ca3af' }}><div style={{ fontSize: '3rem', marginBottom: 12 }}>🐾</div><p>Không có thú cưng nào phù hợp bộ lọc này.</p></div>}

        {/* Submit CTA */}
        <div style={{ background: 'linear-gradient(135deg,#fce4ec,#fdf6ec)', borderRadius: 20, padding: '36px 32px', textAlign: 'center', border: '1px solid #f0ebe4', marginBottom: 32 }}>
          <h3 style={{ fontWeight: 900, color: '#111', marginBottom: 10, fontSize: '1.3rem' }}>Bạn có thú cưng cần tìm nhà mới?</h3>
          <p style={{ color: '#888', marginBottom: 20, lineHeight: 1.6 }}>Đăng bài tìm nhà hoặc bán thú cưng. Admin sẽ xét duyệt trong 24 giờ.</p>
          <Link to="/submit-pet" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#111', color: '#fff', padding: '12px 28px', borderRadius: 50, textDecoration: 'none', fontWeight: 700 }}>📤 Đăng bài ngay</Link>
        </div>
      </main>

      {/* ─── Pet Detail Modal ─── */}
      {selected && (
        <div style={overlay} onClick={e => { if (e.target === e.currentTarget) closePet(); }}>
          <div style={{ background: '#fff', borderRadius: 24, width: 580, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.22)' }}>
            {/* Image */}
            <div style={{ position: 'relative' }}>
              <PetImg src={selected.image} alt={selected.name} style={{ width: '100%', height: 280 }} />
              <div style={{ position: 'absolute', top: 14, left: 14, background: selected.listingType === 'adoption' ? '#dcfce7' : '#dbeafe', color: selected.listingType === 'adoption' ? '#166534' : '#1e40af', fontSize: '0.75rem', fontWeight: 700, padding: '5px 12px', borderRadius: 12 }}>
                {selected.listingType === 'adoption' ? '🏠 Nhận nuôi miễn phí' : '🏷️ Có sẵn — ' + fmt(selected.price)}
              </div>
              <button onClick={closePet} style={{ position: 'absolute', top: 12, right: 14, background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            <div style={{ padding: '22px 26px 26px' }}>
              {!showContact ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <h2 style={{ margin: 0, fontWeight: 900, fontSize: '1.7rem', color: '#111' }}>{selected.name} <span style={{ color: selected.gender === '♀' ? '#ec4899' : '#3b82f6' }}>{selected.gender}</span></h2>
                      <p style={{ color: '#888', margin: '4px 0 0', fontSize: '0.9rem' }}>{selected.breed} · {selected.ageLabel}</p>
                    </div>
                    <div style={{ fontWeight: 900, fontSize: '1.2rem', color: selected.price === 0 ? '#166534' : '#c7603a', textAlign: 'right' }}>
                      {selected.price === 0 ? 'Miễn phí' : fmt(selected.price)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                    {selected.tags.map(t => <span key={t} style={{ background: '#f0ebe4', color: '#8b5e3c', padding: '4px 10px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 600 }}>{t}</span>)}
                    {selected.vaccinated && <span style={{ background: '#f0fdf4', color: '#166534', padding: '4px 10px', borderRadius: 10, fontSize: '0.78rem', fontWeight: 700 }}>💉 Đã tiêm {selected.vaccineCount} mũi</span>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    {[['Loài', selected.species], ['Cân nặng', selected.weight || '—'], ['Màu lông', selected.color || '—'], ['Sức khoẻ', selected.health || 'Tốt']].map(([k, v]) => (
                      <div key={k as string} style={{ background: '#f9fafb', padding: '10px 14px', borderRadius: 10 }}>
                        <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: 2 }}>{k}</div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111' }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {selected.description && <p style={{ color: '#555', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: 20 }}>{selected.description}</p>}

                  {/* Sale pet: add to cart */}
                  {selected.listingType === 'sale' && (
                    addedToCart ? (
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '16px 20px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#166534', fontWeight: 700 }}>✅ Đã thêm vào giỏ hàng!</span>
                        <button onClick={() => { closePet(); navigate('/cart'); }}
                          style={{ background: '#1a1a1a', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 50, fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>
                          Xem giỏ hàng →
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => handleAddToCart(selected)}
                        style={{ width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', padding: '14px', borderRadius: 50, fontWeight: 800, fontSize: '1rem', cursor: 'pointer', marginBottom: 10 }}>
                        🛒 Thêm vào giỏ hàng — {fmt(selected.price)}
                      </button>
                    )
                  )}

                  {/* Adoption pet: contact form */}
                  {selected.listingType === 'adoption' && (
                    <button onClick={() => setShowContact(true)}
                      style={{ width: '100%', background: '#111', color: '#fff', border: 'none', padding: '14px', borderRadius: 50, fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>
                      🏠 Đăng ký nhận nuôi
                    </button>
                  )}
                </>
              ) : sent ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: 14 }}>🎉</div>
                  <h3 style={{ fontWeight: 900, color: '#111', marginBottom: 10 }}>Đã gửi yêu cầu!</h3>
                  <p style={{ color: '#888', lineHeight: 1.7, marginBottom: 24 }}>Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để sắp xếp gặp bé <b>{selected.name}</b>.</p>
                  <button onClick={closePet} style={{ background: '#111', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 50, fontWeight: 700, cursor: 'pointer' }}>Đóng</button>
                </div>
              ) : (
                <form onSubmit={handleContact}>
                  <h3 style={{ fontWeight: 800, color: '#111', margin: '0 0 18px', fontSize: '1.1rem' }}>
                    🏠 Đăng ký nhận nuôi — <span style={{ color: '#c7603a' }}>{selected.name}</span>
                  </h3>
                  <div className="ap-form-row">
                    <div className="ap-form-group"><label>Họ và tên *</label><input className="ap-input" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} required /></div>
                    <div className="ap-form-group"><label>Số điện thoại *</label><input className="ap-input" value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} required /></div>
                    <div className="ap-form-group ap-form-full"><label>Email</label><input className="ap-input" type="email" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} /></div>
                    <div className="ap-form-group ap-form-full"><label>Lời nhắn</label><textarea className="ap-input" rows={3} value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} placeholder={selected.listingType === 'adoption' ? 'Bạn muốn nhận nuôi vì lý do gì?' : 'Hỏi thêm về bé...'} /></div>
                    <div className="ap-form-group ap-form-full" style={{ display: 'flex', gap: 10 }}>
                      <button type="button" onClick={() => setShowContact(false)} style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: 'none', padding: '12px', borderRadius: 50, fontWeight: 700, cursor: 'pointer' }}>← Quay lại</button>
                      <button type="submit" style={{ flex: 2, background: '#111', color: '#fff', border: 'none', padding: '12px', borderRadius: 50, fontWeight: 800, cursor: 'pointer' }}>
                        ✅ Gửi đăng ký nhận nuôi
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};