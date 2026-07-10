import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Header } from "@/components/Common/Header";
import { Footer } from "@/components/Common/Footer";
import { serviceService } from "@/services/serviceService";
import { 
  createAppointmentThunk, 
  updateBookingDraft, 
  clearBookingDraft 
} from "@/stores/slices/appointmentSlice";
import type { RootState, AppDispatch } from "@/stores/store";
import type { Service } from "@/types/service";

type Step = "form" | "confirm";

export const AppointmentFormPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { serviceId } = useParams<{ serviceId: string }>();

  // Lấy trạng thái đăng nhập và profile của user (nếu có) để tự điền form
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  // Lấy dữ liệu bản nháp form và các trạng thái loading/error từ Redux Store toàn cục
  const { bookingFormDraft, loading, error: reduxError } = useSelector((state: RootState) => state.appointment);

  const [loadingService, setLoadingService] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("form");

  // ĐÃ SỬA: Đồng bộ hóa dữ liệu form ưu tiên lấy từ bản nháp Redux ra trước
  const [form, setForm] = useState({
    service: serviceId ?? bookingFormDraft.service ?? "",
    customerName: bookingFormDraft.customerName ?? "",
    phone: bookingFormDraft.phone ?? "",
    email: bookingFormDraft.email ?? "",
    petName: bookingFormDraft.petName ?? "",
    petType: bookingFormDraft.petType ?? "",
    appointmentDate: bookingFormDraft.appointmentDate ?? "",
    appointmentTime: bookingFormDraft.appointmentTime ?? "",
    note: bookingFormDraft.note ?? "",
  });

  // 1. Luồng tải dữ liệu dịch vụ (Cho phép cả khách vãng lai truy cập)
  useEffect(() => {
    if (!form.service) {
      setLocalError("Thông tin dịch vụ yêu cầu không hợp lệ.");
      return;
    }

    setLoadingService(true);
    serviceService
      .getServiceById(form.service)
      .then((s) => setService(s ?? null))
      .catch((err: any) => setLocalError(err.message || "Lỗi tải thông tin dịch vụ."))
      .finally(() => setLoadingService(false));
  }, [form.service]);

  // 2. ĐÃ THÊM: Tính năng Pre-fill thông tin tự động nếu khách hàng đã đăng nhập tài khoản
  useEffect(() => {
    if (isAuthenticated && user) {
      setForm((prev) => ({
        ...prev,
        customerName: prev.customerName || user.name || "",
        phone: prev.phone || user.phone || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [isAuthenticated, user]);

  // 3. ĐÃ THÊM: Lưu bản nháp vào Redux Store theo thời gian thực (Real-time Auto-Save Draft)
  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      dispatch(updateBookingDraft(updated)); // Đẩy thẳng vào Redux bọc giữ dữ liệu
      return updated;
    });
  };

  const computedSummary = useMemo(() => {
    if (!service) return null;
    return {
      serviceName: service.name,
      servicePrice: service.price,
      serviceDuration: service.duration,
    };
  }, [service]);

  // ĐÃ THÊM: Chốt chặn giao diện khống chế không cho chọn ngày trong quá khứ
  const minDateString = useMemo(() => {
    return new Date().toISOString().split("T")[0]; // Trả về dạng chuỗi 'YYYY-MM-DD' hôm nay
  }, []);

  const validate = (): string | null => {
    if (!form.service) return "Thông tin dịch vụ trống.";
    if (!form.customerName.trim()) return "Vui lòng nhập họ và tên người đặt lịch.";
    if (!form.phone.trim()) return "Vui lòng nhập số điện thoại liên hệ.";
    if (!form.petName.trim()) return "Vui lòng cung cấp tên của thú cưng.";
    if (!form.petType.trim()) return "Vui lòng nhập chủng loại thú cưng (Ví dụ: Chó, Mèo...).";
    if (!form.appointmentDate) return "Vui lòng chọn ngày hẹn thực hiện dịch vụ.";
    if (!form.appointmentTime) return "Vui lòng cấu hình khung giờ hẹn.";
    return null;
  };

  const handleConfirm = () => {
    const errorMsg = validate();
    if (errorMsg) {
      setLocalError(errorMsg);
      return;
    }
    setLocalError(null);
    setStep("confirm");
  };

  // 4. Thực hiện gửi lịch thông qua Async Thunk điều phối Redux
  const handleSubmit = async () => {
    const errorMsg = validate();
    if (errorMsg) {
      setLocalError(errorMsg);
      setStep("form");
      return;
    }

    setLocalError(null);

    // Triển khai dispatch action lên store mạng Backend
    const resultAction = await dispatch(createAppointmentThunk({
      service: form.service, // ĐÃ SỬA: Đổi tên trường thành 'service' khớp 100% với DTO Backend mới
      customerName: form.customerName,
      phone: form.phone,
      email: form.email || undefined,
      petName: form.petName,
      petType: form.petType,
      appointmentDate: form.appointmentDate,
      appointmentTime: form.appointmentTime,
      note: form.note || undefined,
    }));

    if (createAppointmentThunk.fulfilled.match(resultAction)) {
      dispatch(clearBookingDraft()); // Đặt lịch thành công -> Xóa sạch bản nháp
      navigate("/my-appointments"); // Chuyển hướng sang trang lịch sử đặt lịch
    }
  };

  const displayError = localError || reduxError;

  if (displayError && !service && !loadingService) {
    return (
      <>
        <Header />
        <main className="appointment">
          <div className="appointment__state appointment__state--error">
            <p>{displayError}</p>
            <button className="appointment__back" onClick={() => navigate("/services")}>
              Quay lại danh sách dịch vụ
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

      <main className="appointment">
        <div className="appointment__container">
          <div className="appointment__header">
            <h1 className="appointment__title">Đặt lịch dịch vụ</h1>
            <p className="appointment__sub">Vui lòng điền thông tin để đặt lịch hẹn chăm sóc thú cưng.</p>
          </div>

          {loadingService ? (
            <div className="appointment__state">
              <div className="appointment__spinner" />
              <p>Đang xử lý thông tin dịch vụ mẫu...</p>
            </div>
          ) : (
            <div className="appointment-booking">
              <section className="appointment-booking__left">
                <div className="appointment__form-head">
                  <span className={`appointment__step${step === "form" ? " appointment__step--active" : ""}`}>1. Nhập thông tin</span>
                  <span className="appointment__divider">|</span>
                  <span className={`appointment__step${step === "confirm" ? " appointment__step--active" : ""}`}>2. Xác nhận</span>
                </div>

                <div className="appointment__serviceLine">
                  <span className="appointment__serviceLabel">Dịch vụ đã chọn:</span>
                  <span className="appointment__serviceValue">{service?.name ?? ""}</span>
                </div>

                {step === "form" ? (
                  <>
                    <div className="appointment__row">
                      <label className="appointment__label">Họ tên khách hàng *</label>
                      <input
                        className="appointment__input"
                        value={form.customerName}
                        onChange={(e) => handleInputChange("customerName", e.target.value)}
                      />
                    </div>

                    <div className="appointment__row">
                      <label className="appointment__label">Số điện thoại liên hệ *</label>
                      <input
                        className="appointment__input"
                        value={form.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>

                    <div className="appointment__row">
                      <label className="appointment__label">Địa chỉ Email (nếu có)</label>
                      <input
                        className="appointment__input"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>

                    <div className="appointment__row">
                      <label className="appointment__label">Tên thú cưng *</label>
                      <input
                        className="appointment__input"
                        value={form.petName}
                        onChange={(e) => handleInputChange("petName", e.target.value)}
                      />
                    </div>

                    <div className="appointment__row">
                      <label className="appointment__label">Loại thú cưng (Ví dụ: Chó, Mèo) *</label>
                      <input
                        className="appointment__input"
                        value={form.petType}
                        onChange={(e) => handleInputChange("petType", e.target.value)}
                      />
                    </div>

                    <div className="appointment__row appointment__row--two">
                      <div>
                        <label className="appointment__label">Ngày hẹn *</label>
                        <input
                          className="appointment__input"
                          type="date"
                          min={minDateString} // ĐÃ THÊM: Khóa cứng, không cho người dùng chọn ngày quá khứ
                          value={form.appointmentDate}
                          onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="appointment__label">Giờ hẹn *</label>
                        <select
                          className="appointment__input booking-time-select"
                          value={form.appointmentTime}
                          onChange={(e) => handleInputChange("appointmentTime", e.target.value)}
                        >
                          <option value="">Chọn giờ hẹn</option>
                          {/* ĐÃ SỬA: Thu hẹp danh sách khung giờ trống chuẩn khung 08:00 - 17:00 của hệ thống */}
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
                    </div>

                    <div className="appointment__row">
                      <label className="appointment__label">Ghi chú yêu cầu đặc biệt</label>
                      <textarea
                        className="appointment__textarea"
                        value={form.note}
                        onChange={(e) => handleInputChange("note", e.target.value)}
                        placeholder="Nhập ghi chú sức khỏe hoặc yêu cầu cắt tỉa lông riêng biệt cho bé (nếu có)"
                      />
                    </div>

                    {displayError && <p className="appointment__error">{displayError}</p>}

                    <div className="appointment__actions">
                      <button className="appointment__btn-primary" onClick={handleConfirm} disabled={loading}>
                        Tiếp tục xác nhận
                      </button>
                      <button className="appointment__btn-secondary" onClick={() => navigate("/services")} disabled={loading}>
                        Hủy bỏ
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="appointment__confirm">
                      <h2 className="appointment__confirmTitle">Tóm tắt thông tin đặt lịch</h2>
                      <div className="appointment__confirmGrid">
                        <div className="appointment__kv"><span>Dịch vụ sử dụng</span><strong>{computedSummary?.serviceName ?? ""}</strong></div>
                        <div className="appointment__kv"><span>Chi phí niêm yết</span><strong>{computedSummary?.servicePrice.toLocaleString("vi-VN") ?? ""}đ</strong></div>
                        <div className="appointment__kv"><span>Thời gian thực hiện dự kiến</span><strong>{computedSummary?.serviceDuration ?? ""} phút</strong></div>
                        <div className="appointment__kv"><span>Họ tên chủ nuôi</span><strong>{form.customerName}</strong></div>
                        <div className="appointment__kv"><span>Số điện thoại</span><strong>{form.phone}</strong></div>
                        <div className="appointment__kv"><span>Địa chỉ Email</span><strong>{form.email || "— Khách vãng lai —"}</strong></div>
                        <div className="appointment__kv"><span>Tên bé cưng</span><strong>{form.petName}</strong></div>
                        <div className="appointment__kv"><span>Chủng loại thú cưng</span><strong>{form.petType}</strong></div>
                        <div className="appointment__kv"><span>Ngày hẹn đến</span><strong>{form.appointmentDate}</strong></div>
                        <div className="appointment__kv"><span>Khung giờ bắt đầu</span><strong>{form.appointmentTime}</strong></div>
                        <div className="appointment__kv"><span>Yêu cầu dặn dò</span><strong>{form.note || "— Không có —"}</strong></div>
                        <div className="appointment__kv"><span>Trạng thái hồ sơ</span><strong>Chờ hệ thống xác nhận</strong></div>
                      </div>

                      {displayError && <p className="appointment__error">{displayError}</p>}

                      <div className="appointment__actions">
                        <button className="appointment__btn-primary" onClick={handleSubmit} disabled={loading}>
                          {loading ? "Đang xử lý đặt chỗ..." : "Gửi thông tin đặt lịch"}
                        </button>
                        <button className="appointment__btn-secondary" onClick={() => setStep("form")} disabled={loading}>
                          Quay lại chỉnh sửa Form
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};