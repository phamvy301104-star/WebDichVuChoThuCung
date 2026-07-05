import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Header } from "@components/Common/Header";
import { Footer } from "@components/Common/Footer";
import { RootState } from "@stores/store";

const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";

export const CartPage: React.FC = () => {
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);

  return (
    <>
      <Header />
      <main
        className="page-container"
        style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}
      >
        <h1
          style={{
            fontWeight: 800,
            fontSize: "1.8rem",
            color: "#1e1b4b",
            marginBottom: 24,
          }}
        >
          🛒 Giỏ hàng
        </h1>

        {items.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 28,
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            Giỏ hàng của bạn đang trống.
          </div>
        ) : (
          <>
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                overflow: "hidden",
                marginBottom: 20,
              }}
            >
              {items.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 16,
                    alignItems: "center",
                    padding: "16px 20px",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <div
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: 16,
                      background: "#fef3c7",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2.4rem",
                    }}
                  >
                    🐾
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: "#1e1b4b",
                        marginBottom: 6,
                      }}
                    >
                      {item.product.name}
                    </div>
                    <div style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                      {item.quantity} x {fmt(item.price)}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      fontWeight: 700,
                      color: "#ef4444",
                    }}
                  >
                    {fmt(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: "20px 24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: 16,
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ color: "#6b7280", marginBottom: 4 }}>
                  Tổng cộng
                </div>
                <div
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 900,
                    color: "#ef4444",
                  }}
                >
                  {fmt(totalPrice)}
                </div>
              </div>
              <Link
                to="/checkout"
                className="ap-btn ap-btn-primary"
                style={{
                  textDecoration: "none",
                  padding: "14px 28px",
                  borderRadius: 999,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Thanh toán ngay
              </Link>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
};
