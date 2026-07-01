import React, { useState } from "react";
import { Pet } from "../../types";
import { PET_STATUS_LABELS } from "@utils/constants";

interface PetTableProps {
  pets: Pet[];
  onEdit: (pet: Pet) => void;
  onDelete: (id: string) => void;
}

export const PetTable: React.FC<PetTableProps> = ({
  pets,
  onEdit,
  onDelete,
}) => {
  const [search, setSearch] = useState("");
  const [filterSpecies, setFilterSpecies] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredPets = pets.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.breed.toLowerCase().includes(search.toLowerCase());
    const matchesSpecies =
      filterSpecies === "All" || p.species === filterSpecies;
    const matchesStatus =
      filterStatus === "All" ||
      p.status === filterStatus;
    return matchesSearch && matchesSpecies && matchesStatus;
  });

  return (
    <>
      <div className="flex flex-col gap-3.5 mb-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-slate-800">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold text-slate-500 min-w-[120px] uppercase tracking-wider">
            Tìm kiếm:
          </span>
          <input
            type="text"
            className="w-full max-w-sm px-3.5 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#3BB77E] transition-all bg-white text-slate-800"
            placeholder="Tìm nhanh theo tên hoặc giống..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold text-slate-500 min-w-[120px] uppercase tracking-wider">
            Giống loài:
          </span>
          <div className="flex gap-2 flex-wrap">
            {["All", "Chó", "Mèo", "Thỏ"].map((species) => (
              <button
                key={species}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${filterSpecies === species ? "bg-gradient-to-r from-[#3BB77E] to-[#2D9B6A] text-white border-transparent shadow-md shadow-emerald-100" : "bg-slate-50 border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700"}`}
                onClick={() => setFilterSpecies(species)}
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

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold text-slate-500 min-w-[120px] uppercase tracking-wider">
            Trạng thái:
          </span>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: "All", label: "Tất cả" },
              { value: "owned", label: "Đang sở hữu" },
              { value: "for_sale", label: "Chờ nhận nuôi" },
              { value: "for_adoption", label: "Đã nhận nuôi" },
            ].map((statusItem) => (
              <button
                key={statusItem.value}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${filterStatus === statusItem.value ? "bg-gradient-to-r from-[#3BB77E] to-[#2D9B6A] text-white border-transparent shadow-md shadow-emerald-100" : "bg-slate-50 border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700"}`}
                onClick={() => setFilterStatus(statusItem.value)}
              >
                {statusItem.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto text-slate-800">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-3.5 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                Ảnh
              </th>
              <th className="px-4 py-3.5 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                Tên
              </th>
              <th className="px-4 py-3.5 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                Loài / Giống
              </th>
              <th className="px-4 py-3.5 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                Tuổi
              </th>
              <th className="px-4 py-3.5 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                Người sở hữu
              </th>
              <th className="px-4 py-3.5 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                Trạng thái
              </th>
              <th className="px-4 py-3.5 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                Chi phí
              </th>
              <th className="px-4 py-3.5 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                Ngày đăng ký
              </th>
              <th className="px-4 py-3.5 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider border-b border-slate-200 text-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPets.length > 0 ? (
              filteredPets.map((pet) => (
                <tr
                  key={pet.id}
                  className="hover:bg-slate-50/80 transition-all"
                >
                  <td className="px-4 py-4 border-b border-slate-100 align-middle">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-11 h-11 rounded-lg object-cover border border-slate-100"
                    />
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100 align-middle font-bold text-slate-800">
                    {pet.name}
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100 text-slate-700 align-middle">
                    <span className="inline-flex items-center gap-1.5 bg-[#E8F5EF] text-[#166534] px-2.5 py-1 rounded-md text-xs font-semibold">
                      {pet.species === "Chó"
                        ? "🐕"
                        : pet.species === "Mèo"
                          ? "🐱"
                          : pet.species === "Thỏ"
                            ? "🐇"
                            : "🐾"}{" "}
                      {pet.breed}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100 text-slate-700 align-middle">
                    {pet.age} tuổi / tháng
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100 align-middle text-xs">
                    <div className="font-semibold text-slate-700">
                      {pet.owner?.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {pet.owner?.email}
                    </div>
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100 text-slate-700 align-middle">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-extrabold tracking-wide whitespace-nowrap shadow-sm"
                      style={{
                        background:
                          pet.status === "for_sale"
                            ? "#dbeafe"
                            : pet.status === "for_adoption"
                              ? "#dcfce7"
                              : "#f1f5f9",
                        color:
                          pet.status === "for_sale"
                            ? "#1d4ed8"
                            : pet.status === "for_adoption"
                              ? "#15803d"
                              : "#475569",
                      }}
                    >
                      {PET_STATUS_LABELS[
                        pet.status as keyof typeof PET_STATUS_LABELS
                      ] || pet.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100 align-middle text-xs font-bold">
                    {pet.price && pet.price > 0 ? (
                      <span className="text-emerald-700">
                        {pet.price.toLocaleString("vi-VN")}đ
                      </span>
                    ) : (
                      <span className="text-slate-400">Miễn phí</span>
                    )}
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100 align-middle text-slate-500 text-xs">
                    {new Date(pet.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100 text-slate-700 align-middle">
                    <div className="flex gap-1.5 justify-center">
                      <button
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-1.5 rounded-lg text-xs transition-all cursor-pointer"
                        title="Sửa"
                        onClick={() => onEdit(pet)}
                      >
                        ✏️
                      </button>
                      <button
                        className="bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 p-1.5 rounded-lg text-xs transition-all cursor-pointer"
                        title="Xóa"
                        onClick={() => onDelete(pet.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-8 text-slate-400 text-sm"
                >
                  Không tìm thấy thú cưng nào trùng khớp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
