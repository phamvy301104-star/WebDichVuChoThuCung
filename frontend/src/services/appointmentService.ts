import api from './api';
import type { ApiResponse } from '@/types';
import type { Booking, BookingRequest } from '@/types/booking';

/**
 * ĐÃ SỬA: Hàm chuẩn hóa dữ liệu đầu ra đồng nhất cho toàn hệ thống Frontend
 */
const normalizeBooking = (b: any): Booking => ({
  id: b._id ?? b.id,
  user: b.user,
  service: b.service,
  customerName: b.customerName,
  phone: b.phone,
  email: b.email,
  petName: b.petName,
  petType: b.petType,
  appointmentDate: b.appointmentDate ? String(b.appointmentDate).split('T')[0] : '', 
  appointmentTime: b.appointmentTime,
  duration: b.duration ?? 0, // ĐÃ THÊM: Snapshot số phút thực hiện dịch vụ
  endTime: b.endTime ?? '',   // ĐÃ THÊM: Chuỗi giờ kết thúc (HH:mm) hiển thị giao diện
  note: b.note,
  status: b.status,
  staff: b.staff,
  createdAt: b.createdAt,
  updatedAt: b.updatedAt,
});

export const appointmentService = {
  /**
   * Tạo lịch hẹn mới (Khớp nối DTO Request sạch)
   */
  async createAppointment(data: BookingRequest): Promise<Booking> {
    const response = await api.post<ApiResponse<Booking>>('/appointments', data);
    return normalizeBooking(response.data.data);
  },

  /**
   * Danh sách lịch hẹn toàn hệ thống (Dành cho Admin điều phối)
   */
  async getAppointments(): Promise<Booking[]> {
    const response = await api.get<ApiResponse<Booking[]>>('/appointments');
    return (response.data.data ?? []).map(normalizeBooking);
  },

  /**
   * Lịch sử đặt lịch cá nhân (Dành cho Khách hàng)
   */
  async getMyAppointments(): Promise<Booking[]> {
    const response = await api.get<ApiResponse<Booking[]>>('/appointments/my');
    // ĐÃ SỬA: Bắt buộc áp dụng map dữ liệu tránh lỗi lệch trường _id ở trang lịch sử
    return (response.data.data ?? []).map(normalizeBooking);
  },

  /**
   * Xem chi tiết một lịch hẹn bất kỳ
   */
  async getAppointmentById(id: string): Promise<Booking> {
    const response = await api.get<ApiResponse<Booking>>(`/appointments/${id}`);
    if (!response.data.data) throw new Error('Không tìm thấy dữ liệu lịch hẹn.');
    return normalizeBooking(response.data.data);
  },

  /**
   * Khách hàng tự sửa đổi thông tin liên hệ khi lịch đang ở trạng thái chờ
   */
  async updateAppointment(id: string, data: Partial<BookingRequest>): Promise<Booking> {
    const response = await api.patch<ApiResponse<Booking>>(`/appointments/${id}`, data);
    return normalizeBooking(response.data.data);
  },

  /**
   * ĐÃ SỬA: Khách hàng tự hủy lịch hẹn chính chủ
   * Chuyển hướng endpoint sang luồng riêng biệt xử lý bypass phân quyền 403 thành công
   */
  async cancelAppointment(id: string, reason?: string): Promise<Booking> {
    const response = await api.patch<ApiResponse<Booking>>(`/appointments/${id}/cancel`, {
      reason, // Truyền kèm lý do hủy lên hệ thống nếu khách nhập vào form
    });
    return normalizeBooking(response.data.data);
  },

  /**
   * Admin hoặc Staff thực hiện cập nhật trạng thái xử lý lịch hẹn
   */
  async updateAppointmentStatus(id: string, status: string): Promise<Booking> {
    const response = await api.patch<ApiResponse<Booking>>(`/appointments/${id}/status`, {
      status: status.toLowerCase(),
    });
    return normalizeBooking(response.data.data);
  },

  /**
   * Admin thực hiện phân phối, gán nhân viên phụ trách ca làm việc
   */
  async assignStaff(id: string, staffId: string): Promise<Booking> {
    const response = await api.patch<ApiResponse<Booking>>(`/appointments/${id}/assign-staff`, {
      staffId,
    });
    return normalizeBooking(response.data.data);
  },

   /**
   * ĐÃ THÊM: Khách hàng gửi đánh giá chất lượng dịch vụ sau khi hoàn thành ca
   */
  async reviewAppointment(id: string, data: { rating: number; reviewText: string }): Promise<any> {
    const response = await api.post(`/appointments/${id}/review`, data);
    return response.data;
  },
};