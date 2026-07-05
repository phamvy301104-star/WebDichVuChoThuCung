import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Header } from "@components/Common/Header";
import { Footer } from "@components/Common/Footer";
import { mockProducts } from "../../data/mockProducts";
import { addToCart } from "@stores/slices/cartSlice";

const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = mockProducts.find((item) => item.id === id);
  const dispatch = useDispatch();

  if (!product) {
    return (
      <>
        <Header />
        <main
          className="page-container"
          style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              textAlign: "center",
            }}
          >
            <h2>Sản phẩm không tìm thấy</h2>
            <p>Vui lòng quay lại danh sách sản phẩm.</p>
            <button
              onClick={() => navigate("/products")}
              className="ap-btn ap-btn-secondary"
              style={{ marginTop: 16 }}
            >
              Quay lại danh sách sản phẩm
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    alert("Đã thêm vào giỏ hàng!");
  };

  return (
    <>
      <Header />
      <main
        className="page-container"
        style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}
      >
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}
        >
          <div
            style={{
              background: "linear-gradient(135deg,#fef9f0,#fef3c7)",
              borderRadius: 16,
              minHeight: 360,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "8rem",
            }}
          >
            🐾
          </div>
          <div>
            <span
              style={{
                background: "#E8F5EF",
                color: "#166534",
                fontSize: "0.78rem",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: 6,
              }}
            >
              {product.category.name}
            </span>
            <h1
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                color: "#253D4E",
                margin: "12px 0 8px",
              }}
            >
              {product.name}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 900,
                  color: "#ef4444",
                }}
              >
                {fmt(product.price)}
              </span>
              <span
                style={{
                  background: "#f0fdf4",
                  color: "#166534",
                  padding: "4px 10px",
                  borderRadius: 8,
                  fontSize: "0.82rem",
                }}
              >
                ⭐ {product.rating}
              </span>
              <span
                style={{
                  background: "#f3f4f6",
                  color: "#374151",
                  padding: "4px 10px",
                  borderRadius: 8,
                  fontSize: "0.82rem",
                }}
              >
                Đã đánh giá: {product.reviews}
              </span>
            </div>
            <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>
              {product.description}
            </p>
            <div
              style={{
                background: "#f9fafb",
                borderRadius: 10,
                padding: 16,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span style={{ color: "#6b7280" }}>Thương hiệu</span>
                <b>{product.brand.name}</b>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span style={{ color: "#6b7280" }}>Số lượng</span>
                <b>{product.quantity}</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#6b7280" }}>Ngày cập nhật</span>
                <b>{product.createdAt}</b>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={handleAddToCart}
                className="ap-btn ap-btn-primary"
                style={{ padding: "14px 28px", borderRadius: 999 }}
              >
                Thêm vào giỏ
              </button>
              <button
                onClick={() => navigate("/products")}
                className="ap-btn ap-btn-secondary"
                style={{ padding: "14px 28px", borderRadius: 999 }}
              >
                Quay lại danh sách
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
