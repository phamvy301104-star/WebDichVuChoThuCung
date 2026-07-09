import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@stores/store";
import { Pet, AdoptionRequest } from "../../types";
import { setPets as setReduxPets } from "@stores/slices/petSlice";
import { petService } from "@services/petService";

import { PetTable } from "@components/Pets/PetTable";
import { AdoptionRequestsTable } from "@components/Pets/AdoptionRequestsTable";
import { AddEditPetModal } from "@components/Pets/AddEditPetModal";
import { DeletePetModal } from "@components/Pets/DeletePetModal";

export const AdminPets: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [activeTab, setActiveTab] = useState<"pets" | "requests">("pets");

  const [pets, setPets] = useState<Pet[]>([]);
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [petsData, requestsData] = await Promise.all([
        petService.getAllPets(),
        petService.getAllAdoptionRequests(),
      ]);
      setPets(petsData);
      dispatch(setReduxPets(petsData));
      setRequests(requestsData);
    } catch (err: any) {
      showToast("Lỗi khi tải dữ liệu thú cưng!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const handleOpenAddModal = () => {
    setEditingPet(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (pet: Pet) => {
    setEditingPet(pet);
    setIsAddEditModalOpen(true);
  };

  const handleOpenDeleteModal = (id: string) => {
    setDeletingPetId(id);
    setIsDeleteModalOpen(true);
  };

  const handleSavePet = async (formData: {
    name: string;
    species: string;
    breed: string;
    age: number;
    image: string;
    description: string;
    price: number;
    status: "owned" | "for_sale" | "for_adoption";
  }) => {
    try {
      if (editingPet) {
        const id = editingPet.id || editingPet._id || "";
        const updated = await petService.updatePet(id, formData);
        if (updated) {
          setPets((current) =>
            current.map((p) =>
              (p.id || p._id) === id ? updated : p,
            ),
          );
          dispatch(setReduxPets(pets.map((p) => (p.id || p._id) === id ? updated : p)));
          showToast("Cập nhật thông tin thú cưng thành công!");
        }
      } else {
        const created = await petService.createPet(formData);
        if (created) {
          setPets((current) => [created, ...current]);
          dispatch(setReduxPets([created, ...pets]));
          showToast("Thêm thú cưng mới thành công!");
        }
      }
      setIsAddEditModalOpen(false);
    } catch (err: any) {
      showToast(err.message || "Lỗi khi lưu thông tin thú cưng!", "error");
    }
  };

  const handleDeletePet = async () => {
    if (!deletingPetId) return;
    try {
      await petService.deletePet(deletingPetId);
      setPets((current) => current.filter((p) => (p.id || p._id) !== deletingPetId));
      dispatch(setReduxPets(pets.filter((p) => (p.id || p._id) !== deletingPetId)));
      
      // Auto-reject any pending requests associated with the deleted pet
      setRequests((current) =>
        current.map((r) =>
          r.petId === deletingPetId && r.status === "pending"
            ? { ...r, status: "rejected" as const }
            : r,
        ),
      );
      
      setIsDeleteModalOpen(false);
      setDeletingPetId(null);
      showToast("Xóa thú cưng thành công!");
    } catch (err: any) {
      showToast(err.message || "Lỗi khi xóa thú cưng!", "error");
    }
  };

  const handleApproveAdoption = async (request: AdoptionRequest) => {
    try {
      const updatedRequest = await petService.updateAdoptionRequestStatus(request.id, "approved");
      if (updatedRequest) {
        setRequests((current) =>
          current.map((r) =>
            r.id === request.id ? updatedRequest : r,
          ),
        );
        
        // Update pet's status to 'owned' since it has been adopted
        setPets((current) =>
          current.map((p) =>
            (p.id || p._id) === request.petId ? { ...p, status: "owned" as const } : p,
          ),
        );
        dispatch(setReduxPets(pets.map((p) =>
          (p.id || p._id) === request.petId ? { ...p, status: "owned" as const } : p,
        )));
        
        showToast(`Đã duyệt yêu cầu cho bé ${request.petName}!`);
      }
    } catch (err: any) {
      showToast(err.message || "Lỗi khi duyệt yêu cầu!", "error");
    }
  };

  const handleRejectAdoption = async (request: AdoptionRequest) => {
    try {
      const updatedRequest = await petService.updateAdoptionRequestStatus(request.id, "rejected");
      if (updatedRequest) {
        setRequests((current) =>
          current.map((r) =>
            r.id === request.id ? updatedRequest : r,
          ),
        );
        showToast(`Đã từ chối yêu cầu cho bé ${request.petName}.`, "error");
      }
    } catch (err: any) {
      showToast(err.message || "Lỗi khi từ chối yêu cầu!", "error");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen text-slate-800">
      {toast && (
        <div
          className={`fixed top-6 right-6 bg-white text-slate-800 border-l-4 ${toast.type === "error" ? "border-red-500" : "border-emerald-500"} px-5 py-4 rounded-lg shadow-xl z-50 flex items-center gap-3 animate-slide-left font-semibold text-sm`}
        >
          <span>{toast.type === "success" ? "✅" : "❌"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#253D4E] m-0">
            Hệ thống quản lý thú cưng
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Quản lý danh sách thú cưng và xét duyệt hồ sơ yêu cầu nhận nuôi của
            khách hàng.
          </p>
        </div>
        {activeTab === "pets" && (
          <div className="flex gap-2">
            <button
              className="px-4 py-2.5 bg-gradient-to-r from-[#3BB77E] to-[#2D9B6A] hover:opacity-90 active:scale-95 text-white font-bold text-sm rounded-lg shadow-lg shadow-emerald-100 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
              onClick={handleOpenAddModal}
            >
              <span>➕</span> Thêm thú cưng
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-2 border-b border-slate-200 mb-6 pb-px">
        <button
          className={`px-4 py-2.5 text-sm font-bold transition-all relative cursor-pointer ${activeTab === "pets" ? 'text-[#3BB77E] after:content-[""] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-[#3BB77E] after:rounded-t' : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-lg"}`}
          onClick={() => setActiveTab("pets")}
        >
          🐾 Danh sách thú cưng ({pets.length})
        </button>
        <button
          className={`px-4 py-2.5 text-sm font-bold transition-all relative cursor-pointer ${activeTab === "requests" ? 'text-[#3BB77E] after:content-[""] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-[#3BB77E] after:rounded-t' : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-lg"}`}
          onClick={() => setActiveTab("requests")}
        >
          📝 Yêu cầu nhận nuôi / mua (
          {requests.filter((r) => r.status === "pending").length} chờ duyệt)
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 48, textAlign: "center", color: "#6b7280" }}>
          Đang tải dữ liệu...
        </div>
      ) : activeTab === "pets" ? (
        <PetTable
          pets={pets}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
        />
      ) : (
        <AdoptionRequestsTable
          requests={requests}
          pets={pets}
          onApprove={handleApproveAdoption}
          onReject={handleRejectAdoption}
        />
      )}

      <AddEditPetModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSavePet}
        editingPet={editingPet}
      />

      <DeletePetModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePet}
      />
    </div>
  );
};
