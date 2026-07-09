import mongoose, { Schema, Document } from 'mongoose';

export interface IAdoptionRequest extends Document {
  petId: mongoose.Types.ObjectId;
  petName: string;
  petBreed: string;
  petImage: string;
  petPrice?: number;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  reason?: string;
  appointmentDate?: Date;
  appointmentTime?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const adoptionRequestSchema = new Schema<IAdoptionRequest>(
  {
    petId: {
      type: Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
    },
    petName: { type: String, required: true },
    petBreed: { type: String, required: true },
    petImage: { type: String, default: "" },
    petPrice: Number,
    requesterName: { type: String, required: true },
    requesterEmail: { type: String, required: true },
    requesterPhone: { type: String, required: true },
    reason: String,
    appointmentDate: Date,
    appointmentTime: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Map _id to id when toJSON is called
adoptionRequestSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    const r = ret as any;
    delete r._id;
    delete r.__v;
  },
});

export default mongoose.model<IAdoptionRequest>('AdoptionRequest', adoptionRequestSchema);
