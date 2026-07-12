import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@stores/store';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

// Mapping ImageNet/MobileNet labels → Vietnamese pet info
const BREED_MAP: Record<string, { species: string; breedVi: string; origin: string; size: string; weight: string; lifespan: string; temperament: string[]; care: string; food: string; icon: string; color: string }> = {
  // Dogs
  'golden_retriever':        { species: 'Chó', breedVi: 'Golden Retriever', origin: 'Scotland, Anh', size: 'Lớn', weight: '25-34 kg', lifespan: '10-12 năm', temperament: ['Thân thiện','Đáng tin cậy','Thông minh','Tình cảm'], care: 'Tập thể dục nhiều, tắm 2 tuần/lần', food: 'Thức ăn khô chất lượng cao, 2-3 bữa/ngày', icon: '🐕', color: '#f9e8d0' },
  'Labrador_retriever':      { species: 'Chó', breedVi: 'Labrador', origin: 'Canada', size: 'Lớn', weight: '25-36 kg', lifespan: '10-12 năm', temperament: ['Thân thiện','Hoạt bát','Trung thành','Vâng lời'], care: 'Vận động hàng ngày, chải lông hàng tuần', food: 'Thức ăn giàu protein, 2 bữa/ngày', icon: '🐕', color: '#e8e0d0' },
  'poodle':                  { species: 'Chó', breedVi: 'Poodle', origin: 'Đức/Pháp', size: 'Vừa/Nhỏ', weight: '3-32 kg', lifespan: '12-15 năm', temperament: ['Thông minh','Hoạt bát','Tình cảm','Không rụng lông'], care: 'Cắt lông định kỳ 6-8 tuần', food: 'Thức ăn chất lượng cao', icon: '🐩', color: '#f0e8f8' },
  'Pembroke':                { species: 'Chó', breedVi: 'Corgi Pembroke', origin: 'Wales, Anh', size: 'Nhỏ/Vừa', weight: '10-14 kg', lifespan: '12-15 năm', temperament: ['Năng động','Thông minh','Vâng lời','Vui vẻ'], care: 'Chải lông 2-3 lần/tuần', food: 'Kiểm soát khẩu phần', icon: '🐕', color: '#fde8d0' },
  'Siberian_husky':          { species: 'Chó', breedVi: 'Siberian Husky', origin: 'Siberia, Nga', size: 'Vừa/Lớn', weight: '16-27 kg', lifespan: '12-15 năm', temperament: ['Năng động','Thân thiện','Độc lập','Vui nghịch'], care: 'Vận động nhiều, chải lông mùa thay lông', food: 'Protein cao, 2 bữa/ngày', icon: '🐕', color: '#e8f0f8' },
  'German_shepherd':         { species: 'Chó', breedVi: 'German Shepherd', origin: 'Đức', size: 'Lớn', weight: '22-40 kg', lifespan: '9-13 năm', temperament: ['Trung thành','Thông minh','Dũng cảm','Vâng lời'], care: 'Vận động mạnh, huấn luyện từ nhỏ', food: 'Thức ăn giàu dinh dưỡng, kiểm soát cân nặng', icon: '🐕', color: '#f0f0e8' },
  'Chihuahua':               { species: 'Chó', breedVi: 'Chihuahua', origin: 'Mexico', size: 'Rất nhỏ', weight: '1.5-3 kg', lifespan: '14-17 năm', temperament: ['Dũng cảm','Tự tin','Tình cảm','Nhạy cảm'], care: 'Chải lông hàng tuần, giữ ấm mùa đông', food: 'Thức ăn cho chó nhỏ, chia nhỏ bữa', icon: '🐕', color: '#f8e8e8' },
  'shih-tzu':                { species: 'Chó', breedVi: 'Shih Tzu', origin: 'Tây Tạng/Trung Quốc', size: 'Nhỏ', weight: '4-7 kg', lifespan: '10-16 năm', temperament: ['Tình cảm','Vui vẻ','Thân thiện','Quấn chủ'], care: 'Chải lông hàng ngày, vệ sinh mắt thường xuyên', food: 'Thức ăn cho chó nhỏ, protein vừa', icon: '🐕', color: '#f8f0e0' },
  'beagle':                  { species: 'Chó', breedVi: 'Beagle', origin: 'Anh', size: 'Vừa', weight: '9-11 kg', lifespan: '12-15 năm', temperament: ['Tò mò','Vui vẻ','Thân thiện','Năng động'], care: 'Vận động hàng ngày, kiểm soát ăn uống', food: 'Thức ăn chất lượng, kiểm soát cân nặng', icon: '🐕', color: '#e8f0e8' },
  // Cats
  'tabby':                   { species: 'Mèo', breedVi: 'Mèo tabby / Mèo lông ngắn', origin: 'Đa dạng', size: 'Vừa', weight: '3-5 kg', lifespan: '12-18 năm', temperament: ['Độc lập','Tình cảm','Thích vui chơi','Thông minh'], care: 'Chải lông hàng tuần, vệ sinh khay cát', food: 'Thức ăn cân bằng protein', icon: '🐱', color: '#f0f8e8' },
  'Persian_cat':             { species: 'Mèo', breedVi: 'Mèo Ba Tư', origin: 'Iran', size: 'Vừa/Lớn', weight: '3.5-7 kg', lifespan: '12-17 năm', temperament: ['Điềm tĩnh','Sang chảnh','Tình cảm','Lười biếng'], care: 'Chải lông hàng ngày, vệ sinh mắt thường xuyên', food: 'Thức ăn chất lượng cao, protein vừa', icon: '🐱', color: '#f8f0e8' },
  'Siamese_cat':             { species: 'Mèo', breedVi: 'Mèo Xiêm', origin: 'Thái Lan', size: 'Vừa', weight: '3-5 kg', lifespan: '15-20 năm', temperament: ['Hoạt bát','Thông minh','Tình cảm','Hay kêu'], care: 'Tương tác nhiều, chải lông hàng tuần', food: 'Thức ăn cao protein, chia 2-3 bữa', icon: '🐱', color: '#e8f0f8' },
  'Egyptian_cat':            { species: 'Mèo', breedVi: 'Mèo Ai Cập', origin: 'Ai Cập', size: 'Vừa', weight: '2.5-5 kg', lifespan: '12-15 năm', temperament: ['Nhanh nhẹn','Thông minh','Tình cảm','Năng động'], care: 'Vui chơi thường xuyên, chải lông 1-2 lần/tuần', food: 'Protein cao, thức ăn ướt', icon: '🐱', color: '#f8f8e0' },
  // Other animals
  'rabbit':                  { species: 'Thỏ', breedVi: 'Thỏ cảnh', origin: 'Đa dạng', size: 'Nhỏ', weight: '1-3 kg', lifespan: '7-12 năm', temperament: ['Hiền','Thích khám phá','Nhút nhát','Tình cảm'], care: 'Chuồng sạch sẽ, tránh ánh nắng trực tiếp', food: 'Cỏ khô, rau xanh, pellet', icon: '🐇', color: '#f0f0f8' },
  'hamster':                 { species: 'Chuột hamster', breedVi: 'Hamster', origin: 'Trung Đông/Châu Âu', size: 'Rất nhỏ', weight: '0.02-0.18 kg', lifespan: '2-3 năm', temperament: ['Năng động về đêm','Nhút nhát','Độc lập'], care: 'Chuồng lớn với bánh xe, thay lót chuồng hàng tuần', food: 'Hạt hamster, rau củ tươi', icon: '🐹', color: '#f8e8e0' },
  'bird':                    { species: 'Chim', breedVi: 'Chim cảnh', origin: 'Đa dạng', size: 'Nhỏ', weight: '0.02-0.5 kg', lifespan: '5-80 năm', temperament: ['Vui vẻ','Hoạt bát','Thông minh'], care: 'Lồng rộng, cho tắm nước thường xuyên', food: 'Hạt chim, rau quả tươi', icon: '🦜', color: '#e8f8e0' },
};

