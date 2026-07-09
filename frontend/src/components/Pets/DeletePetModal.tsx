import React from 'react';

interface DeletePetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeletePetModal: React.FC<DeletePetModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fade-in text-slate-800">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-8 relative animate-slide-up text-center flex flex-col items-center">
        <div className="text-5xl mb-3">⚠️</div>
        <h3 className="text-xl font-extrabold text-[#253D4E] mb-2">Xóa thú cưng?</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          Bạn có chắc chắn muốn xóa thú cưng này khỏi hệ thống? Hành động này không thể hoàn tác.
        </p>
        <div className="flex gap-3 justify-center w-full">
          <button
            type="button"
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 text-slate-500 cursor-pointer transition-all flex-1"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            type="button"
            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg cursor-pointer transition-all shadow-md shadow-red-100 flex-1"
            onClick={onConfirm}
          >
            Xóa ngay
          </button>
        </div>
      </div>
    </div>
  );
};
