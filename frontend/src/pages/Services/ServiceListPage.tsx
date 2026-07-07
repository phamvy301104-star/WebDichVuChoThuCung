import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Header } from "@components/Common/Header";
import { Footer } from "@components/Common/Footer";
import { serviceService } from "@services/serviceService";
import { RootState } from "@stores/store";
import type { Service } from "@/types";

const CATEGORIES = [
  { key: "all", label: "Tất cả", icon: "🐾" },
  { key: "spa", label: "Spa & Grooming", icon: "✂️" },
  { key: "bath", label: "Tắm & Vệ sinh", icon: "🛁" },
  { key: "medical", label: "Khám & Điều trị", icon: "🩺" },
  { key: "hotel", label: "Lưu trú", icon: "🏨" },
  { key: "transport", label: "Vận chuyển", icon: "🚗" },
  { key: "training", label: "Huấn luyện", icon: "🎓" },
];

const getCategoryKey = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes("spa") || n.includes("grooming") || n.includes("cắt lông")) return "spa";
  if (n.includes("tắm") || n.includes("vệ sinh")) return "bath";
  if (n.includes("khám") || n.includes("tiêm") || n.includes("điều trị") || n.includes("bệnh")) return "medical";
  if (n.includes("lưu trú") || n.includes("khách sạn")) return "hotel";
  if (n.includes("vận chuyển")) return "transport";
  if (n.includes("huấn luyện") || n.includes("training")) return "training";
  return "spa";
};

const getCategoryLabel = (key: string) =>
  CATEGORIES.find((c) => c.key === key)?.label ?? "Dịch vụ";

const getServiceIcon = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes("tắm")) return "🛁";
  if (n.includes("cắt") || n.includes("grooming") || n.includes("spa")) return "✂️";
  if (n.includes("khám") || n.includes("bệnh")) return "🩺";
  if (n.includes("tiêm")) return "💉";
  if (n.includes("lưu trú") || n.includes("khách sạn")) return "🏨";
  if (n.includes("vận chuyển")) return "🚗";
  if (n.includes("huấn luyện")) return "🎓";
  return "🐾";
};

const PAGE_SIZE = 6;
type SortKey = "popular" | "price_asc" | "price_desc" | "duration";

