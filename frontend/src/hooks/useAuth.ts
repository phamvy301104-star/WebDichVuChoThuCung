import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@stores/store';
import { loginSuccess, logout, setUser, setLoading, loginFailure } from '@stores/slices/authSlice';
import { User } from '@types/index';

// Mock users for demo (replace with real API when backend ready)
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@petcare.com',
    password: 'admin123',
    name: 'Admin PetCare',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'user@petcare.com',
    password: 'user123',
    name: 'Người dùng Demo',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
];

const USERS_KEY = 'petcare_users';
const TOKEN_KEY = 'token';
const USER_KEY = 'petcare_user';

const getStoredUsers = (): (User & { password: string })[] => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || JSON.stringify(MOCK_USERS));
  } catch {
    return MOCK_USERS;
  }
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    dispatch(setLoading(true));
    await new Promise(r => setTimeout(r, 600)); // simulate network
    const users = getStoredUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) {
      dispatch(loginFailure('Email hoặc mật khẩu không đúng'));
      throw new Error('Email hoặc mật khẩu không đúng');
    }
    const { password: _pw, ...userData } = found;
    const mockToken = btoa(JSON.stringify({ id: userData.id, email: userData.email, role: userData.role }));
    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    dispatch(loginSuccess({ user: userData, token: mockToken }));
    return userData;
  };

  const register = async (email: string, password: string, name: string) => {
    dispatch(setLoading(true));
    await new Promise(r => setTimeout(r, 600));
    const users = getStoredUsers();
    if (users.find(u => u.email === email)) {
      dispatch(loginFailure('Email đã được sử dụng'));
      throw new Error('Email đã được sử dụng');
    }
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    const { password: _pw, ...userData } = newUser;
    const mockToken = btoa(JSON.stringify({ id: userData.id, email: userData.email, role: userData.role }));
    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    dispatch(loginSuccess({ user: userData, token: mockToken }));
    return userData;
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    dispatch(logout());
  };

  const getCurrentUser = () => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        const userData: User = JSON.parse(stored);
        dispatch(setUser(userData));
        return userData;
      }
    } catch {
      // ignore
    }
    return null;
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout: handleLogout,
    getCurrentUser,
  };
};
