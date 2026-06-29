import api from "./api";
import { AuthRequest, AuthResponse, User } from "@types/index";

export const authService = {
  // Đăng ký tài khoản
  async register(data: AuthRequest & { name: string }) {
    const response = await api.post<AuthResponse>("/auth/register", data);
    if (response.data.data?.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
    }
    return response.data;
  },

  // Đăng nhập
  async login(data: AuthRequest) {
    const response = await api.post<AuthResponse>("/auth/login", data);
    if (response.data.data?.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
    }
    return response.data;
  },

  // Đăng nhập với Google
  async loginWithGoogle(googleToken: string) {
    const response = await api.post<AuthResponse>("/auth/google", {
      token: googleToken,
    });
    if (response.data.data?.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
    }
    return response.data;
  },

  // Lấy thông tin người dùng hiện tại
  async getCurrentUser() {
    const response = await api.get<{ data: User }>("/auth/me");
    return response.data.data;
  },

  // Đơi mật khẩu
  async changePassword(oldPassword: string, newPassword: string) {
    const response = await api.put("/auth/change-password", {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  // Cập nhật hồ sơ
  async updateProfile(data: Partial<User>) {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },

  // Đăng xuất
  async logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    // Gọi API logout nếu backend cần
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.log("Logout error:", error);
    }
  },

  // Refresh token
  async refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token");

    const response = await api.post<AuthResponse>("/auth/refresh", {
      refreshToken,
    });
    if (response.data.data?.token) {
      localStorage.setItem("token", response.data.data.token);
    }
    return response.data;
  },
};
