import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@stores/store';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

// Pet breed database with details
const PET_BREEDS = [
  { species: 'Chó', breed: 'Golden Retriever', confidence: 94, origin: 'Scotland, Anh', size: 'Lớn', weight: '25-34 kg', lifespan: '10-12 năm', temperament: ['Thân thiện', 'Đáng tin cậy', 'Đáng yêu', 'Thông minh'], care: 'Cần tập thể dục nhiều, tắm 2 tuần/lần', food: 'Thức ăn khô chất lượng cao, 2-3 bữa/ngày', health: 'Dễ bị loạn sản hông, ung thư', icon: '🐕', color: '#f9e8d0' },
  { species: 'Chó', breed: 'Poodle', confidence: 92, origin: 'Đức/Pháp', size: 'Vừa/Nhỏ', weight: '3-32 kg', lifespan: '12-15 năm', temperament: ['Thông minh', 'Hoạt bát', 'Tình cảm', 'Không rụng lông'], care: 'Cắt lông định kỳ 6-8 tuần', food: 'Thức ăn chất lượng cao, kiểm soát cân nặng', health: 'Dễ bị đục thủy tinh thể, loạn sản', icon: '🐩', color: '#f0e8f8' },
  { species: 'Chó', breed: 'Corgi Pembroke', confidence: 91, origin: 'Wales, Anh', size: 'Nhỏ/Vừa', weight: '10-14 kg', lifespan: '12-15 năm', temperament: ['Năng động', 'Thông minh', 'Vâng lời', 'Vui vẻ'], care: 'Cần vận động, chải lông 2-3 lần/tuần', food: 'Kiểm soát khẩu phần, tránh béo phì', health: 'Dễ bị loạn sản hông, vấn đề mắt', icon: '🐕', color: '#fde8d0' },
  { species: 'Chó', breed: 'Husky', confidence: 93, origin: 'Siberia, Nga', size: 'Vừa/Lớn', weight: '16-27 kg', lifespan: '12-15 năm', temperament: ['Năng động', 'Thân thiện', 'Độc lập', 'Vui nghịch'], care: 'Cần vận động nhiều, chải lông mùa thay lông', food: 'Protein cao, 2 bữa/ngày', health: 'Dễ bị vấn đề mắt, loạn sản hông', icon: '🐕', color: '#e8f0f8' },
  { species: 'Mèo', breed: 'Maine Coon', confidence: 95, origin: 'Maine, Mỹ', size: 'Lớn', weight: '5-9 kg', lifespan: '12-15 năm', temperament: ['Tình cảm', 'Vui vẻ', 'Thông minh', 'Thân thiện với trẻ'], care: 'Chải lông 2-3 lần/tuần, vui chơi thường xuyên', food: 'Thức ăn giàu protein, thức ăn ướt', health: 'Dễ bị loạn sản hông, tim mạch', icon: '🐱', color: '#e8f8e8' },
  { species: 'Mèo', breed: 'British Shorthair', confidence: 90, origin: 'Anh', size: 'Vừa/Lớn', weight: '4-8 kg', lifespan: '14-20 năm', temperament: ['Điềm tĩnh', 'Độc lập', 'Tình cảm', 'Ít sủa'], care: 'Chải lông hàng tuần, vệ sinh tai mắt', food: 'Thức ăn cân bằng, kiểm soát calo', health: 'Dễ béo phì, vấn đề tim', icon: '🐱', color: '#f8f0e8' },
  { species: 'Mèo', breed: 'Ragdoll', confidence: 88, origin: 'California, Mỹ', size: 'Lớn', weight: '5-9 kg', lifespan: '15-20 năm', temperament: ['Hiền lành', 'Thích được ẵm', 'Tình cảm', 'Thụ động'], care: 'Chải lông 2-3 lần/tuần, không nên thả ra ngoài', food: 'Thức ăn chất lượng cao, protein vừa', health: 'Dễ bị bệnh tim HCM', icon: '🐱', color: '#f0f8f8' },
  { species: 'Thỏ', breed: 'Holland Lop', confidence: 86, origin: 'Hà Lan', size: 'Nhỏ', weight: '1.5-2.5 kg', lifespan: '7-14 năm', temperament: ['Đáng yêu', 'Tình cảm', 'Hiền', 'Thích đùa'], care: 'Vệ sinh chuồng thường xuyên, không tắm nước', food: 'Cỏ khô, rau xanh, pellet', health: 'Cần kiểm tra răng và tiêu hóa', icon: '🐇', color: '#f0e8f8' },
];

