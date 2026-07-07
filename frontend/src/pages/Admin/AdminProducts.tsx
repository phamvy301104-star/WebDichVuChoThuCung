import React, { useEffect, useMemo, useState } from "react";
import { productService } from "@services/productService";
import type { Product, Brand, Category } from "@/types";

const emptyProductForm = {
  name: "",
  description: "",
  price: 0,
  quantity: 0,
  categoryId: "",
  brandId: "",
};

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyProductForm });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productData, categoryData, brandData] = await Promise.all([
          productService.getProducts(),
          productService.getCategories(),
          productService.getBrands(),
        ]);

        setProducts(productData);
        setCategories(categoryData);
        setBrands(brandData);
        setForm((prev) => ({
          ...prev,
          categoryId: categoryData[0]?.id || categoryData[0]?._id || "",
          brandId: brandData[0]?.id || brandData[0]?._id || "",
        }));
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Lỗi khi tải dữ liệu sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const keyword = search.toLowerCase();
        const categoryId = product.category.id || product.category._id || "";
        const brandId = product.brand.id || product.brand._id || "";
        const matchKeyword =
          product.name.toLowerCase().includes(keyword) ||
          product.description.toLowerCase().includes(keyword) ||
          product.category.name.toLowerCase().includes(keyword) ||
          product.brand.name.toLowerCase().includes(keyword);
        const matchCategory = categoryFilter ? categoryId === categoryFilter : true;
        const matchBrand = brandFilter ? brandId === brandFilter : true;
        return matchKeyword && matchCategory && matchBrand;
      }),
    [products, search, categoryFilter, brandFilter],
  );

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.categoryId || !form.brandId) {
      alert("Vui lòng chọn danh mục và thương hiệu.");
      return;
    }

    try {
      if (editingId) {
        const updated = await productService.updateProduct(editingId, {
          ...form,
          category: form.categoryId,
          brand: form.brandId,
        } as any);

        setProducts((current) =>
          current.map((product) =>
            (product.id || product._id) === editingId ? (updated.data as Product) : product,
          ),
        );
        setEditingId(null);
      } else {
        const created = await productService.createProduct({
          ...form,
          category: form.categoryId,
          brand: form.brandId,
        } as any);
        setProducts((current) => [created.data as Product, ...current]);
      }

      setForm({ ...emptyProductForm, categoryId: categories[0]?.id || categories[0]?._id || "", brandId: brands[0]?.id || brands[0]?._id || "" });
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Lỗi khi lưu sản phẩm");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id || product._id || null);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      categoryId: product.category.id || product.category._id || "",
      brandId: product.brand.id || product.brand._id || "",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      setProducts((current) => current.filter((item) => (item.id || item._id) !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm({ ...emptyProductForm });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Lỗi khi xóa sản phẩm");
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Quản lý sản phẩm</h1>
          </div>
        </div>
        <div className="ap-card">
          <div className="ap-card-header">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

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
            {categories.map((category) => (
              <option key={category.id || category._id} value={category.id || category._id}>
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
            {brands.map((brand) => (
              <option key={brand.id || brand._id} value={brand.id || brand._id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <div style={{ padding: 24, color: '#ef4444' }}>{error}</div>
        ) : (
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
                <tr key={product.id || product._id}>
                  <td>{product.name}</td>
                  <td>{product.category.name}</td>
                  <td>{product.brand.name}</td>
                  <td>{product.price.toLocaleString('vi-VN')}đ</td>
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
                      onClick={() => handleDelete(product.id || product._id || '')}
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
        )}
      </div>

      <div className="ap-card ap-form-card">
        <div className="ap-card-header">
          <div>{editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</div>
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
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id || category._id} value={category.id || category._id}>
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
                required
              >
                <option value="">Chọn thương hiệu</option>
                {brands.map((brand) => (
                  <option key={brand.id || brand._id} value={brand.id || brand._id}>
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

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button type="submit" className="ap-btn ap-btn-primary">
              {editingId ? 'Lưu cập nhật' : 'Thêm sản phẩm'}
            </button>
            <button
              type="button"
              className="ap-btn ap-btn-secondary"
              onClick={() => {
                setEditingId(null);
                setForm({
                  ...emptyProductForm,
                  categoryId: categories[0]?.id || categories[0]?._id || "",
                  brandId: brands[0]?.id || brands[0]?._id || "",
                });
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
