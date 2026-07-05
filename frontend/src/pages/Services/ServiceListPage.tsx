import React, { useEffect, useState } from "react";
import { Header } from "@components/Common/Header";
import { Footer } from "@components/Common/Footer";
import { serviceService } from "@services/serviceService";
import type { Service } from "@/types";

export const ServiceListPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await serviceService.getServices();
        setServices(data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "Lỗi khi tải dịch vụ",
        );
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <>
      <Header />
      <main className="page-container">
        <div
          style={{
            textAlign: "center",
            padding: "48px 20px 32px",
            background: "linear-gradient(135deg,#3BB77E,#2D9B6A)",
            borderRadius: 16,
            color: "#fff",
            marginBottom: 32,
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>✂️</div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 10px" }}>
            Dịch vụ chăm sóc thú cưng
          </h1>
          <p style={{ fontSize: "1.05rem", opacity: 0.9, margin: 0 }}>
            Đội ngũ bác sĩ & groomer chuyên nghiệp, tận tâm với thú cưng của bạn
          </p>
        </div>

        {loading ? (
          <div className="page-empty-state">Đang tải dịch vụ...</div>
        ) : error ? (
          <div className="page-empty-state" style={{ color: "#ef4444" }}>
            {error}
          </div>
        ) : services.length === 0 ? (
          <div className="page-empty-state">Không có dịch vụ nào.</div>
        ) : (
          <div className="list-grid">
            {services.map((service) => (
              <div key={service.id || service._id} className="card">
                <div className="card-icon">✂️</div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="card-meta">
                  <span>Giá: {service.price.toLocaleString("vi-VN")}đ</span>
                  <span>Thời gian: {service.duration} phút</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};
