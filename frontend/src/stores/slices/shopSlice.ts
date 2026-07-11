import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Category { id: string; name: string; description: string; }
export interface Brand    { id: string; name: string; description: string; logo?: string; }

export interface ShopProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  categoryId: string;
  brandId: string;
  description: string;
  stock: number;
  rating: number;
  sold: number;
  status: 'active' | 'inactive';
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  note: string;
  createdAt: string;
}

// ─── Initial seed data ────────────────────────────────────────────────────────
const SEED_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Thức ăn', description: 'Thức ăn hạt, pate, snack cho thú cưng' },
  { id: 'c2', name: 'Phụ kiện', description: 'Vòng cổ, dây dắt, quần áo' },
  { id: 'c3', name: 'Đồ chơi', description: 'Đồ chơi kích thích bản năng tự nhiên' },
  { id: 'c4', name: 'Chăm sóc', description: 'Sản phẩm tắm gội, vệ sinh' },
  { id: 'c5', name: 'Y tế', description: 'Thuốc, vitamin, sản phẩm y tế' },
  { id: 'c6', name: 'Chuồng & Nhà', description: 'Chuồng, ổ, nhà cho thú cưng' },
];

const SEED_BRANDS: Brand[] = [
  { id: 'b1', name: 'Royal Canin', description: 'Thương hiệu dinh dưỡng thú cưng hàng đầu thế giới', logo: '👑' },
  { id: 'b2', name: 'Pedigree', description: 'Thức ăn chó nổi tiếng toàn cầu', logo: '🐕' },
  { id: 'b3', name: 'Whiskas', description: 'Thức ăn mèo được yêu thích nhất', logo: '🐱' },
  { id: 'b4', name: 'Kong', description: 'Đồ chơi bền bỉ cho thú cưng năng động', logo: '🦾' },
  { id: 'b5', name: 'PetCare VN', description: 'Sản phẩm nội địa chất lượng cao', logo: '🐾' },
];

