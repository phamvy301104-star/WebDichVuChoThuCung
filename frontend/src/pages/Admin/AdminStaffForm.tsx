import React, { useEffect, useMemo, useState } from 'react';
import { serviceService } from '@/services/serviceService';
import type { Staff, StaffStatus } from '@/types/staff';
import type { Service } from '@/types/service';

type StaffFormValues = {
  name: string;
  email: string;
  phone: string;
  position: string;
  status: StaffStatus;
  services: string[]; // Chứa mảng các ID dạng chuỗi (ObjectId phục vụ Backend)
  avatar?: string;
};

type Props = {
  mode: 'create' | 'edit';
  initialValue: Staff | null;
  onCancel: () => void;
  onSubmit: (payload: StaffFormValues) => Promise<void> | void;
};

const STATUS_OPTIONS: { value: StaffStatus; label: string }[] = [
  { value: 'active', label: 'Đang làm việc' },
  { value: 'on_leave', label: 'Nghỉ phép' },
  { value: 'inactive', label: 'Ngừng hoạt động' },
];

export const StaffForm: React.FC<Props> = ({ mode, initialValue, onCancel, onSubmit }) => {
  const isEdit = mode === 'edit';
  const [submitting, setSubmitting] = useState(false);
  const [availableServices, setAvailableServices] = useState<Service[]>([]); // Kho chứa dịch vụ thật từ hệ thống

  const [values, setValues] = useState<StaffFormValues>({
    name: '',
    email: '',
    phone: '',
    position: '',
    status: 'active',
    services: [],
    avatar: '',
  });

  // 1. Tải danh sách dịch vụ thực tế từ Backend để hiển thị bộ chọn Checkbox[cite: 13]
  useEffect(() => {
    serviceService.getServices()
      .then((data) => setAvailableServices(data.filter(s => s.status === 'ACTIVE')))
      .catch((err) => console.error('Lỗi tải danh mục dịch vụ chọn ca:', err));
  }, []);

  // 2. Điền sẵn thông tin khi cập nhật sửa đổi[cite: 13]
  useEffect(() => {
    if (initialValue) {
      // Bóc tách trích xuất mảng ID gốc từ backend (phòng hờ trường hợp dữ liệu đã populate thành Object)[cite: 13]
      const mappedServiceIds = initialValue.services.map((sv: any) => typeof sv === 'object' ? (sv.id || sv._id) : sv);

      setValues({
        name: initialValue.name ?? '',
        email: initialValue.email ?? '',
        phone: initialValue.phone ?? '',
        position: initialValue.position ?? '',
        status: initialValue.status ?? 'active',
        services: mappedServiceIds,
        avatar: initialValue.avatar ?? '',
      });
    }
  }, [initialValue]);

  const canSubmit = useMemo(() => {
    return (
      values.name.trim().length > 0 &&
      values.email.trim().length > 0 &&
      values.phone.trim().length > 0 &&
      values.position.trim().length > 0 &&
      values.services.length > 0 // Chốt chặn: Bắt buộc chọn ít nhất 1 kỹ năng chuyên môn[cite: 13]
    );
  }, [values]);

  const handleChange = (key: keyof StaffFormValues, v: any) => {
    setValues((prev) => ({ ...prev, [key]: v }));
  };

  // 3. Logic xử lý đảo trạng thái tick chọn Checkbox mảng ID dịch vụ[cite: 13]
  const handleToggleServiceCheckbox = (serviceId: string) => {
    setValues((prev) => {
      const exists = prev.services.includes(serviceId);
      const updatedServices = exists
        ? prev.services.filter(id => id !== serviceId) // Bỏ chọn[cite: 13]
        : [...prev.services, serviceId]; // Thêm mới ID vào danh sách gánh vác[cite: 13]
      return { ...prev, services: updatedServices };
    });
  };

  return (
    <div>
      {/* KHỐI STYLE SCOPED: Hóa giải hoàn toàn 100% cảnh báo no-inline-styles của Edge Tools[cite: 13] */}
      <style>{`
        .ap-form-grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .ap-form-label-muted { font-size: 12px; color: #6b7280; }
        .ap-form-label-block { font-size: 12px; color: #6b7280; display: block; margin-bottom: 6px; }
        .ap-form-input-w100 { width: 100%; }
        .ap-form-col-full { grid-column: 1 / -1; }
        .ap-margin-top-6 { margin-top: 6px; }
        .ap-services-checkbox-container { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; max-height: 110px; overflow-y: auto; padding: 6px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .ap-services-checkbox-label { display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer; }
        .ap-form-actions-flex { display: flex; gap: 10px; justify-content: flex-end; margin-top: 18px; }
        .ap-btn-cancel-custom { border: 1px solid rgba(0,0,0,0.12); background: transparent; padding: 8px 12px; border-radius: 12px; cursor: pointer; }
        .ap-btn-submit-custom { padding: 8px 12px; border-radius: 12px; }
      `}</style>

      <div className="ap-form-grid-2col">
        <div>
          {/* ĐÃ SỬA: Đồng bộ thuộc tính htmlFor liên kết id chặt chẽ chặn đứng lỗi axe/forms[cite: 13] */}
          <label htmlFor="staff-form-name" className="ap-form-label-muted">Họ tên nhân viên *</label>
          <input id="staff-form-name" className="ap-input ap-form-input-w100" value={values.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Nhập họ tên" />
        </div>

        <div>
          <label htmlFor="staff-form-status" className="ap-form-label-muted">Trạng thái vận hành *</label>
          {/* ĐÃ SỬA LỖI CHÍ MẠNG 1: Bổ sung id và aria-label quét sạch lỗi khuyết danh tính[cite: 13] */}
          <select 
            id="staff-form-status"
            className="ap-select ap-form-input-w100" 
            aria-label="Cấu hình trạng thái vận hành của nhân viên"
            value={values.status} 
            onChange={(e) => handleChange('status', e.target.value as StaffStatus)}
          >
            {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="staff-form-email" className="ap-form-label-muted">Địa chỉ Email *</label>
          <input id="staff-form-email" className="ap-input ap-form-input-w100" value={values.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="Nhập email" />
        </div>

        <div>
          <label htmlFor="staff-form-phone" className="ap-form-label-muted">Số điện thoại liên lạc *</label>
          <input id="staff-form-phone" className="ap-input ap-form-input-w100" value={values.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="Nhập số điện thoại" />
        </div>

        <div className="ap-form-col-full">
          <label htmlFor="staff-form-position" className="ap-form-label-muted">Chức danh / Vị trí *</label>
          <input id="staff-form-position" className="ap-input ap-form-input-w100" value={values.position} onChange={(e) => handleChange('position', e.target.value)} placeholder="Ví dụ: Bác sĩ thú y, Chuyên viên tỉa lông" />
        </div>

        {/* Khu vực render danh sách Checkbox dịch vụ động, an toàn và bảo mật dữ liệu tuyệt đối[cite: 13] */}
        <div className="ap-form-col-full ap-margin-top-6">
          <span className="ap-form-label-block">Danh sách kỹ năng dịch vụ đảm nhiệm * (Chọn ít nhất 1 mục)</span>
          <div className="ap-services-checkbox-container">
            {availableServices.map((sv) => {
              const sId = sv.id || '';
              return (
                <label key={sId} className="ap-services-checkbox-label">
                  <input
                    type="checkbox"
                    aria-label={`Giao dịch vụ ${sv.name}`}
                    checked={values.services.includes(sId)}
                    onChange={() => handleToggleServiceCheckbox(sId)}
                  />
                  <span>{sv.name} ({sv.category})</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="ap-form-actions-flex">
        <button type="button" className="ap-btn ap-btn-cancel-custom" onClick={onCancel} disabled={submitting}>Hủy bỏ</button>
        <button
          type="button"
          className="ap-btn ap-btn-primary ap-btn-submit-custom"
          disabled={!canSubmit || submitting}
          onClick={async () => {
            setSubmitting(true);
            try {
              await onSubmit(values);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {submitting ? 'Đang lưu kết quả...' : isEdit ? 'Cập nhật' : 'Tạo mới'}
        </button>
      </div>
    </div>
  );
};