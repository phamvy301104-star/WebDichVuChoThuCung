import api from "./api";
import {
  Product,
  Category,
  Brand,
  ApiResponse,
  PaginatedResponse,
} from "@types/index";

export const productService = {
  // Lấy danh sách sản phẩm
  async getProducts(page: number = 1, limit: number = 10, filters?: any) {
    const response = await api.get<PaginatedResponse<Product>>("/products", {
      params: { page, limit, ...filters },
    });
    return response.data;
  },

  // Lấy chi tiết sản phẩm
  async getProductById(id: string) {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  // Tìm kiếm sản phẩm
  async searchProducts(keyword: string) {
    const response = await api.get<PaginatedResponse<Product>>(
      "/products/search",
      {
        params: { keyword },
      },
    );
    return response.data;
  },

  // Lấy danh sách danh mục
  async getCategories() {
    const response = await api.get<ApiResponse<Category[]>>("/categories");
    return response.data.data || [];
  },

  // Lấy danh sách thương hiệu
  async getBrands() {
    const response = await api.get<ApiResponse<Brand[]>>("/brands");
    return response.data.data || [];
  },

  // Tạo sản phẩm (Admin)
  async createProduct(data: Partial<Product>) {
    const response = await api.post<ApiResponse<Product>>("/products", data);
    return response.data;
  },

  // Cập nhật sản phẩm (Admin)
  async updateProduct(id: string, data: Partial<Product>) {
    const response = await api.put<ApiResponse<Product>>(
      `/products/${id}`,
      data,
    );
    return response.data;
  },

  // Xóa sản phẩm (Admin)
  async deleteProduct(id: string) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  // Tạo danh mục (Admin)
  async createCategory(data: Partial<Category>) {
    const response = await api.post<ApiResponse<Category>>("/categories", data);
    return response.data;
  },

  // Cập nhật danh mục (Admin)
  async updateCategory(id: string, data: Partial<Category>) {
    const response = await api.put<ApiResponse<Category>>(
      `/categories/${id}`,
      data,
    );
    return response.data;
  },

  // Xóa danh mục (Admin)
  async deleteCategory(id: string) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
