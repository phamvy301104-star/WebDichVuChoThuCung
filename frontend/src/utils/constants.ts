// ==================== API Endpoints ====================
export const API_ENDPOINTS = {
  AUTH: '/auth',
  PRODUCTS: '/products',
  SERVICES: '/services',
  PETS: '/pets',
  ORDERS: '/orders',
  BOOKINGS: '/bookings',
  CATEGORIES: '/categories',
  BRANDS: '/brands',
  REVIEWS: '/reviews',
  ADMIN: '/admin',
};

// ==================== Routes ====================
export const ROUTES = {
  HOME: '/',
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_HISTORY: '/orders',
  ORDER_DETAIL: '/orders/:id',
  
  // Services
  SERVICES: '/services',
  SERVICE_DETAIL: '/services/:id',
  BOOKINGS: '/bookings',
  BOOKING_DETAIL: '/bookings/:id',
  
  // Pets
  PETS: '/pets',
  PET_DETAIL: '/pets/:id',
  PETS_FOR_SALE: '/pets/for-sale',
  PETS_FOR_ADOPTION: '/pets/for-adoption',
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_BRANDS: '/admin/brands',
  ADMIN_SERVICES: '/admin/services',
  ADMIN_STAFF: '/admin/staff',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_BOOKINGS: '/admin/bookings',
};

// ==================== Order Status ====================
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  shipped: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

// ==================== Booking Status ====================
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const BOOKING_STATUS_LABELS = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

// ==================== Pet Status ====================
export const PET_STATUS = {
  OWNED: 'owned',
  FOR_SALE: 'for_sale',
  FOR_ADOPTION: 'for_adoption',
};

export const PET_STATUS_LABELS = {
  owned: 'Đang sở hữu',
  for_sale: 'Bán',
  for_adoption: 'Nhận nuôi',
};

// ==================== User Roles ====================
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  STAFF: 'staff',
};

// ==================== Pagination ====================
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// ==================== Messages ====================
export const MESSAGES = {
  SUCCESS: 'Thành công!',
  ERROR: 'Đã xảy ra lỗi!',
  LOADING: 'Đang tải...',
  NO_DATA: 'Không có dữ liệu',
  CONFIRM_DELETE: 'Bạn có chắc muốn xóa không?',
};

// ==================== Validation ====================
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10}$/,
  PASSWORD_MIN_LENGTH: 6,
};