// Related products by species
const RELATED_CATS: Record<string, string[]> = {
  'Chó': ['p1', 'p2', 'p3', 'p4', 'p7'],
  'Mèo': ['p1', 'p4', 'p5', 'p6'],
  'Thỏ': ['p3', 'p5'],
};

export const PetRecognizePage: React.FC = () => {
  const { products } = useSelector((s: RootState) => s.shop);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<typeof PET_BREEDS[0] | null>(null);
  const [dragging, setDragging] = useState(false);

  const analyze = (dataUrl: string) => {
    setImageUrl(dataUrl);
    setAnalyzing(true);
    setResult(null);
    setProgress(0);

    // Simulate AI analysis with progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.random() * 15;
      });
    }, 120);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      // Pick a random breed (in real app: call AI API)
      const breed = PET_BREEDS[Math.floor(Math.random() * PET_BREEDS.length)];
      setResult(breed);
      setAnalyzing(false);
    }, 2800);
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return alert('Vui lòng chọn file ảnh.');
    if (file.size > 10 * 1024 * 1024) return alert('Ảnh tối đa 10MB.');
    const reader = new FileReader();
    reader.onload = ev => analyze(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const relatedProducts = result
    ? products.filter(p => p.status === 'active' && (RELATED_CATS[result.species] || []).includes(p.id)).slice(0, 4)
    : [];

  const STEPS = ['Phát hiện đối tượng', 'Phân tích đặc điểm', 'Nhận diện giống loài', 'Tra cứu thông tin'];

  return (
    <>
      <Header />
      <main className="page-container" style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: '6px 16px', marginBottom: 16, fontSize: '0.82rem', color: '#166534', fontWeight: 600 }}>
            🤖 AI Pet Recognition
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 900, color: '#111', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            Nhận diện thú cưng bằng AI
          </h1>
          <p style={{ color: '#888', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Tải lên ảnh thú cưng của bạn — AI sẽ nhận diện giống loài, cung cấp thông tin chăm sóc và gợi ý sản phẩm phù hợp.
          </p>
        </div>

        {!result && !analyzing && (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ border: `3px dashed ${dragging ? '#111' : '#d1d5db'}`, borderRadius: 24, padding: '64px 32px', textAlign: 'center', cursor: 'pointer', background: dragging ? '#f9fafb' : '#fff', transition: 'all 0.2s', marginBottom: 32 }}
          >
            <div style={{ fontSize: '5rem', marginBottom: 20 }}>📷</div>
            <h2 style={{ fontWeight: 800, color: '#111', marginBottom: 10, fontSize: '1.4rem' }}>Kéo thả hoặc click để tải ảnh lên</h2>
            <p style={{ color: '#9ca3af', marginBottom: 20 }}>Hỗ trợ JPG, PNG, WEBP · Tối đa 10MB</p>
            <button style={{ background: '#111', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 50, fontWeight: 700, cursor: 'pointer', fontSize: '0.97rem' }}>
              🔍 Chọn ảnh thú cưng
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>
        )}

        {/* Analyzing state */}
        {analyzing && imageUrl && (
          <div style={{ background: '#fff', borderRadius: 24, padding: 32, marginBottom: 32, border: '1px solid #f0ebe4', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <img src={imageUrl} alt="pet" style={{ width: '100%', borderRadius: 16, objectFit: 'cover', maxHeight: 300 }} />
                {/* Scanning overlay */}
                <div style={{ position: 'absolute', inset: 0, borderRadius: 16, background: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ border: '3px solid #22c55e', borderRadius: 12, width: '60%', height: '60%', animation: 'none', boxShadow: '0 0 20px rgba(34,197,94,0.5)' }} />
                </div>
              </div>
              <div>
                <h3 style={{ fontWeight: 800, color: '#111', marginBottom: 20, fontSize: '1.2rem' }}>🤖 Đang phân tích ảnh...</h3>
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem' }}>Tiến trình nhận diện</span>
                    <span style={{ fontWeight: 800, color: '#22c55e' }}>{Math.round(progress)}%</span>
                  </div>
                  <div style={{ background: '#e5e7eb', borderRadius: 9999, height: 10, overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#22c55e,#16a34a)', height: '100%', borderRadius: 9999, transition: 'width 0.1s' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {STEPS.map((step, i) => {
                    const stepProgress = (i + 1) * 25;
                    const done = progress >= stepProgress;
                    const active = progress >= (i * 25) && progress < stepProgress;
                    return (
                      <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: done ? '#22c55e' : active ? '#f59e0b' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0 }}>
                          {done ? '✓' : active ? '⟳' : (i + 1)}
                        </div>
                        <span style={{ fontSize: '0.88rem', color: done ? '#166534' : active ? '#92400e' : '#9ca3af', fontWeight: done || active ? 600 : 400 }}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {result && imageUrl && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 32 }}>
              {/* Image */}
              <div>
                <img src={imageUrl} alt="pet" style={{ width: '100%', borderRadius: 20, objectFit: 'cover', maxHeight: 360, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }} />
                <button onClick={() => { setResult(null); setImageUrl(null); setProgress(0); }}
                  style={{ width: '100%', marginTop: 12, background: '#f3f4f6', color: '#374151', border: 'none', padding: '10px', borderRadius: 50, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                  🔄 Thử ảnh khác
                </button>
              </div>

              {/* Pet details */}
              <div style={{ background: result.color, borderRadius: 20, padding: 28, border: '1px solid #f0ebe4' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: '2.5rem' }}>{result.icon}</span>
                      <div>
                        <h2 style={{ fontWeight: 900, color: '#111', margin: 0, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>{result.breed}</h2>
                        <p style={{ color: '#888', margin: 0, fontSize: '0.85rem' }}>{result.species} · {result.origin}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ background: '#22c55e', color: '#fff', padding: '6px 14px', borderRadius: 20, fontWeight: 800, fontSize: '0.9rem' }}>
                    {result.confidence}% ✓
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                  {[['📏 Kích thước', result.size], ['⚖️ Cân nặng', result.weight], ['🎂 Tuổi thọ', result.lifespan]].map(([k, v]) => (
                    <div key={k as string} style={{ background: 'rgba(255,255,255,0.7)', padding: '10px 14px', borderRadius: 12 }}>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{k}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{v}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8, fontSize: '0.88rem', color: '#374151' }}>✨ Tính cách đặc trưng</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {result.temperament.map(t => <span key={t} style={{ background: 'rgba(255,255,255,0.8)', color: '#374151', padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600 }}>{t}</span>)}
                  </div>
                </div>
              </div>
            </div>

            {/* Care info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
              {[['🛁 Chăm sóc lông', result.care], ['🍖 Chế độ ăn', result.food], ['🏥 Sức khoẻ', result.health]].map(([title, desc]) => (
                <div key={title as string} style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', border: '1px solid #f0ebe4', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontWeight: 800, color: '#111', marginBottom: 8, fontSize: '0.9rem' }}>{title as string}</div>
                  <div style={{ color: '#555', fontSize: '0.82rem', lineHeight: 1.6 }}>{desc as string}</div>
                </div>
              ))}
            </div>

            {/* Related products */}
            {relatedProducts.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontWeight: 800, color: '#111', margin: 0, fontSize: '1.2rem' }}>🛍️ Sản phẩm phù hợp cho {result.breed}</h3>
                  <Link to="/products" style={{ color: '#111', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem', borderBottom: '2px solid #111' }}>Xem tất cả →</Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
                  {relatedProducts.map(p => (
                    <Link key={p.id} to={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #f0ebe4', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'transform 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = '')}>
                        <div style={{ height: 140, overflow: 'hidden', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display='none'; }} /> : <span style={{ fontSize: '3rem' }}>🐾</span>}
                        </div>
                        <div style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700, color: '#111', fontSize: '0.88rem', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                          <div style={{ fontWeight: 900, color: '#c7603a' }}>{fmt(p.price)}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedProducts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 20px', background: '#f9fafb', borderRadius: 16 }}>
                <p style={{ color: '#9ca3af' }}>Đang cập nhật sản phẩm cho {result.species}. <Link to="/products" style={{ color: '#111', fontWeight: 700 }}>Xem tất cả sản phẩm →</Link></p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
};