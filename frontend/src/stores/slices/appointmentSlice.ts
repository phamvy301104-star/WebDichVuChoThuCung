import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { appointmentService } from '@/services/appointmentService';
import type { Booking, BookingRequest } from '@/types/booking';

// Định nghĩa cấu trúc State lưu trữ lịch đặt toàn cục
interface AppointmentState {
  appointments: Booking[];        // Danh sách cho Admin điều phối
  myAppointments: Booking[];      // Lịch sử cá nhân của Khách hàng
  currentAppointment: Booking | null; // Chi tiết 1 lịch đang xem
  bookingFormDraft: Partial<BookingRequest>; // ĐA THÊM: Lưu trữ bản nháp của Form đặt lịch chặn lỗi mất data khi nhảy trang
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  myAppointments: [],
  currentAppointment: null,
  bookingFormDraft: {}, // Khởi tạo object trống cho bản nháp form
  loading: false,
  error: null,
};

// ==========================================
// CÁC ASYNC THUNKS ĐIỀU PHỐI API GỌI MẠNG
// ==========================================

export const createAppointmentThunk = createAsyncThunk(
  'appointment/create',
  async (data: BookingRequest, { rejectWithValue }) => {
    try {
      return await appointmentService.createAppointment(data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Đặt lịch thất bại.');
    }
  }
);

export const fetchAppointmentsThunk = createAsyncThunk(
  'appointment/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await appointmentService.getAppointments();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lấy danh sách lịch hẹn thất bại.');
    }
  }
);

export const fetchMyAppointmentsThunk = createAsyncThunk(
  'appointment/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      return await appointmentService.getMyAppointments();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Lấy lịch sử đặt lịch thất bại.');
    }
  }
);

export const cancelAppointmentThunk = createAsyncThunk(
  'appointment/cancel',
  async ({ id, reason }: { id: string; reason?: string }, { rejectWithValue }) => {
    try {
      return await appointmentService.cancelAppointment(id, reason);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Hủy lịch hẹn thất bại.');
    }
  }
);

export const assignStaffThunk = createAsyncThunk(
  'appointment/assignStaff',
  async ({ id, staffId }: { id: string; staffId: string }, { rejectWithValue }) => {
    try {
      return await appointmentService.assignStaff(id, staffId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Phân công nhân viên thất bại.');
    }
  }
);

// ==========================================
// THIẾT LẬP SLICE CHÍNH
// ==========================================
const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    // Action cập nhật thời gian thực từng trường khi user gõ vào form đặt lịch
    updateBookingDraft: (state, action: PayloadAction<Partial<BookingRequest>>) => {
      state.bookingFormDraft = { ...state.bookingFormDraft, ...action.payload };
    },
    // Xóa sạch bản nháp form sau khi đặt lịch thành công
    clearBookingDraft: (state) => {
      state.bookingFormDraft = {};
    },
    // Xóa thông tin lỗi khi chuyển màn hình
    clearAppointmentErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Luồng Tạo lịch hẹn
      .addCase(createAppointmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointmentThunk.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.loading = false;
        state.myAppointments.unshift(action.payload); // Đẩy lịch mới lên đầu danh sách cá nhân
      })
      .addCase(createAppointmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Luồng Lấy tất cả lịch hẹn (Admin)
      .addCase(fetchAppointmentsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAppointmentsThunk.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointmentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Luồng Lấy lịch hẹn cá nhân (Khách hàng)
      .addCase(fetchMyAppointmentsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyAppointmentsThunk.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.loading = false;
        state.myAppointments = action.payload;
      })
      .addCase(fetchMyAppointmentsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Luồng Hủy lịch hẹn
      .addCase(cancelAppointmentThunk.fulfilled, (state, action: PayloadAction<Booking>) => {
        // Cập nhật lại trạng thái 'cancelled' ngay lập tức trong mảng để UI thay đổi tức thì
        const indexMine = state.myAppointments.findIndex(b => b.id === action.payload.id);
        if (indexMine !== -1) state.myAppointments[indexMine] = action.payload;

        const indexAdmin = state.appointments.findIndex(b => b.id === action.payload.id);
        if (indexAdmin !== -1) state.appointments[indexAdmin] = action.payload;
      })

      // Luồng Phân công nhân viên
      .addCase(assignStaffThunk.fulfilled, (state, action: PayloadAction<Booking>) => {
        const index = state.appointments.findIndex(b => b.id === action.payload.id);
        if (index !== -1) state.appointments[index] = action.payload;
      });
  },
});

export const { updateBookingDraft, clearBookingDraft, clearAppointmentErrors } = appointmentSlice.actions;
export default appointmentSlice.reducer;