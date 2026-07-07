import api from "./api";
import type { ApiResponse, Booking, BookingRequest } from "@/types";

const toStatus = (s: string) => s;

export const appointmentService = {
  // ==================== API appointments ====================
  async getAppointments() {
    const response = await api.get<ApiResponse<Booking[]>>("/appointments");
    return response.data.data || response.data;
  },

  async getMyAppointments() {
    const response = await api.get<ApiResponse<Booking[]>>("/appointments/my");
    return response.data.data || response.data;
  },

  // GET /appointments (fallback cho demo)
  async getAllAppointments() {
    const response = await api.get<ApiResponse<Booking[]>>("/appointments");
    return response.data.data || response.data;
  },

  async getAppointmentById(id: string) {
    const response = await api.get<ApiResponse<Booking>>(`/appointments/${id}`);
    return response.data.data || response.data;
  },



  async cancelAppointment(id: string) {
    // Backend đang dùng status dạng lowercase: cancelled
    return this.updateAppointmentStatus(id, "cancelled");
  },



  // ==================== Backward compat ====================
  async createAppointment(payload: any) {
    const response = await api.post<ApiResponse<Booking>>("/appointments", payload);
    return response.data.data || response.data;
  },

  // ==================== Update appointment ====================
  // Backend có thể hỗ trợ PATCH /appointments/:id để cập nhật thông tin.
  // Nếu backend không có route này thì FE sẽ fail khi gọi.
  async updateAppointment(id: string, payload: Partial<BookingRequest> & { [k: string]: any }) {
    const response = await api.patch<ApiResponse<Booking>>(`/appointments/${id}`, payload);
    return response.data.data || response.data;
  },

  // Alias theo yêu cầu
  async updateAppointmentStatus(id: string, status: string) {
    // Backend đang dùng status dạng lowercase: cancelled/pending/confirmed/...
    const normalized = String(status).toLowerCase();
    const response = await api.patch<ApiResponse<Booking>>(`/appointments/${id}/status`, {
      status: normalized,
    });
    return response.data.data || response.data;
  },



  async updateAppointmentStatusRaw(id: string, status: string) {
    const response = await api.patch<ApiResponse<Booking>>(`/appointments/${id}/status`, {
      status: toStatus(status),
    });
    return response.data.data || response.data;
  },

};