// Map COCO-SSD labels to species
const COCO_PET_MAP: Record<string, string> = { dog: 'Chó', cat: 'Mèo', bird: 'Chim', horse: 'Ngựa', sheep: 'Cừu', cow: 'Bò', elephant: 'Voi', bear: 'Gấu', zebra: 'Ngựa vằn' };

// Get best matching breed from MobileNet prediction
const getBestBreed = (predictions: { className: string; probability: number }[]) => {
  for (const pred of predictions) {
    const className = pred.className.toLowerCase().replace(/[,\s]+/g, '_');
    for (const [key, val] of Object.entries(BREED_MAP)) {
      if (className.includes(key.toLowerCase()) || key.toLowerCase().includes(className.split('_')[0])) {
        return { ...val, breed: val.breedVi, confidence: Math.round(pred.probability * 100) };
      }
    }
    // Generic species detection
    if (className.includes('dog') || className.includes('canine') || className.includes('hound') || className.includes('terrier') || className.includes('retriever') || className.includes('poodle') || className.includes('husky') || className.includes('shepherd') || className.includes('bulldog') || className.includes('spaniel')) {
      return { ...BREED_MAP['golden_retriever'], breed: 'Chó (đang phân tích giống...)', confidence: Math.round(pred.probability * 100) };
    }
    if (className.includes('cat') || className.includes('kitten') || className.includes('feline') || className.includes('tabby') || className.includes('persian') || className.includes('siamese')) {
      return { ...BREED_MAP['tabby'], breed: 'Mèo (đang phân tích giống...)', confidence: Math.round(pred.probability * 100) };
    }
    if (className.includes('rabbit') || className.includes('bunny')) {
      return { ...BREED_MAP['rabbit'], breed: 'Thỏ', confidence: Math.round(pred.probability * 100) };
    }
    if (className.includes('bird') || className.includes('parrot') || className.includes('cockatiel')) {
      return { ...BREED_MAP['bird'], breed: 'Chim cảnh', confidence: Math.round(pred.probability * 100) };
    }
    if (className.includes('hamster') || className.includes('rodent') || className.includes('mouse') || className.includes('rat')) {
      return { ...BREED_MAP['hamster'], breed: 'Hamster/Chuột cảnh', confidence: Math.round(pred.probability * 100) };
    }
  }
  return null;
};

