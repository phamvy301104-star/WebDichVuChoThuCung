import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Header } from "@components/Common/Header";
import { Footer } from "@components/Common/Footer";
import { appointmentService } from "@services/appointmentService";

import type { RootState } from "@stores/store";
import type { Booking } from "@/types";

type BookingStatus = Booking["status"];


const STATUS_UI: Record<BookingStatus, { label: string }> = {
  pending: { label: "Chờ xác nhận" },
  confirmed: { label: "Đã xác nhận" },
  completed: { label: "Hoàn thành" },
  cancelled: { label: "Đã hủy" },
};

const formatDateTime = (date?: string, time?: string) => {
  if (!date) return time || "";
  const d = new Date(date);
  const dateStr = isNaN(d.getTime()) ? String(date) : d.toLocaleDateString("vi-VN");
  return time ? `${dateStr} ${time}` : dateStr;
};

export const MyAppointmentsPage: React.FC = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  const editingAppointment = editTarget;


  const [editForm, setEditForm] = useState({
    phone: "",
    petName: "",
    petType: "",
    date: "",
    time: "",
    note: "",
  });

  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);


  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const normalizeAppointments = (response: any): any[] => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.appointments)) return response.appointments;
    if (Array.isArray(response?.data?.appointments)) return response.data.appointments;
    return [];
  };

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const result = await appointmentService.getMyAppointments();

        if (!cancelled) setAppointments(normalizeAppointments(result));
      } catch (e: any) {
        console.error("Lỗi lấy lịch hẹn:", e);
        if (!cancelled) setAppointments([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);


  const appointmentList = Array.isArray(appointments) ? appointments : [];

  const rows = useMemo(() => {
    return appointmentList.map((b: any) => {
      const id = b._id ?? b.id;

      const service = b.service;
      const status = (b.status as BookingStatus) || "pending";

      return {
        id: String(id),
        customerName: b.customerName,
        phone: b.phone,
        petName: b.petName,
        petType: b.petType,
        serviceName: service?.name ?? "",
        serviceImage: service?.image ?? b.serviceImage ?? "",
        price: service?.price ?? b.price ?? 0,
        employeeName: b.staff?.name ?? b.employeeName ?? "",
        date: b.appointmentDate,
        time: b.appointmentTime,
        note: b.note,
        status,
      };
    });
  }, [appointments]);

  const canEdit = (s: BookingStatus) => s === "pending" || s === "confirmed";
  const canReview = (s: BookingStatus) => s === "completed";



  return (
    <>
      <Header />
      <main className="my-appointments-page">
        <div className="my-appointments-container">
          <div className="my-appointments-header">
            <div>
              <h1 className="my-appointments-title">Lịch hẹn của tôi</h1>
              <p className="my-appointments-subtitle">Theo dõi trạng thái lịch hẹn dịch vụ của bạn.</p>
            </div>

            <div className="appointment-stats">
              {(() => {
                const all = rows.length;
                const pending = rows.filter((x: any) => (x.status || "pending") === "pending").length;
                const confirmed = rows.filter((x: any) => (x.status || "pending") === "confirmed").length;
                const completed = rows.filter((x: any) => (x.status || "pending") === "completed").length;
                const cancelled = rows.filter((x: any) => (x.status || "pending") === "cancelled").length;

                return (
                  <>
                    <div className="appointment-stat-card">
                      <div className="appointment-stat-card__value">{all}</div>
                      <div className="appointment-stat-card__label">Tổng lịch</div>
                    </div>
                    <div className="appointment-stat-card">
                      <div className="appointment-stat-card__value status-pending">{pending}</div>
                      <div className="appointment-stat-card__label">Chờ xác nhận</div>
                    </div>
                    <div className="appointment-stat-card">
                      <div className="appointment-stat-card__value status-confirmed">{confirmed}</div>
                      <div className="appointment-stat-card__label">Đã xác nhận</div>
                    </div>
                    <div className="appointment-stat-card">
                      <div className="appointment-stat-card__value status-completed">{completed}</div>
                      <div className="appointment-stat-card__label">Hoàn thành</div>
                    </div>
                    <div className="appointment-stat-card">
                      <div className="appointment-stat-card__value status-cancelled">{cancelled}</div>
                      <div className="appointment-stat-card__label">Đã hủy</div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>


          {loading ? (
            <div className="my-appointments__state">
              <p>Đang tải lịch hẹn...</p>
            </div>
          ) : error ? (
            <div className="my-appointments__state my-appointments__state--error">
              <p>{error}</p>
            </div>
          ) : (
            <div className="my-appointments__list">
              {rows.length === 0 ? (
                <div className="my-appointments__state">Bạn chưa có lịch hẹn nào.</div>
              ) : (
                rows.map((r) => (

                  <div key={r.id} className="my-appointments__item">
                    <div className="my-appointments__itemMain">
                      <div className="my-appointments__service">
                        {r.serviceImage ? (
                          <img className="my-appointments__thumb" src={r.serviceImage} alt={r.serviceName} />
                        ) : (
                          <div className="my-appointments__thumb my-appointments__thumb--fallback">✂️</div>
                        )}
                        <div>
                          <div className="my-appointments__serviceName">{r.serviceName}</div>
                          <div className="my-appointments__meta">
                            <span>📅 {formatDateTime(r.date, r.time)}</span>
                            <span className="my-appointments__dot">•</span>
                            <span>💰 {Number(r.price || 0).toLocaleString("vi-VN")}đ</span>
                          </div>
                        </div>
                      </div>

                      <div className="my-appointments__status">
                        <span className="my-appointments__statusBadge">{STATUS_UI[r.status]?.label}</span>
                      </div>
                    </div>

                    <div className="my-appointments__itemAside">
                      <div className="my-appointments__customer">
                        <div>👤 {r.customerName || ""}</div>
                        <div>📞 {r.phone || ""}</div>
                        <div>🐾 {r.petName ? r.petName : ""}{r.petType ? ` (${r.petType})` : ""}</div>
                        {r.employeeName && <div>🧑‍⚕️ {r.employeeName}</div>}
                      </div>

                      <div className="my-appointments__actions">
                        {canEdit(r.status) && (
                          <>
                            <button
                              className="my-appointments__btn"
                              onClick={() => {
                                setEditTarget(r);
                                setEditForm({
                                  phone: r.phone || "",
                                  petName: r.petName || "",
                                  petType: r.petType || "",
                                  date: r.date ? String(new Date(r.date).toISOString().slice(0, 10)) : "",
                                  time: r.time || "",
                                  note: r.note || "",
                                });
                                setEditModalOpen(true);
                              }}
                            >
                              Sửa lịch
                            </button>
                            <button
                              className="my-appointments__btn my-appointments__btn--danger"
                              onClick={async () => {
                                const id = r.id || (r as any)._id || (r as any).id;
                                if (!id) return;
                                if (!window.confirm("Bạn chắc chắn muốn hủy lịch này không?")) return;
                                try {
                                  await appointmentService.cancelAppointment(id);

                                  const result = await appointmentService.getMyAppointments();
                                  setAppointments(normalizeAppointments(result));
                                } catch (e) {
                                  console.error(e);
                                  alert("Hủy lịch thất bại");
                                }
                              }}
                            >
                              Hủy lịch
                            </button>

                          </>
                        )}

                        {canReview(r.status) && (
                          <button
                            className="my-appointments__btn"
                            onClick={() => {
                              // giữ nguyên UI hiện tại: nếu dự án chưa có trang review thì chỉ hiển thị nút
                              alert("Chức năng đánh giá sẽ được kết nối sau.");
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
      {editModalOpen && editingAppointment && (

        <div className="my-appointments-modalOverlay" role="dialog" aria-modal="true">
          <div className="my-appointments-modal">
            <div className="my-appointments-modal__header">
              <h2 className="my-appointments-modal__title">Sửa lịch hẹn</h2>
              <button
                className="my-appointments-modal__close"
                onClick={() => {
                  setEditModalOpen(false);
                  setEditTarget(null);
                }}
                aria-label="Đóng"
              >
                ✕
              </button>

            </div>

            <div className="my-appointments-modal__body">
              <div className="my-appointments-modal__row">
                <label className="my-appointments-modal__label">Số điện thoại</label>
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
                <label className="my-appointments-modal__label">Ngày hẹn</label>
                <input type="date" className="my-appointments-modal__input" value={editForm.date} onChange={(e) => setEditForm((p) => ({ ...p, date: e.target.value }))} />
              </div>

              <div className="my-appointments-modal__row">
                <label className="my-appointments-modal__label">Giờ hẹn</label>
                <input type="time" className="my-appointments-modal__input" value={editForm.time} onChange={(e) => setEditForm((p) => ({ ...p, time: e.target.value }))} />
              </div>

              <div className="my-appointments-modal__row">
                <label className="my-appointments-modal__label">Ghi chú</label>
                <textarea className="my-appointments-modal__textarea" value={editForm.note} onChange={(e) => setEditForm((p) => ({ ...p, note: e.target.value }))} />
              </div>
            </div>

            <div className="my-appointments-modal__footer">
              <button
                className="my-appointments-modal__btn my-appointments-modal__btn--primary"
                onClick={async () => {
                  const id = editTarget?.id || editTarget?._id || editTarget?.appointmentId;
                  if (!id) return;
                  try {
                    // Theo yêu cầu: payload có field tương ứng backend dùng.
                    // Hiện FE đang sẵn có appointmentDate/appointmentTime trong project, nên gửi theo format này.
                    await appointmentService.updateAppointment(id, {
                      phone: editForm.phone,
                      petName: editForm.petName,
                      petType: editForm.petType,
                      appointmentDate: editForm.date,
                      appointmentTime: editForm.time,
                      note: editForm.note,
                    } as any);

                    setEditModalOpen(false);
                    const result = await appointmentService.getMyAppointments();
                    setAppointments(normalizeAppointments(result));
                  } catch (e) {
                    console.error(e);
                    alert("Cập nhật lịch thất bại");
                  }
                }}
              >
                Lưu thay đổi
              </button>
              <button
                className="my-appointments-modal__btn"
                onClick={() => {
                  setEditModalOpen(false);
                  setEditTarget(null);
                }}
              >
                Hủy
              </button>

            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};


