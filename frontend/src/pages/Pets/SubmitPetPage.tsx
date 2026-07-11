import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { submitPet } from '@stores/slices/petMgmtSlice';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

export const SubmitPetPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((s: RootState) => s.auth);
  const [done, setDone] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '', species: 'Chó', breed: '', ageLabel: '', gender: '♂' as '♂' | '♀',
    image: '', tags: '', price: 0, listingType: 'adoption' as 'adoption' | 'sale',
    vaccinated: false, vaccineCount: 0, weight: '', color: '', description: '', health: '',
  });

  // Convert uploaded file to base64 data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return alert('Vui lòng chọn file ảnh (JPG, PNG, WEBP).');
    if (file.size > 5 * 1024 * 1024) return alert('File ảnh quá lớn (tối đa 5MB).');
    setUploading(true);
    const reader = new FileReader();
    reader.onload = ev => {
      setForm(f => ({ ...f, image: ev.target?.result as string }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setForm(f => ({ ...f, image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!isAuthenticated) return (
    <>
      <Header />
      <main className="page-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔐</div>
        <h2 style={{ fontWeight: 800, marginBottom: 12 }}>Bạn cần đăng nhập</h2>
        <p style={{ color: '#888', marginBottom: 24 }}>Đăng nhập để đăng bài tìm nhà hoặc bán thú cưng.</p>
        <button onClick={() => navigate('/auth/login')} style={{ background: '#111', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 50, fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>Đăng nhập ngay</button>
      </main>
      <Footer />
    </>
  );

  if (done) return (
    <>
      <Header />
      <main className="page-container" style={{ textAlign: 'center', padding: '80px 20px', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontWeight: 900, marginBottom: 12 }}>Đã gửi bài đăng!</h2>
        <p style={{ color: '#888', lineHeight: 1.7, marginBottom: 32 }}>Bài đăng của bạn đang chờ admin xét duyệt. Sau khi được duyệt, thú cưng sẽ xuất hiện trên trang thú cưng.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => navigate('/pets')} style={{ background: '#111', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 50, fontWeight: 700, cursor: 'pointer' }}>Xem trang thú cưng</button>
          <button onClick={() => { setDone(false); setForm({ name: '', species: 'Chó', breed: '', ageLabel: '', gender: '♂', image: '', tags: '', price: 0, listingType: 'adoption', vaccinated: false, vaccineCount: 0, weight: '', color: '', description: '', health: '' }); }}
            style={{ background: 'transparent', color: '#111', border: '2px solid #111', padding: '12px 24px', borderRadius: 50, fontWeight: 700, cursor: 'pointer' }}>Đăng bài khác</button>
        </div>
      </main>
      <Footer />
    </>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.breed) return alert('Vui lòng nhập tên và giống thú cưng.');
    dispatch(submitPet({
      name: form.name, species: form.species, breed: form.breed, ageLabel: form.ageLabel,
      gender: form.gender, image: form.image,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      price: form.listingType === 'sale' ? form.price : 0,
      listingType: form.listingType, vaccinated: form.vaccinated, vaccineCount: form.vaccineCount,
      weight: form.weight, color: form.color, description: form.description, health: form.health,
      status: 'available', submittedBy: user?.email || '', submittedByName: user?.name || '',
    }));
    setDone(true);
  };

  return (
    <>
      <Header />
      <main className="page-container" style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🐾</div>
          <h1 style={{ fontWeight: 900, color: '#111', fontSize: '2rem', marginBottom: 8 }}>Đăng thú cưng tìm nhà</h1>
          <p style={{ color: '#888', lineHeight: 1.6 }}>Điền thông tin bên dưới. Admin sẽ xét duyệt trước khi bài được đăng lên trang thú cưng.</p>
        </div>

        <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 12, padding: '12px 16px', marginBottom: 28, fontSize: '0.88rem', color: '#92400e' }}>
          ⏳ Bài đăng sẽ được admin xét duyệt trong vòng 24 giờ làm việc.
        </div>

        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f0ebe4' }}>
          <div className="ap-form-row">
            <div className="ap-form-group"><label>Tên thú cưng *</label><input className="ap-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="VD: Buddy" required /></div>
            <div className="ap-form-group"><label>Loài</label>
              <select className="ap-input" value={form.species} onChange={e => setForm({ ...form, species: e.target.value })}>
                {['Chó', 'Mèo', 'Thỏ', 'Khác'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="ap-form-group"><label>Giống *</label><input className="ap-input" value={form.breed} onChange={e => setForm({ ...form, breed: e.target.value })} placeholder="Golden Retriever, Corgi..." required /></div>
            <div className="ap-form-group"><label>Tuổi</label><input className="ap-input" value={form.ageLabel} onChange={e => setForm({ ...form, ageLabel: e.target.value })} placeholder="3 tuổi / 6 tháng" /></div>
            <div className="ap-form-group"><label>Giới tính</label>
              <select className="ap-input" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value as '♂' | '♀' })}>
                <option value="♂">♂ Đực</option><option value="♀">♀ Cái</option>
              </select>
            </div>
            <div className="ap-form-group"><label>Mục đích đăng</label>
              <select className="ap-input" value={form.listingType} onChange={e => setForm({ ...form, listingType: e.target.value as any })}>
                <option value="adoption">🏠 Cho nhận nuôi (miễn phí)</option>
                <option value="sale">🏷️ Bán</option>
              </select>
            </div>
            {form.listingType === 'sale' && <div className="ap-form-group"><label>Giá bán (VND)</label><input className="ap-input" type="number" value={form.price || ''} onChange={e => setForm({ ...form, price: +e.target.value })} /></div>}
            <div className="ap-form-group"><label>Cân nặng</label><input className="ap-input" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} placeholder="4 kg" /></div>
            <div className="ap-form-group"><label>Màu lông</label><input className="ap-input" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} placeholder="Vàng kem, đen trắng..." /></div>
            <div className="ap-form-group"><label>Tiêm phòng</label>
              <select className="ap-input" value={form.vaccinated ? 'yes' : 'no'} onChange={e => setForm({ ...form, vaccinated: e.target.value === 'yes' })}>
                <option value="no">Chưa tiêm phòng</option>
                <option value="yes">Đã tiêm phòng</option>
              </select>
            </div>
            {form.vaccinated && <div className="ap-form-group"><label>Số mũi đã tiêm</label><input className="ap-input" type="number" min={1} value={form.vaccineCount || ''} onChange={e => setForm({ ...form, vaccineCount: +e.target.value })} /></div>}
            <div className="ap-form-group ap-form-full">
                <label>Ảnh thú cưng</label>

                {/* Upload zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed #d1d5db', borderRadius: 12, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', background: '#faf9f7', transition: 'border-color 0.15s', marginBottom: 10 }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#111')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#d1d5db')}
                >
                  {uploading ? (
                    <div style={{ color: '#9ca3af' }}>⏳ Đang xử lý ảnh...</div>
                  ) : form.image && form.image.startsWith('data:') ? (
                    <div>
                      <img src={form.image} alt="preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 10, marginBottom: 10 }} />
                      <button type="button" onClick={e => { e.stopPropagation(); clearImage(); }}
                        style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 16px', borderRadius: 20, cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>
                        🗑️ Xóa ảnh
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📷</div>
                      <div style={{ fontWeight: 700, color: '#374151', marginBottom: 4 }}>Click để chọn ảnh</div>
                      <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>JPG, PNG, WEBP · Tối đa 5MB</div>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />

                {/* OR URL input */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                  <span style={{ color: '#9ca3af', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>hoặc dán URL ảnh</span>
                  <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
                </div>
                <input className="ap-input" value={form.image.startsWith('data:') ? '' : form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  disabled={form.image.startsWith('data:')}
                />
                {form.image && !form.image.startsWith('data:') && (
                  <img src={form.image} alt="preview" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 10, marginTop: 8 }}
                    onError={e => (e.currentTarget.style.display = 'none')} />
                )}
              </div>
            {form.image && <div className="ap-form-group"><label>Xem trước ảnh</label><img src={form.image} alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10 }} /></div>}
            <div className="ap-form-group ap-form-full"><label>Tính cách (cách nhau bằng dấu phẩy)</label><input className="ap-input" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Thân thiện, Thông minh, Thích trẻ em" /></div>
            <div className="ap-form-group ap-form-full"><label>Mô tả thú cưng *</label><textarea className="ap-input" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Mô tả tính cách, lịch sử, lý do cần tìm nhà mới..." required /></div>
            <div className="ap-form-group ap-form-full"><label>Tình trạng sức khoẻ</label><input className="ap-input" value={form.health} onChange={e => setForm({ ...form, health: e.target.value })} placeholder="Tốt, đã khám bác sĩ thú y..." /></div>
            <div className="ap-form-group ap-form-full">
              <button type="submit" style={{ width: '100%', background: '#111', color: '#fff', border: 'none', padding: '14px', borderRadius: 50, fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>
                📤 Gửi bài đăng (chờ admin duyệt)
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
};