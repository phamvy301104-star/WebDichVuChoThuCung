import { Service } from './service';

// Đồng bộ 3 trạng thái chuẩn từ Backend
export type StaffStatus = 'active' | 'on_leave' | 'inactive';

export interface Staff {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  avatar?: string;
  status: StaffStatus;
  // ĐÃ SỬA: Khi lấy chi tiết Staff, mảng dịch vụ có thể được Backend populate thành Object cụ thể để hiển thị UI
  services: string[] | Service[]; 
  createdAt: string;
  updatedAt: string;
}