import mongoose, { Document, Schema } from 'mongoose';

export type ServiceStatus = 'ACTIVE' | 'INACTIVE';

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
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    image: String,
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
      index: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IService>('Service', serviceSchema);

