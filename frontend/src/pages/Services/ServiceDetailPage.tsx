import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Common/Header";
import { Footer } from "@/components/Common/Footer";
import { serviceService } from "@/services/serviceService";
import type { Service } from "@/types/service";

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Mã nhận diện dịch vụ không hợp lệ.");
      setLoading(false);
      return;
    }

    setLoading(true);
    serviceService
      .getServiceById(id)
      .then((s) => setService(s ?? null))
      .catch((err: any) => setError(err.message || "Lỗi tải chi tiết dịch vụ."))
      .finally(() => setLoading(false));
  }, [id]);

  // ĐÃ SỬA: Chuyển hướng trực tiếp sang trang Form đặt chỗ, hỗ trợ tuyệt đối khách vãng lai
  const handleBook = () => {
    if (!service?.id) return;
    navigate(`/booking/${service.id}`);
  };

  return (
    <>
      <Header />

      <main className="services-detail">
        <div className="services-detail-wrap">
          {/* Breadcrumb định hướng */}
          <nav className="services-detail-breadcrumb" aria-label="breadcrumb">
            <button className="services-detail-breadcrumb__link" onClick={() => navigate("/services")}>
              Danh mục dịch vụ
            </button>
            <span className="services-detail-breadcrumb__sep">›</span>
            <span className="services-detail-breadcrumb__cur">{loading ? "Đang xử lý..." : service?.name ?? "Chi tiết"}</span>
          </nav>

          {loading ? (
            <div className="services-detail__state">
              <div className="services-detail__spinner" aria-hidden="true" />
              <p className="services-detail__stateText">Đang tải thông tin dịch vụ...</p>
            </div>
          ) : error ? (
            <div className="services-detail__state services-detail__state--error">
              <div className="services-detail__stateIcon" aria-hidden="true">⚠️</div>
              <p className="services-detail__stateText">{error}</p>
              <button className="services-detail__btn-secondary" onClick={() => navigate("/services")}>
                Quay lại danh sách
              </button>
            </div>
          ) : service ? (
            <section className="services-detail__card" aria-label="Chi tiết dịch vụ">
              <aside className="services-detail__media">
                {service.image ? (
                  <img className="services-detail__img" src={service.image} alt={service.name} />
                ) : (
                  <div className="services-detail__img services-detail__img--fallback" aria-hidden="true">🐾</div>
                )}

                <div className="services-detail__mediaOverlay">
                  {/* ĐÃ SỬA: Đọc trực tiếp trường category sạch từ database */}
                  <span className="services-detail__badge">{service.category}</span>
                </div>
              </aside>

              <div className="services-detail__content">
                <div className="services-detail__categoryRow">
                  <span className="services-detail__categoryIcon" aria-hidden="true">🏷️</span>
                  <span className="services-detail__categoryText">{service.category}</span>
                </div>

                <h1 className="services-detail__title">{service.name}</h1>
                <p className="services-detail__desc">{service.description}</p>

                <div className="services-detail__facts" role="list">
                  <div className="services-detail__fact" role="listitem">
                    <span className="services-detail__factLabel">⏱ Thời gian thực hiện</span>
                    <span className="services-detail__factValue">{service.duration} phút</span>
                  </div>

                  {service.rating > 0 && (
                    <div className="services-detail__fact" role="listitem">
                      <span className="services-detail__factLabel">⭐ Đánh giá trung bình</span>
                      <span className="services-detail__factValue">{service.rating.toFixed(1)} / 5 ({service.reviews} đánh giá)</span>
                    </div>
                  )}

                  <div className="services-detail__fact" role="listitem">
                    <span className="services-detail__factLabel">💰 Chi phí dịch vụ</span>
                    <span className="services-detail__factValue">{service.price.toLocaleString("vi-VN")}đ</span>
                  </div>
                </div>

                <div className="services-detail__actions">
                  <button className="services-detail__btn-primary" onClick={handleBook}>
                    Đặt lịch dịch vụ này ngay
                  </button>
                  <button className="services-detail__btn-secondary" onClick={() => navigate("/services")}>
                    Quay lại danh sách dịch vụ
                  </button>
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </main>

      <Footer />
    </>
  );
};