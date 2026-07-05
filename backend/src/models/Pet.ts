import mongoose, { Document, Schema } from 'mongoose';

export interface IPet extends Document {
  name: string;
  species: string;
  breed: string;
  age: number;
  image: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  status: 'owned' | 'for_sale' | 'for_adoption';
  price?: number;
  quantity?: number;
  createdAt: Date;
  updatedAt: Date;
}

const petSchema = new Schema<IPet>(
  {
    name: {
      type: String,
      required: true,
    },
    species: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['owned', 'for_sale', 'for_adoption'],
      default: 'owned',
    },
    price: Number,
    quantity: Number,
  },
  { timestamps: true }
);

export default mongoose.model<IPet>('Pet', petSchema);
