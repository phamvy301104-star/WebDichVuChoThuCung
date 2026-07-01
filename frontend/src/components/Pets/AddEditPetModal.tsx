import React, { useState, useEffect } from "react";
import { Pet } from "../../types";
import { SAMPLE_IMAGES } from "./petConstants";

interface AddEditPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    species: string;
    breed: string;
    age: number;
    image: string;
    description: string;
    price: number;
    status: 'owned' | 'for_sale' | 'for_adoption';
  }) => void;
  editingPet: Pet | null;
}

export const AddEditPetModal: React.FC<AddEditPetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPet
}) => {
  const [formName, setFormName] = useState("");
  const [formSpecies, setFormSpecies] = useState("Chó");
  const [formBreed, setFormBreed] = useState("");
  const [formAge, setFormAge] = useState<number>(1);
  const [formImage, setFormImage] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<'owned' | 'for_sale' | 'for_adoption'>('owned');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingPet) {
      setFormName(editingPet.name);
      setFormSpecies(editingPet.species);
      setFormBreed(editingPet.breed);
      setFormAge(editingPet.age);
      setFormImage(editingPet.image);
      setFormDescription(editingPet.description || "");
      setFormPrice(editingPet.price ?? 0);
      setFormStatus(editingPet.status as 'owned' | 'for_sale' | 'for_adoption');
    } else {
      setFormName("");
      setFormSpecies("Chó");
      setFormBreed("");
      setFormAge(1);
      setFormImage(SAMPLE_IMAGES["Chó"][0]);
      setFormDescription("");
      setFormPrice(0);
      setFormStatus("owned");
    }
    setFormErrors({});
  }, [editingPet, isOpen]);

  useEffect(() => {
    if (isOpen && !editingPet) {
      const imagesForSpecies =
        SAMPLE_IMAGES[formSpecies as keyof typeof SAMPLE_IMAGES] ||
        SAMPLE_IMAGES["Khác"];
      setFormImage(imagesForSpecies[0]);
    }
  }, [formSpecies, isOpen, editingPet]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formName.trim()) errors.name = "Tên không được để trống";
    if (!formBreed.trim()) errors.breed = "Giống không được để trống";
    if (!formImage.trim()) errors.image = "Đường dẫn ảnh không được để trống";
    if (formAge <= 0) errors.age = "Tuổi phải lớn hơn 0";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave({
      name: formName,
      species: formSpecies,
      breed: formBreed,
      age: formAge,
      image: formImage,
      description: formDescription,
      price: formPrice,
      status: formStatus,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fade-in text-slate-800">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto shadow-2xl p-6 relative animate-slide-up">
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3.5">
          <h3 className="text-lg font-extrabold text-[#253D4E] m-0">
            {editingPet
              ? "📝 Cập nhật thông tin thú cưng"
              : "🐾 Thêm thú cưng mới"}
          </h3>
          <button
            type="button"
            className="bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 w-8 h-8 rounded-full cursor-pointer flex items-center justify-center transition-all hover:rotate-90"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600">
                Tên thú cưng *
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border ${formErrors.name ? "border-red-400 focus:border-red-400" : "border-slate-200 focus:border-[#3BB77E]"} bg-white text-slate-800 rounded-lg text-sm outline-none transition-all`}
                placeholder="Ví dụ: Cacao"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
              {formErrors.name && (
                <span className="text-red-500 text-xs mt-0.5">
                  {formErrors.name}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600">Loài *</label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#3BB77E] transition-all bg-white text-slate-800"
                value={formSpecies}
                onChange={(e) => setFormSpecies(e.target.value)}
              >
                <option value="Chó">Chó 🐕</option>
                <option value="Mèo">Mèo 🐱</option>
                <option value="Thỏ">Thỏ 🐇</option>
                <option value="Khác">Khác 🐾</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600">
                Giống loài (Breed) *
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border ${formErrors.breed ? "border-red-400 focus:border-red-400" : "border-slate-200 focus:border-[#3BB77E]"} bg-white text-slate-800 rounded-lg text-sm outline-none transition-all`}
                placeholder="Ví dụ: Poodle, Corgi, Sphynx"
                value={formBreed}
                onChange={(e) => setFormBreed(e.target.value)}
              />
              {formErrors.breed && (
                <span className="text-red-500 text-xs mt-0.5">
                  {formErrors.breed}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600">Tuổi *</label>
              <input
                type="number"
                className={`w-full px-3 py-2 border ${formErrors.age ? "border-red-400 focus:border-red-400" : "border-slate-200 focus:border-[#3BB77E]"} bg-white text-slate-800 rounded-lg text-sm outline-none transition-all`}
                value={formAge}
                onChange={(e) => setFormAge(parseInt(e.target.value) || 0)}
              />
              {formErrors.age && (
                <span className="text-red-500 text-xs mt-0.5">
                  {formErrors.age}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600">
                Trạng thái *
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#3BB77E] transition-all bg-white text-slate-800"
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
              >
                <option value="owned">Đang sở hữu</option>
                <option value="for_sale">Chờ nhận nuôi</option>
                <option value="for_adoption">Đã nhận nuôi</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600">
                Chi phí nhận nuôi (VNĐ)
              </label>
              <input
                type="number"
                min={0}
                className="w-full px-3 py-2 border border-slate-200 focus:border-[#3BB77E] bg-white text-slate-800 rounded-lg text-sm outline-none transition-all"
                placeholder="0 = Miễn phí"
                value={formPrice}
                onChange={(e) => setFormPrice(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-3">
            <label className="text-xs font-bold text-slate-600">
              Đường dẫn hình ảnh *
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 border ${formErrors.image ? "border-red-400 focus:border-red-400" : "border-slate-200 focus:border-[#3BB77E]"} bg-white text-slate-800 rounded-lg text-sm outline-none transition-all`}
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
            />
            {formErrors.image && (
              <span className="text-red-500 text-xs mt-0.5">
                {formErrors.image}
              </span>
            )}
          </div>

          {/* Sample images chooser */}
          <div className="mb-4">
            <label className="text-xs font-bold text-slate-600 block mb-2">
              Chọn hình ảnh mẫu gợi ý:
            </label>
            <div className="flex gap-2.5 flex-wrap">
              {(
                SAMPLE_IMAGES[formSpecies as keyof typeof SAMPLE_IMAGES] ||
                SAMPLE_IMAGES["Khác"]
              ).map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormImage(img)}
                  className={`p-0 overflow-hidden cursor-pointer w-11 h-11 transition-all rounded-lg ${formImage === img ? "ring-2 ring-[#3BB77E] ring-offset-2" : "border border-slate-200"}`}
                >
                  <img
                    src={img}
                    alt="sample"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full mb-5">
            <label className="text-xs font-bold text-slate-600">
              Mô tả ngắn
            </label>
            <textarea
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#3BB77E] transition-all min-h-[80px] resize-y bg-white text-slate-800"
              placeholder="Mô tả về tính cách, cân nặng, sức khỏe..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-3 justify-end mt-5">
            <button
              type="button"
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 text-slate-500 cursor-pointer transition-all"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-[#3BB77E] to-[#2D9B6A] hover:opacity-90 text-white text-sm font-bold rounded-lg shadow-lg shadow-emerald-100 cursor-pointer transition-all"
            >
              {editingPet ? "Lưu thay đổi" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
