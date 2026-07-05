import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@stores/store";
import { Header } from "@components/Common/Header";
import { Footer } from "@components/Common/Footer";
import { clearCart } from "@stores/slices/cartSlice";
import { orderService } from "@services/orderService";

export const CheckoutPage: React.FC = () => {
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleConfirm = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("Vui lòng điền đầy đủ thông tin giao nhận.");
      return;
    }

    if (items.length === 0) {
      alert("Giỏ hàng đang trống.");
      return;
    }

    setSubmitting(true);

    try {
      await orderService.createOrder({
        items: items.map((item) => ({
          product: item.product.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: `${name} | ${phone} | ${address}`,
        paymentMethod,
      });

      dispatch(clearCart());
      alert("Đơn hàng của bạn đã được đặt thành công!");
      navigate("/orders");
    } catch (err) {
      alert("Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main
        className="page-container"
        style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}
      >
        <div
          style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <h1
              style={{ marginBottom: 24, fontSize: "1.8rem", fontWeight: 800 }}
            >
              Thanh toán
            </h1>
            <div style={{ display: "grid", gap: 18 }}>
              <div>
                <h2
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    marginBottom: 12,
                  }}
                >
                  Thông tin giao nhận
                </h2>
                <div style={{ display: "grid", gap: 12 }}>
                  <input
                    className="ap-search"
                    type="text"
                    placeholder="Họ tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="ap-search"
                    type="text"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <input
                    className="ap-search"
                    type="text"
                    placeholder="Địa chỉ nhận hàng"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <textarea
                    className="ap-search"
                    rows={4}
                    placeholder="Ghi chú thêm (tuỳ chọn)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <h2
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    marginBottom: 12,
                  }}
                >
                  Phương thức thanh toán
                </h2>
                <select
                  className="ap-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="COD">Thanh toán khi nhận hàng</option>
                  <option value="bank">Chuyển khoản ngân hàng</option>
                  <option value="momo">Thanh toán Momo</option>
                </select>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <h2
              style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 18 }}
            >
              Tóm tắt đơn hàng
            </h2>
            {items.length === 0 ? (
              <div style={{ color: "#6b7280" }}>Giỏ hàng đang trống.</div>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {items.map((item) => (
                  <div
                    key={item.productId}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.product.name}</div>
                      <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                        x{item.quantity}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700 }}>
                      {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: 14,
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 800,
                  }}
                >
                  <span>Tổng thanh toán</span>
                  <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
                </div>
                <button
                  type="button"
                  className="ap-btn ap-btn-primary"
                  style={{ width: "100%" }}
                  onClick={handleConfirm}
                >
                  Xác nhận đặt hàng
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
