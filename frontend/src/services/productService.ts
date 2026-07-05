import api from './api';
import type { Product, Category, Brand, ApiResponse } from '@/types';

export const productService = {
  // Lấy danh sách sản phẩm
  async getProducts(page?: number, limit?: number, filters?: Record<string, any>) {
    const response = await api.get<ApiResponse<Product[]>>('/products', {
      params: {
        page,
        limit,
        ...filters,
      },
    });
    return response.data.data || [];
  },

  // Lấy chi tiết sản phẩm
  async getProductById(id: string) {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  // Tìm kiếm sản phẩm
  async searchProducts(keyword: string) {
    return this.getProducts(undefined, undefined, { keyword });
  },

  // Lấy danh sách danh mục
  async getCategories() {
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    return response.data.data || [];
  },

  // Lấy danh sách thương hiệu
  async getBrands() {
    const response = await api.get<ApiResponse<Brand[]>>('/brands');
    return response.data.data || [];
  },

  // Tạo sản phẩm (Admin)
  async createProduct(data: Partial<Product>) {
    const response = await api.post<ApiResponse<Product>>('/products', data);
    return response.data;
  },

  // Cập nhật sản phẩm (Admin)
  async updateProduct(id: string, data: Partial<Product>) {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data;
  },

  // Xóa sản phẩm (Admin)
  async deleteProduct(id: string) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Tạo thương hiệu (Admin)
  async createBrand(data: Partial<Brand>) {
    const response = await api.post<ApiResponse<Brand>>('/brands', data);
    return response.data.data;
  },

  // Cập nhật thương hiệu (Admin)
  async updateBrand(id: string, data: Partial<Brand>) {
    const response = await api.put<ApiResponse<Brand>>(`/brands/${id}`, data);
    return response.data.data;
  },

  // Xóa thương hiệu (Admin)
  async deleteBrand(id: string) {
    const response = await api.delete(`/brands/${id}`);
    return response.data;
  },

  // Tạo danh mục (Admin)
  async createCategory(data: Partial<Category>) {
    const response = await api.post<ApiResponse<Category>>('/categories', data);
    return response.data.data;
  },

  // Cập nhật danh mục (Admin)
  async updateCategory(id: string, data: Partial<Category>) {
    const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data.data;
  },

  // Xóa danh mục (Admin)
  async deleteCategory(id: string) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
