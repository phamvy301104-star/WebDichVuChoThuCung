import React from "react";
import { Service } from "@types/index";

interface ServiceCardProps {
  service: Service;
  onBook?: (serviceId: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onBook,
}) => {
  return (
    <div className="service-card">
      {service.image && <img src={service.image} alt={service.name} />}
      <div className="service-info">
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <div className="service-meta">
          <span className="price">${service.price}</span>
          <span className="duration">⏱️ {service.duration} phút</span>
          <span className="rating">⭐ {service.rating}</span>
        </div>
        {onBook && (
          <button onClick={() => onBook(service.id)} className="btn-book">
            Đặt lịch
          </button>
        )}
      </div>
    </div>
  );
};