const SEED_PRODUCTS: ShopProduct[] = [
  { id: 'p1', name: 'Thức ăn mèo Royal Canin 400g', price: 185000, originalPrice: 220000, image: 'https://images.unsplash.com/photo-1589924691995-400dc9562c07?w=400&h=300&fit=crop&auto=format', categoryId: 'c1', brandId: 'b1', description: 'Thức ăn hạt cao cấp dành cho mèo trưởng thành, bổ sung đầy đủ dinh dưỡng.', stock: 50, rating: 4.8, sold: 124, status: 'active' },
  { id: 'p2', name: 'Balo vận chuyển thú cưng cao cấp', price: 320000, image: 'https://images.unsplash.com/photo-1553279734-78a57ac37a77?w=400&h=300&fit=crop&auto=format', categoryId: 'c2', brandId: 'b5', description: 'Balo thoáng khí, chắc chắn, an toàn cho mèo và chó nhỏ.', stock: 20, rating: 4.6, sold: 43, status: 'active' },
  { id: 'p3', name: 'Vitamin tổng hợp cho chó (60 viên)', price: 180000, image: 'https://images.unsplash.com/photo-1550583724-b7c71bcd9c9a?w=400&h=300&fit=crop&auto=format', categoryId: 'c5', brandId: 'b5', description: 'Bổ sung vitamin và khoáng chất thiết yếu cho chó mọi lứa tuổi.', stock: 35, rating: 4.5, sold: 76, status: 'active' },
  { id: 'p4', name: 'Combo đồ chơi chuột nhỏ cho mèo', price: 55000, originalPrice: 75000, image: 'https://images.unsplash.com/photo-1601758174493-7ddff9b1a7e6?w=400&h=300&fit=crop&auto=format', categoryId: 'c3', brandId: 'b4', description: 'Bộ 5 đồ chơi kích thích bản năng săn mồi tự nhiên của mèo.', stock: 80, rating: 4.7, sold: 89, status: 'active' },
  { id: 'p5', name: 'Shampoo thú cưng hương lavender 500ml', price: 120000, image: 'https://images.unsplash.com/photo-1559757148-5f89397f3755?w=400&h=300&fit=crop&auto=format', categoryId: 'c4', brandId: 'b5', description: 'Dầu gội dịu nhẹ, an toàn, làm sạch sâu và khử mùi hiệu quả.', stock: 45, rating: 4.4, sold: 68, status: 'active' },
  { id: 'p6', name: 'Cát vệ sinh cho mèo 5kg', price: 95000, image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop&auto=format', categoryId: 'c4', brandId: 'b3', description: 'Cát vón cục siêu nhanh, khử mùi hiệu quả, ít bụi.', stock: 60, rating: 4.9, sold: 112, status: 'active' },
  { id: 'p7', name: 'Vòng chống bọ chét & ve cho chó', price: 145000, image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&auto=format', categoryId: 'c5', brandId: 'b5', description: 'Bảo vệ chó khỏi bọ chét, ve và muỗi suốt 8 tháng.', stock: 30, rating: 4.3, sold: 55, status: 'active' },
  { id: 'p8', name: 'Chuồng sắt gấp gọn cho chó cỡ vừa', price: 750000, image: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=400&h=300&fit=crop&auto=format', categoryId: 'c6', brandId: 'b5', description: 'Chuồng sắt chắc chắn, dễ lắp ráp và vệ sinh, gấp gọn tiện lợi.', stock: 10, rating: 4.6, sold: 21, status: 'active' },
];

const SEED_ORDERS: Order[] = [
  { id: 'ORD001', customerName: 'Nguyễn Văn A', customerEmail: 'a@gmail.com', customerPhone: '0901234567', address: '123 Lê Lợi, Q1, TP.HCM', items: [{ productId: 'p1', productName: 'Thức ăn mèo Royal Canin 400g', productImage: 'https://images.unsplash.com/photo-1589924691995-400dc9562c07?w=80&h=80&fit=crop', price: 185000, quantity: 2 }], total: 370000, status: 'pending', note: '', createdAt: '2026-07-10T09:00:00' },
  { id: 'ORD002', customerName: 'Trần Thị B', customerEmail: 'b@gmail.com', customerPhone: '0912345678', address: '456 Nguyễn Trãi, Q5, TP.HCM', items: [{ productId: 'p4', productName: 'Combo đồ chơi chuột nhỏ cho mèo', productImage: 'https://images.unsplash.com/photo-1601758174493-7ddff9b1a7e6?w=80&h=80&fit=crop', price: 55000, quantity: 1 }, { productId: 'p5', productName: 'Shampoo thú cưng hương lavender', productImage: 'https://images.unsplash.com/photo-1559757148-5f89397f3755?w=80&h=80&fit=crop', price: 120000, quantity: 1 }], total: 175000, status: 'confirmed', note: 'Giao buổi sáng', createdAt: '2026-07-10T10:30:00' },
  { id: 'ORD003', customerName: 'Lê Văn C', customerEmail: 'c@gmail.com', customerPhone: '0923456789', address: '789 CMT8, Q3, TP.HCM', items: [{ productId: 'p6', productName: 'Cát vệ sinh cho mèo 5kg', productImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=80&h=80&fit=crop', price: 95000, quantity: 3 }], total: 285000, status: 'completed', note: '', createdAt: '2026-07-09T14:00:00' },
];

// ─── Load from localStorage with seed fallback ────────────────────────────────
function load<T>(key: string, seed: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : seed; } catch { return seed; }
}
function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

interface ShopState {
  categories: Category[];
  brands: Brand[];
  products: ShopProduct[];
  orders: Order[];
}

const initialState: ShopState = {
  categories: load('shop_categories', SEED_CATEGORIES),
  brands:     load('shop_brands',     SEED_BRANDS),
  products:   load('shop_products',   SEED_PRODUCTS),
  orders:     load('shop_orders',     SEED_ORDERS),
};

// ─── Slice ────────────────────────────────────────────────────────────────────
const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    // ── Categories ──
    addCategory: (state, { payload }: PayloadAction<Omit<Category, 'id'>>) => {
      state.categories.push({ id: 'c' + Date.now(), ...payload });
      save('shop_categories', state.categories);
    },
    updateCategory: (state, { payload }: PayloadAction<Category>) => {
      const i = state.categories.findIndex(c => c.id === payload.id);
      if (i >= 0) state.categories[i] = payload;
      save('shop_categories', state.categories);
    },
    deleteCategory: (state, { payload }: PayloadAction<string>) => {
      state.categories = state.categories.filter(c => c.id !== payload);
      save('shop_categories', state.categories);
    },

    // ── Brands ──
    addBrand: (state, { payload }: PayloadAction<Omit<Brand, 'id'>>) => {
      state.brands.push({ id: 'b' + Date.now(), ...payload });
      save('shop_brands', state.brands);
    },
    updateBrand: (state, { payload }: PayloadAction<Brand>) => {
      const i = state.brands.findIndex(b => b.id === payload.id);
      if (i >= 0) state.brands[i] = payload;
      save('shop_brands', state.brands);
    },
    deleteBrand: (state, { payload }: PayloadAction<string>) => {
      state.brands = state.brands.filter(b => b.id !== payload);
      save('shop_brands', state.brands);
    },

    // ── Products ──
    addProduct: (state, { payload }: PayloadAction<Omit<ShopProduct, 'id' | 'rating' | 'sold'>>) => {
      state.products.push({ id: 'p' + Date.now(), rating: 0, sold: 0, ...payload });
      save('shop_products', state.products);
    },
    updateProduct: (state, { payload }: PayloadAction<ShopProduct>) => {
      const i = state.products.findIndex(p => p.id === payload.id);
      if (i >= 0) state.products[i] = payload;
      save('shop_products', state.products);
    },
    deleteProduct: (state, { payload }: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== payload);
      save('shop_products', state.products);
    },

    // ── Orders ──
    placeOrder: (state, { payload }: PayloadAction<Omit<Order, 'id' | 'createdAt'>>) => {
      const order: Order = { id: 'ORD' + Date.now(), createdAt: new Date().toISOString(), ...payload };
      state.orders.unshift(order);
      // update sold count for each product
      payload.items.forEach(item => {
        const p = state.products.find(p => p.id === item.productId);
        if (p) { p.sold += item.quantity; p.stock = Math.max(0, p.stock - item.quantity); }
      });
      save('shop_orders', state.orders);
      save('shop_products', state.products);
    },
    updateOrderStatus: (state, { payload }: PayloadAction<{ id: string; status: Order['status'] }>) => {
      const o = state.orders.find(o => o.id === payload.id);
      if (o) o.status = payload.status;
      save('shop_orders', state.orders);
    },
  },
});

export const {
  addCategory, updateCategory, deleteCategory,
  addBrand, updateBrand, deleteBrand,
  addProduct, updateProduct, deleteProduct,
  placeOrder, updateOrderStatus,
} = shopSlice.actions;

export default shopSlice.reducer;
