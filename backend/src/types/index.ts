// Cấu trúc định danh tài khoản từ Token mã hóa
export interface UserPayload {
  _id: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
}

// Chuẩn hóa ApiResponse trả về bằng Generics
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginationQuery {
  page: number;
  limit: number;
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

// Định nghĩa interface lỗi mở rộng cho Express & Mongoose
export interface AppError extends Error {
  statusCode?: number;
  code?: number;      // Bắt mã lỗi của MongoDB (ví dụ: 11000)
  path?: string;      // Bắt trường dữ liệu bị lỗi CastError
  keyValue?: any;     // Bắt cặp key-value bị trùng lặp
  errors?: any;       // Bắt danh sách lỗi Validation của Mongoose
}