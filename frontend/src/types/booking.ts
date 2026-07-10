import { Service } from './service';
import { Staff } from './staff';

// Đồng bộ hệ thống trạng thái 6 bước của Backend
export type BookingStatus = 'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id?: string;
  _id?: string;
  user?: any; // Đặt dấu ? vì khách vãng lai sẽ không có tài khoản user liên kết
  service: Service;
  staff?: Staff;
  customerName: string;
  phone: string;
  email?: string;
  petName: string;
  petType: string;
  appointmentDate: string; // Định dạng chuẩn 'YYYY-MM-DD' từ Backend
  appointmentTime: string; // 'HH:mm'
  duration: number;        // ĐÃ THÊM: Số phút snapshot từ Backend
  endTime: string;         // ĐÃ THÊM: Giờ kết thúc dạng 'HH:mm' snapshot từ Backend
  note?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

// Cấu trúc Data truyền lên API khi đặt lịch
export interface BookingRequest {
  service: string; // ĐÃ SỬA: Đổi từ 'serviceId' thành 'service' để khớp 100% với Controller của Backend
  customerName: string;
  phone: string;
  email?: string;
  petName: string;
  petType: string;
  appointmentDate: string; // FE chọn ngày và format thành string 'YYYY-MM-DD' trước khi gửi
  appointmentTime: string; // 'HH:mm'
  note?: string;
}