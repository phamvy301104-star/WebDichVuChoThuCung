import api from './api';
import type { ApiResponse } from '@/types';
import type {Booking,BookingRequest,} from '@/types/booking';


const normalizeBooking = (b: any): Booking => ({
  id: b._id ?? b.id,
  user: b.user,
  service: b.service,
  customerName: b.customerName,
  phone: b.phone,
  email: b.email,
  petName: b.petName,
  petType: b.petType,
  appointmentDate: b.appointmentDate ? String(b.appointmentDate).split('T')[0] : '', // Trả về dạng YYYY-MM-DD
  appointmentTime: b.appointmentTime,
  note: b.note,
  status: b.status,
  staff: b.staff,
  createdAt: b.createdAt,
  updatedAt: b.updatedAt,
});

export const appointmentService = {
  // =========================
  // Appointment
  // =========================

  // Tạo lịch hẹn
  async createAppointment(data: BookingRequest) {
    const bePayload = {
      service: data.serviceId,
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      petName: data.petName,
      petType: data.petType,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      note: data.note,
    };

    const response = await api.post<ApiResponse<Booking>>('/appointments', bePayload);
    return normalizeBooking(response.data.data);
  },

  // Danh sách lịch hẹn (Admin)
  async getAppointments() {
    const response = await api.get<ApiResponse<Booking[]>>(
      '/appointments'
    );

    return (response.data.data ?? []).map(normalizeBooking);
  },

  // Lịch của tôi
  async getMyAppointments() {
    const response = await api.get<ApiResponse<Booking[]>>(
      '/appointments/my'
    );

    return response.data.data ?? [];
  },

  // Chi tiết lịch
  async getAppointmentById(id: string) {
    const response = await api.get<ApiResponse<Booking>>(
      `/appointments/${id}`
    );

    return response.data.data;
  },

  // Cập nhật thông tin lịch
  // async updateAppointment(
  //   id: string,
  //   data: Partial<BookingRequest>
  // ) {
  //   const response = await api.patch<ApiResponse<Booking>>(
  //     `/appointments/${id}`,
  //     data
  //   );

  //   return response.data.data;
  // },

  // Cập nhật trạng thái
  async updateAppointmentStatus(
    id: string,
    status: string
  ) {
    const response = await api.patch<ApiResponse<Booking>>(
      `/appointments/${id}/status`,
      {
        status: status.toLowerCase(),
      }
    );

    return response.data.data;
  },

  // Hủy lịch
  async cancelAppointment(id: string) {
    return this.updateAppointmentStatus(id, 'cancelled');
  },

  // Phân công nhân viên
  async assignStaff(
    id: string,
    staffId: string
  ) {
    const response = await api.patch<ApiResponse<Booking>>(
      `/appointments/${id}/assign-staff`,
      {
        staffId,
      }
    );

    return response.data.data;
  },
};