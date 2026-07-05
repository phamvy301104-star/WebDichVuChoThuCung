import React, { useEffect, useState } from "react";
import { Header } from "@components/Common/Header";
import { Footer } from "@components/Common/Footer";
import { orderService } from "@services/orderService";
import type { Order } from "@/types";

const statusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "#f59e0b";
    case "processing":
      return "#3b82f6";
    case "shipped":
      return "#10b981";
    case "delivered":
      return "#059669";
    case "cancelled":
      return "#ef4444";
    default:
      return "#6b7280";
  }
};

export const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await orderService.getMyOrders();
        setOrders(response || []);
      } catch (err) {
        setError("Không tải được lịch sử đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <>
      <Header />
      <main
        className="page-container"
        style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 20px" }}
      >
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: "1.9rem", fontWeight: 800, marginBottom: 10 }}>
            Lịch sử đơn hàng
          </h1>
          <p style={{ color: "#6b7280" }}>
            Xem lại trạng thái và chi tiết các đơn hàng bạn đã đặt.
          </p>
        </div>

        {loading ? (
          <div style={{ color: "#6b7280" }}>Đang tải đơn hàng...</div>
        ) : error ? (
          <div style={{ color: "#ef4444" }}>{error}</div>
        ) : orders.length === 0 ? (
          <div style={{ color: "#6b7280" }}>Bạn chưa có đơn hàng nào.</div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {orders.map((order) => {
              const orderId = order.id || order._id;
              return (
                <div
                  key={orderId}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: 20,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 16,
                      alignItems: "center",
                      marginBottom: 14,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: "#1e1b4b" }}>
                        {orderId}
                      </div>
                      <div style={{ color: "#6b7280", fontSize: "0.95rem" }}>
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      background: statusColor(order.status),
                      color: "#fff",
                      padding: "6px 14px",
                      borderRadius: 999,
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    {order.status}
                  </span>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ minWidth: 160 }}>
                      <strong>{order.items.length}</strong> sản phẩm
                    </div>
                    <div style={{ minWidth: 160 }}>
                      <strong>
                        {order.totalPrice.toLocaleString("vi-VN")}đ
                      </strong>{" "}
                      tổng
                    </div>
                    <button
                      style={{
                        marginLeft: "auto",
                        background: "#6366f1",
                        color: "#fff",
                        border: "none",
                        borderRadius: 10,
                        padding: "8px 14px",
                        cursor: "pointer",
                      }}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};
