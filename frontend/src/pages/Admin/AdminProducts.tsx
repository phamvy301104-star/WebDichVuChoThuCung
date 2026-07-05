import React, { useMemo, useState } from "react";
import type { Product, Brand, Category } from "@/types";

const initialCategories: Category[] = [
  { id: "c1", name: "Thức ăn", description: "Sản phẩm thức ăn cho thú cưng" },
  { id: "c2", name: "Phụ kiện", description: "Trang bị và phụ kiện" },
  { id: "c3", name: "Chăm sóc", description: "Sản phẩm chăm sóc và vệ sinh" },
];

const initialBrands: Brand[] = [
  { id: "b1", name: "Royal Canin" },
  { id: "b2", name: "PetJoy" },
  { id: "b3", name: "HappyPaws" },
];

const initialProducts: Product[] = [
  {
    id: "p1",
    name: "Thức ăn mèo Royal Canin 400g",
    description: "Công thức dinh dưỡng cân bằng cho mèo trưởng thành.",
    price: 185000,
    quantity: 45,
    image: "",
    category: initialCategories[0],
    brand: initialBrands[0],
    rating: 4.8,
    reviews: 132,
    createdAt: "2026-06-01",
  },
  {
    id: "p2",
    name: "Balo vận chuyển thú cưng cao cấp",
    description: "Thiết kế êm ái, thông gió tốt cho thú cưng khi di chuyển.",
    price: 320000,
    quantity: 12,
    image: "",
    category: initialCategories[1],
    brand: initialBrands[1],
    rating: 4.6,
    reviews: 89,
    createdAt: "2026-05-20",
  },
  {
    id: "p3",
    name: "Shampoo thú cưng hương lavender 500ml",
    description: "Sạch sâu, mềm mượt lông thú cưng.",
    price: 120000,
    quantity: 32,
    image: "",
    category: initialCategories[2],
    brand: initialBrands[2],
    rating: 4.4,
    reviews: 54,
    createdAt: "2026-06-10",
  },
];

const emptyProductForm = {
  name: "",
  description: "",
  price: 0,
  quantity: 0,
  categoryId: initialCategories[0].id,
  brandId: initialBrands[0].id,
};

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyProductForm });

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const keyword = search.toLowerCase();
        const matchKeyword =
          product.name.toLowerCase().includes(keyword) ||
          product.description.toLowerCase().includes(keyword) ||
          product.category.name.toLowerCase().includes(keyword) ||
          product.brand.name.toLowerCase().includes(keyword);
        const matchCategory = categoryFilter
          ? product.category.id === categoryFilter
          : true;
        const matchBrand = brandFilter
          ? product.brand.id === brandFilter
          : true;
        return matchKeyword && matchCategory && matchBrand;
      }),
    [products, search, categoryFilter, brandFilter],
  );

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const category =
      initialCategories.find((item) => item.id === form.categoryId) ??
      initialCategories[0];
    const brand =
      initialBrands.find((item) => item.id === form.brandId) ??
      initialBrands[0];

    if (editingId) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingId
            ? { ...product, ...form, category, brand }
            : product,
        ),
      );
      setEditingId(null);
    } else {
      setProducts((current) => [
        {
          id: `p${Date.now()}`,
          ...form,
          category,
          brand,
          image: "",
          rating: 0,
          reviews: 0,
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...current,
      ]);
    }

    setForm({ ...emptyProductForm });
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      categoryId: product.category.id,
      brandId: product.brand.id,
    });
  };

  const handleDelete = (id: string) => {
    setProducts((current) => current.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm({ ...emptyProductForm });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý sản phẩm</h1>
          <p className="admin-page-sub">
            Thêm, chỉnh sửa và quản lý danh sách sản phẩm.
          </p>
        </div>
      </div>

      <div className="ap-card">
        <div className="ap-card-header">
          <div>Danh sách sản phẩm hiện có</div>
        </div>

        <div className="ap-filters">
          <input
            type="text"
            className="ap-search"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="ap-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {initialCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            className="ap-select"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            <option value="">Tất cả thương hiệu</option>
            {initialBrands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Thương hiệu</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Đánh giá</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category.name}</td>
                <td>{product.brand.name}</td>
                <td>{product.price.toLocaleString("vi-VN")}đ</td>
                <td>{product.quantity}</td>
                <td>{product.rating.toFixed(1)} ⭐</td>
                <td className="ap-actions">
                  <button
                    className="ap-action-btn"
                    onClick={() => handleEdit(product)}
                  >
                    Sửa
                  </button>
                  <button
                    className="ap-action-btn ap-action-del"
                    onClick={() => handleDelete(product.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={7}>Không có sản phẩm phù hợp.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="ap-card ap-form-card">
        <div className="ap-card-header">
          <div>{editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</div>
        </div>
        <form onSubmit={handleSave}>
          <div className="ap-form-row">
            <div className="ap-form-group">
              <label>Tên sản phẩm</label>
              <input
                className="ap-search"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="ap-form-group">
              <label>Danh mục</label>
              <select
                className="ap-select"
                value={form.categoryId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, categoryId: e.target.value }))
                }
              >
                {initialCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="ap-form-group">
              <label>Thương hiệu</label>
              <select
                className="ap-select"
                value={form.brandId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, brandId: e.target.value }))
                }
              >
                {initialBrands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="ap-form-row">
            <div className="ap-form-group">
              <label>Giá</label>
              <input
                type="number"
                className="ap-search"
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    price: Number(e.target.value),
                  }))
                }
                min={0}
                required
              />
            </div>
            <div className="ap-form-group">
              <label>Số lượng</label>
              <input
                type="number"
                className="ap-search"
                value={form.quantity}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    quantity: Number(e.target.value),
                  }))
                }
                min={0}
                required
              />
            </div>
            <div className="ap-form-group ap-form-full">
              <label>Mô tả</label>
              <textarea
                className="ap-search"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button type="submit" className="ap-btn ap-btn-primary">
              {editingId ? "Lưu cập nhật" : "Thêm sản phẩm"}
            </button>
            <button
              type="button"
              className="ap-btn ap-btn-secondary"
              onClick={() => {
                setEditingId(null);
                setForm({ ...emptyProductForm });
              }}
            >
              Đặt lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
