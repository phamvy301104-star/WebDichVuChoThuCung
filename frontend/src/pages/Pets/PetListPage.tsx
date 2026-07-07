import React, { useEffect, useState } from "react";
import { Header } from "@components/Common/Header";
import { Footer } from "@components/Common/Footer";
import { petService } from "@services/petService";
import type { Pet } from "@/types";

export const PetListPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const salePets = await petService.getPetsForSale();
        const adoptionPets = await petService.getPetsForAdoption();
        setPets([...salePets, ...adoptionPets]);
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "Lỗi khi tải thú cưng",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

  return (
    <>
      <Header />
      <main className="page-container">
        <div
          style={{
            textAlign: "center",
            padding: "48px 20px 32px",
            background: "linear-gradient(135deg,#3BB77E,#F6921E)",
            borderRadius: 16,
            color: "#fff",
            marginBottom: 32,
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🐾</div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 10px" }}>
            Nhận nuôi thú cưng
          </h1>
          <p style={{ fontSize: "1.05rem", opacity: 0.9, margin: 0 }}>
            Mỗi thú cưng đều xứng đáng có một ngôi nhà yêu thương ❤️
          </p>
        </div>

        {loading ? (
          <div className="page-empty-state">Đang tải thú cưng...</div>
        ) : error ? (
          <div className="page-empty-state" style={{ color: "#ef4444" }}>
            {error}
          </div>
        ) : pets.length === 0 ? (
          <div className="page-empty-state">Không có thú cưng nào.</div>
        ) : (
          <div className="list-grid">
            {pets.map((pet) => (
              <div key={pet.id || pet._id} className="card">
                <div className="card-icon">🐾</div>
                <h3>{pet.name}</h3>
                <p>{pet.description}</p>
                <div className="card-meta">
                  <span>Giống: {pet.breed}</span>
                  <span>Tuổi: {pet.age}</span>
                </div>
                <div
                  style={{ marginTop: 8, fontSize: "0.9rem", color: "#6b7280" }}
                >
                  Trạng thái:{" "}
                  {pet.status === "for_sale" ? "Đang bán" : "Nhận nuôi"}
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
