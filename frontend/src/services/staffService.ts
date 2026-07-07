import api from './api';
import type { ApiResponse } from '@/types';

export type StaffStatus = 'active' | 'on_leave' | 'inactive';

export interface Staff {
  id: string;
  avatar?: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  services: string[];
  status: StaffStatus;
}

export interface CreateStaffRequest {
  name: string;
  email: string;
  phone: string;
  position: string;
  status: StaffStatus;
  services: string[];
  avatar?: string;
}

export interface UpdateStaffRequest extends Partial<CreateStaffRequest> {}

const normalizeStaff = (s: any): Staff => ({
  id: s._id ?? s.id,
  avatar: s.avatar,
  name: s.name,
  email: s.email,
  phone: s.phone,
  position: s.position,
  services: s.services ?? [],
  status: s.status,
});

export const staffService = {
  async getAll(params?: { search?: string; status?: string }) {
    const response = await api.get<ApiResponse<Staff[]>>('/staff', { params });
    const list = response.data.data ?? [];
    return list.map(normalizeStaff);
  },

  async create(payload: CreateStaffRequest) {
    const response = await api.post<ApiResponse<any>>('/staff', payload);
    return normalizeStaff(response.data.data);
  },

  async update(id: string, payload: UpdateStaffRequest) {
    const response = await api.patch<ApiResponse<any>>(`/staff/${id}`, payload);
    return normalizeStaff(response.data.data);
  },

  async remove(id: string) {
    const response = await api.delete<ApiResponse<any>>(`/staff/${id}`);
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get<ApiResponse<any>>(`/staff/${id}`);
    return normalizeStaff(response.data.data);
  },
};

