import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@components/Common/Header";
import { Footer } from "@components/Common/Footer";
import { productService } from "@services/productService";
import type { Product } from "@/types";

const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";

export const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "Lỗi khi tải sản phẩm",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Header />
      <main className="page-container">
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px 28px",
            background: "linear-gradient(135deg,#f59e0b,#ef4444)",
            borderRadius: 16,
            color: "#fff",
            marginBottom: 32,
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: 10 }}>🛍️</div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 8px" }}>
            Cửa hàng thú cưng
          </h1>
          <p style={{ opacity: 0.9, margin: 0 }}>
            Sản phẩm chất lượng cao, giá tốt nhất thị trường
          </p>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              marginBottom: 48,
              color: "#6b7280",
            }}
          >
            Đang tải sản phẩm...
          </div>
        ) : error ? (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              marginBottom: 48,
              color: "#ef4444",
            }}
          >
            {error}
          </div>
        ) : products.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              marginBottom: 48,
              color: "#6b7280",
            }}
          >
            Không có sản phẩm nào.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
              gap: 18,
              marginBottom: 48,
            }}
          >
            {products.map((p) => (
              <Link
                key={p.id || p._id}
                to={`/products/${p.id || p._id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                    border: "1px solid #f0f0f0",
                  }}
                >
                  <div
                    style={{
                      height: 130,
                      background: "linear-gradient(135deg,#fef9f0,#fef3c7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3.5rem",
                    }}
                  >
                    🐾
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        background: "#E8F5EF",
                        color: "#166534",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        padding: "2px 7px",
                        borderRadius: 5,
                      }}
                    >
                      {p.category?.name || "Không xác định"}
                    </span>
                    <h3
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        color: "#253D4E",
                        margin: "8px 0 6px",
                        lineHeight: 1.3,
                      }}
                    >
                      {p.name}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontWeight: 800,
                            color: "#ef4444",
                            fontSize: "1rem",
                          }}
                        >
                          {fmt(p.price)}
                        </span>
                      </div>
                      <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>
                        ⭐ {p.rating}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "#9ca3af",
                        marginTop: 4,
                      }}
                    >
                      Thương hiệu: {p.brand?.name || "Không xác định"}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};
