import React, { useState } from "react";
import type { Category } from "@/types";

const initialCategories: Category[] = [
  {
    id: "c1",
    name: "Thức ăn",
    description: "Sản phẩm dinh dưỡng cho thú cưng.",
  },
  { id: "c2", name: "Phụ kiện", description: "Túi xách, dây dắt, đồ chơi." },
  { id: "c3", name: "Chăm sóc", description: "Sản phẩm vệ sinh và làm đẹp." },
];

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      category.description?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = form.name.trim();
    if (!trimmedName) return;

    if (editingId) {
      setCategories((current) =>
        current.map((item) =>
          item.id === editingId ? { ...item, ...form } : item,
        ),
      );
      setEditingId(null);
    } else {
      setCategories((current) => [
        { id: `c${Date.now()}`, ...form },
        ...current,
      ]);
    }

    setForm({ name: "", description: "" });
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setForm({ name: category.name, description: category.description || "" });
  };

  const handleDelete = (id: string) => {
    setCategories((current) =>
      current.filter((category) => category.id !== id),
    );
    if (editingId === id) {
      setEditingId(null);
      setForm({ name: "", description: "" });
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

        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên danh mục</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr key={category.id}>
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
                    onClick={() => handleDelete(category.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan={3}>Không có danh mục phù hợp.</td>
              </tr>
            )}
          </tbody>
        </table>
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
