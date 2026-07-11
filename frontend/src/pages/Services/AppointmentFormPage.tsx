import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { bookAppointment } from '@stores/slices/bookingSlice';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';
const TIMES = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00'];

export const AppointmentFormPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { services, staff } = useSelector((s: RootState) => s.booking);
  const { user } = useSelector((s: RootState) => s.auth);
  const { pets: myPets } = useSelector((s: RootState) => s.myPets);
  const myPetList = myPets.filter(p => p.ownerId === user?.id);

  const service = services.find(s => s.id === serviceId);
  const activeStaff = staff.filter(s => s.status === 'active');

  const [form, setForm] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    petName: '',
    petType: 'Chó',
    staffId: '',
    date: '',
    time: '',
    note: '',
  });
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.petName || !form.date || !form.time) return alert('Vui lòng điền đầy đủ thông tin bắt buộc (*)');
    const st = staff.find(s => s.id === form.staffId);
    dispatch(bookAppointment({
      ...form,
      serviceId: serviceId || '',
      serviceName: service?.name || '',
      staffName: st?.name || 'Chưa chỉ định',
      status: 'pending',
    }));
    setDone(true);
  };

  if (!service) return (
    <>
      <Header />
      <main className="page-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <p>Dịch vụ không tồn tại. <a href="/services" style={{ color: '#c7603a' }}>Xem tất cả dịch vụ</a></p>
      </main>
      <Footer />
    </>
  );

  if (done) return (
    <>
      <Header />
      <main className="page-container" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontWeight: 900, color: '#1a1a1a', marginBottom: 8 }}>Đặt lịch thành công!</h1>
        <p style={{ color: '#6b7280', marginBottom: 8 }}>Lịch hẹn của bạn đã được ghi nhận.</p>
        <p style={{ color: '#6b7280', marginBottom: 32 }}>Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => navigate('/services')} style={{ background: '#1a1a1a', color: '#fff', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}>Xem thêm dịch vụ</button>
        </div>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <main className="page-container" style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>
          {/* Form */}
          <div>
            <h1 style={{ fontWeight: 900, color: '#1a1a1a', marginBottom: 4 }}>📅 Đặt lịch hẹn</h1>
            <p style={{ color: '#6b7280', marginBottom: 24 }}>Điền thông tin bên dưới để xác nhận lịch hẹn</p>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {[['Họ và tên *', 'customerName', 'text', 'Nguyễn Văn A'], ['Số điện thoại *', 'customerPhone', 'tel', '0901234567'], ['Email', 'customerEmail', 'email', 'email@gmail.com']].map(([label, key, type, placeholder]) => (
                  <div key={key as string}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: '0.9rem', color: '#1a1a1a' }}>{label as string}</label>
                    <input type={type as string} className="ap-input" placeholder={placeholder as string} value={(form as any)[key as string]} onChange={e => setForm({ ...form, [key as string]: e.target.value })} required={(label as string).includes('*')} />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>              {/* Quick-fill from profile pets */}
              {myPetList.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, fontSize: '0.9rem' }}>🐾 Chọn nhanh từ thú cưng của bạn</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {myPetList.map(p => (
                      <button key={p.id} type="button"
                        onClick={() => setForm({ ...form, petName: p.name, petType: p.species })}
                        style={{ padding: '7px 14px', borderRadius: 50, border: `2px solid ${form.petName === p.name ? '#111' : '#e5e7eb'}`, background: form.petName === p.name ? '#111' : '#fff', color: form.petName === p.name ? '#fff' : '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                        {p.name} ({p.species})
                      </button>
                    ))}
                  </div>
                </div>
              )}                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: '0.9rem' }}>Tên thú cưng *</label>
                  <input className="ap-input" placeholder="VD: Buddy" value={form.petName} onChange={e => setForm({ ...form, petName: e.target.value })} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: '0.9rem' }}>Loài</label>
                  <select className="ap-input" value={form.petType} onChange={e => setForm({ ...form, petType: e.target.value })}>
                    {['Chó', 'Mèo', 'Thỏ', 'Khác'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Staff selection */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 10, fontSize: '0.9rem' }}>Chọn nhân viên</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 10 }}>
                  <div onClick={() => setForm({ ...form, staffId: '' })}
                    style={{ padding: '10px 14px', borderRadius: 10, border: `2px solid ${!form.staffId ? '#1a1a1a' : '#e5e7eb'}`, background: !form.staffId ? '#f9f9f9' : '#fff', cursor: 'pointer', textAlign: 'center', fontSize: '0.85rem' }}>
                    <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>🎲</div>
                    <div style={{ fontWeight: 600 }}>Bất kỳ</div>
                  </div>
                  {activeStaff.map(s => (
                    <div key={s.id} onClick={() => setForm({ ...form, staffId: s.id })}
                      style={{ padding: '10px 14px', borderRadius: 10, border: `2px solid ${form.staffId === s.id ? '#1a1a1a' : '#e5e7eb'}`, background: form.staffId === s.id ? '#f9f9f9' : '#fff', cursor: 'pointer', textAlign: 'center' }}>
                      <img src={s.avatar} alt={s.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', marginBottom: 6 }} onError={e => { (e.target as HTMLImageElement).src = ''; }} />
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#1a1a1a' }}>{s.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{s.role}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: '0.9rem' }}>Ngày hẹn *</label>
                  <input type="date" className="ap-input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} min={new Date().toISOString().split('T')[0]} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: '0.9rem' }}>Giờ hẹn *</label>
                  <select className="ap-input" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required>
                    <option value="">— Chọn giờ —</option>
                    {TIMES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: '0.9rem' }}>Ghi chú</label>
                <textarea className="ap-input" rows={3} placeholder="VD: Bé hay cắn, cần nhẹ nhàng..." value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
              </div>

              <button type="submit" style={{ width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', padding: '14px', borderRadius: 10, fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>
                ✅ Xác nhận đặt lịch
              </button>
            </form>
          </div>

          {/* Service info card */}
          <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #f0ebe4', position: 'sticky', top: 20 }}>
            {service.image && <img src={service.image} alt={service.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />}
            <div style={{ padding: 20 }}>
              <span style={{ background: '#f0ebe4', color: '#8b5e3c', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 10 }}>{service.category}</span>
              <h3 style={{ fontWeight: 800, color: '#1a1a1a', margin: '10px 0 8px' }}>{service.name}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: 16 }}>{service.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #f0ebe4' }}>
                <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>⏱ {service.duration} phút</span>
                <span style={{ fontWeight: 900, color: '#c7603a', fontSize: '1.05rem' }}>{fmt(service.price)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};