import api from './api';
import type { Pet, ApiResponse, AdoptionRequest } from '@/types';

export const petService = {
  // Lấy danh sách thú cưng của người dùng
  async getMyPets() {
    const response = await api.get<ApiResponse<Pet[]>>('/pets/my-pets');
    return response.data.data || [];
  },

  // Lấy tất cả thú cưng (Admin)
  async getAllPets() {
    const response = await api.get<ApiResponse<Pet[]>>('/pets');
    return response.data.data || [];
  },

  // Lấy chi tiết thú cưng
  async getPetById(id: string) {
    const response = await api.get<ApiResponse<Pet>>(`/pets/${id}`);
    return response.data.data;
  },

  // Thêm thú cưng
  async createPet(data: Partial<Pet>) {
    const response = await api.post<ApiResponse<Pet>>('/pets', data);
    return response.data.data;
  },

  // Cập nhật thú cưng
  async updatePet(id: string, data: Partial<Pet>) {
    const response = await api.put<ApiResponse<Pet>>(`/pets/${id}`, data);
    return response.data.data;
  },

  // Xóa thú cưng
  async deletePet(id: string) {
    const response = await api.delete(`/pets/${id}`);
    return response.data;
  },

  // Lấy danh sách thú cưng bán
  async getPetsForSale() {
    const response = await api.get<ApiResponse<Pet[]>>('/pets/for-sale');
    return response.data.data || [];
  },

  // Lấy danh sách thú cưng nhận nuôi
  async getPetsForAdoption() {
    const response = await api.get<ApiResponse<Pet[]>>('/pets/for-adoption');
    return response.data.data || [];
  },

  // Gửi yêu cầu nhận nuôi / mua
  async requestAdoption(petId: string, data?: { requesterName?: string; requesterEmail?: string; requesterPhone?: string; reason?: string; appointmentDate?: string; appointmentTime?: string }) {
    const response = await api.post<ApiResponse<AdoptionRequest>>(`/pets/${petId}/adoption-request`, data);
    return response.data.data;
  },

  // Lấy tất cả yêu cầu nhận nuôi (Admin)
  async getAllAdoptionRequests() {
    const response = await api.get<ApiResponse<AdoptionRequest[]>>('/pets/adoption-requests');
    return response.data.data || [];
  },

  // Cập nhật trạng thái yêu cầu nhận nuôi (Admin)
  async updateAdoptionRequestStatus(id: string, status: 'approved' | 'rejected') {
    const response = await api.put<ApiResponse<AdoptionRequest>>(`/pets/adoption-requests/${id}`, { status });
    return response.data.data;
  },

  // AI nhận dạng giống loài thú cưng
  async recognizePet(image: File) {
    const formData = new FormData();
    formData.append('image', image);
    const response = await api.post('/pets/recognize', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Đặt thú cưng để bán
  async listPetForSale(petId: string, price: number, quantity: number) {
    const response = await api.post(`/pets/${petId}/list-for-sale`, {
      price,
      quantity,
    });
    return response.data;
  },

  // Dỡ danh sách bán/nhận nuôi
  async unlistPet(petId: string) {
    const response = await api.post(`/pets/${petId}/unlist`);
    return response.data;
  },
};
