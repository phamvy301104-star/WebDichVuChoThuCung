import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@stores/store';
import { loginSuccess, logout, setUser, setLoading, loginFailure } from '@stores/slices/authSlice';
import { authService } from '@services/authService';
import type { User } from '@/types';

const TOKEN_KEY = 'token';
const USER_KEY = 'petcare_user';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    dispatch(setLoading(true));
    try {
      const response = await authService.login({ email, password });
      console.log('Login response:', response);
      const userData = response.data.user;
      const userToken = response.data.token;
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      dispatch(loginSuccess({ user: userData, token: userToken }));
      return userData;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Đăng nhập thất bại';
      dispatch(loginFailure(message));
      throw new Error(message);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    dispatch(setLoading(true));
    try {
      const response = await authService.register({ email, password, name });
      const userData = response.data.user;
      const userToken = response.data.token;
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      dispatch(loginSuccess({ user: userData, token: userToken }));
      return userData;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Đăng ký thất bại';
      dispatch(loginFailure(message));
      throw new Error(message);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
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
