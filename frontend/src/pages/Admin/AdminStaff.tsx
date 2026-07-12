import React, { useState } from 'react';

interface Staff { id: string; name: string; phone: string; email: string; role: string; status: 'active' | 'inactive'; joinDate: string; }

const INIT: Staff[] = [
  { id: '1', name: 'Nguyễn Thị Lan', phone: '0901111111', email: 'lan@petcare.com', role: 'Bác sĩ thú y', status: 'active', joinDate: '2023-01-15' },
  { id: '2', name: 'Trần Văn Minh', phone: '0902222222', email: 'minh@petcare.com', role: 'Groomer', status: 'active', joinDate: '2023-03-20' },
  { id: '3', name: 'Lê Thị Hoa', phone: '0903333333', email: 'hoa@petcare.com', role: 'Lễ tân', status: 'active', joinDate: '2023-06-01' },
  { id: '4', name: 'Phạm Văn Đức', phone: '0904444444', email: 'duc@petcare.com', role: 'Groomer', status: 'inactive', joinDate: '2022-11-10' },
];

const ROLES = ['Bác sĩ thú y', 'Groomer', 'Lễ tân', 'Kho vận', 'Kế toán'];
const EMPTY: Staff = { id: '', name: '', phone: '', email: '', role: 'Lễ tân', status: 'active', joinDate: '' };

export const AdminStaff: React.FC = () => {
  const [items, setItems] = useState(INIT);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const openAdd = () => { setForm({ ...EMPTY, id: Date.now().toString() }); setModal(true); };
  const openEdit = (s: Staff) => { setForm(s); setModal(true); };
  const save = () => {
    setItems(prev => prev.find(s => s.id === form.id) ? prev.map(s => s.id === form.id ? form : s) : [...prev, form]);
    setModal(false);
  };
  const remove = (id: string) => { if (confirm('Xóa nhân viên này?')) setItems(prev => prev.filter(s => s.id !== id)); };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1e1b4b', margin: 0 }}>👨‍💼 Quản lý nhân viên</h1>
        <button onClick={openAdd} style={{ background: 'linear-gradient(135deg,#3BB77E,#2D9B6A)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>+ Thêm nhân viên</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {items.map(s => (
          <div key={s.id} style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#3BB77E,#2D9B6A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.2rem', flexShrink: 0 }}>
                {s.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#1e1b4b' }}>{s.name}</div>
                <span style={{ background: '#E8F5EF', color: '#166534', padding: '2px 8px', borderRadius: 5, fontSize: '0.75rem', fontWeight: 600 }}>{s.role}</span>
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#6b7280', display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
              <span>📞 {s.phone}</span>
              <span>✉️ {s.email}</span>
              <span>📅 Ngày vào: {s.joinDate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ background: s.status === 'active' ? '#dcfce7' : '#fee2e2', color: s.status === 'active' ? '#16a34a' : '#dc2626', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
                {s.status === 'active' ? 'Đang làm việc' : 'Nghỉ việc'}
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => openEdit(s)} style={{ background: '#dbeafe', color: '#2563eb', border: 'none', padding: '4px 10px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>Sửa</button>
                <button onClick={() => remove(s.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 10px', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>Xóa</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 460, maxWidth: '90vw' }}>
            <h3 style={{ fontWeight: 800, color: '#1e1b4b', marginBottom: 20 }}>Nhân viên</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[{ label: 'Họ tên', key: 'name' }, { label: 'Số điện thoại', key: 'phone' }, { label: 'Email', key: 'email' }, { label: 'Ngày vào làm', key: 'joinDate' }].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 4, fontSize: '0.88rem' }}>{f.label}</label>
                  <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    type={f.key === 'joinDate' ? 'date' : 'text'}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e7eb', boxSizing: 'border-box', outline: 'none' }} />
                </div>
              ))}
              {[{ label: 'Chức vụ', key: 'role', options: ROLES.map(r => ({ value: r, label: r })) }, { label: 'Trạng thái', key: 'status', options: [{ value: 'active', label: 'Đang làm việc' }, { value: 'inactive', label: 'Nghỉ việc' }] }].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: 4, fontSize: '0.88rem' }}>{f.label}</label>
                  <select value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e7eb', outline: 'none' }}>
                    {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={save} style={{ flex: 1, background: 'linear-gradient(135deg,#3BB77E,#2D9B6A)', color: '#fff', border: 'none', padding: '11px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Lưu</button>
              <button onClick={() => setModal(false)} style={{ flex: 1, background: '#f3f4f6', color: '#374151', border: 'none', padding: '11px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
