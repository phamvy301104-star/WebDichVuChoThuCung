import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  user?: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  customerName: string;
  phone: string;
  email?: string;
  petName: string;
  petType: string;
  appointmentDate: Date;
  appointmentTime: string;
  note?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  staff?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    petName: { type: String, required: true },
    petType: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    note: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    staff: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', bookingSchema);
