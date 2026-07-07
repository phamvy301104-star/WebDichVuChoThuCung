import api from './api';
import type { Service, Booking, BookingRequest, ApiResponse } from '@/types';

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


  // Xóa dịch vụ (Admin) - không dùng ở màn admin hiện tại (soft delete bằng updateService)
  async deleteService(id: string) {
    const response = await api.delete(`/services/${id}`);
    return response.data?.data || response.data;
  },


  // ==================== Booking (Appointments) ====================
  // Backend hiện tại dùng routes: /appointments
  // POST /appointments
  async createBooking(data: BookingRequest) {
    // Map request sang format backend mong đợi
    // Backend expects: { service, customerName, phone, email?, petName, petType, appointmentDate, appointmentTime, note? }
    const payload: any = {
      service: (data as any).serviceId,
      appointmentDate: (data as any).date,
      appointmentTime: (data as any).time,
      petName: (data as any).petId ?? (data as any).petName,
      petType: (data as any).petType,
      note: data.notes,
      // Các field customerName/phone hiện chưa có trong BookingRequest của FE.
      // Nếu FE đang truyền thêm, payload sẽ lấy từ (data as any).
      customerName: (data as any).customerName,
      phone: (data as any).phone,
      email: (data as any).email,
    };

    const response = await api.post<ApiResponse<Booking>>('/appointments', payload);
    return response.data.data;
  },

  // GET /appointments/my
  async getMyBookings() {
    const response = await api.get<ApiResponse<Booking[]>>('/appointments/my');
    return response.data;
  },

  // GET /appointments/:id
  async getBookingById(id: string) {
    const response = await api.get<ApiResponse<Booking>>(`/appointments/${id}`);
    return response.data.data;
  },

  // PATCH /appointments/:id/status (FE đang gọi update/cancel theo booking cũ)
  async updateBooking(id: string, data: Partial<BookingRequest>) {
    const status = (data as any).status;
    if (!status) {
      // fallback: không có status thì không thể update theo backend hiện tại
      return Promise.reject(new Error('Thiếu status để cập nhật lịch hẹn.'));
    }
    const response = await api.patch<ApiResponse<Booking>>(`/appointments/${id}/status`, { status });
    return response.data.data;
  },

  // Cancel = updateStatus cancelled
  async cancelBooking(id: string) {
    const response = await api.patch<ApiResponse<Booking>>(`/appointments/${id}/status`, { status: 'cancelled' });
    return response.data;
  },

  // GET /appointments (admin)
  async getAllBookings() {
    const response = await api.get<ApiResponse<Booking[]>>('/appointments');
    return response.data.data ?? response.data;
  },
};

