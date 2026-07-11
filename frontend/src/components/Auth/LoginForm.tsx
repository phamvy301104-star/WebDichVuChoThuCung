import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure, setLoading } from '@stores/slices/authSlice';
import { useAuth } from '@hooks/useAuth';

// Tài khoản demo dùng khi backend chưa kết nối
const DEMO_ACCOUNTS: Record<string, { id: string; name: string; email: string; role: 'admin' | 'user'; phone: string }> = {
  'admin@petcare.com': { id: '1', name: 'Admin PetCare', email: 'admin@petcare.com', role: 'admin', phone: '0900000001' },
  'user@petcare.com':  { id: '2', name: 'Khách Hàng Demo', email: 'user@petcare.com',  role: 'user',  phone: '0900000002' },
};
const DEMO_PASSWORD = 'admin123';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoadingLocal] = useState(false);
  const { login } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mockLogin = (emailKey: string) => {
    const user = DEMO_ACCOUNTS[emailKey];
    const token = 'demo_token_' + Date.now();
    localStorage.setItem('token', token);
    localStorage.setItem('petcare_user', JSON.stringify(user));
    dispatch(loginSuccess({ user, token }));
    navigate(user.role === 'admin' ? '/admin' : '/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingLocal(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch {
      // Fallback: dùng mock nếu backend chưa chạy
      const demo = DEMO_ACCOUNTS[email.toLowerCase()];
      if (demo && password === DEMO_PASSWORD) {
        mockLogin(email.toLowerCase());
        return;
      }
      setError('Email hoặc mật khẩu không đúng.');
    } finally {
      setLoadingLocal(false);
    }
  };

  const handleGoogleLogin = () => {
    // Mock Google Login — thay bằng OAuth thật khi có Client ID
    mockLogin('user@petcare.com');
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: '2.5rem' }}>🐾</div>
        <h2 style={{ margin: '8px 0 4px', color: '#253D4E', fontWeight: 800 }}>Đăng nhập</h2>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>Chào mừng trở lại PetCare!</p>
      </div>

      {/* Demo credentials box */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', marginBottom: 18, fontSize: '0.82rem' }}>
        <div style={{ fontWeight: 700, color: '#166534', marginBottom: 4 }}>🔑 Tài khoản demo</div>
        <div style={{ color: '#374151', cursor: 'pointer' }} onClick={() => { setEmail('admin@petcare.com'); setPassword('admin123'); }}>
          👑 Admin: <b>admin@petcare.com</b> / <b>admin123</b>
        </div>
        <div style={{ color: '#374151', cursor: 'pointer', marginTop: 2 }} onClick={() => { setEmail('user@petcare.com'); setPassword('admin123'); }}>
          👤 User: <b>user@petcare.com</b> / <b>admin123</b>
        </div>
      </div>

      {error && <div className="error-message" style={{ marginBottom: 12, padding: '10px 14px', background: '#fee2e2', color: '#991b1b', borderRadius: 8, fontSize: '0.88rem' }}>{error}</div>}

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
      </div>

      <div className="form-group">
        <label htmlFor="password">Mật khẩu</label>
        <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
      </div>

      <button type="submit" disabled={loading} className="btn-submit" style={{ width: '100%', marginBottom: 12 }}>
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>

      {/* Google Login */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          padding: '10px 16px', border: '1.5px solid #e5e7eb', borderRadius: 8, background: '#fff',
          cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: '#374151', marginBottom: 16,
          transition: 'box-shadow 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
      >
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.2 0 24 0 14.6 0 6.6 5.5 2.7 13.5l7.8 6C12.4 13 17.8 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.9-10 6.9-17z"/>
          <path fill="#FBBC05" d="M10.5 28.8A14.6 14.6 0 0 1 9.5 24c0-1.7.3-3.3.9-4.8l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.7 10.7l7.8-5.9z"/>
          <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.2 0-11.5-4.2-13.4-9.9l-7.8 6C6.5 42.5 14.6 48 24 48z"/>
        </svg>
        Đăng nhập bằng Google
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.88rem', color: '#6b7280', margin: 0 }}>
        Chưa có tài khoản? <a href="/auth/register" style={{ color: '#3BB77E', fontWeight: 600 }}>Đăng ký ngay</a>
      </p>
    </form>
  );
};

