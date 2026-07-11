import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Common/Header";
import { Footer } from "@/components/Common/Footer";
import { serviceService } from "@/services/serviceService";
import type { Service } from "@/types/service";

const CATEGORIES = [
  { key: "all", label: "Tất cả dịch vụ", icon: "🐾" },
  { key: "Spa", label: "Spa & Grooming", icon: "✂️" },
  { key: "Y tế", label: "Khám bệnh & Y tế", icon: "🩺" },
];

// Dữ liệu mẫu hiển thị khi backend chưa kết nối
const MOCK_SERVICES: Partial<Service>[] = [
  { _id: 's1', name: 'Tắm & Cắt lông', category: 'Spa', price: 150000, duration: 90, petTypes: ['Chó','Mèo'], image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=220&fit=crop&auto=format', description: 'Tắm sạch, cắt tỉa lông đẹp, vệ sinh tai, cắt móng chuyên nghiệp.' },
  { _id: 's2', name: 'Spa toàn thân Premium', category: 'Spa', price: 280000, duration: 120, petTypes: ['Chó','Mèo'], image: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=400&h=220&fit=crop&auto=format', description: 'Tắm gội + ủ lông + massage + nước hoa thú cưng cao cấp.' },
  { _id: 's3', name: 'Cắt lông tạo kiểu', category: 'Spa', price: 200000, duration: 60, petTypes: ['Chó'], image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=220&fit=crop&auto=format', description: 'Cắt tỉa tạo kiểu theo yêu cầu, đẹp và giữ form lâu.' },
  { _id: 's4', name: 'Khám sức khoẻ tổng quát', category: 'Y tế', price: 200000, duration: 30, petTypes: ['Chó','Mèo','Thỏ'], image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=400&h=220&fit=crop&auto=format', description: 'Kiểm tra sức khoẻ toàn diện, tư vấn dinh dưỡng và phòng bệnh.' },
  { _id: 's5', name: 'Tiêm phòng vaccine', category: 'Y tế', price: 250000, duration: 15, petTypes: ['Chó','Mèo'], image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=220&fit=crop&auto=format', description: 'Tiêm đầy đủ các loại vaccine theo lịch, có theo dõi phản ứng.' },
  { _id: 's6', name: 'Vệ sinh tai & mắt', category: 'Spa', price: 50000, duration: 20, petTypes: ['Chó','Mèo'], image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=220&fit=crop&auto=format', description: 'Làm sạch tai, mắt nhẹ nhàng, ngăn ngừa viêm nhiễm hiệu quả.' },
  { _id: 's7', name: 'Triệt sản & phẫu thuật', category: 'Y tế', price: 1500000, duration: 120, petTypes: ['Chó','Mèo'], image: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=220&fit=crop&auto=format', description: 'Phẫu thuật triệt sản an toàn bởi bác sĩ thú y có chuyên môn cao.' },
  { _id: 's8', name: 'Tẩy giun & xét nghiệm', category: 'Y tế', price: 180000, duration: 30, petTypes: ['Chó','Mèo','Thỏ'], image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400&h=220&fit=crop&auto=format', description: 'Tẩy giun định kỳ, xét nghiệm máu và kiểm tra ký sinh trùng.' },
];

const getServiceIcon = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes("tắm") || n.includes("vệ sinh")) return "🛁";
  if (n.includes("cắt") || n.includes("grooming") || n.includes("spa")) return "✂️";
  if (n.includes("khám") || n.includes("bệnh")) return "🩺";
  if (n.includes("tiêm") || n.includes("vaccine")) return "💉";
  return "🐾";
};

const PAGE_SIZE = 6;
type SortKey = "popular" | "price_asc" | "price_desc" | "duration";

export const ServiceListPage: React.FC = () => {
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [page, setPage] = useState(1);

  useEffect(() => {
    serviceService
      .getServices()
      .then(data => setServices(data.length > 0 ? data : MOCK_SERVICES as Service[]))
      .catch(() => setServices(MOCK_SERVICES as Service[]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { 
    setPage(1); 
  }, [search, activeCategory, sort]);

  // Bộ lọc Client mượt mà xử lý phân loại dữ liệu ẩn
  const filtered = useMemo(() => {
    let list = [...services].filter((s) => s.status !== 'INACTIVE');

    // ĐÃ SỬA: Lọc trực tiếp bằng thuộc tính s.category chuẩn của thực thể DB
    if (activeCategory !== "all") {
      list = list.filter((s) => s.category === activeCategory);
    }

    if (search.trim()) {
      const kw = search.toLowerCase();
      list = list.filter((s) =>
        s.name.toLowerCase().includes(kw) || s.description.toLowerCase().includes(kw)
      );
    }

    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "duration") list.sort((a, b) => a.duration - b.duration);
    else list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [services, activeCategory, search, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const scrollToList = () => {
    document.getElementById("services-list")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Header />

      {/* HERO BANNER SECTION */}
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
              Đội ngũ bác sĩ thú y và groomer giàu kinh nghiệm, tận tâm mang lại trải nghiệm tốt nhất cho người bạn lông xù của bạn.
            </p>
            <div className="services-hero__cta">
              <button className="services-hero__btn-primary" onClick={scrollToList}>
                Đặt lịch ngay
              </button>
              <button className="services-hero__btn-outline" onClick={() => navigate("/my-appointments")}>
                Lịch hẹn của tôi
              </button>
            </div>
            <div className="services-hero__stats">
              <div className="services-hero__stat"><strong>500+</strong><span>Khách hàng</span></div>
              <div className="services-hero__stat-div" />
              <div className="services-hero__stat"><strong>4.9★</strong><span>Đánh giá</span></div>
              <div className="services-hero__stat-div" />
              <div className="services-hero__stat"><strong>10+</strong><span>Chuyên gia</span></div>
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

      {/* MAIN LIST BODY SECTION */}
      <div className="services-page-body" id="services-list">
        <div className="services-wrap">

          {/* Tìm kiếm và Sắp xếp */}
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

          {/* Thẻ Pills phân loại danh mục */}
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

          <div className="services-list-head">
            <h2 className="services-list-title">
              {activeCategory === "all" ? "Tất cả dịch vụ" : CATEGORIES.find(c => c.key === activeCategory)?.label}
            </h2>
            <span className="services-list-count">
              {loading ? "Đang tải..." : `${filtered.length} dịch vụ`}
            </span>
          </div>

          {loading ? (
            <div className="services-state">
              <div className="services-spinner" />
              <p>Đang đồng bộ danh sách dịch vụ...</p>
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
                        <span className="services-card__badge">{service.category}</span>
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
                      {/* ĐÃ SỬA: Loại bỏ thuộc tính id="service-list" trùng lặp vi phạm W3C */}
                      <div className="services-card__footer">
                        <button
                          className="services-card__btn-detail"
                          onClick={() => navigate(`/services/${id}`)} // ĐÃ SỬA: Dùng trực tiếp thuộc tính id chuẩn hóa sạch
                        >
                          Xem chi tiết
                        </button>
                        <button
                          className="services-card__btn-book"
                          onClick={() => navigate(`/booking/${id}`)} // ĐÃ SỬA: Cho phép tất cả đi qua Form đặt chỗ vãng lai
                        >
                          Đặt lịch
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Phân trang */}
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