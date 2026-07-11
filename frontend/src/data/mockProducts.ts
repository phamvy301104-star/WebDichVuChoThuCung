import type { Product, Brand, Category } from '@/types';

const categories: Category[] = [
  { id: 'c1', name: 'Thức ăn', description: 'Sản phẩm dinh dưỡng cho thú cưng.' },
  { id: 'c2', name: 'Phụ kiện', description: 'Đồ dùng, túi xách và phụ kiện.' },
  { id: 'c3', name: 'Chăm sóc', description: 'Sản phẩm vệ sinh và chăm sóc.' },
];

const brands: Brand[] = [
  { id: 'b1', name: 'Royal Canin' },
  { id: 'b2', name: 'PetJoy' },
  { id: 'b3', name: 'HappyPaws' },
];

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Thức ăn mèo Royal Canin 400g',
    description: 'Công thức dinh dưỡng cân bằng dành cho mèo trưởng thành.',
    price: 185000,
    quantity: 45,
    image: '',
    category: categories[0],
    brand: brands[0],
    rating: 4.8,
    reviews: 132,
    createdAt: '2026-06-01',
  },
  {
    id: 'p2',
    name: 'Balo vận chuyển thú cưng cao cấp',
    description: 'Thiết kế êm ái, thông gió giúp thú cưng thoải mái khi di chuyển.',
    price: 320000,
    quantity: 12,
    image: '',
    category: categories[1],
    brand: brands[1],
    rating: 4.6,
    reviews: 89,
    createdAt: '2026-05-20',
  },
  {
    id: 'p3',
    name: 'Shampoo thú cưng hương lavender 500ml',
    description: 'Giúp lông mềm mượt và thơm lâu, phù hợp mọi loại thú cưng.',
    price: 120000,
    quantity: 32,
    image: '',
    category: categories[2],
    brand: brands[2],
    rating: 4.4,
    reviews: 54,
    createdAt: '2026-06-10',
  },
  {
    id: 'p4',
    name: 'Combo đồ chơi chuột nhỏ cho mèo',
    description: 'Đồ chơi tương tác giúp mèo vận động và giảm stress.',
    price: 55000,
    quantity: 18,
    image: '',
    category: categories[1],
    brand: brands[2],
    rating: 4.7,
    reviews: 70,
    createdAt: '2026-05-28',
  },
];

export const mockCategories = categories;
export const mockBrands = brands;
