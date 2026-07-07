import api from './api';
import type { Order, ApiResponse } from '@/types';

export const orderService = {
  // Lấy danh sách đơn hàng của người dùng
  async getMyOrders() {
    const response = await api.get<ApiResponse<Order[]>>('/orders/my-orders');
    return response.data.data || [];
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
    const response = await api.put<ApiResponse<Order>>(`/orders/${id}/cancel`);
    return response.data.data;
  },

  // Lấy danh sách tất cả đơn hàng (Admin)
  async getAllOrders() {
    const response = await api.get<ApiResponse<Order[]>>('/orders');
    return response.data.data || [];
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
