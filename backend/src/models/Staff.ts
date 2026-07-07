import mongoose, { Document, Schema } from 'mongoose';

export type StaffStatus = 'active' | 'on_leave' | 'inactive';

export interface IStaff extends Document {
  name: string;
  email: string;
  phone: string;
  position: string;
  status: StaffStatus;
  services: string[];
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const staffSchema = new Schema<IStaff>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['active', 'on_leave', 'inactive'],
      default: 'active',
    },
    services: { type: [String], default: [] },
    avatar: { type: String, required: false },
  },
  { timestamps: true }
);

staffSchema.index({ email: 1 });

export default mongoose.model<IStaff>('Staff', staffSchema);

