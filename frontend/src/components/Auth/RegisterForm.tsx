import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@stores/slices/authSlice';
import { useAuth } from '@hooks/useAuth';

const inputStyle: React.CSSProperties = { width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: '0.95rem', outline: 'none', background: '#fff', boxSizing: 'border-box', transition: 'border-color 0.15s' };

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    if (formData.password !== formData.confirmPassword) { setError('Mật khẩu xác nhận không khớp.'); setLoading(false); return; }
    if (formData.password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự.'); setLoading(false); return; }
    try {
      await register(formData.email, formData.password, formData.name);
      navigate('/');
    } catch {
      // Mock register fallback
      const user = { id: 'u' + Date.now(), name: formData.name, email: formData.email, role: 'user' as const, phone: '', avatar: '' };
      const token = 'mock_token_' + Date.now();
      localStorage.setItem('token', token);
      localStorage.setItem('petcare_user', JSON.stringify(user));
      dispatch(loginSuccess({ user, token }));
      navigate('/');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🐾</div>
        <h2 style={{ margin: '0 0 6px', color: '#111', fontWeight: 900, fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Tạo tài khoản</h2>
        <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.9rem' }}>Tham gia cộng đồng PetCare ngay hôm nay</p>
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 10, marginBottom: 16, fontSize: '0.88rem', fontWeight: 600 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: '0.88rem', color: '#374151' }}>Họ và tên</label>
            <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Nguyễn Văn A" required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: '0.88rem', color: '#374151' }}>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: '0.88rem', color: '#374151' }}>Mật khẩu</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Tối thiểu 6 ký tự" required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: '0.88rem', color: '#374151' }}>Xác nhận mật khẩu</label>
            <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Nhập lại mật khẩu" required style={inputStyle} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', padding: '13px', borderRadius: 50, fontWeight: 800, fontSize: '0.97rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4 }}>
            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay'}
          </button>
        </div>
      </form>

      <p style={{ textAlign: 'center', fontSize: '0.88rem', color: '#6b7280', marginTop: 20, marginBottom: 0 }}>
        Đã có tài khoản? <a href="/auth/login" style={{ color: '#111', fontWeight: 700 }}>Đăng nhập</a>
      </p>
    </div>
  );
};
