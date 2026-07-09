import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Header } from "@components/Common/Header";
import { Footer } from "@components/Common/Footer";
import { serviceService } from "@services/serviceService";
import { appointmentService } from "@services/appointmentService";
import type { RootState } from "@stores/store";
import type { Service } from "@/types";

type Step = "form" | "confirm";

type AppointmentFormState = {
  serviceId: string;
  customerName: string;
  phone: string;
  email: string;
  petName: string;
  petType: string;
  date: string;
  time: string;
  notes: string;
};

export const AppointmentFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [loadingService, setLoadingService] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState<Step>("form");

  const { serviceId } = useParams();


  const [form, setForm] = useState<AppointmentFormState>({
    serviceId: serviceId ?? "",
    customerName: "",
    phone: "",
    email: "",
    petName: "",
    petType: "",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      // vẫn bảo vệ đăng nhập
      navigate(`/auth/login?redirect=/booking/${serviceId ?? ""}&serviceId=${serviceId ?? ""}`);
      return;
    }

    if (!form.serviceId) {
      setError("Thiếu serviceId");
      return;
    }

    setLoadingService(true);
    serviceService
      .getServiceById(form.serviceId)
      .then((s) => setService(s ?? null))
      .catch((err: any) => setError(err.response?.data?.message || err.message || "Lỗi tải dịch vụ"))
      .finally(() => setLoadingService(false));
  }, [form.serviceId, isAuthenticated, navigate]);

  useEffect(() => {
    // khi route param thay đổi, sync lại form.serviceId
    if (serviceId && form.serviceId !== serviceId) {
      setForm((prev) => ({ ...prev, serviceId: serviceId ?? "" }));
    }
  }, [serviceId, form.serviceId]);

  const computedSummary = useMemo(() => {
    if (!service) return null;
    return {
      serviceName: service.name,
      servicePrice: service.price,
      serviceDuration: service.duration,
    };
  }, [service]);

  const validate = (): string | null => {
    if (!form.serviceId) return "Thiếu dịch vụ";
    if (!form.customerName.trim()) return "Vui lòng nhập họ tên";
    if (!form.phone.trim()) return "Vui lòng nhập số điện thoại";
    if (!form.petName.trim()) return "Vui lòng nhập tên thú cưng";
    if (!form.petType.trim()) return "Vui lòng nhập loại thú cưng";
    if (!form.date) return "Vui lòng chọn ngày hẹn";
    if (!form.time) return "Vui lòng chọn giờ hẹn";
    return null;
  };

  const handleConfirm = () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    setStep("confirm");
  };

  const handleSubmit = async () => {
  const v = validate();

  if (v) {
    setError(v);
    setStep("form");
    return;
  }

  try {
    setError(null);

    await appointmentService.createAppointment({
      serviceId: form.serviceId,
      customerName: form.customerName,
      phone: form.phone,
      email: form.email || undefined,
      petName: form.petName,
      petType: form.petType,
      date: form.date,
      time: form.time,
      notes: form.notes || undefined,
    });

    navigate("/my-appointments");
  } catch (err: any) {
    setError(
      err.response?.data?.message ||
      err.message ||
      "Gửi lịch hẹn thất bại"
    );
  }
};

  const handleCancel = () => {
    navigate("/services");
  };

  if (error && !service && !loadingService) {
    return (
      <>
        <Header />
        <main className="appointment">
          <div className="appointment__state appointment__state--error">
            <p>{error}</p>
            <button className="appointment__back" onClick={() => navigate("/services")}>
              Quay lại
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
            <p className="appointment__sub">Vui lòng điền thông tin để đặt lịch hẹn.</p>
          </div>

          {loadingService ? (
            <div className="appointment__state">
              <div className="appointment__spinner" />
              <p>Đang tải thông tin dịch vụ...</p>
            </div>
          ) : (
            <>
              <div className="appointment-booking">
                <section className="appointment-booking__left">
                  <div className="appointment__form-head">
                    <span className={`appointment__step${step === "form" ? " appointment__step--active" : ""}`}>1</span>
                    <span className="appointment__divider">/</span>
                    <span className={`appointment__step${step === "confirm" ? " appointment__step--active" : ""}`}>2</span>
                  </div>

                  <div className="appointment__serviceLine">
                    <span className="appointment__serviceLabel">Dịch vụ</span>
                    <span className="appointment__serviceValue">{service?.name ?? ""}</span>
                  </div>

                  {step === "form" ? (
                    <>
                      <div className="appointment__row">
                        <label className="appointment__label">Họ tên khách</label>
                        <input
                          className="appointment__input"
                          value={form.customerName}
                          onChange={(e) => setForm((p) => ({ ...p, customerName: e.target.value }))}
                        />
                      </div>

                      <div className="appointment__row">
                        <label className="appointment__label">Số điện thoại</label>
                        <input
                          className="appointment__input"
                          value={form.phone}
                          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                        />
                      </div>

                      <div className="appointment__row">
                        <label className="appointment__label">Email (nếu có)</label>
                        <input
                          className="appointment__input"
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        />
                      </div>

                      <div className="appointment__row">
                        <label className="appointment__label">Tên thú cưng</label>
                        <input
                          className="appointment__input"
                          value={form.petName}
                          onChange={(e) => setForm((p) => ({ ...p, petName: e.target.value }))}
                        />
                      </div>

                      <div className="appointment__row">
                        <label className="appointment__label">Loại thú cưng</label>
                        <input
                          className="appointment__input"
                          value={form.petType}
                          onChange={(e) => setForm((p) => ({ ...p, petType: e.target.value }))}
                        />
                      </div>

                      <div className="appointment__row appointment__row--two">
                        <div>
                          <label className="appointment__label">Ngày hẹn</label>
                          <input
                            className="appointment__input"
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="appointment__label">Giờ hẹn</label>
                          <select
                            className="appointment__input booking-time-select"
                            value={form.time}
                            onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                          >
                            <option value="">Chọn giờ hẹn</option>
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
                            <option value="17:30">17:30</option>
                            <option value="18:00">18:00</option>
                            <option value="18:30">18:30</option>
                            <option value="19:00">19:00</option>
                            <option value="19:30">19:30</option>
                            <option value="20:00">20:00</option>
                            <option value="20:30">20:30</option>
                            <option value="21:00">21:00</option>
                          </select>
                        </div>
                      </div>

                      <div className="appointment__row">
                        <label className="appointment__label">Ghi chú</label>
                        <textarea
                          className="appointment__textarea"
                          value={form.notes}
                          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                          placeholder="Nhập ghi chú (nếu có)"
                        />
                      </div>

                      {error && <p className="appointment__error">{error}</p>}

                      <div className="appointment__actions">
                        <button className="appointment__btn-primary" onClick={handleConfirm}>
                          Xác nhận đặt lịch
                        </button>
                        <button className="appointment__btn-secondary" onClick={handleCancel}>
                          Hủy
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="appointment__confirm">
                        <h2 className="appointment__confirmTitle">Tóm tắt thông tin</h2>
                        <div className="appointment__confirmGrid">
                          <div className="appointment__kv"><span>Dịch vụ</span><strong>{computedSummary?.serviceName ?? ""}</strong></div>
                          <div className="appointment__kv"><span>Giá</span><strong>{computedSummary?.servicePrice.toLocaleString("vi-VN") ?? ""}đ</strong></div>
                          <div className="appointment__kv"><span>Thời gian</span><strong>{computedSummary?.serviceDuration ?? ""} phút</strong></div>
                          <div className="appointment__kv"><span>Họ tên khách</span><strong>{form.customerName}</strong></div>
                          <div className="appointment__kv"><span>Số điện thoại</span><strong>{form.phone}</strong></div>
                          <div className="appointment__kv"><span>Email</span><strong>{form.email || "—"}</strong></div>
                          <div className="appointment__kv"><span>Tên thú cưng</span><strong>{form.petName}</strong></div>
                          <div className="appointment__kv"><span>Loại thú cưng</span><strong>{form.petType}</strong></div>
                          <div className="appointment__kv"><span>Ngày hẹn</span><strong>{form.date}</strong></div>
                          <div className="appointment__kv"><span>Giờ hẹn</span><strong>{form.time}</strong></div>
                          <div className="appointment__kv"><span>Ghi chú</span><strong>{form.notes || "—"}</strong></div>
                          <div className="appointment__kv"><span>Trạng thái</span><strong>Chờ xác nhận</strong></div>
                        </div>

                        {error && <p className="appointment__error">{error}</p>}

                        <div className="appointment__actions">
                          <button className="appointment__btn-primary" onClick={handleSubmit}>
                            Gửi lịch hẹn
                          </button>
                          <button className="appointment__btn-secondary" onClick={() => setStep("form")}>
                            Hủy / chỉnh sửa
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </section>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

