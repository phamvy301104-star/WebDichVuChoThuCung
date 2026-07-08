import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Header } from "@components/Common/Header";
import { Footer } from "@components/Common/Footer";
import { productService } from "@services/productService";
import { addToCart } from "@stores/slices/cartSlice";
import type { Product } from "@/types";

const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!id) {
          setError("Mã sản phẩm không hợp lệ.");
          return;
        }

        const data = await productService.getProductById(id);
        if (!data) {
          setError("Sản phẩm không tìm thấy.");
          return;
        }

        setProduct(data);
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Không tìm thấy sản phẩm",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity: 1 }));
    alert("Đã thêm vào giỏ hàng!");
  };

  if (loading) {
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
              color: "#6b7280",
            }}
          >
            Đang tải dữ liệu sản phẩm...
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
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
            <h2>{error || "Sản phẩm không tìm thấy"}</h2>
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
              background: "#fff",
              borderRadius: 16,
              minHeight: 360,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  minHeight: 360,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "8rem",
                }}
              >
                🐾
              </div>
            )}
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
              {product.category?.name || "Không xác định"}
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
                <b>{product.brand?.name || "Không xác định"}</b>
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
