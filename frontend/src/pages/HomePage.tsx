import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

export const HomePage: React.FC = () => (
  <>
    <Header />
    <main>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#3BB77E 0%,#2D9B6A 60%,#F6921E 100%)', color: '#fff', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🐾</div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, margin: '0 0 16px' }}>PetCare — Yêu thương thú cưng</h1>
          <p style={{ fontSize: '1.15rem', opacity: 0.9, marginBottom: 32 }}>Dịch vụ chăm sóc thú cưng chuyên nghiệp · Sản phẩm chất lượng · Nhận nuôi thú cưng</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/services" style={{ background: '#fff', color: '#3BB77E', padding: '12px 28px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}>Xem dịch vụ</Link>
            <Link to="/products" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '12px 28px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: '1rem', border: '2px solid rgba(255,255,255,0.4)' }}>Cửa hàng</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#fff', padding: '40px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 24, textAlign: 'center' }}>
          {[['500+','Khách hàng'],['1000+','Lịch hẹn'],['50+','Dịch vụ'],['4.9★','Đánh giá']].map(([v,l]) => (
            <div key={l} style={{ padding: 24, borderRadius: 12, background: '#f9fafb' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#3BB77E' }}>{v}</div>
              <div style={{ color: '#6b7280', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services highlight */}
      <section style={{ padding: '48px 20px', background: '#f9fafb' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: '1.8rem', marginBottom: 32, color: '#1e1b4b' }}>Dịch vụ nổi bật</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20 }}>
            {[['✂️','Tắm & Cắt lông','Từ 150.000đ'],['🩺','Khám sức khoẻ','Từ 200.000đ'],['💉','Tiêm phòng','Từ 250.000đ'],['🏥','Phẫu thuật','Từ 1.500.000đ']].map(([icon,name,price]) => (
              <div key={name} style={{ background: '#fff', borderRadius: 12, padding: 24, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>{icon}</div>
                <div style={{ fontWeight: 700, color: '#253D4E', marginBottom: 4 }}>{name}</div>
                <div style={{ color: '#3BB77E', fontWeight: 600 }}>{price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);