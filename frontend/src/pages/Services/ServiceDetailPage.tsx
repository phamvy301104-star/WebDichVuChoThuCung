import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Header } from "@components/Common/Header";
import { Footer } from "@components/Common/Footer";
import { serviceService } from "@services/serviceService";
import type { RootState } from "@stores/store";
import type { Service } from "@/types";


export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [service, setService] = useState<Service | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Không tìm thấy dịch vụ");
      setLoading(false);
      return;
    }

    setLoading(true);
    serviceService
      .getServiceById(id)
      .then((s) => setService((s as Service | undefined) ?? null))
      .catch((err: any) =>
        setError(err.response?.data?.message || err.message || "Lỗi khi tải dịch vụ")
      )
      .finally(() => setLoading(false));
  }, [id]);


  const categoryLabel = useMemo(() => {
    if (!service) return "";
    // Backend trả name/description; FE mapping giống ServiceListPage
    const n = service.name.toLowerCase();
    if (n.includes("spa") || n.includes("grooming") || n.includes("cắt lông")) return "Spa & Grooming";
    if (n.includes("tắm") || n.includes("vệ sinh")) return "Tắm & Vệ sinh";
    if (n.includes("khám") || n.includes("tiêm") || n.includes("điều trị") || n.includes("bệnh")) return "Khám & Điều trị";
    if (n.includes("lưu trú") || n.includes("khách sạn")) return "Lưu trú & Khách sạn";
    if (n.includes("vận chuyển")) return "Vận chuyển";
    if (n.includes("huấn luyện") || n.includes("training")) return "Huấn luyện";
    return "Dịch vụ";
  }, [service]);

  const handleBook = () => {
    if (!service) return;
    if (!isAuthenticated) {
      const serviceId = (service as any)?._id ?? (service as any)?.id ?? id;
      navigate(`/auth/login?redirect=/booking/${serviceId ?? ""}&serviceId=${serviceId ?? ""}`);
      return;
    }

    const serviceId = (service as any)?._id ?? (service as any)?.id ?? id;
    navigate(`/booking/${serviceId}`);
  };

  return (
    <>
      <Header />

      <main className="services-detail">
        <div className="services-detail-wrap">
          {/* Breadcrumb */}
          <nav className="services-detail-breadcrumb" aria-label="breadcrumb">
            <button className="services-detail-breadcrumb__link" onClick={() => navigate("/services")}>
              Dịch vụ
            </button>
            <span className="services-detail-breadcrumb__sep">›</span>
            <span className="services-detail-breadcrumb__cur">{loading ? "Đang tải..." : service?.name ?? "Chi tiết"}</span>
          </nav>

          {loading ? (
            <div className="services-detail__state">
              <div className="services-detail__spinner" aria-hidden="true" />
              <p className="services-detail__stateText">Đang tải dịch vụ...</p>
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
                  <div className="services-detail__img services-detail__img--fallback" aria-hidden="true">
                    ✂️
                  </div>
                )}

                <div className="services-detail__mediaOverlay">
                  <span className="services-detail__badge">{categoryLabel}</span>
                </div>
              </aside>

              <div className="services-detail__content">
                <div className="services-detail__categoryRow">
                  <span className="services-detail__categoryIcon" aria-hidden="true">🐾</span>
                  <span className="services-detail__categoryText">{categoryLabel}</span>
                </div>

                <h1 className="services-detail__title">{service.name}</h1>
                <p className="services-detail__desc">{service.description}</p>

                <div className="services-detail__facts" role="list">
                  <div className="services-detail__fact" role="listitem">
                    <span className="services-detail__factLabel">⏱ Thời gian</span>
                    <span className="services-detail__factValue">{service.duration} phút</span>
                  </div>

                  {service.rating > 0 && (
                    <div className="services-detail__fact" role="listitem">
                      <span className="services-detail__factLabel">⭐ Đánh giá</span>
                      <span className="services-detail__factValue">{service.rating.toFixed(1)} / 5</span>
                    </div>
                  )}

                  <div className="services-detail__fact" role="listitem">
                    <span className="services-detail__factLabel">💰 Giá</span>
                    <span className="services-detail__factValue">{service.price.toLocaleString("vi-VN")}đ</span>
                  </div>
                </div>

                <div className="services-detail__actions">
                  <button className="services-detail__btn-primary" onClick={handleBook}>
                    Đặt lịch dịch vụ này
                  </button>
                  <button className="services-detail__btn-secondary" onClick={() => navigate("/services")}>
                    Quay lại danh sách
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

