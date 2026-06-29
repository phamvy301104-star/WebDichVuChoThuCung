import api from "./api";
import {
  Service,
  Booking,
  BookingRequest,
  ApiResponse,
  PaginatedResponse,
} from "@types/index";

export const serviceService = {
  // Lấy danh sách dịch vụ
  async getServices(page: number = 1, limit: number = 10) {
    const response = await api.get<PaginatedResponse<Service>>("/services", {
      params: { page, limit },
    });
    return response.data;
  },

  // Lấy chi tiết dịch vụ
  async getServiceById(id: string) {
    const response = await api.get<ApiResponse<Service>>(`/services/${id}`);
    return response.data.data;
  },

  // Tạo dịch vụ (Admin)
  async createService(data: Partial<Service>) {
    const response = await api.post<ApiResponse<Service>>("/services", data);
    return response.data;
  },

  // Cập nhật dịch vụ (Admin)
  async updateService(id: string, data: Partial<Service>) {
    const response = await api.put<ApiResponse<Service>>(
      `/services/${id}`,
      data,
    );
    return response.data;
  },

  // Xóa dịch vụ (Admin)
  async deleteService(id: string) {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },

  // ==================== Booking ====================
  // Đặt lịch hẹn
  async createBooking(data: BookingRequest) {
    const response = await api.post<ApiResponse<Booking>>("/bookings", data);
    return response.data.data;
  },

  // Lấy danh sách lịch hẹn của người dùng
  async getMyBookings() {
    const response = await api.get<PaginatedResponse<Booking>>(
      "/bookings/my-bookings",
    );
    return response.data;
  },

  // Lấy chi tiết lịch hẹn
  async getBookingById(id: string) {
    const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data.data;
  },

  // Cập nhật lịch hẹn
  async updateBooking(id: string, data: Partial<BookingRequest>) {
    const response = await api.put<ApiResponse<Booking>>(
      `/bookings/${id}`,
      data,
    );
    return response.data.data;
  },

  // Hủy lịch hẹn
  async cancelBooking(id: string) {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  // Lấy danh sách booking cho admin
  async getAllBookings(page: number = 1, limit: number = 10) {
    const response = await api.get<PaginatedResponse<Booking>>("/bookings", {
      params: { page, limit },
    });
    return response.data;
  },
};
