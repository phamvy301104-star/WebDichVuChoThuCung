import React, { useEffect, useState } from "react";
import type { Brand } from "@/types";
import { productService } from "@services/productService";

const emptyForm = { name: "" };

export const AdminBrands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await productService.getBrands();
        setBrands(data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Lỗi khi tải thương hiệu");
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = form.name.trim();
    if (!trimmed) return;

    try {
      if (editingId) {
        const updatedBrand = await productService.updateBrand(editingId, form);
        setBrands((current) =>
          current.map((item) =>
            (item.id || item._id) === editingId ? updatedBrand : item,
          ),
        );
        setEditingId(null);
      } else {
        const createdBrand = await productService.createBrand(form);
        setBrands((current) => [createdBrand as Brand, ...current]);
      }
      setForm({ ...emptyForm });
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Không thể lưu thương hiệu");
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingId(brand.id || brand._id || null);
    setForm({ name: brand.name });
  };

  const handleDelete = async (id: string) => {
    try {
      await productService.deleteBrand(id);
      setBrands((current) =>
        current.filter((brand) => (brand.id || brand._id) !== id),
      );
      if (editingId === id) {
        setEditingId(null);
        setForm({ ...emptyForm });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Không thể xóa thương hiệu");
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

        {loading ? (
          <div style={{ padding: 24, color: '#6b7280' }}>Đang tải thương hiệu...</div>
        ) : error ? (
          <div style={{ padding: 24, color: '#ef4444' }}>{error}</div>
        ) : (
          <table className="admin-table">
          <thead>
            <tr>
              <th>Tên thương hiệu</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((brand) => {
              const id = brand.id || brand._id || '';
              return (
                <tr key={id}>
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
                      onClick={() => handleDelete(id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredBrands.length === 0 && (
              <tr>
                <td colSpan={2}>Không có thương hiệu phù hợp.</td>
              </tr>
            )}
          </tbody>
        </table>
        )}
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
