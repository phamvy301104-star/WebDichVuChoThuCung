// Backend Type Definitions

export interface ApiResponse<T> {
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
