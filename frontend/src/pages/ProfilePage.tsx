import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { updateProfile } from '@stores/slices/authSlice';
import { addMyPet, updateMyPet, deleteMyPet, MyPet } from '@stores/slices/myPetsSlice';
import { addReview } from '@stores/slices/reviewsSlice';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';
import { Link, useNavigate } from 'react-router-dom';

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

export const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((s: RootState) => s.auth);
  const { orders } = useSelector((s: RootState) => s.shop);
  const { appointments } = useSelector((s: RootState) => s.booking);
  const { messages } = useSelector((s: RootState) => s.contact);
  const { pets: myPets } = useSelector((s: RootState) => s.myPets);
  const { products } = useSelector((s: RootState) => s.shop);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<'profile' | 'orders' | 'appointments' | 'messages' | 'pets' | 'reviews'>('profile');

  // My Pets state
  const EMPTY_PET: Omit<MyPet,'id'> = { name:'', species:'Chó', breed:'', age:'', weight:'', gender:'', color:'', allergies:'', notes:'', ownerId: user?.id||'' };
  const [petModal, setPetModal] = useState<{open:boolean;data?:MyPet}>({open:false});
  const [petForm, setPetForm] = useState<Omit<MyPet,'id'>>({...EMPTY_PET});

  // Review state
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ productId:'', productName:'', rating:5, title:'', comment:'' });
  const [reviewSent, setReviewSent] = useState(false);

  const myPetList = myPets.filter(p => p.ownerId === user?.id);
  const myOrders = orders.filter(o => o.customerEmail === user?.email);

  const openPetModal = (p?: MyPet) => { if(p){const{id,...r}=p;setPetForm(r);}else setPetForm({...EMPTY_PET,ownerId:user?.id||''}); setPetModal({open:true,data:p}); };
  const savePet = () => { if(!petForm.name)return alert('Nhập tên thú cưng.'); if(petModal.data)dispatch(updateMyPet({id:petModal.data.id,...petForm})); else dispatch(addMyPet(petForm)); setPetModal({open:false}); };

  const submitReview = () => { if(!reviewForm.productId||!reviewForm.comment)return alert('Chọn sản phẩm và nhập nội dung.'); dispatch(addReview({...reviewForm,userId:user?.id||'',userName:user?.name||'',userEmail:user?.email||''})); setReviewSent(true); setTimeout(()=>{setReviewModal(false);setReviewSent(false);setReviewForm({productId:'',productName:'',rating:5,title:'',comment:''});},2000); };
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: (user as any)?.address || '',
    birthday: (user as any)?.birthday || '',
    gender: (user as any)?.gender || '',
    bio: (user as any)?.bio || '',
    avatar: user?.avatar || '',
  });

  if (!isAuthenticated || !user) return (
    <>
      <Header />
      <main className="page-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔐</div>
        <h2 style={{ fontWeight: 800, marginBottom: 12 }}>Bạn cần đăng nhập</h2>
        <button onClick={() => navigate('/auth/login')} style={{ background: '#111', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 50, fontWeight: 700, cursor: 'pointer' }}>Đăng nhập ngay</button>
      </main>
      <Footer />
    </>
  );

  // Filter user's own orders and appointments
  const myAppointments = appointments.filter(a => a.customerEmail === user.email);
  const myMessages = messages.filter(m => m.email === user.email);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return alert('Vui lòng chọn file ảnh.');
    if (file.size > 5 * 1024 * 1024) return alert('Ảnh tối đa 5MB.');
    const reader = new FileReader();
    reader.onload = ev => {
      const avatar = ev.target?.result as string;
      setForm(f => ({ ...f, avatar }));
      // Auto-save avatar immediately
      dispatch(updateProfile({ avatar } as any));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    dispatch(updateProfile({ name: form.name, phone: form.phone, email: form.email, avatar: form.avatar, address: form.address as any, birthday: form.birthday as any, gender: form.gender as any, bio: form.bio as any } as any));
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const STATUS_ORDER: Record<string, { label: string; color: string; bg: string }> = {
    pending:    { label: 'Chờ xác nhận', color: '#92400e', bg: '#fef3c7' },
    confirmed:  { label: 'Đã xác nhận',  color: '#1e40af', bg: '#dbeafe' },
    processing: { label: 'Đang xử lý',   color: '#5b21b6', bg: '#ede9fe' },
    completed:  { label: 'Hoàn thành',   color: '#166534', bg: '#dcfce7' },
    cancelled:  { label: 'Đã hủy',       color: '#991b1b', bg: '#fee2e2' },
  };
  const STATUS_APPT: Record<string, { label: string; color: string; bg: string }> = {
    pending:   { label: 'Chờ xác nhận', color: '#92400e', bg: '#fef3c7' },
    confirmed: { label: 'Đã xác nhận',  color: '#1e40af', bg: '#dbeafe' },
    completed: { label: 'Hoàn thành',   color: '#166534', bg: '#dcfce7' },
    cancelled: { label: 'Đã hủy',       color: '#991b1b', bg: '#fee2e2' },
  };

  const TABS = [
    { k: 'profile', l: '👤 Hồ sơ' },
    { k: 'pets', l: `🐾 Thú cưng của tôi (${myPetList.length})` },
    { k: 'orders', l: `🛒 Đơn hàng (${myOrders.length})` },
    { k: 'appointments', l: `📅 Lịch hẹn (${myAppointments.length})` },
    { k: 'messages', l: `💬 Tin nhắn (${myMessages.length})` },
    { k: 'reviews', l: '⭐ Viết đánh giá' },
  ];

  return (
    <>
      <Header />
      <main className="page-container" style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
        {/* Avatar + name banner */}
        <div style={{ background: 'linear-gradient(135deg,#fce4ec,#fdf6ec)', borderRadius: 20, padding: '32px 28px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 24, border: '1px solid #f0ebe4' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 88, height: 88, borderRadius: '50%', overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', background: '#f0ebe4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900, color: '#111', cursor: 'pointer' }}
              onClick={() => avatarInputRef.current?.click()}>
              {form.avatar ? <img src={form.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name.charAt(0).toUpperCase()}
            </div>
            <button onClick={() => avatarInputRef.current?.click()}
              style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', background: '#111', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>✏️</button>
            <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontWeight: 900, color: '#111', margin: '0 0 4px', fontSize: '1.6rem' }}>{user.name}</h1>
            <p style={{ color: '#888', margin: '0 0 8px', fontSize: '0.9rem' }}>{user.email}</p>
            <span style={{ background: user.role === 'admin' ? '#fef3c7' : '#f0ebe4', color: user.role === 'admin' ? '#92400e' : '#8b5e3c', padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>
              {user.role === 'admin' ? '👑 Quản trị viên' : '👤 Thành viên'}
            </span>
          </div>
          {saved && <div style={{ background: '#dcfce7', color: '#166534', padding: '8px 16px', borderRadius: 10, fontWeight: 700, fontSize: '0.88rem' }}>✅ Đã lưu!</div>}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t.k} onClick={() => setTab(t.k as any)}
              style={{ padding: '9px 18px', borderRadius: 50, border: `2px solid ${tab === t.k ? '#111' : '#e5e7eb'}`, background: tab === t.k ? '#111' : '#fff', color: tab === t.k ? '#fff' : '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}>
              {t.l}
            </button>
          ))}
        </div>

        {/* ─── Profile tab ─── */}
        {tab === 'profile' && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #f0ebe4', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontWeight: 800, margin: 0, fontSize: '1.1rem' }}>Thông tin cá nhân</h2>
              {!editing
                ? <button onClick={() => setEditing(true)} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '8px 18px', borderRadius: 50, fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>✏️ Chỉnh sửa</button>
                : <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setEditing(false)} style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '8px 16px', borderRadius: 50, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>Hủy</button>
                    <button onClick={handleSave} style={{ background: '#111', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 50, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>💾 Lưu</button>
                  </div>
              }
            </div>
            <div className="ap-form-row">
              {[
                ['Họ và tên', 'name', 'text', 'Nguyễn Văn A'],
                ['Số điện thoại', 'phone', 'tel', '0901234567'],
                ['Email', 'email', 'email', 'email@gmail.com'],
                ['Ngày sinh', 'birthday', 'date', ''],
              ].map(([label, key, type, placeholder]) => (
                <div key={key as string} className="ap-form-group">
                  <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>{label as string}</label>
                  {editing
                    ? <input className="ap-input" type={type as string} value={(form as any)[key as string]} onChange={e => setForm({ ...form, [key as string]: e.target.value })} placeholder={placeholder as string} />
                    : <div style={{ padding: '10px 0', color: (form as any)[key as string] ? '#111' : '#9ca3af', fontWeight: (form as any)[key as string] ? 500 : 400 }}>{(form as any)[key as string] || `Chưa cập nhật ${label}`}</div>
                  }
                </div>
              ))}
              <div className="ap-form-group">
                <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>Giới tính</label>
                {editing
                  ? <select className="ap-input" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                      <option value="">-- Chọn --</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  : <div style={{ padding: '10px 0', color: form.gender ? '#111' : '#9ca3af' }}>{form.gender || 'Chưa cập nhật'}</div>
                }
              </div>
              <div className="ap-form-group ap-form-full">
                <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>Địa chỉ</label>
                {editing
                  ? <input className="ap-input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Số nhà, đường, phường, quận, thành phố" />
                  : <div style={{ padding: '10px 0', color: form.address ? '#111' : '#9ca3af' }}>{form.address || 'Chưa cập nhật địa chỉ'}</div>
                }
              </div>
              <div className="ap-form-group ap-form-full">
                <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>Giới thiệu bản thân</label>
                {editing
                  ? <textarea className="ap-input" rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Viết vài dòng về bạn và thú cưng của bạn..." />
                  : <div style={{ padding: '10px 0', color: form.bio ? '#555' : '#9ca3af', lineHeight: 1.6 }}>{form.bio || 'Chưa có giới thiệu'}</div>
                }
              </div>
            </div>
          </div>
        )}

        {/* ─── Orders tab ─── */}
        {tab === 'orders' && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #f0ebe4', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontWeight: 800, margin: '0 0 20px', fontSize: '1.1rem' }}>🛒 Đơn hàng của tôi</h2>
            {myOrders.length === 0
              ? <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}><div style={{ fontSize: '3rem', marginBottom: 12 }}>🛒</div><p>Chưa có đơn hàng nào</p><Link to="/products" style={{ color: '#111', fontWeight: 700 }}>Mua sắm ngay →</Link></div>
              : myOrders.map(o => {
                  const s = STATUS_ORDER[o.status] || STATUS_ORDER.pending;
                  return (
                    <div key={o.id} style={{ border: '1px solid #f0ebe4', borderRadius: 14, padding: '16px 18px', marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div><div style={{ fontWeight: 800, color: '#111' }}>#{o.id}</div><div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{new Date(o.createdAt).toLocaleDateString('vi-VN')}</div></div>
                        <span style={{ padding: '4px 12px', borderRadius: 12, fontSize: '0.78rem', fontWeight: 700, color: s.color, background: s.bg }}>{s.label}</span>
                      </div>
                      {o.items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'center' }}>
                          <img src={item.productImage} alt={item.productName} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8 }} onError={e => (e.currentTarget.style.display='none')} />
                          <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.productName}</div><div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>x{item.quantity} · {fmt(item.price)}</div></div>
                          <div style={{ fontWeight: 800, color: '#c7603a' }}>{fmt(item.price * item.quantity)}</div>
                        </div>
                      ))}
                      <div style={{ borderTop: '1px solid #f0ebe4', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{o.note && `Ghi chú: ${o.note}`}</span>
                        <span style={{ fontWeight: 900, color: '#c7603a' }}>Tổng: {fmt(o.total)}</span>
                      </div>
                    </div>
                  );
                })
            }
          </div>
        )}

        {/* ─── Appointments tab ─── */}
        {tab === 'appointments' && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #f0ebe4', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontWeight: 800, margin: '0 0 20px', fontSize: '1.1rem' }}>📅 Lịch hẹn của tôi</h2>
            {myAppointments.length === 0
              ? <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}><div style={{ fontSize: '3rem', marginBottom: 12 }}>📅</div><p>Chưa có lịch hẹn nào</p><Link to="/services" style={{ color: '#111', fontWeight: 700 }}>Đặt lịch ngay →</Link></div>
              : myAppointments.map(a => {
                  const s = STATUS_APPT[a.status] || STATUS_APPT.pending;
                  return (
                    <div key={a.id} style={{ border: '1px solid #f0ebe4', borderRadius: 14, padding: '14px 18px', marginBottom: 12, display: 'flex', gap: 14, alignItems: 'center' }}>
                      <div style={{ background: '#f0ebe4', padding: '12px 16px', borderRadius: 12, textAlign: 'center', minWidth: 64 }}>
                        <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#111' }}>{a.time}</div>
                        <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{a.date}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, marginBottom: 3 }}>{a.serviceName}</div>
                        <div style={{ fontSize: '0.82rem', color: '#888' }}>🐾 {a.petName} · 👨‍💼 {a.staffName}</div>
                        {a.note && <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: 2 }}>{a.note}</div>}
                      </div>
                      <span style={{ padding: '4px 12px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700, color: s.color, background: s.bg, whiteSpace: 'nowrap' }}>{s.label}</span>
                    </div>
                  );
                })
            }
          </div>
        )}

        {/* ─── Messages tab ─── */}
        {tab === 'messages' && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #f0ebe4', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontWeight: 800, margin: '0 0 20px', fontSize: '1.1rem' }}>💬 Tin nhắn liên hệ của tôi</h2>
            {myMessages.length === 0
              ? <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}><div style={{ fontSize: '3rem', marginBottom: 12 }}>💬</div><p>Chưa có tin nhắn nào</p><Link to="/contact" style={{ color: '#111', fontWeight: 700 }}>Gửi liên hệ ngay →</Link></div>
              : myMessages.map(m => (
                  <div key={m.id} style={{ border: '1px solid #f0ebe4', borderRadius: 14, padding: '14px 18px', marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span className="ap-tag">{m.subject}</span>
                      <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 700, color: m.status === 'replied' ? '#166534' : m.status === 'read' ? '#92400e' : '#991b1b', background: m.status === 'replied' ? '#dcfce7' : m.status === 'read' ? '#fef3c7' : '#fee2e2' }}>
                        {m.status === 'replied' ? '✅ Đã trả lời' : m.status === 'read' ? '👀 Đã đọc' : '🔴 Mới'}
                      </span>
                    </div>
                    <p style={{ color: '#555', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 8px' }}>{m.message}</p>
                    {m.reply && <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '10px 14px', border: '1px solid #bbf7d0' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#166534', marginBottom: 4 }}>💬 Phản hồi từ PetCare:</div>
                      <div style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.6 }}>{m.reply}</div>
                    </div>}
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 8 }}>{new Date(m.createdAt).toLocaleString('vi-VN')}</div>
                  </div>
                ))
            }
          </div>
        )}

        {/* ─── My Pets tab ─── */}
        {tab === 'pets' && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #f0ebe4', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontWeight: 800, margin: 0, fontSize: '1.1rem' }}>🐾 Thú cưng của tôi</h2>
              <button onClick={() => openPetModal()} style={{ background: '#111', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 50, fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>+ Thêm thú cưng</button>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: 20 }}>Thêm thú cưng để tự động điền khi đặt lịch spa & dịch vụ.</p>
            {myPetList.length === 0
              ? <div style={{ textAlign: 'center', padding: '32px 20px', color: '#9ca3af' }}><div style={{ fontSize: '3rem', marginBottom: 12 }}>🐾</div><p>Chưa có thú cưng nào. Thêm bé đầu tiên!</p></div>
              : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
                  {myPetList.map(p => (
                    <div key={p.id} style={{ background: '#faf9f7', borderRadius: 14, padding: '16px 18px', border: '1px solid #f0ebe4' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1rem' }}>{p.name} <span style={{ color: p.gender === 'Cái' ? '#ec4899' : '#3b82f6', fontSize: '0.82rem' }}>{p.gender}</span></div>
                          <div style={{ color: '#888', fontSize: '0.82rem' }}>{p.species}{p.breed && ` · ${p.breed}`}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => openPetModal(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#6b7280' }}>✏️</button>
                          <button onClick={() => dispatch(deleteMyPet(p.id))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#ef4444' }}>🗑️</button>
                        </div>
                      </div>
                      {[p.age && `🎂 ${p.age}`, p.weight && `⚖️ ${p.weight}`, p.color && `🎨 ${p.color}`].filter(Boolean).map((info, i) => (
                        <div key={i} style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: 3 }}>{info}</div>
                      ))}
                      {p.allergies && <div style={{ marginTop: 8, background: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 600 }}>⚠️ Dị ứng: {p.allergies}</div>}
                    </div>
                  ))}
                </div>
            }
            {/* Pet modal */}
            {petModal.open && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
                onClick={e => { if (e.target === e.currentTarget) setPetModal({ open: false }); }}>
                <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: 500, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h3 style={{ margin: 0, fontWeight: 800 }}>{petModal.data ? '✏️ Sửa thú cưng' : '➕ Thêm thú cưng'}</h3>
                    <button onClick={() => setPetModal({ open: false })} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#9ca3af' }}>✕</button>
                  </div>
                  <div className="ap-form-row">
                    <div className="ap-form-group"><label>Tên thú cưng *</label><input className="ap-input" value={petForm.name} onChange={e => setPetForm({ ...petForm, name: e.target.value })} /></div>
                    <div className="ap-form-group"><label>Loài</label>
                      <select className="ap-input" value={petForm.species} onChange={e => setPetForm({ ...petForm, species: e.target.value })}>
                        {['Chó', 'Mèo', 'Thỏ', 'Khác'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="ap-form-group"><label>Giống</label><input className="ap-input" value={petForm.breed} onChange={e => setPetForm({ ...petForm, breed: e.target.value })} placeholder="Golden Retriever..." /></div>
                    <div className="ap-form-group"><label>Tuổi</label><input className="ap-input" value={petForm.age} onChange={e => setPetForm({ ...petForm, age: e.target.value })} placeholder="3 tuổi" /></div>
                    <div className="ap-form-group"><label>Giới tính</label>
                      <select className="ap-input" value={petForm.gender} onChange={e => setPetForm({ ...petForm, gender: e.target.value })}>
                        <option value="">—</option><option value="Đực">Đực</option><option value="Cái">Cái</option>
                      </select>
                    </div>
                    <div className="ap-form-group"><label>Cân nặng</label><input className="ap-input" value={petForm.weight} onChange={e => setPetForm({ ...petForm, weight: e.target.value })} placeholder="4 kg" /></div>
                    <div className="ap-form-group"><label>Màu lông</label><input className="ap-input" value={petForm.color} onChange={e => setPetForm({ ...petForm, color: e.target.value })} placeholder="Vàng, đen trắng..." /></div>
                    <div className="ap-form-group ap-form-full"><label>Dị ứng / Lưu ý sức khoẻ</label><input className="ap-input" value={petForm.allergies} onChange={e => setPetForm({ ...petForm, allergies: e.target.value })} placeholder="Dị ứng với shampoo ABC..." /></div>
                    <div className="ap-form-group ap-form-full"><label>Ghi chú thêm</label><textarea className="ap-input" rows={2} value={petForm.notes} onChange={e => setPetForm({ ...petForm, notes: e.target.value })} /></div>
                    <div className="ap-form-group ap-form-full">
                      <div className="ap-form-actions">
                        <button className="ap-btn ap-btn-primary" onClick={savePet}>{petModal.data ? 'Lưu' : 'Thêm thú cưng'}</button>
                        <button className="ap-btn ap-btn-ghost" onClick={() => setPetModal({ open: false })}>Hủy</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Reviews tab ─── */}
        {tab === 'reviews' && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #f0ebe4', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontWeight: 800, margin: 0, fontSize: '1.1rem' }}>⭐ Viết đánh giá sản phẩm</h2>
              <button onClick={() => setReviewModal(true)} style={{ background: '#111', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 50, fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>+ Viết đánh giá</button>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Chia sẻ trải nghiệm của bạn về sản phẩm đã mua. Admin sẽ duyệt trước khi đăng.</p>
            {reviewModal && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
                onClick={e => { if (e.target === e.currentTarget) setReviewModal(false); }}>
                <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: 500, boxShadow: '0 24px 64px rgba(0,0,0,.2)' }}>
                  {reviewSent ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
                      <h3 style={{ fontWeight: 900 }}>Đã gửi đánh giá!</h3>
                      <p style={{ color: '#888' }}>Admin sẽ xét duyệt và đăng lên sớm.</p>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h3 style={{ margin: 0, fontWeight: 800 }}>⭐ Viết đánh giá</h3>
                        <button onClick={() => setReviewModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#9ca3af' }}>✕</button>
                      </div>
                      <div className="ap-form-row">
                        <div className="ap-form-group ap-form-full"><label>Chọn sản phẩm *</label>
                          <select className="ap-input" value={reviewForm.productId} onChange={e => { const p = products.find(p=>p.id===e.target.value); setReviewForm({...reviewForm,productId:e.target.value,productName:p?.name||''}); }}>
                            <option value="">— Chọn sản phẩm —</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                        </div>
                        <div className="ap-form-group ap-form-full">
                          <label>Điểm đánh giá *</label>
                          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                            {[1,2,3,4,5].map(n => (
                              <button key={n} type="button" onClick={() => setReviewForm({...reviewForm,rating:n})}
                                style={{ fontSize: '1.8rem', background: 'none', border: 'none', cursor: 'pointer', filter: n <= reviewForm.rating ? 'none' : 'grayscale(1) opacity(0.3)', transform: n <= reviewForm.rating ? 'scale(1.1)' : '' }}>⭐</button>
                            ))}
                            <span style={{ alignSelf: 'center', fontWeight: 700, color: '#f59e0b' }}>{reviewForm.rating}/5</span>
                          </div>
                        </div>
                        <div className="ap-form-group ap-form-full"><label>Tiêu đề đánh giá</label><input className="ap-input" value={reviewForm.title} onChange={e => setReviewForm({...reviewForm,title:e.target.value})} placeholder="Sản phẩm tuyệt vời!" /></div>
                        <div className="ap-form-group ap-form-full"><label>Nội dung đánh giá *</label><textarea className="ap-input" rows={4} value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm,comment:e.target.value})} placeholder="Chia sẻ trải nghiệm của bạn..." required /></div>
                        <div className="ap-form-group ap-form-full">
                          <div className="ap-form-actions">
                            <button className="ap-btn ap-btn-primary" onClick={submitReview}>📤 Gửi đánh giá</button>
                            <button className="ap-btn ap-btn-ghost" onClick={() => setReviewModal(false)}>Hủy</button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};