import api from "./api";
import { Pet, ApiResponse, PaginatedResponse } from "@types/index";

export const petService = {
  // Lấy danh sách thú cưng của người dùng
  async getMyPets() {
    const response = await api.get<PaginatedResponse<Pet>>("/pets/my-pets");
    return response.data;
  },

  // Lấy chi tiết thú cưng
  async getPetById(id: string) {
    const response = await api.get<ApiResponse<Pet>>(`/pets/${id}`);
    return response.data.data;
  },

  // Thêm thú cưng
  async createPet(data: Partial<Pet>) {
    const response = await api.post<ApiResponse<Pet>>("/pets", data);
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
  async getPetsForSale(page: number = 1, limit: number = 10) {
    const response = await api.get<PaginatedResponse<Pet>>("/pets/for-sale", {
      params: { page, limit },
    });
    return response.data;
  },

  // Lấy danh sách thú cưng nhận nuôi
  async getPetsForAdoption(page: number = 1, limit: number = 10) {
    const response = await api.get<PaginatedResponse<Pet>>(
      "/pets/for-adoption",
      {
        params: { page, limit },
      },
    );
    return response.data;
  },

  // Gửi yêu cầu nhận nuôi
  async requestAdoption(petId: string) {
    const response = await api.post(`/pets/${petId}/adoption-request`);
    return response.data;
  },

  // AI nhận dạng giống loài thú cưng
  async recognizePet(image: File) {
    const formData = new FormData();
    formData.append("image", image);
    const response = await api.post("/pets/recognize", formData, {
      headers: { "Content-Type": "multipart/form-data" },
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
