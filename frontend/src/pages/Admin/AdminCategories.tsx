import React, { useEffect, useState } from "react";
import type { Category } from "@/types";
import { productService } from "@services/productService";

const emptyForm = { name: "", description: "" };

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Lỗi khi tải danh mục");
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      category.description?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = form.name.trim();
    if (!trimmedName) return;

    try {
      if (editingId) {
        const updatedCategory = await productService.updateCategory(editingId, form);
        setCategories((current) =>
          current.map((item) =>
            (item.id || item._id) === editingId ? updatedCategory : item,
          ),
        );
        setEditingId(null);
      } else {
        const createdCategory = await productService.createCategory(form);
        setCategories((current) => [createdCategory as Category, ...current]);
      }
      setForm({ ...emptyForm });
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Không thể lưu danh mục");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id || category._id || null);
    setForm({ name: category.name, description: category.description || "" });
  };

  const handleDelete = async (id: string) => {
    try {
      await productService.deleteCategory(id);
      setCategories((current) =>
        current.filter((category) => (category.id || category._id) !== id),
      );
      if (editingId === id) {
        setEditingId(null);
        setForm({ ...emptyForm });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Không thể xóa danh mục");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý danh mục</h1>
          <p className="admin-page-sub">Tạo, sửa và xóa danh mục sản phẩm.</p>
        </div>
      </div>

      <div className="ap-card">
        <div className="ap-card-header">
          <div>Danh sách danh mục</div>
        </div>

        <div className="ap-filters">
          <input
            type="text"
            className="ap-search"
            placeholder="Tìm danh mục..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ padding: 24, color: '#6b7280' }}>Đang tải danh mục...</div>
        ) : error ? (
          <div style={{ padding: 24, color: '#ef4444' }}>{error}</div>
        ) : (
          <table className="admin-table">
          <thead>
            <tr>
              <th>Tên danh mục</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => {
              const id = category.id || category._id || '';
              return (
                <tr key={id}>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td className="ap-actions">
                    <button
                      className="ap-action-btn"
                      onClick={() => handleEdit(category)}
                    >
                      Sửa
                    </button>
                    <button
                      className="ap-action-btn ap-action-del"
                      onClick={() => handleDelete(id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan={3}>Không có danh mục phù hợp.</td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>

      <div className="ap-card ap-form-card">
        <div className="ap-card-header">
          <div>{editingId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</div>
        </div>
        <form onSubmit={handleSave}>
          <div className="ap-form-row">
            <div className="ap-form-group">
              <label>Tên danh mục</label>
              <input
                className="ap-search"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
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
              {editingId ? "Lưu danh mục" : "Thêm danh mục"}
            </button>
            <button
              type="button"
              className="ap-btn ap-btn-secondary"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", description: "" });
              }}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
