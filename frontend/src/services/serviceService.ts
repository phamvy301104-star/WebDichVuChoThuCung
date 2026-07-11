import api from './api';
import type { ApiResponse } from '@/types';
import type { Service } from '@/types/service';

/**
 * ĐÃ THÊM: Chuẩn hóa dữ liệu Dịch vụ đồng nhất hệ thống id
 */
const normalizeService = (s: any): Service => ({
  id: s._id ?? s.id,
  name: s.name,
  description: s.description,
  category: s.category,
  price: s.price,
  duration: s.duration,
  image: s.image,
  status: s.status,
  rating: s.rating,
  reviews: s.reviews,
  createdAt: s.createdAt,
  updatedAt: s.updatedAt,
});

export const serviceService = {
  // Lấy danh sách dịch vụ
  async getServices(): Promise<Service[]> {
    const response = await api.get<ApiResponse<Service[]>>('/services');
    const list = response.data.data || [];
    return list.map(normalizeService); // ĐÃ SỬA: Đồng bộ map dữ liệu sạch
  },

  // Lấy chi tiết dịch vụ
  async getServiceById(id: string): Promise<Service> {
    const response = await api.get<ApiResponse<Service>>(`/services/${id}`);
    if (!response.data.data) throw new Error('Không tìm thấy thông tin dịch vụ.');
    return normalizeService(response.data.data);
  },

  // Tạo dịch vụ (Admin)
  async createService(data: Partial<Service>): Promise<Service> {
    const response = await api.post<ApiResponse<Service>>('/services', data);
    return normalizeService(response.data.data);
  },

  // Cập nhật dịch vụ (Admin)
  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    const response = await api.patch<ApiResponse<Service>>(`/services/${id}`, data);
    return normalizeService(response.data.data);
  },
 
  // Xóa dịch vụ (Admin)
  async deleteService(id: string): Promise<Service> {
    const response = await api.delete<ApiResponse<Service>>(`/services/${id}`);
    return normalizeService(response.data.data);
  },
};