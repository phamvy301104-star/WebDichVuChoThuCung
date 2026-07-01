import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@stores/store";
import { Pet, AdoptionRequest } from "../../types";
import { setPets as setReduxPets } from "@stores/slices/petSlice";
import {
  INITIAL_MOCK_PETS,
  INITIAL_ADOPTION_REQUESTS,
  MOCK_ADMIN,
} from "@components/Pets/petConstants";

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

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);

  useEffect(() => {
    const storedPets = localStorage.getItem("petcare_pets");
    if (storedPets) {
      try {
        let parsed = JSON.parse(storedPets) as Pet[];
        let migrated = false;
        parsed = parsed.map((p) => {
          if (
            (p.status as string) === "adopted" ||
            (p.status as string) === "sold"
          ) {
            migrated = true;
            return { ...p, status: "for_adoption" as const };
          }
          return p;
        });
        if (migrated) {
          localStorage.setItem("petcare_pets", JSON.stringify(parsed));
        }
        setPets(parsed);
        dispatch(setReduxPets(parsed));
      } catch (err) {
        setPets(INITIAL_MOCK_PETS);
        dispatch(setReduxPets(INITIAL_MOCK_PETS));
        localStorage.setItem("petcare_pets", JSON.stringify(INITIAL_MOCK_PETS));
      }
    } else {
      setPets(INITIAL_MOCK_PETS);
      dispatch(setReduxPets(INITIAL_MOCK_PETS));
      localStorage.setItem("petcare_pets", JSON.stringify(INITIAL_MOCK_PETS));
    }

    const storedRequests = localStorage.getItem("petcare_adoption_requests");
    if (storedRequests) {
      try {
        setRequests(JSON.parse(storedRequests));
      } catch (err) {
        setRequests(INITIAL_ADOPTION_REQUESTS);
        localStorage.setItem(
          "petcare_adoption_requests",
          JSON.stringify(INITIAL_ADOPTION_REQUESTS),
        );
      }
    } else {
      setRequests(INITIAL_ADOPTION_REQUESTS);
      localStorage.setItem(
        "petcare_adoption_requests",
        JSON.stringify(INITIAL_ADOPTION_REQUESTS),
      );
    }
  }, [dispatch]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

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

  const handleSavePet = (formData: {
    name: string;
    species: string;
    breed: string;
    age: number;
    image: string;
    description: string;
    price: number;
    status: "owned" | "for_sale" | "for_adoption";
  }) => {
    let updatedPets: Pet[] = [];

    if (editingPet) {
      updatedPets = pets.map((p) =>
        p.id === editingPet.id
          ? {
              ...p,
              ...formData,
            }
          : p,
      );
      showToast("Cập nhật thông tin thú cưng thành công!");
    } else {
      const newPet: Pet = {
        id: `pet_${Date.now()}`,
        ...formData,
        owner: currentUser || MOCK_ADMIN,
        createdAt: new Date().toISOString(),
      };
      updatedPets = [...pets, newPet];
      showToast("Thêm thú cưng mới thành công!");
    }

    setPets(updatedPets);
    dispatch(setReduxPets(updatedPets));
    localStorage.setItem("petcare_pets", JSON.stringify(updatedPets));
    setIsAddEditModalOpen(false);
  };

  const handleDeletePet = () => {
    if (!deletingPetId) return;
    const updatedPets = pets.filter((p) => p.id !== deletingPetId);
    setPets(updatedPets);
    dispatch(setReduxPets(updatedPets));
    localStorage.setItem("petcare_pets", JSON.stringify(updatedPets));

    const updatedRequests = requests.map((r) =>
      r.petId === deletingPetId && r.status === "pending"
        ? { ...r, status: "rejected" as const }
        : r,
    );
    setRequests(updatedRequests);
    localStorage.setItem(
      "petcare_adoption_requests",
      JSON.stringify(updatedRequests),
    );

    setIsDeleteModalOpen(false);
    setDeletingPetId(null);
    showToast("Xóa thú cưng thành công!");
  };

  const handleApproveAdoption = (request: AdoptionRequest) => {
    const updatedRequests = requests.map((r) =>
      r.id === request.id ? { ...r, status: "approved" as const } : r,
    );
    setRequests(updatedRequests);
    localStorage.setItem(
      "petcare_adoption_requests",
      JSON.stringify(updatedRequests),
    );

    const updatedPets = pets.map((p) =>
      p.id === request.petId ? { ...p, status: "for_adoption" as const } : p,
    );
    setPets(updatedPets);
    dispatch(setReduxPets(updatedPets));
    localStorage.setItem("petcare_pets", JSON.stringify(updatedPets));

    showToast(`Đã duyệt yêu cầu nhận nuôi bé ${request.petName}!`);
  };

  const handleRejectAdoption = (request: AdoptionRequest) => {
    const updatedRequests = requests.map((r) =>
      r.id === request.id ? { ...r, status: "rejected" as const } : r,
    );
    setRequests(updatedRequests);
    localStorage.setItem(
      "petcare_adoption_requests",
      JSON.stringify(updatedRequests),
    );

    showToast(`Đã từ chối yêu cầu nhận nuôi bé ${request.petName}.`, "error");
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
          📝 Phê duyệt nhận nuôi (
          {requests.filter((r) => r.status === "pending").length} chờ duyệt)
        </button>
      </div>

      {activeTab === "pets" ? (
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
