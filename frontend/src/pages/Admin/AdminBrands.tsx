import React, { useState } from "react";
import type { Brand } from "@/types";

const initialBrands: Brand[] = [
  { id: "b1", name: "Royal Canin" },
  { id: "b2", name: "PetJoy" },
  { id: "b3", name: "HappyPaws" },
];

export const AdminBrands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "" });

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = form.name.trim();
    if (!trimmed) return;

    if (editingId) {
      setBrands((current) =>
        current.map((item) =>
          item.id === editingId ? { ...item, name: trimmed } : item,
        ),
      );
      setEditingId(null);
    } else {
      setBrands((current) => [
        { id: `b${Date.now()}`, name: trimmed },
        ...current,
      ]);
    }

    setForm({ name: "" });
  };

  const handleEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setForm({ name: brand.name });
  };

  const handleDelete = (id: string) => {
    setBrands((current) => current.filter((brand) => brand.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm({ name: "" });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý thương hiệu</h1>
          <p className="admin-page-sub">
            Thêm và quản lý các thương hiệu sản phẩm.
          </p>
        </div>
      </div>

      <div className="ap-card">
        <div className="ap-card-header">
          <div>Danh sách thương hiệu</div>
        </div>

        <div className="ap-filters">
          <input
            type="text"
            className="ap-search"
            placeholder="Tìm thương hiệu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên thương hiệu</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((brand) => (
              <tr key={brand.id}>
                <td>{brand.name}</td>
                <td className="ap-actions">
                  <button
                    className="ap-action-btn"
                    onClick={() => handleEdit(brand)}
                  >
                    Sửa
                  </button>
                  <button
                    className="ap-action-btn ap-action-del"
                    onClick={() => handleDelete(brand.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {filteredBrands.length === 0 && (
              <tr>
                <td colSpan={2}>Không có thương hiệu phù hợp.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="ap-card ap-form-card">
        <div className="ap-card-header">
          <div>
            {editingId ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
          </div>
        </div>
        <form onSubmit={handleSave}>
          <div className="ap-form-row">
            <div className="ap-form-group">
              <label>Tên thương hiệu</label>
              <input
                className="ap-search"
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
                required
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button type="submit" className="ap-btn ap-btn-primary">
              {editingId ? "Lưu thương hiệu" : "Thêm thương hiệu"}
            </button>
            <button
              type="button"
              className="ap-btn ap-btn-secondary"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "" });
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
