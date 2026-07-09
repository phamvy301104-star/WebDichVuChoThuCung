export interface Service {
  id?: string;
  _id?: string;

  name: string;
  description: string;

  category: string;

  price: number;
  duration: number;

  image?: string;

  status: 'ACTIVE' | 'INACTIVE';

  rating: number;
  reviews: number;

  createdAt: string;
  updatedAt: string;
}