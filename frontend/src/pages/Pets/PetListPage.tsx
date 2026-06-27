import React from 'react';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

const pets = [
  { id: 1, name: 'Max', type: 'Chó', breed: 'Golden Retriever', age: '3 tuổi', gender: 'Đực', icon: '🐕', desc: 'Max rất thân thiện, hiền lành và thích trẻ em. Đã tiêm phòng đầy đủ.', status: 'Chờ nhận nuôi' },
  { id: 2, name: 'Bella', type: 'Mèo', breed: 'Maine Coon', age: '8 tháng', gender: 'Cái', icon: '🐱', desc: 'Bella lanh lợi, hay nghịch ngợm nhưng rất dễ thương và tình cảm.', status: 'Chờ nhận nuôi' },
  { id: 3, name: 'Buddy', type: 'Chó', breed: 'Corgi', age: '1 tuổi', gender: 'Đực', icon: '🐕', desc: 'Buddy năng động, thích chạy nhảy và học các trò mới rất nhanh.', status: 'Chờ nhận nuôi' },
  { id: 4, name: 'Whiskers', type: 'Mèo', breed: 'Ba Tư', age: '4 tuổi', gender: 'Đực', icon: '🐱', desc: 'Whiskers điềm tĩnh, hợp với gia đình có không gian yên tĩnh.', status: 'Cần cứu hộ' },
  { id: 5, name: 'Coco', type: 'Thỏ', breed: 'Holland Lop', age: '6 tháng', gender: 'Cái', icon: '🐇', desc: 'Coco cực kỳ đáng yêu, hiền, không gây ồn. Phù hợp căn hộ.', status: 'Chờ nhận nuôi' },
  { id: 6, name: 'Luna', type: 'Mèo', breed: 'Exotic Shorthair', age: '2 tuổi', gender: 'Cái', icon: '🐱', desc: 'Luna béo tròn, lười biếng theo kiểu đáng yêu, thích được âu yếm.', status: 'Chờ nhận nuôi' },
];

export const PetListPage: React.FC = () => (
  <>
    <Header />
    <main className="page-container">
      <div style={{ textAlign: 'center', padding: '48px 20px 32px', background: 'linear-gradient(135deg,#3BB77E,#F6921E)', borderRadius: 16, color: '#fff', marginBottom: 32 }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🐾</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 10px' }}>Nhận nuôi thú cưng</h1>
        <p style={{ fontSize: '1.05rem', opacity: 0.9, margin: 0 }}>Mỗi thú cưng đều xứng đáng có một ngôi nhà yêu thương ❤️</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20, marginBottom: 48 }}>
        {pets.map(p => (
          <div key={p.id} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>
            <div style={{ height: 120, background: 'linear-gradient(135deg,#fdf2f8,#ede9fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>{p.icon}</div>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h3 style={{ fontWeight: 700, color: '#253D4E', margin: 0, fontSize: '1.1rem' }}>{p.name}</h3>
                <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: '0.72rem', fontWeight: 700, color: '#1e40af', background: '#dbeafe' }}>{p.status}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: 10 }}>{p.breed} · {p.age} · {p.gender}</div>
              <p style={{ fontSize: '0.87rem', color: '#374151', lineHeight: 1.5, margin: 0 }}>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
    <Footer />
  </>
);