export const ServiceListPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    serviceService
      .getServices()
      .then(setServices)
      .catch((err: any) =>
        setError(err.response?.data?.message || err.message || "Lỗi khi tải dịch vụ")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setPage(1); }, [search, activeCategory, sort]);

  const filtered = useMemo(() => {
    // Logic yêu cầu: chỉ ẩn service status INACTIVE.
    // Admin xem toàn bộ, user chỉ không thấy INACTIVE (không ẩn nhầm các service còn lại).
    let list = [...services].filter((s) => (s as any)?.status !== 'INACTIVE');

    if (activeCategory !== "all")
      list = list.filter((s) => getCategoryKey(s.name) === activeCategory);

    if (search.trim())
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.description.toLowerCase().includes(search.toLowerCase())
      );
    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "duration") list.sort((a, b) => a.duration - b.duration);
    else list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [services, activeCategory, search, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleBook = (serviceId: string) => {
    if (!isAuthenticated) {
      navigate(`/auth/login?redirect=/services&serviceId=${serviceId}`);
      return;
    }
    navigate(`/appointments?serviceId=${serviceId}`);
  };

  const scrollToList = () =>
    document.getElementById("services-list")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="services-hero">
        <div className="services-wrap">
          <div className="services-hero__content">
            <nav className="services-breadcrumb">
              <span>Trang chủ</span>
              <span className="services-breadcrumb__sep">›</span>
              <span className="services-breadcrumb__cur">Dịch vụ &amp; Đặt lịch</span>
            </nav>
            <h1 className="services-hero__title">
              Chăm sóc thú cưng <span className="services-hero__accent">toàn diện</span>
              <br />ấm áp và chuyên nghiệp
            </h1>
            <p className="services-hero__desc">
              Đội ngũ bác sĩ thú y và groomer giàu kinh nghiệm, tận tâm mang lại
              trải nghiệm tốt nhất cho người bạn lông xù của bạn.
            </p>
            <div className="services-hero__cta">
              <button
                className="services-hero__btn-primary"
                onClick={() => {
                  // yêu cầu: nếu chưa chọn dịch vụ thì không tạo "đặt lịch ngay", chỉ scroll xuống danh sách
                  scrollToList();
                }}
              >
                Đặt lịch ngay
              </button>
              <button
                className="services-hero__btn-outline"
                onClick={() => navigate("/my-appointments")}
              >
                Lịch hẹn của tôi
              </button>

            </div>
            <div className="services-hero__stats">
              <div className="services-hero__stat">
                <strong>500+</strong><span>Khách hàng</span>
              </div>
              <div className="services-hero__stat-div" />
              <div className="services-hero__stat">
                <strong>4.9★</strong><span>Đánh giá</span>
              </div>
              <div className="services-hero__stat-div" />
              <div className="services-hero__stat">
                <strong>10+</strong><span>Chuyên gia</span>
              </div>
            </div>
          </div>
          <div className="services-hero__visual">
            <div className="services-hero__blob">🐶</div>
            <div className="services-hero__tag services-hero__tag--1">✂️ Grooming</div>
            <div className="services-hero__tag services-hero__tag--2">🩺 Khám bệnh</div>
            <div className="services-hero__tag services-hero__tag--3">💉 Tiêm phòng</div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="services-page-body" id="services-list">
        <div className="services-wrap">

          {/* Search + Sort bar */}
          <div className="services-toolbar">
            <div className="services-search-wrap">
              <span className="services-search-ico">🔍</span>
              <input
                className="services-search-input"
                placeholder="Tìm kiếm dịch vụ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="services-sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="popular">Phổ biến nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="duration">Thời gian ngắn nhất</option>
            </select>
          </div>

          {/* Category pills */}
          <div className="services-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className={`services-pill${activeCategory === cat.key ? " services-pill--active" : ""}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>

          {/* List header */}
          <div className="services-list-head">
            <h2 className="services-list-title">
              {activeCategory === "all" ? "Tất cả dịch vụ" : getCategoryLabel(activeCategory)}
            </h2>
            <span className="services-list-count">
              {loading ? "Đang tải..." : `${filtered.length} dịch vụ`}
            </span>
          </div>

          {/* States */}
          {loading ? (
            <div className="services-state">
              <div className="services-spinner" />
              <p>Đang tải dịch vụ...</p>
            </div>
          ) : error ? (
            <div className="services-state services-state--error">
              <span>⚠️</span><p>{error}</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="services-state">
              <span>🔍</span><p>Không tìm thấy dịch vụ phù hợp.</p>
            </div>
          ) : (
            <>
              <div className="services-grid">
                {paginated.map((service) => {
                  const id = service.id || "";
                  const catKey = getCategoryKey(service.name);
                  const catLabel = getCategoryLabel(catKey);
                  return (
                    <div key={id} className="services-card">
                      <div className="services-card__media">
                        {service.image ? (
                          <img src={service.image} alt={service.name} className="services-card__img" />
                        ) : (
                          <div className="services-card__icon-wrap">
                            <span className="services-card__icon">{getServiceIcon(service.name)}</span>
                          </div>
                        )}
                        <span className="services-card__badge">{catLabel}</span>
                      </div>
                      <div className="services-card__body">
                        <h3 className="services-card__name">{service.name}</h3>
                        <p className="services-card__desc">{service.description}</p>
                        <div className="services-card__meta">
                          <span>⏱ {service.duration} phút</span>
                          {service.rating > 0 && <span>⭐ {service.rating.toFixed(1)}</span>}
                        </div>
                        <div className="services-card__price">
                          {service.price.toLocaleString("vi-VN")}<span>đ</span>
                        </div>
                      </div>
                      <div className="services-card__footer" id="service-list">
                        <button
                          className="services-card__btn-detail"
                          onClick={() => {
                            const serviceId = (service as any)?._id || (service as any)?.id;
                            if (!serviceId) {
                              console.error("Không tìm thấy serviceId:", service);
                              return;
                            }
                            navigate(`/services/${serviceId}`);
                          }}
                        >
                          Xem chi tiết
                        </button>
                        <button
                          className="services-card__btn-book"
                          onClick={() => {
                            const serviceId = (service as any)?._id || (service as any)?.id;
                            if (!serviceId) {
                              console.error("Không tìm thấy serviceId:", service);
                              return;
                            }
                            navigate(`/booking/${serviceId}`);
                          }}
                        >
                          Đặt lịch
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="services-pagination">
                <p className="services-pagination__info">
                  Hiển thị {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} trong {filtered.length} dịch vụ
                </p>
                <div className="services-pagination__btns">
                  <button className="services-pg-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`services-pg-btn${page === p ? " services-pg-btn--active" : ""}`}
                      onClick={() => setPage(p)}
                    >{p}</button>
                  ))}
                  <button className="services-pg-btn" disabled={page === totalPages || totalPages === 0} onClick={() => setPage((p) => p + 1)}>›</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};
