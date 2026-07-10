import api from './api';
import type { ApiResponse } from '@/types';
import type { Staff, StaffStatus } from '@/types/staff'; //  Import tập trung

// ĐA XÓA: Loại bỏ toàn bộ đống code khai báo lại interface gây loãng mã nguồn

const normalizeStaff = (s: any): Staff => ({
  id: s._id ?? s.id,
  avatar: s.avatar,
  name: s.name,
  email: s.email,
  phone: s.phone,
  position: s.position,
  // Chấp nhận mảng string ID hoặc mảng Object Service đã populate từ Backend mới
  services: s.services ?? [], 
  status: s.status,
  createdAt: s.createdAt,
  updatedAt: s.updatedAt,
});

export const staffService = {
  async getAll(params?: { search?: string; status?: string }): Promise<Staff[]> {
    const response = await api.get<ApiResponse<Staff[]>>('/staff', { params });
    const list = response.data.data ?? [];
    return list.map(normalizeStaff);
  },

  async create(payload: Partial<Staff>): Promise<Staff> {
    const response = await api.post<ApiResponse<any>>('/staff', payload);
    return normalizeStaff(response.data.data);
  },

  async update(id: string, payload: Partial<Staff>): Promise<Staff> {
    const response = await api.patch<ApiResponse<any>>(`/staff/${id}`, payload);
    return normalizeStaff(response.data.data);
  },

  async remove(id: string): Promise<any> {
    const response = await api.delete<ApiResponse<any>>(`/staff/${id}`);
    return response.data;
  },

  async getById(id: string): Promise<Staff> {
    const response = await api.get<ApiResponse<any>>(`/staff/${id}`);
    return normalizeStaff(response.data.data);
  },
};