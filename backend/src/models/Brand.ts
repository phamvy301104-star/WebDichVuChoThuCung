import mongoose, { Document, Schema } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  logo?: string;
}

const brandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    logo: String,
  },
  { timestamps: true }
);

export default mongoose.model<IBrand>('Brand', brandSchema);
