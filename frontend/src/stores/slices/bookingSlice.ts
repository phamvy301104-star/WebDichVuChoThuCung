import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface BookingService {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  petTypes: string[];
  image: string;
  description: string;
  status: 'active' | 'inactive';
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  schedule: string;
  avatar: string;
  specialties: string[];
  status: 'active' | 'inactive';
}

export interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  petName: string;
  petType: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  date: string;
  time: string;
  note: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_SERVICES: BookingService[] = [
  { id: 'svc1', name: 'Tắm & Cắt lông cơ bản', category: 'Spa', price: 150000, duration: 90, petTypes: ['Chó', 'Mèo'], image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=240&fit=crop&auto=format', description: 'Tắm sạch, cắt tỉa lông đẹp, vệ sinh tai, cắt móng chuyên nghiệp.', status: 'active' },
  { id: 'svc2', name: 'Spa toàn thân Premium', category: 'Spa', price: 280000, duration: 120, petTypes: ['Chó', 'Mèo'], image: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=400&h=240&fit=crop&auto=format', description: 'Tắm gội + ủ lông phục hồi + massage thư giãn + nước hoa thú cưng cao cấp.', status: 'active' },
  { id: 'svc3', name: 'Cắt lông tạo kiểu sáng tạo', category: 'Spa', price: 200000, duration: 60, petTypes: ['Chó'], image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=240&fit=crop&auto=format', description: 'Cắt tỉa tạo kiểu theo yêu cầu bởi groomer chuyên nghiệp.', status: 'active' },
  { id: 'svc4', name: 'Khám sức khoẻ tổng quát', category: 'Y tế', price: 200000, duration: 30, petTypes: ['Chó', 'Mèo', 'Thỏ'], image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&h=240&fit=crop&auto=format', description: 'Kiểm tra sức khoẻ toàn diện, tư vấn dinh dưỡng và phòng bệnh hiệu quả.', status: 'active' },
  { id: 'svc5', name: 'Tiêm phòng đầy đủ vaccine', category: 'Y tế', price: 250000, duration: 15, petTypes: ['Chó', 'Mèo'], image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=240&fit=crop&auto=format', description: 'Tiêm đầy đủ các loại vaccine theo lịch, có theo dõi phản ứng sau tiêm.', status: 'active' },
  { id: 'svc6', name: 'Vệ sinh tai & mắt', category: 'Spa', price: 50000, duration: 20, petTypes: ['Chó', 'Mèo'], image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=240&fit=crop&auto=format', description: 'Làm sạch tai, mắt nhẹ nhàng, ngăn ngừa viêm nhiễm hiệu quả.', status: 'active' },
  { id: 'svc7', name: 'Triệt sản an toàn', category: 'Y tế', price: 1500000, duration: 120, petTypes: ['Chó', 'Mèo'], image: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=240&fit=crop&auto=format', description: 'Phẫu thuật triệt sản an toàn bởi bác sĩ thú y có chuyên môn cao.', status: 'active' },
  { id: 'svc8', name: 'Tẩy giun & xét nghiệm', category: 'Y tế', price: 180000, duration: 30, petTypes: ['Chó', 'Mèo', 'Thỏ'], image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400&h=240&fit=crop&auto=format', description: 'Tẩy giun định kỳ, xét nghiệm máu và kiểm tra ký sinh trùng.', status: 'active' },
];

const SEED_STAFF: Staff[] = [
  { id: 'st1', name: 'Nguyễn Minh Tuấn', role: 'Groomer chính', phone: '0901111001', email: 'tuan@petcare.vn', schedule: 'Thứ 2 – Thứ 7 · 08:00–17:00', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&auto=format', specialties: ['Spa', 'Cắt lông'], status: 'active' },
  { id: 'st2', name: 'Trần Thu Hương', role: 'Bác sĩ thú y', phone: '0901111002', email: 'huong@petcare.vn', schedule: 'Thứ 2 – Thứ 6 · 08:00–17:00', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&auto=format', specialties: ['Khám bệnh', 'Tiêm phòng', 'Phẫu thuật'], status: 'active' },
  { id: 'st3', name: 'Lê Văn Phúc', role: 'Groomer', phone: '0901111003', email: 'phuc@petcare.vn', schedule: 'Thứ 3 – Chủ nhật · 09:00–18:00', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format', specialties: ['Spa', 'Tắm gội'], status: 'active' },
  { id: 'st4', name: 'Phạm Thị Lan', role: 'Bác sĩ thú y', phone: '0901111004', email: 'lan@petcare.vn', schedule: 'Thứ 2 – Thứ 7 · 08:00–17:00', avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&h=120&fit=crop&auto=format', specialties: ['Khám bệnh', 'Xét nghiệm', 'Tiêm phòng'], status: 'active' },
  { id: 'st5', name: 'Hoàng Đức Anh', role: 'Lễ tân & tư vấn', phone: '0901111005', email: 'anh@petcare.vn', schedule: 'Thứ 2 – Thứ 7 · 08:00–20:00', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&auto=format', specialties: ['Tư vấn', 'Chăm sóc khách hàng'], status: 'active' },
  { id: 'st6', name: 'Ngô Thị Mai', role: 'Kỹ thuật viên spa', phone: '0901111006', email: 'mai@petcare.vn', schedule: 'Thứ 3 – Chủ nhật · 09:00–18:00', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&auto=format', specialties: ['Spa Premium', 'Chăm sóc lông'], status: 'active' },
];

const SEED_APPOINTMENTS: Appointment[] = [
  { id: 'APT001', customerName: 'Nguyễn Văn A', customerEmail: 'a@gmail.com', customerPhone: '0901234567', petName: 'Buddy', petType: 'Chó', serviceId: 'svc1', serviceName: 'Tắm & Cắt lông cơ bản', staffId: 'st1', staffName: 'Nguyễn Minh Tuấn', date: '2026-07-12', time: '09:00', note: 'Bé hay cắn, cần nhẹ nhàng', status: 'pending', createdAt: '2026-07-11T08:00:00' },
  { id: 'APT002', customerName: 'Trần Thị B', customerEmail: 'b@gmail.com', customerPhone: '0912345678', petName: 'Mimi', petType: 'Mèo', serviceId: 'svc4', serviceName: 'Khám sức khoẻ tổng quát', staffId: 'st2', staffName: 'Trần Thu Hương', date: '2026-07-12', time: '10:30', note: '', status: 'confirmed', createdAt: '2026-07-11T09:00:00' },
  { id: 'APT003', customerName: 'Lê Văn C', customerEmail: 'c@gmail.com', customerPhone: '0923456789', petName: 'Max', petType: 'Chó', serviceId: 'svc2', serviceName: 'Spa toàn thân Premium', staffId: 'st3', staffName: 'Lê Văn Phúc', date: '2026-07-13', time: '14:00', note: 'Allergic to certain shampoos', status: 'completed', createdAt: '2026-07-10T14:00:00' },
];

function load<T>(key: string, seed: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : seed; } catch { return seed; }
}
function save(key: string, value: unknown) { localStorage.setItem(key, JSON.stringify(value)); }

interface BookingState {
  services: BookingService[];
  staff: Staff[];
  appointments: Appointment[];
}

const initialState: BookingState = {
  services:     load('booking_services',     SEED_SERVICES),
  staff:        load('booking_staff',        SEED_STAFF),
  appointments: load('booking_appointments', SEED_APPOINTMENTS),
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    // Services
    addService: (state, { payload }: PayloadAction<Omit<BookingService, 'id'>>) => {
      state.services.push({ id: 'svc' + Date.now(), ...payload });
      save('booking_services', state.services);
    },
    updateService: (state, { payload }: PayloadAction<BookingService>) => {
      const i = state.services.findIndex(s => s.id === payload.id);
      if (i >= 0) state.services[i] = payload;
      save('booking_services', state.services);
    },
    deleteService: (state, { payload }: PayloadAction<string>) => {
      state.services = state.services.filter(s => s.id !== payload);
      save('booking_services', state.services);
    },
    // Staff
    addStaff: (state, { payload }: PayloadAction<Omit<Staff, 'id'>>) => {
      state.staff.push({ id: 'st' + Date.now(), ...payload });
      save('booking_staff', state.staff);
    },
    updateStaff: (state, { payload }: PayloadAction<Staff>) => {
      const i = state.staff.findIndex(s => s.id === payload.id);
      if (i >= 0) state.staff[i] = payload;
      save('booking_staff', state.staff);
    },
    deleteStaff: (state, { payload }: PayloadAction<string>) => {
      state.staff = state.staff.filter(s => s.id !== payload);
      save('booking_staff', state.staff);
    },
    // Appointments
    bookAppointment: (state, { payload }: PayloadAction<Omit<Appointment, 'id' | 'createdAt'>>) => {
      state.appointments.unshift({ id: 'APT' + Date.now(), createdAt: new Date().toISOString(), ...payload });
      save('booking_appointments', state.appointments);
    },
    updateAppointmentStatus: (state, { payload }: PayloadAction<{ id: string; status: Appointment['status'] }>) => {
      const a = state.appointments.find(a => a.id === payload.id);
      if (a) a.status = payload.status;
      save('booking_appointments', state.appointments);
    },
    deleteAppointment: (state, { payload }: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(a => a.id !== payload);
      save('booking_appointments', state.appointments);
    },
  },
});

export const { addService, updateService, deleteService, addStaff, updateStaff, deleteStaff, bookAppointment, updateAppointmentStatus, deleteAppointment } = bookingSlice.actions;
export default bookingSlice.reducer;