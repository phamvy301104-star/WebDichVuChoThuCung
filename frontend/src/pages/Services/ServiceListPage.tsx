import React from 'react';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

const services = [
  { id: 1, icon: '✂️', name: 'Tắm & Cắt lông', price: 'Từ 150.000đ', duration: '90 phút', petType: 'Chó, Mèo', desc: 'Tắm sạch, cắt tỉa lông đẹp, vệ sinh tai, cắt móng.' },
  { id: 2, icon: '🩺', name: 'Khám sức khoẻ', price: 'Từ 200.000đ', duration: '30 phút', petType: 'Tất cả', desc: 'Kiểm tra sức khoẻ toàn diện, tư vấn dinh dưỡng và phòng bệnh.' },
  { id: 3, icon: '💉', name: 'Tiêm phòng', price: 'Từ 250.000đ', duration: '15 phút', petType: 'Chó, Mèo', desc: 'Tiêm đầy đủ các loại vaccine theo lịch.' },
  { id: 4, icon: '✂️', name: 'Cắt móng', price: 'Từ 50.000đ', duration: '20 phút', petType: 'Tất cả', desc: 'Cắt móng an toàn, không gây đau.' },
  { id: 5, icon: '🏥', name: 'Triệt sản', price: 'Từ 1.500.000đ', duration: '2 giờ', petType: 'Chó, Mèo', desc: 'Phẫu thuật triệt sản an toàn bởi bác sĩ thú y.' },
  { id: 6, icon: '👂', name: 'Vệ sinh tai & mắt', price: 'Từ 30.000đ', duration: '10 phút', petType: 'Chó, Mèo', desc: 'Làm sạch tai, mắt nhẹ nhàng, ngăn ngừa viêm nhiễm.' },
];

export const ServiceListPage: React.FC = () => (
  <>
    <Header />
    <main className="page-container">
      <div style={{ textAlign: 'center', padding: '48px 20px 32px', background: 'linear-gradient(135deg,#3BB77E,#2D9B6A)', borderRadius: 16, color: '#fff', marginBottom: 32 }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>✂️</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 10px' }}>Dịch vụ chăm sóc thú cưng</h1>
        <p style={{ fontSize: '1.05rem', opacity: 0.9, margin: 0 }}>Đội ngũ bác sĩ & groomer chuyên nghiệp, tận tâm với thú cưng của bạn</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20, marginBottom: 48 }}>
        {services.map(s => (
          <div key={s.id} style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>{s.icon}</div>
            <h3 style={{ fontWeight: 700, color: '#1e1b4b', margin: '0 0 6px' }}>{s.name}</h3>
            <p style={{ color: '#6b7280', fontSize: '0.88rem', lineHeight: 1.5, margin: '0 0 12px' }}>{s.desc}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
              <span style={{ background: '#E8F5EF', color: '#166534', padding: '2px 8px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600 }}>{s.petType}</span>
              <span style={{ background: '#f0fdf4', color: '#166534', padding: '2px 8px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600 }}>⏱ {s.duration}</span>
            </div>
            <span style={{ fontWeight: 800, color: '#3BB77E', fontSize: '1.05rem' }}>{s.price}</span>
          </div>
        ))}
      </div>
    </main>
    <Footer />
  </>
);