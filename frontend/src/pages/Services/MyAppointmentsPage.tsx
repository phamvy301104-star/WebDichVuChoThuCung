import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Header } from "@/components/Common/Header";
import { Footer } from "@/components/Common/Footer";
import { 
  fetchMyAppointmentsThunk, 
  cancelAppointmentThunk 
} from "@/stores/slices/appointmentSlice";
import { appointmentService } from "@/services/appointmentService";
import type { RootState, AppDispatch } from "@/stores/store";
import type { Booking, BookingStatus } from "@/types/booking";

// ĐÃ SỬA: Cấu hình bao phủ toàn bộ 6 trạng thái vận hành đầu cuối của Backend kèm class CSS
const STATUS_UI: Record<BookingStatus, { label: string; className: string }> = {
  pending: { label: "Chờ xác nhận", className: "status-pending" },
  confirmed: { label: "Đã xác nhận", className: "status-confirmed" },
  assigned: { label: "Đã xếp nhân viên", className: "status-assigned" },
  in_progress: { label: "Đang thực hiện", className: "status-inprogress" },
  completed: { label: "Hoàn thành", className: "status-completed" },
  cancelled: { label: "Đã hủy", className: "status-cancelled" },
};

// ĐÃ SỬA: Hàm format chuỗi phẳng YYYY-MM-DD sang DD/MM/YYYY, triệt tiêu lỗi lệch ngày múi giờ local
const formatCleanDate = (dateStr: string) => {
  if (!dateStr || !dateStr.includes("-")) return dateStr;
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

export const MyAppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Kết nối nạp dữ liệu đồng bộ trực tiếp từ kho lưu trữ Redux toàn cục
  const { myAppointments, loading, error } = useSelector((state: RootState) => state.appointment);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const [editForm, setEditForm] = useState({
    phone: "",
    petName: "",
    petType: "",
    appointmentDate: "",
    appointmentTime: "",
    note: "",
  });

  // Tự động kích hoạt nạp danh sách lịch hẹn khi mount component
  useEffect(() => {
    dispatch(fetchMyAppointmentsThunk());
  }, [dispatch]);

  // Khống chế chặn không cho sửa ngày về quá khứ trong modal
  const minDateString = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Cấu trúc mảng dữ liệu phẳng tối ưu hiệu năng hiển thị giao diện
  const rows = useMemo(() => {
    return myAppointments.map((b: Booking) => {
      const status = b.status || "pending";
      return {
        id: String(b.id),
        customerName: b.customerName,
        phone: b.phone,
        petName: b.petName,
        petType: b.petType,
        serviceName: b.service?.name ?? "Dịch vụ đã ẩn",
        serviceImage: b.service?.image ?? "",
        price: b.service?.price ?? 0,
        employeeName: b.staff?.name ?? "",
        date: b.appointmentDate, // Định dạng phẳng 'YYYY-MM-DD' sạch
        time: b.appointmentTime,
        endTime: b.endTime,
        note: b.note,
        status,
      };
    });
  }, [myAppointments]);

  // Bộ đếm số liệu thống kê thông minh thẻ Dashboard
  const stats = useMemo(() => {
    return {
      all: rows.length,
      pending: rows.filter((x) => x.status === "pending").length,
      confirmed: rows.filter((x) => ["confirmed", "assigned", "in_progress"].includes(x.status)).length,
      completed: rows.filter((x) => x.status === "completed").length,
      cancelled: rows.filter((x) => x.status === "cancelled").length,
    };
  }, [rows]);

  const canEdit = (s: BookingStatus) => s === "pending";
  const canCancel = (s: BookingStatus) => ["pending", "confirmed", "assigned"].includes(s);
  const canReview = (s: BookingStatus) => s === "completed";

  // Logic khách hàng tự hủy đơn đặt lịch thông qua Redux Action
  const handleCancelBooking = async (id: string) => {
    const reason = window.prompt("Vui lòng nhập lý do hủy lịch hẹn (nếu có):");
    if (reason === null) return; 

    if (window.confirm("Bạn có chắc chắn muốn hủy đơn đăng ký lịch hẹn này không?")) {
      await dispatch(cancelAppointmentThunk({ id, reason: reason.trim() || undefined }));
    }
  };

  // Logic cập nhật sửa đổi thông tin liên lạc lịch hẹn
  const handleSaveEdit = async () => {
    if (!editTarget?.id) return;
    try {
      setSubmittingEdit(true);
      await appointmentService.updateAppointment(editTarget.id, {
        phone: editForm.phone,
        petName: editForm.petName,
        petType: editForm.petType,
        appointmentDate: editForm.appointmentDate,
        appointmentTime: editForm.appointmentTime,
        note: editForm.note,
      });
      setEditModalOpen(false);
      dispatch(fetchMyAppointmentsThunk()); // Tải lại dữ liệu mới sạch sẽ
    } catch (err: any) {
      alert(err.message || "Cập nhật thông tin lịch hẹn thất bại.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  return (
    <>
      <Header />
      <main className="my-appointments-page">
        <div className="my-appointments-container">
          <div className="my-appointments-header">
            <div>
              <h1 className="my-appointments-title">Lịch hẹn của tôi</h1>
              <p className="my-appointments-subtitle">Theo dõi trạng thái và tiến độ lịch hẹn dịch vụ của bạn.</p>
            </div>

            <div className="appointment-stats">
              <div className="appointment-stat-card">
                <div className="appointment-stat-card__value">{stats.all}</div>
                <div className="appointment-stat-card__label">Tổng lịch</div>
              </div>
              <div className="appointment-stat-card">
                <div className="appointment-stat-card__value status-pending">{stats.pending}</div>
                <div className="appointment-stat-card__label">Chờ xác nhận</div>
              </div>
              <div className="appointment-stat-card">
                <div className="appointment-stat-card__value status-confirmed">{stats.confirmed}</div>
                <div className="appointment-stat-card__label">Đã xác nhận</div>
              </div>
              <div className="appointment-stat-card">
                <div className="appointment-stat-card__value status-completed">{stats.completed}</div>
                <div className="appointment-stat-card__label">Hoàn thành</div>
              </div>
              <div className="appointment-stat-card">
                <div className="appointment-stat-card__value status-cancelled">{stats.cancelled}</div>
                <div className="appointment-stat-card__label">Đã hủy</div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="my-appointments__state">
              <p>Đang tải danh sách lịch hẹn...</p>
            </div>
          ) : error ? (
            <div className="my-appointments__state my-appointments__state--error">
              <p>{error}</p>
            </div>
          ) : (
            <div className="my-appointments__list">
              {rows.length === 0 ? (
                <div className="my-appointments__state">Bạn hiện chưa có lịch hẹn dịch vụ nào.</div>
              ) : (
                rows.map((r) => (
                  <div key={r.id} className="my-appointments__item">
                    <div className="my-appointments__itemMain">
                      <div className="my-appointments__service">
                        {r.serviceImage ? (
                          <img className="my-appointments__thumb" src={r.serviceImage} alt={r.serviceName} />
                        ) : (
                          <div className="my-appointments__thumb my-appointments__thumb--fallback">🐾</div>
                        )}
                        <div>
                          <div className="my-appointments__serviceName">{r.serviceName}</div>
                          <div className="my-appointments__meta">
                            <span>📅 Ngày: {formatCleanDate(r.date)} ({r.time} - {r.endTime ?? "—"})</span>
                            <span className="my-appointments__dot">•</span>
                            <span>💰 {Number(r.price).toLocaleString("vi-VN")}đ</span>
                          </div>
                        </div>
                      </div>

                      <div className="my-appointments__status">
                        <span className={`my-appointments__statusBadge ${STATUS_UI[r.status]?.className}`}>
                          {STATUS_UI[r.status]?.label || "Không rõ"}
                        </span>
                      </div>
                    </div>

                    <div className="my-appointments__itemAside">
                      <div className="my-appointments__customer">
                        <div>👤 Khách hàng: {r.customerName || ""}</div>
                        <div>📞 Điện thoại: {r.phone || ""}</div>
                        <div>🐾 Thú cưng: {r.petName} {r.petType ? ` (${r.petType})` : ""}</div>
                        {r.employeeName && <div>🧑‍⚕️ Chuyên viên: <b>{r.employeeName}</b></div>}
                      </div>

                      <div className="my-appointments__actions">
                        {canEdit(r.status) && (
                          <button
                            className="my-appointments__btn"
                            onClick={() => {
                              setEditTarget(r);
                              setEditForm({
                                phone: r.phone || "",
                                petName: r.petName || "",
                                petType: r.petType || "",
                                appointmentDate: r.date,
                                appointmentTime: r.time,
                                note: r.note || "",
                              });
                              setEditModalOpen(true);
                            }}
                          >
                            Sửa lịch
                      </button>
                        )}

                        {canCancel(r.status) && (
                          <button
                            className="my-appointments__btn my-appointments__btn--danger"
                            onClick={() => handleCancelBooking(r.id)}
                          >
                            Hủy lịch
                          </button>
                        )}

                        {canReview(r.status) && (
                          <button
                            className="my-appointments__btn"
                            onClick={() => {
                              const rating = window.prompt("Vui lòng nhập điểm đánh giá từ 1 đến 5 ⭐:");
                              if (!rating) return;
                              const num = parseInt(rating, 10);
                              if (isNaN(num) || num < 1 || num > 5) {
                                alert("Điểm số không hợp lệ, vui lòng nhập từ 1 đến 5.");
                                return;
                              }
                              const text = window.prompt("Nhập nội dung nhận xét chất lượng dịch vụ:");
                              appointmentService.reviewAppointment(r.id, { rating: num, reviewText: text || "" })
                                .then(() => {
                                  alert("Cảm ơn bạn đã gửi đánh giá chất lượng dịch vụ!");
                                  dispatch(fetchMyAppointmentsThunk());
                                })
                                .catch((err: any) => alert(err.message)); // ĐÃ SỬA LỖI 2: Thêm kiểu dữ liệu explicit (err: any) triệt tiêu lỗi noImplicitAny hoàn toàn
                            }}
                          >
                            Đánh giá
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* MODAL SỬA LỊCH HẸN CHUẨN */}
      {editModalOpen && editTarget && (
        <div className="my-appointments-modalOverlay" role="dialog" aria-modal="true">
          <div className="my-appointments-modal">
            <div className="my-appointments-modal__header">
              <h2 className="my-appointments-modal__title">Sửa đổi thông tin lịch hẹn</h2>
              <button className="my-appointments-modal__close" onClick={() => setEditModalOpen(false)}>✕</button>
            </div>

            <div className="my-appointments-modal__body">
              <div className="my-appointments-modal__row">
                <label className="my-appointments-modal__label">Số điện thoại liên hệ</label>
                <input className="my-appointments-modal__input" value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="my-appointments-modal__row">
                <label className="my-appointments-modal__label">Tên thú cưng</label>
                <input className="my-appointments-modal__input" value={editForm.petName} onChange={(e) => setEditForm((p) => ({ ...p, petName: e.target.value }))} />
              </div>
              <div className="my-appointments-modal__row">
                <label className="my-appointments-modal__label">Loại thú cưng</label>
                <input className="my-appointments-modal__input" value={editForm.petType} onChange={(e) => setEditForm((p) => ({ ...p, petType: e.target.value }))} />
              </div>
              <div className="my-appointments-modal__row">
                <label className="my-appointments-modal__label">Ngày hẹn đến</label>
                <input type="date" min={minDateString} className="my-appointments-modal__input" value={editForm.appointmentDate} onChange={(e) => setEditForm((p) => ({ ...p, appointmentDate: e.target.value }))} />
              </div>
              <div className="my-appointments-modal__row">
                <label className="my-appointments-modal__label">Giờ hẹn bắt đầu</label>
                <select
                  className="my-appointments-modal__input"
                  value={editForm.appointmentTime}
                  onChange={(e) => setEditForm((p) => ({ ...p, appointmentTime: e.target.value }))}
                >
                  <option value="08:00">08:00</option>
                  <option value="08:30">08:30</option>
                  <option value="09:00">09:00</option>
                  <option value="09:30">09:30</option>
                  <option value="10:00">10:00</option>
                  <option value="10:30">10:30</option>
                  <option value="11:00">11:00</option>
                  <option value="11:30">11:30</option>
                  <option value="13:00">13:00</option>
                  <option value="13:30">13:30</option>
                  <option value="14:00">14:00</option>
                  <option value="14:30">14:30</option>
                  <option value="15:00">15:00</option>
                  <option value="15:30">15:30</option>
                  <option value="16:00">16:00</option>
                  <option value="16:30">16:30</option>
                  <option value="17:00">17:00</option>
                </select>
              </div>
              <div className="my-appointments-modal__row">
                <label className="my-appointments-modal__label">Ghi chú lời dặn</label>
                <textarea className="my-appointments-modal__textarea" value={editForm.note} onChange={(e) => setEditForm((p) => ({ ...p, note: e.target.value }))} />
              </div>
            </div>

            <div className="my-appointments-modal__footer">
              <button className="my-appointments-modal__btn my-appointments-modal__btn--primary" onClick={handleSaveEdit} disabled={submittingEdit}>
                {submittingEdit ? "Đang lưu đơn..." : "Lưu thay đổi"}
              </button>
              <button className="my-appointments-modal__btn" onClick={() => setEditModalOpen(false)}>Hủy bỏ</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};