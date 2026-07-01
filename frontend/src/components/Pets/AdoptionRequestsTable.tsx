import React, { useState } from "react";
import { AdoptionRequest, Pet } from "../../types";

interface AdoptionRequestsTableProps {
  requests: AdoptionRequest[];
  pets: Pet[];
  onApprove: (request: AdoptionRequest) => void;
  onReject: (request: AdoptionRequest) => void;
}

export const AdoptionRequestsTable: React.FC<AdoptionRequestsTableProps> = ({
  requests,
  pets,
  onApprove,
  onReject,
}) => {
  const [filterStatus, setFilterStatus] = useState<"All" | "pending" | "approved" | "rejected">("All");

  const filteredRequests = requests.filter(
    (r) => filterStatus === "All" || r.status === filterStatus
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 mb-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-slate-800">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[120px]">
            Trạng thái yêu cầu:
          </span>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: "All", label: "Tất cả" },
              { value: "pending", label: "Chờ duyệt ⏳" },
              { value: "approved", label: "Đã duyệt ✅" },
              { value: "rejected", label: "Đã từ chối ❌" },
            ].map((statusItem) => (
              <button
                key={statusItem.value}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === statusItem.value
                    ? "bg-gradient-to-r from-[#3BB77E] to-[#2D9B6A] text-white border-transparent shadow-md shadow-emerald-100"
                    : "bg-slate-50 border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-700"
                }`}
                onClick={() => setFilterStatus(statusItem.value as any)}
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
                Ảnh thú cưng
              </th>
              <th className="px-4 py-3.5 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                Thú cưng
              </th>
              <th className="px-4 py-3.5 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                Giống loài
              </th>
              <th className="px-4 py-3.5 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                Người yêu cầu nhận nuôi
              </th>
              <th className="px-4 py-3.5 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                Trạng thái
              </th>
              <th className="px-4 py-3.5 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                Chi phí
              </th>
              <th className="px-4 py-3.5 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                Lý do nhận nuôi
              </th>
              <th className="px-4 py-3.5 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                Ngày gửi
              </th>
              <th className="px-4 py-3.5 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider border-b border-slate-200 text-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-all">
                  <td className="px-4 py-4 border-b border-slate-100 align-middle">
                    <img
                      src={req.petImage}
                      alt={req.petName}
                      className="w-11 h-11 rounded-lg object-cover border border-slate-100"
                    />
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100 align-middle font-bold text-slate-800">
                    {req.petName}
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100 text-slate-700 align-middle">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-semibold">
                      {req.petBreed}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100 align-middle">
                    <div className="font-semibold text-slate-800">{req.requesterName}</div>
                    <div className="text-xs text-slate-500">{req.requesterEmail}</div>
                    <div className="text-xs text-slate-400">{req.requesterPhone}</div>
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100 align-middle">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-extrabold tracking-wide whitespace-nowrap shadow-sm ${
                        req.status === "approved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : req.status === "rejected"
                          ? "bg-rose-50 text-rose-700 border border-rose-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}
                    >
                      {req.status === "approved"
                        ? "Đã duyệt"
                        : req.status === "rejected"
                        ? "Từ chối"
                        : "Chờ duyệt"}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100 align-middle text-xs font-bold">
                    {(() => {
                      const pet = pets.find((p) => p.id === req.petId);
                      const price = pet?.price ?? 0;
                      return price > 0 ? (
                        <span className="text-emerald-700">
                          {price.toLocaleString("vi-VN")}đ
                        </span>
                      ) : (
                        <span className="text-slate-400">Miễn phí</span>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100 align-middle text-slate-600 text-xs max-w-[180px]">
                    {req.reason ? (
                      <span className="line-clamp-2">{req.reason}</span>
                    ) : (
                      <span className="text-slate-300 italic">Không có</span>
                    )}
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100 align-middle text-slate-500 text-xs">
                    {new Date(req.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-4 border-b border-slate-100 align-middle text-center">
                    {req.status === "pending" ? (
                      <div className="flex gap-2 justify-center items-center">
                        <button
                          onClick={() => onApprove(req)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 transition-all cursor-pointer"
                        >
                          Duyệt ✅
                        </button>
                        <button
                          onClick={() => onReject(req)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition-all cursor-pointer"
                        >
                          Từ chối ❌
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Không có thao tác</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-8 text-slate-400 text-sm">
                  Không tìm thấy yêu cầu nhận nuôi nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
