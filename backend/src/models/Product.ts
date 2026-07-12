import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  category: mongoose.Types.ObjectId;
  brand: mongoose.Types.ObjectId;
  rating: number;
  reviews: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    image: String,
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
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

export default mongoose.model<IProduct>('Product', productSchema);
