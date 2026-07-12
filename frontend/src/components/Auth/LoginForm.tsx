import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure, setLoading } from '@stores/slices/authSlice';
import { useAuth } from '@hooks/useAuth';
import { useGoogleLogin } from '@react-oauth/google';

const HAS_GOOGLE = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Tài khoản demo dùng khi backend chưa kết nối
const DEMO_ACCOUNTS: Record<string, { id: string; name: string; email: string; role: 'admin' | 'user'; phone: string }> = {
  'admin@petcare.com':  { id: '1', name: 'Admin PetCare',    email: 'admin@petcare.com',  role: 'admin', phone: '0900000001' },
  'user@petcare.com':   { id: '2', name: 'Khách Hàng Demo',   email: 'user@petcare.com',   role: 'user',  phone: '0900000002' },
  'bezubts@gmail.com':  { id: '3', name: 'Yasuo Admin',       email: 'bezubts@gmail.com',  role: 'admin', phone: '' },
};
const DEMO_PASSWORD = 'admin123';
// Emails always get admin role (even via Google OAuth)
const ADMIN_EMAILS = ['admin@petcare.com', 'bezubts@gmail.com'];

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

  // Real Google OAuth — only works when VITE_GOOGLE_CLIENT_ID is set in .env.local
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const g = await res.json();
        const isAdmin = ADMIN_EMAILS.includes(g.email?.toLowerCase());
        const user = { id: g.sub, name: g.name, email: g.email, avatar: g.picture, role: isAdmin ? 'admin' as const : 'user' as const, phone: '' };
        const token = tokenResponse.access_token;
        localStorage.setItem('token', token);
        localStorage.setItem('petcare_user', JSON.stringify(user));
        dispatch(loginSuccess({ user, token }));
        navigate('/');
      } catch {
        alert('Không thể lấy thông tin tài khoản Google.');
      }
    },
    onError: () => alert('Đăng nhập Google thất bại.'),
  });

  const handleGoogleClick = () => {
    if (!HAS_GOOGLE) {
      alert('Google OAuth chưa được cấu hình. Vui lòng thêm VITE_GOOGLE_CLIENT_ID vào file .env.local');
      return;
    }
    googleLogin();
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🐾</div>
        <h2 style={{ margin: '0 0 6px', color: '#111', fontWeight: 900, fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Đăng nhập</h2>
        <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.9rem' }}>Chào mừng trở lại PetCare!</p>
      </div>

      {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 10, marginBottom: 16, fontSize: '0.88rem', fontWeight: 600 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: '0.88rem', color: '#374151' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: '0.95rem', outline: 'none', background: '#fff', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: '0.88rem', color: '#374151' }}>Mật khẩu</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: '0.95rem', outline: 'none', background: '#fff', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', background: '#1a1a1a', color: '#fff', border: 'none', padding: '13px', borderRadius: 50, fontWeight: 800, fontSize: '0.97rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4 }}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
        <span style={{ color: '#9ca3af', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>hoặc</span>
        <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
      </div>

      {/* Google Login */}
      <button type="button" onClick={handleGoogleClick}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '11px 16px', border: '1.5px solid #e5e7eb', borderRadius: 50, background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: '#374151', marginBottom: 20, transition: 'box-shadow 0.15s' }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.2 0 24 0 14.6 0 6.6 5.5 2.7 13.5l7.8 6C12.4 13 17.8 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.9-10 6.9-17z"/>
          <path fill="#FBBC05" d="M10.5 28.8A14.6 14.6 0 0 1 9.5 24c0-1.7.3-3.3.9-4.8l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.7 10.7l7.8-5.9z"/>
          <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.2 0-11.5-4.2-13.4-9.9l-7.8 6C6.5 42.5 14.6 48 24 48z"/>
        </svg>
        Đăng nhập bằng Google
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.88rem', color: '#6b7280', marginBottom: 0 }}>
        Chưa có tài khoản? <a href="/auth/register" style={{ color: '#111', fontWeight: 700 }}>Đăng ký ngay</a>
      </p>
    </div>
  );
};

