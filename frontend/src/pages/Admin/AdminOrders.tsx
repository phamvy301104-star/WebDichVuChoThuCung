import React, { useEffect, useMemo, useState } from "react";
import type { Order } from "@/types";
import { orderService } from "@services/orderService";

const statusLabels: Record<string, string> = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  shipped: "Đã gửi",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const nextStatusMap: Record<string, string | null> = {
  pending: "processing",
  processing: "shipped",
  shipped: "delivered",
  delivered: null,
  cancelled: null,
};

const statusClass = (status: string) => {
  switch (status) {
    case "pending":
      return "ap-tag";
    case "processing":
      return "ap-tag";
    case "shipped":
      return "ap-tag";
    case "delivered":
      return "ap-tag";
    case "cancelled":
      return "ap-tag";
    default:
      return "ap-tag";
  }
};

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await orderService.getAllOrders();
        setOrders(data);
      } catch (err) {
        setError("Không tải được danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const keyword = search.toLowerCase();
        const orderId = (order.id || order._id || "").toString();
        const matchKeyword =
          orderId.toLowerCase().includes(keyword) ||
          order.user?.name?.toLowerCase().includes(keyword) ||
          order.user?.email?.toLowerCase().includes(keyword);
        const matchStatus = statusFilter ? order.status === statusFilter : true;
        return matchKeyword && matchStatus;
      }),
    [orders, search, statusFilter],
  );

  const updateStatus = async (id: string) => {
    const order = orders.find((order) => (order.id || order._id) === id);
    if (!order) return;
    const nextStatus = nextStatusMap[order.status];
    if (!nextStatus) return;

    try {
      const updated = await orderService.updateOrderStatus(id, nextStatus);
      setOrders((current) =>
        current.map((item) => ((item.id || item._id) === id ? updated : item)),
      );
    } catch {
      alert("Cập nhật trạng thái không thành công.");
    }
  };

  const cancelOrder = async (id: string) => {
    try {
      const updated = await orderService.cancelOrder(id);
      setOrders((current) =>
        current.map((order) =>
          (order.id || order._id) === id ? updated : order,
        ),
      );
    } catch {
      alert("Hủy đơn hàng không thành công.");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý đơn hàng</h1>
          <p className="admin-page-sub">
            Theo dõi và cập nhật trạng thái đơn hàng bán hàng.
          </p>
        </div>
      </div>

      <div className="ap-card">
        <div className="ap-card-header">
          <div>Danh sách đơn hàng</div>
        </div>

        <div className="ap-filters">
          <input
            type="text"
            className="ap-search"
            placeholder="Tìm theo mã đơn, tên khách hàng hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="ap-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div style={{ padding: 24, color: "#6b7280" }}>
            Đang tải đơn hàng...
          </div>
        ) : error ? (
          <div style={{ padding: 24, color: "#ef4444" }}>{error}</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Giá trị</th>
                <th>Phương thức</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.user?.name || "Khách"}</td>
                  <td>{order.totalPrice.toLocaleString("vi-VN")}đ</td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <span className={statusClass(order.status)}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="ap-actions">
                    {nextStatusMap[order.status] && (
                      <button
                        className="ap-action-btn"
                        onClick={() => updateStatus(order.id)}
                      >
                        Chuyển sang{" "}
                        {
                          statusLabels[
                            nextStatusMap[order.status] ?? order.status
                          ]
                        }
                      </button>
                    )}
                    {order.status !== "cancelled" &&
                      order.status !== "delivered" && (
                        <button
                          className="ap-action-btn ap-action-del"
                          onClick={() => cancelOrder(order.id)}
                        >
                          Hủy
                        </button>
                      )}
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7}>Không có đơn hàng phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
