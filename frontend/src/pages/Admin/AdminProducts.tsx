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
  image: "",
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
  const [showForm, setShowForm] = useState(false);
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
          image: "",
        }));
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Lỗi khi tải dữ liệu sản phẩm",
        );
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
        const categoryId = product.category?.id || product.category?._id || "";
        const brandId = product.brand?.id || product.brand?._id || "";
        const name = product.name || "";
        const description = product.description || "";
        const categoryName = product.category?.name || "";
        const brandName = product.brand?.name || "";

        const matchKeyword =
          name.toLowerCase().includes(keyword) ||
          description.toLowerCase().includes(keyword) ||
          categoryName.toLowerCase().includes(keyword) ||
          brandName.toLowerCase().includes(keyword);

        const matchCategory = categoryFilter
          ? categoryId === categoryFilter
          : true;
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
          // backend expects category/brand ids; cast to any to satisfy TS
          category: form.categoryId as unknown as any,
          brand: form.brandId as unknown as any,
        });

        setProducts((current) =>
          current.map((product) => {
            if ((product.id || product._id) === editingId) {
              // updated.data may be undefined in the ApiResponse type; fallback to existing product
              return (updated.data as Product) || product;
            }
            return product;
          }),
        );
        setEditingId(null);
      } else {
        const created = await productService.createProduct({
          ...form,
          category: form.categoryId as unknown as any,
          brand: form.brandId as unknown as any,
        });
        setProducts((current) => [
          (created.data as Product) || ({} as Product),
          ...current,
        ]);
      }

      setForm({
        ...emptyProductForm,
        categoryId: categories[0]?.id || categories[0]?._id || "",
        brandId: brands[0]?.id || brands[0]?._id || "",
      });
    } catch (err: any) {
      alert(
        err.response?.data?.message || err.message || "Lỗi khi lưu sản phẩm",
      );
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id || product._id || null);
    setShowForm(true);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      categoryId: product.category.id || product.category._id || "",
      brandId: product.brand.id || product.brand._id || "",
      image: product.image || "",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      setProducts((current) =>
        current.filter((item) => (item.id || item._id) !== id),
      );
      if (editingId === id) {
        setEditingId(null);
        setForm({ ...emptyProductForm });
      }
    } catch (err: any) {
      alert(
        err.response?.data?.message || err.message || "Lỗi khi xóa sản phẩm",
      );
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

        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            className="ap-btn ap-btn-primary"
            type="button"
            onClick={() => {
              setShowForm((value) => !value);
              if (!showForm) {
                setEditingId(null);
                setForm({
                  ...emptyProductForm,
                  categoryId: categories[0]?.id || categories[0]?._id || "",
                  brandId: brands[0]?.id || brands[0]?._id || "",
                });
              }
            }}
          >
            {showForm ? "Ẩn form" : "Thêm sản phẩm mới"}
          </button>
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
              <option
                key={category.id || category._id}
                value={category.id || category._id}
              >
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
          <div style={{ padding: 24, color: "#ef4444" }}>{error}</div>
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
                  <td>{product.category?.name || "-"}</td>
                  <td>{product.brand?.name || "-"}</td>
                  <td>{(product.price ?? 0).toLocaleString("vi-VN")}đ</td>
                  <td>{product.quantity ?? 0}</td>
                  <td>{(product.rating ?? 0).toFixed(1)} ⭐</td>
                  <td className="ap-actions">
                    <button
                      className="ap-action-btn"
                      onClick={() => handleEdit(product)}
                    >
                      Sửa
                    </button>
                    <button
                      className="ap-action-btn ap-action-del"
                      onClick={() =>
                        handleDelete(product.id || product._id || "")
                      }
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

      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
            padding: 16,
          }}
          onClick={() => {
            setShowForm(false);
            setEditingId(null);
          }}
        >
          <div
            className="ap-card ap-form-card"
            style={{ maxWidth: 760, width: "100%", margin: "0 auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="ap-card-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                {editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
              </div>
              <button
                type="button"
                className="ap-btn ap-btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                style={{ padding: "6px 12px", minWidth: 0 }}
              >
                Đóng
              </button>
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
                      setForm((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option
                        key={category.id || category._id}
                        value={category.id || category._id}
                      >
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
                      <option
                        key={brand.id || brand._id}
                        value={brand.id || brand._id}
                      >
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
                      setForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="ap-form-row">
                <div className="ap-form-group">
                  <label>Ảnh sản phẩm (URL)</label>
                  <input
                    type="text"
                    className="ap-search"
                    placeholder="https://.../image.jpg"
                    value={form.image}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, image: e.target.value }))
                    }
                  />
                </div>
                <div className="ap-form-group">
                  <label>Tải ảnh từ máy</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="ap-search"
                    onChange={(e) => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        const maxBytes = 2 * 1024 * 1024; // 2MB
                        if (file.size > maxBytes) {
                          alert(
                            "Ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 2MB hoặc dùng URL ảnh.",
                          );
                          e.target.value = "";
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => {
                          setForm((prev) => ({
                            ...prev,
                            image: String(reader.result),
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
                <div className="ap-form-group">
                  <label>Xem trước</label>
                  <div
                    style={{
                      minWidth: 120,
                      minHeight: 80,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#fff",
                      border: "1px solid #eee",
                      borderRadius: 8,
                    }}
                  >
                    {form.image ? (
                      // eslint-disable-next-line jsx-a11y/img-redundant-alt
                      <img
                        src={form.image}
                        alt="preview"
                        style={{
                          maxWidth: 120,
                          maxHeight: 80,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    ) : (
                      <span style={{ color: "#9ca3af" }}>Chưa có ảnh</span>
                    )}
                  </div>
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
                    setShowForm(false);
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
      )}
    </div>
  );
};
