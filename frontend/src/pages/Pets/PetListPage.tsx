import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@stores/store";
import { Header } from "@components/Common/Header";
import { Footer } from "@components/Common/Footer";
import { petService } from "@services/petService";
import type { Pet } from "@/types";

export const PetListPage: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Adoption modal state
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterPhone, setRequesterPhone] = useState("");
  const [reason, setReason] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (currentUser) {
      setRequesterName(currentUser.name || "");
      setRequesterEmail(currentUser.email || "");
      setRequesterPhone(currentUser.phone || "");
    }
  }, [currentUser]);

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

  useEffect(() => {
    loadPets();
  }, []);

  const handleOpenAdoptionModal = (pet: Pet) => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập trước khi gửi yêu cầu nhận nuôi!");
      window.location.href = "/auth/login";
      return;
    }
    setSelectedPet(pet);
  };

  const handleCloseModal = () => {
    setSelectedPet(null);
    setReason("");
    setAppointmentDate("");
    setAppointmentTime("");
  };

  const handleAdoptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) return;
    const petId = selectedPet.id || selectedPet._id || "";
    if (!petId) return;

    setSubmitting(true);
    try {
      await petService.requestAdoption(petId, {
        requesterName,
        requesterEmail,
        requesterPhone,
        reason,
        appointmentDate: appointmentDate || undefined,
        appointmentTime: appointmentTime || undefined,
      });
      const isFree = !selectedPet.price || selectedPet.price === 0;
      const requestType = isFree ? "nhận nuôi" : "mua";
      showToast(`Đã gửi yêu cầu ${requestType} bé ${selectedPet.name} thành công!`);
      handleCloseModal();
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || "Gửi yêu cầu không thành công.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered pet list computation
  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const keyword = search.toLowerCase();
      const matchesSearch =
        pet.name.toLowerCase().includes(keyword) ||
        pet.breed.toLowerCase().includes(keyword) ||
        (pet.description && pet.description.toLowerCase().includes(keyword));

      const matchesSpecies =
        speciesFilter === "All" || pet.species === speciesFilter;

      const isFree = !pet.price || pet.price === 0;
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "for_adoption" && isFree) ||
        (statusFilter === "for_sale" && !isFree);

      return matchesSearch && matchesSpecies && matchesStatus;
    });
  }, [pets, search, speciesFilter, statusFilter]);

  return (
    <>
      <Header />
      <main className="page-container max-w-7xl mx-auto px-4 py-8 relative">
        {toast && (
          <div
            className={`fixed top-6 right-6 bg-white text-slate-800 border-l-4 ${toast.type === "error" ? "border-red-500" : "border-emerald-500"} px-5 py-4 rounded-xl shadow-2xl z-[9999] flex items-center gap-3 animate-slide-left font-bold text-sm`}
            style={{ position: "fixed", top: "24px", right: "24px" }}
          >
            <span>{toast.type === "success" ? "✅" : "❌"}</span>
            <span>{toast.message}</span>
          </div>
        )}

        {/* Hero Banner */}
        <div
          style={{
            textAlign: "center",
            padding: "54px 20px 48px",
            background: "linear-gradient(135deg, #3BB77E, #2D9B6A)",
            borderRadius: 24,
            color: "#fff",
            marginBottom: 32,
            boxShadow: "0 10px 30px rgba(59, 183, 126, 0.15)",
          }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent)] pointer-events-none"></div>
          <div style={{ fontSize: "3.5rem", marginBottom: 12 }} className="animate-bounce">🐾</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.5px" }}>
            Nhận nuôi thú cưng
          </h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.95, margin: 0, fontWeight: 500 }}>
            Mỗi thú cưng đều xứng đáng có một mái ấm tràn đầy yêu thương ❤️
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-slate-800">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            <div className="relative w-full md:max-w-xs">
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3BB77E] focus:ring-1 focus:ring-[#3BB77E] transition-all bg-white text-slate-800"
                placeholder="Tìm tên hoặc giống loài..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute left-3 top-3 text-slate-400 text-sm">🔍</span>
            </div>

            {/* Species button tabs */}
            <div className="flex gap-2 flex-wrap">
              {["All", "Chó", "Mèo", "Thỏ"].map((species) => (
                <button
                  key={species}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    speciesFilter === species
                      ? "bg-gradient-to-r from-[#3BB77E] to-[#2D9B6A] text-white shadow-md shadow-emerald-100"
                      : "bg-slate-50 border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                  onClick={() => setSpeciesFilter(species)}
                >
                  {species === "All"
                    ? "Tất cả"
                    : species === "Chó"
                    ? "Chó 🐕"
                    : species === "Mèo"
                    ? "Mèo 🐱"
                    : "Thỏ 🐇"}
                </button>
              ))}
            </div>
          </div>

          {/* Status dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hình thức:</span>
            <select
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#3BB77E] bg-white text-slate-700 cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">Tất cả hình thức</option>
              <option value="for_adoption">Nhận nuôi miễn phí</option>
              <option value="for_sale">Thú cưng bán</option>
            </select>
          </div>
        </div>

        {/* Pet list grid */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-semibold text-lg">Đang tải thú cưng...</div>
        ) : error ? (
          <div className="text-center py-12 text-[#ef4444] font-semibold text-lg">{error}</div>
        ) : filteredPets.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-semibold text-lg">Không tìm thấy thú cưng nào phù hợp.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPets.map((pet) => {
              const id = pet.id || pet._id || "";
              return (
                <div
                  key={id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full group"
                >
                  <div>
                    {/* Image container */}
                    <div className="relative w-full aspect-[4/3] bg-slate-50 overflow-hidden">
                      {pet.image ? (
                        <img
                          src={pet.image}
                          alt={pet.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex justify-center items-center text-5xl bg-slate-50">
                          🐾
                        </div>
                      )}
                      {/* Status Tag */}
                      <span
                        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm z-10 text-white ${
                          (!pet.price || pet.price === 0) ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      >
                        {(!pet.price || pet.price === 0) ? "Nhận nuôi" : "Bán"}
                      </span>
                    </div>

                    {/* Content details */}
                    <div className="p-5">
                      <h3 className="text-lg font-extrabold text-[#253D4E] group-hover:text-[#3BB77E] transition-colors line-clamp-1 mb-1.5">
                        {pet.name}
                      </h3>
                      
                      <div className="flex gap-1.5 mb-3 flex-wrap">
                        <span className="inline-block px-2.5 py-0.5 bg-slate-50 text-slate-600 rounded-md text-[11px] font-bold border border-slate-100">
                          {pet.breed}
                        </span>
                        <span className="inline-block px-2.5 py-0.5 bg-slate-50 text-slate-600 rounded-md text-[11px] font-bold border border-slate-100">
                          {pet.age} tuổi
                        </span>
                      </div>

                      <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">
                        {pet.description || "Chưa có mô tả chi tiết cho bé thú cưng này."}
                      </p>
                    </div>
                  </div>

                  {/* Card bottom action */}
                  <div className="p-5 pt-0 mt-auto border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Chi phí
                      </div>
                      <div className="text-sm font-black text-[#253D4E] mt-0.5">
                        {pet.price && pet.price > 0
                          ? `${pet.price.toLocaleString("vi-VN")}đ`
                          : "Miễn phí"}
                      </div>
                    </div>

                    {!pet.price || pet.price === 0 ? (
                      <button
                        onClick={() => handleOpenAdoptionModal(pet)}
                        className="px-4 py-2 bg-gradient-to-r from-[#3BB77E] to-[#2D9B6A] hover:opacity-95 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-100 transition-all cursor-pointer whitespace-nowrap"
                      >
                        Nhận nuôi ❤️
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenAdoptionModal(pet)}
                        className="px-4 py-2 bg-gradient-to-r from-[#F6921E] to-[#D87D15] hover:opacity-95 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-100 transition-all cursor-pointer whitespace-nowrap"
                      >
                        Mua ngay 💳
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Adoption/Purchase Request Modal */}
        {selectedPet && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center overflow-y-auto p-4 z-[999]"
            style={{ position: "fixed", inset: 0 }}
          >
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl animate-fade-in text-slate-800 my-auto border border-slate-50 relative">
              <h2 className="text-xl font-extrabold text-[#253D4E] mb-1">
                {!selectedPet.price || selectedPet.price === 0 ? "Đăng ký nhận nuôi" : "Đăng ký mua thú cưng"}
              </h2>
              <p className="text-xs text-slate-400 mb-4 font-semibold">
                {!selectedPet.price || selectedPet.price === 0 
                  ? "Bạn đang gửi yêu cầu nhận nuôi bé " 
                  : "Bạn đang gửi yêu cầu mua bé "}
                <span className="text-[#3BB77E] font-black">{selectedPet.name}</span>
              </p>

              <form onSubmit={handleAdoptionSubmit} className="space-y-3">
                <div>
                  <label className="block mb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Họ tên của bạn</label>
                  <input
                    type="text"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3BB77E] focus:ring-1 focus:ring-[#3BB77E] transition-all bg-slate-50 focus:bg-white text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email liên hệ</label>
                  <input
                    type="email"
                    value={requesterEmail}
                    onChange={(e) => setRequesterEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3BB77E] focus:ring-1 focus:ring-[#3BB77E] transition-all bg-slate-50 focus:bg-white text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Số điện thoại</label>
                  <input
                    type="tel"
                    value={requesterPhone}
                    onChange={(e) => setRequesterPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3BB77E] focus:ring-1 focus:ring-[#3BB77E] transition-all bg-slate-50 focus:bg-white text-slate-800 font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ngày hẹn xem pet</label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      onClick={(e) => {
                        try {
                          (e.target as HTMLInputElement).showPicker();
                        } catch (err) {}
                      }}
                      onFocus={(e) => {
                        try {
                          (e.target as HTMLInputElement).showPicker();
                        } catch (err) {}
                      }}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      style={{ colorScheme: "light" }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3BB77E] focus:ring-1 focus:ring-[#3BB77E] transition-all bg-slate-50 focus:bg-white text-slate-800 font-semibold cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Giờ hẹn xem</label>
                    <input
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      onClick={(e) => {
                        try {
                          (e.target as HTMLInputElement).showPicker();
                        } catch (err) {}
                      }}
                      onFocus={(e) => {
                        try {
                          (e.target as HTMLInputElement).showPicker();
                        } catch (err) {}
                      }}
                      required
                      style={{ colorScheme: "light" }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3BB77E] focus:ring-1 focus:ring-[#3BB77E] transition-all bg-slate-50 focus:bg-white text-slate-800 font-semibold cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {!selectedPet.price || selectedPet.price === 0 ? "Lý do muốn nhận nuôi" : "Ghi chú / Yêu cầu mua"}
                  </label>
                  <textarea
                    rows={2.5}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    placeholder={
                      !selectedPet.price || selectedPet.price === 0
                        ? "Hãy chia sẻ kinh nghiệm nuôi pet hoặc môi trường sống cho bé..."
                        : "Hãy ghi chú thời gian nhận bé hoặc yêu cầu vận chuyển..."
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#3BB77E] focus:ring-1 focus:ring-[#3BB77E] transition-all bg-slate-50 focus:bg-white text-slate-800 resize-none font-semibold"
                  />
                </div>
                
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-xs text-slate-500 transition-all cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4.5 py-2 bg-gradient-to-r from-[#3BB77E] to-[#2D9B6A] hover:opacity-90 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-100 transition-all cursor-pointer"
                  >
                    {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};
