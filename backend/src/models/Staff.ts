import mongoose, { Document, Schema } from 'mongoose';

export const STAFF_STATUS = ['active', 'on_leave', 'inactive'] as const;
export type StaffStatus = typeof STAFF_STATUS[number];

export interface IStaff extends Document {
  name: string;
  email: string;
  phone: string;
  position: string;
  status: StaffStatus;
  services: mongoose.Types.ObjectId[]; // ĐÃ SỬA: Chuyển từ string[] sang ObjectId[]
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const staffSchema = new Schema<IStaff>(
  {
    name: { type: String, required: [true, 'Tên nhân viên là bắt buộc'], trim: true },
    email: { 
      type: String, 
      required: [true, 'Email nhân viên là bắt buộc'], 
      trim: true, 
      lowercase: true,
      unique: true, // ĐÃ SỬA: Đảm bảo không trùng lặp email ở tầng DB
      match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
    },
    phone: { 
      type: String, 
      required: [true, 'Số điện thoại nhân viên là bắt buộc'], 
      trim: true,
      match: [/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại không hợp lệ']
    },
    position: { type: String, required: [true, 'Vị trí công việc là bắt buộc'], trim: true },
    status: {
      type: String,
      enum: STAFF_STATUS,
      default: 'active',
      index: true,
    },
    // ĐÃ SỬA: Map chuẩn xác sang bảng Service thông qua ObjectId
    services: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Service',
      required: true 
    }],
    avatar: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.model<IStaff>('Staff', staffSchema);