export const PetRecognizePage: React.FC = () => {
  const { products } = useSelector((s: RootState) => s.shop);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any | null>(null);
  const [dragging, setDragging] = useState(false);
  const [rawLabels, setRawLabels] = useState<{ className: string; probability: number }[]>([]);
  const [notPet, setNotPet] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const modelRef = useRef<any>(null);

  // Pre-load MobileNet model
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadingModel(true);
      try {
        const tf = await import('@tensorflow/tfjs');
        const mobilenet = await import('@tensorflow-models/mobilenet');
        await tf.ready();
        const model = await mobilenet.load({ version: 2, alpha: 1.0 });
        if (!cancelled) { modelRef.current = model; setModelReady(true); }
      } catch (err) {
        console.error('Model load error:', err);
      } finally {
        if (!cancelled) setLoadingModel(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const analyzeImage = async (dataUrl: string) => {
    setImageUrl(dataUrl);
    setAnalyzing(true);
    setResult(null);
    setNotPet(false);
    setRawLabels([]);
    setProgress(0);

    // Animated progress
    const progressInterval = setInterval(() => {
      setProgress(p => { if (p >= 85) { clearInterval(progressInterval); return 85; } return p + 8; });
    }, 150);

    try {
      // Wait for model if still loading
      if (!modelRef.current) {
        const tf = await import('@tensorflow/tfjs');
        const mobilenet = await import('@tensorflow-models/mobilenet');
        await tf.ready();
        modelRef.current = await mobilenet.load({ version: 2, alpha: 1.0 });
        setModelReady(true);
      }

      // Create image element for TensorFlow
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = dataUrl;
      });

      // Run classification
      const predictions = await modelRef.current.classify(img, 10);
      setRawLabels(predictions.slice(0, 5));

      clearInterval(progressInterval);
      setProgress(100);

      const match = getBestBreed(predictions);
      setTimeout(() => {
        if (match) {
          setResult(match);
        } else {
          setNotPet(true);
        }
        setAnalyzing(false);
      }, 400);
    } catch (err) {
      console.error('Classification error:', err);
      clearInterval(progressInterval);
      setProgress(100);
      setNotPet(true);
      setAnalyzing(false);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return alert('Vui lòng chọn file ảnh.');
    const reader = new FileReader();
    reader.onload = e => analyzeImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const relatedProducts = result ? products.filter(p => p.status === 'active').slice(0, 4) : [];

  return (
    <>
      <Header />
      <main className="page-container" style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🤖</div>
          <h1 style={{ fontWeight: 900, color: '#111', fontSize: '2rem', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            AI Nhận diện thú cưng
          </h1>
          <p style={{ color: '#888', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Dùng TensorFlow.js + MobileNet V2 để nhận diện thú cưng của bạn.<br />
            Tải ảnh lên → AI phân tích → Xem thông tin chi tiết & sản phẩm phù hợp.
          </p>
          {loadingModel && !modelReady && (
            <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fef3c7', padding: '6px 16px', borderRadius: 20, fontSize: '0.82rem', color: '#92400e' }}>
              ⏳ Đang tải mô hình AI... (lần đầu mất ~10 giây)
            </div>
          )}
          {modelReady && (
            <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 8, background: '#dcfce7', padding: '6px 16px', borderRadius: 20, fontSize: '0.82rem', color: '#166534' }}>
              ✅ Mô hình AI sẵn sàng — MobileNet V2 (TensorFlow.js)
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: imageUrl ? '1fr 1fr' : '1fr', gap: 24 }}>
          {/* Upload zone */}
          <div>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              style={{ border: `2px dashed ${dragging ? '#111' : '#d1d5db'}`, borderRadius: 20, padding: imageUrl ? '16px' : '56px 20px', textAlign: 'center', cursor: 'pointer', background: dragging ? '#f9f9f9' : '#faf9f7', transition: 'all 0.2s' }}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="upload" style={{ width: '100%', maxHeight: 320, objectFit: 'contain', borderRadius: 12, display: 'block' }} />
              ) : (
                <>
                  <div style={{ fontSize: '4rem', marginBottom: 14 }}>📷</div>
                  <div style={{ fontWeight: 700, color: '#374151', marginBottom: 6, fontSize: '1.05rem' }}>Kéo & thả ảnh hoặc click để chọn</div>
                  <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: 16 }}>JPG, PNG, WEBP · Tối đa 10MB</div>
                  <div style={{ background: '#111', color: '#fff', display: 'inline-block', padding: '10px 24px', borderRadius: 50, fontWeight: 700, fontSize: '0.9rem' }}>📁 Chọn ảnh</div>
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            {imageUrl && (
              <button onClick={() => { setImageUrl(null); setResult(null); setNotPet(false); setRawLabels([]); setProgress(0); setAnalyzing(false); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                style={{ marginTop: 10, width: '100%', background: '#f3f4f6', color: '#374151', border: 'none', padding: '10px', borderRadius: 50, fontWeight: 600, cursor: 'pointer' }}>
                🔄 Thử ảnh khác
              </button>
            )}

            {/* Raw labels */}
            {rawLabels.length > 0 && (
              <div style={{ marginTop: 16, background: '#f9fafb', borderRadius: 12, padding: '12px 16px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#6b7280', marginBottom: 8 }}>🔬 Phân tích AI (Top 5 nhãn)</div>
                {rawLabels.map((l, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4 }}>
                    <span style={{ color: '#374151', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.className}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 8 }}>
                      <div style={{ width: 60, height: 4, background: '#e5e7eb', borderRadius: 999 }}>
                        <div style={{ width: `${Math.round(l.probability * 100)}%`, height: '100%', background: '#3b82f6', borderRadius: 999 }} />
                      </div>
                      <span style={{ color: '#9ca3af', minWidth: 32, textAlign: 'right' }}>{Math.round(l.probability * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Results */}
          {(analyzing || result || notPet) && (
            <div>
              {analyzing && (
                <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #f0ebe4', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  <div style={{ fontSize: '3rem' }}>🔍</div>
                  <div style={{ fontWeight: 700, color: '#111' }}>AI đang phân tích ảnh...</div>
                  <div style={{ width: '100%', background: '#e5e7eb', borderRadius: 999, height: 8 }}>
                    <div style={{ width: `${Math.min(progress, 100)}%`, height: '100%', background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)', borderRadius: 999, transition: 'width 0.3s' }} />
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>TensorFlow.js · MobileNet V2</div>
                </div>
              )}

              {!analyzing && notPet && (
                <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #f0ebe4', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>🤔</div>
                  <h3 style={{ fontWeight: 800, color: '#111', marginBottom: 10 }}>Không nhận ra thú cưng</h3>
                  <p style={{ color: '#888', lineHeight: 1.7, marginBottom: 16, fontSize: '0.9rem' }}>AI không xác định được đây là thú cưng. Hãy thử:<br />• Ảnh rõ nét, đủ sáng<br />• Thú cưng ở trung tâm ảnh<br />• Chó, mèo, thỏ, hamster, chim</p>
                  <button onClick={() => { setImageUrl(null); setNotPet(false); setRawLabels([]); setProgress(0); }}
                    style={{ background: '#111', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 50, fontWeight: 700, cursor: 'pointer' }}>Thử lại</button>
                </div>
              )}

              {!analyzing && result && (
                <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #f0ebe4', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                  {/* Result header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, padding: 16, background: result.color || '#f9fafb', borderRadius: 14 }}>
                    <span style={{ fontSize: '3rem' }}>{result.icon}</span>
                    <div>
                      <div style={{ fontWeight: 900, color: '#111', fontSize: '1.3rem' }}>{result.breed || result.breedVi}</div>
                      <div style={{ color: '#888', fontSize: '0.85rem' }}>{result.species} · Độ chính xác: <b style={{ color: '#22c55e' }}>{result.confidence}%</b></div>
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9ca3af', marginBottom: 4 }}>
                      <span>Độ chính xác AI</span><span>{result.confidence}%</span>
                    </div>
                    <div style={{ background: '#e5e7eb', borderRadius: 999, height: 8 }}>
                      <div style={{ width: `${result.confidence}%`, background: result.confidence > 80 ? '#22c55e' : result.confidence > 50 ? '#f59e0b' : '#ef4444', height: '100%', borderRadius: 999, transition: 'width 1s' }} />
                    </div>
                  </div>

                  {/* Details grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                    {[['🌍 Xuất xứ', result.origin], ['📏 Kích thước', result.size], ['⚖️ Cân nặng', result.weight], ['⏳ Tuổi thọ', result.lifespan]].map(([k,v]) => (
                      <div key={k as string} style={{ background: '#f9fafb', padding: '8px 12px', borderRadius: 10 }}>
                        <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{k}</div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                    {result.temperament?.map((t: string) => <span key={t} style={{ background: '#f0ebe4', color: '#8b5e3c', padding: '3px 10px', borderRadius: 10, fontSize: '0.75rem', fontWeight: 600 }}>{t}</span>)}
                  </div>

                  {/* Care & Food */}
                  <div style={{ background: '#f9fafb', borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
                    <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: 2 }}>🧴 Chăm sóc</div>
                    <div style={{ fontSize: '0.85rem', color: '#374151' }}>{result.care}</div>
                  </div>
                  <div style={{ background: '#f9fafb', borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: 2 }}>🍽️ Thức ăn</div>
                    <div style={{ fontSize: '0.85rem', color: '#374151' }}>{result.food}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related products */}
        {result && relatedProducts.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontWeight: 800, color: '#111', marginBottom: 20, fontSize: '1.3rem' }}>
              🛍️ Sản phẩm phù hợp cho {result.species}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
              {relatedProducts.map(p => (
                <Link key={p.id} to={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #f0ebe4', transition: 'transform 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = '')}>
                    <div style={{ height: 130, overflow: 'hidden', background: '#f9fafb' }}>
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.style.display = 'none')} />
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#111', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontWeight: 800, color: '#c7603a', fontSize: '0.9rem' }}>{fmt(p.price)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};