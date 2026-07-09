import mongoose, { Document, Schema } from 'mongoose';

export const BOOKING_STATUS = [
  'pending',
  'confirmed',
  'assigned',
  'in_progress',
  'completed',
  'cancelled',
] as const;
export type BookingStatus = typeof BOOKING_STATUS[number];

export interface IBooking extends Document {
  user?: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  customerName: string;
  phone: string;
  email?: string;
  pet?: mongoose.Types.ObjectId;
  petName: string;
  petType: string;
  appointmentDate: string; // ĐÃ SỬA: Dạng chuỗi 'YYYY-MM-DD' để né bẫy múi giờ
  appointmentTime: string; // Dạng chuỗi 'HH:mm'
  duration: number;        // ĐÃ THÊM: Lưu snapshot số phút thực hiện tại thời điểm đặt lịch
  endTime: string;         // ĐÃ THÊM: Lưu chuỗi 'HH:mm' kết thúc để tính khoảng bận tức thì
  note?: string;
  status: BookingStatus;
  staff?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: [true, 'Dịch vụ là bắt buộc'] },
    customerName: { type: String, required: [true, 'Tên khách hàng là bắt buộc'], trim: true, maxlength: 100 },
    phone: { 
      type: String, 
      required: [true, 'Số điện thoại là bắt buộc'], 
      trim: true, 
      match: [/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại không hợp lệ'] 
    },
    email: { type: String, trim: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'] },
    pet: { type: Schema.Types.ObjectId, ref: 'Pet' },
    petName: { type: String, required: [true, 'Tên thú cưng là bắt buộc'], trim: true, maxlength: 100 },
    petType: { type: String, required: [true, 'Loại thú cưng là bắt buộc'], trim: true, maxlength: 100 },
    
    // ĐÃ SỬA: Dùng String thay vì Date để cô lập hoàn toàn sai lệch Timezone giữa Client-Server
    appointmentDate: { 
      type: String, 
      required: [true, 'Ngày hẹn là bắt buộc'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Ngày hẹn phải theo định dạng YYYY-MM-DD']
    },
    appointmentTime: { 
      type: String, 
      required: [true, 'Giờ hẹn là bắt buộc'], 
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Giờ hẹn phải theo định dạng HH:mm'] 
    },
    
    // ĐÃ THÊM: Snapshot dữ liệu thời gian phục vụ cho thuật toán chặn trùng lịch
    duration: {
      type: Number,
      required: [true, 'Thời gian thực hiện dịch vụ là bắt buộc'],
      min: [1, 'Thời gian thực hiện phải lớn hơn 0']
    },
    endTime: {
      type: String,
      required: [true, 'Giờ kết thúc là bắt buộc'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Giờ kết thúc phải theo định dạng HH:mm']
    },
    
    note: { type: String, trim: true, maxlength: 500 },
    status: {
      type: String,
      enum: BOOKING_STATUS,
      default: 'pending',
      index: true
    },
    staff: { 
      type: Schema.Types.ObjectId, 
      ref: 'Staff',
      // ĐÃ THÊM: Ràng buộc logic - Trạng thái assigned/in_progress/completed bắt buộc phải có staff
      validate: {
        validator: function(this: IBooking, value: mongoose.Types.ObjectId) {
          if (['assigned', 'in_progress', 'completed'].includes(this.status)) {
            return value != null;
          }
          return true;
        },
        message: 'Bắt buộc phải gán nhân viên (staff) cho lịch đặt ở trạng thái này.'
      }
    },
  },
  { timestamps: true }
);

// HỆ THỐNG INDEX ĐÃ TỐI ƯU
bookingSchema.index({ appointmentDate: 1, appointmentTime: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });

// Index cực mạnh phục vụ quét trùng lịch: tìm kiếm khoảng thời gian giao thoa (Overlapping) của một nhân viên
bookingSchema.index({ staff: 1, appointmentDate: 1, appointmentTime: 1, endTime: 1, status: 1 });

export default mongoose.model<IBooking>('Booking', bookingSchema);