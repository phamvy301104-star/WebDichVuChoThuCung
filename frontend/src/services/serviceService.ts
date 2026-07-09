import api from './api';
import type { ApiResponse } from '@/types';
import type { Service } from '@/types/service';

export const serviceService = {
  // Lấy danh sách dịch vụ
  async getServices() {
    // Backend trả về toàn bộ services.
    // UI user sẽ tự lọc theo status (chỉ ẩn INACTIVE).
    const response = await api.get<ApiResponse<Service[]>>('/services');
    return response.data.data || [];
  },

  // Lấy chi tiết dịch vụ
  async getServiceById(id: string) {
    const response = await api.get<ApiResponse<Service>>(`/services/${id}`);
    return response.data.data;
  },

  // Tạo dịch vụ (Admin)
  async createService(data: Partial<Service>) {
    const response = await api.post<ApiResponse<Service>>('/services', data);
    return response.data?.data || response.data;
  },

  // Cập nhật dịch vụ (Admin)
  async updateService(id: string, data: Partial<Service>) {
    const response = await api.patch<ApiResponse<Service>>(`/services/${id}`, data);
    return response.data?.data || response.data;
  },
 
  // Xóa dịch vụ (Admin) - không dùng ở màn admin hiện tại (soft delete bằng updateService) hay ẩn dịch vụ (status = INACTIVE)
  async deleteService(id: string) {
    const response = await api.delete(`/services/${id}`);
    return response.data?.data || response.data;
  },
};

