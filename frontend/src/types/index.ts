// ==================== Auth Types ====================
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: "user" | "admin" | "staff";
  createdAt: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
  message: string;
}

// ==================== Product Types ====================
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  category: Category;
  brand: Brand;
  rating: number;
  reviews: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
}


export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
  rating: number;
  reviews: number;
  createdAt: string;
}

export interface BookingRequest {
  serviceId: string;
  date: string;
  time: string;
  petId?: string;
  notes?: string;
}

export interface Booking {
  id: string;
  user: User;
  service: Service;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

// ==================== Pet Types ====================
export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  image: string;
  description?: string;
  price?: number;
  owner: User;
  status: "owned" | "for_sale" | "for_adoption";
  createdAt: string;
}

export interface AdoptionRequest {
  id: string;
  petId: string;
  petName: string;
  petBreed: string;
  petImage: string;
  petPrice?: number;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  reason?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

// ==================== Cart & Order Types ====================
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
}

export interface Order {
  id: string;
  user: User;
  items: CartItem[];
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== Review Types ====================
export interface Review {
  id: string;
  user: User;
  product?: Product;
  service?: Service;
  rating: number;
  comment: string;
  createdAt: string;
}

// ==================== API Response Types ====================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
