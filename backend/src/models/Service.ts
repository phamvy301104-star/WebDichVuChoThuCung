import mongoose, { Document, Schema } from 'mongoose';

export const SERVICE_STATUS = ['ACTIVE', 'INACTIVE'] as const;
export type ServiceStatus = typeof SERVICE_STATUS[number];

export interface IService extends Document {
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  image?: string;
  status: ServiceStatus;
  rating: number;
  reviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: [true, 'Tên dịch vụ là bắt buộc'],
      trim: true,
      maxlength: [150, 'Tên dịch vụ không được vượt quá 150 ký tự'],
    },
    description: {
      type: String,
      required: [true, 'Mô tả là bắt buộc'],
      trim: true,
      maxlength: [1000, 'Mô tả không được vượt quá 1000 ký tự'],
    },
    category: {
      type: String,
      required: [true, 'Danh mục là bắt buộc'],
      trim: true,
      maxlength: [100, 'Danh mục không được vượt quá 100 ký tự'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Giá dịch vụ là bắt buộc'],
      min: [0, 'Giá phải lớn hơn hoặc bằng 0'],
    },
    duration: {
      type: Number,
      required: [true, 'Thời gian thực hiện là bắt buộc'],
      min: [1, 'Thời gian phải lớn hơn 0 phút'],
    },
    image: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: SERVICE_STATUS,
      default: 'ACTIVE',
      index: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating không được nhỏ hơn 0'],
      max: [5, 'Rating không được lớn hơn 5'],
    },
    reviews: {
      type: Number,
      default: 0,
      min: [0, 'Số lượt đánh giá không được âm'],
    },
  },
  { timestamps: true }
);

// Indexes phục vụ Query
serviceSchema.index({ status: 1, createdAt: -1 });
serviceSchema.index({ category: 1, status: 1 });
serviceSchema.index({ name: 'text', description: 'text' });

export default mongoose.model<IService>('Service', serviceSchema);