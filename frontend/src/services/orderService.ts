import api from './api';
import { Order, ApiResponse, PaginatedResponse } from '@types/index';

export const orderService = {
  // Lấy danh sách đơn hàng của người dùng
  async getMyOrders(page: number = 1, limit: number = 10) {
    const response = await api.get<PaginatedResponse<Order>>('/orders/my-orders', {
      params: { page, limit },
    });
    return response.data;
  },

  // Lấy chi tiết đơn hàng
  async getOrderById(id: string) {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  },

  // Tạo đơn hàng
  async createOrder(data: {
    items: any[];
    shippingAddress: string;
    paymentMethod: string;
  }) {
    const response = await api.post<ApiResponse<Order>>('/orders', data);
    return response.data.data;
  },

  // Cập nhật trạng thái đơn hàng (Admin)
  async updateOrderStatus(id: string, status: string) {
    const response = await api.put<ApiResponse<Order>>(`/orders/${id}`, { status });
    return response.data.data;
  },

  // Hủy đơn hàng
  async cancelOrder(id: string) {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },

  // Lấy danh sách tất cả đơn hàng (Admin)
  async getAllOrders(page: number = 1, limit: number = 10, filters?: any) {
    const response = await api.get<PaginatedResponse<Order>>('/orders', {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  // Quản lý tồn kho
  async getInventory() {
    const response = await api.get('/inventory');
    return response.data;
  },

  // Cập nhật tồn kho (Admin)
  async updateInventory(productId: string, quantity: number) {
    const response = await api.put(`/inventory/${productId}`, { quantity });
    return response.data;
  },
};
