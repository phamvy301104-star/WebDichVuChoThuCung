import React, { useEffect, useMemo, useState } from 'react';
import type { Staff, StaffStatus } from '@/services/staffService';

type StaffMode = 'create' | 'view' | 'edit';

type StaffFormValues = {
  name: string;
  email: string;
  phone: string;
  position: string;
  status: StaffStatus;
  services: string[];
  avatar?: string;
};

type Props = {
  mode: Exclude<StaffMode, 'view'>;
  initialValue: Staff | null;
  onCancel: () => void;
  onSubmit: (payload: StaffFormValues) => Promise<void> | void;
};

const STATUS_OPTIONS: { value: StaffStatus; label: string }[] = [
  { value: 'active', label: 'Đang làm việc' },
  { value: 'on_leave', label: 'Nghỉ phép' },
  { value: 'inactive', label: 'Ngừng hoạt động' },
];

const joinServices = (services: string[]) => (services || []).join(', ');

const parseServices = (raw: string) =>
  raw
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

export const StaffForm: React.FC<Props> = ({ mode, initialValue, onCancel, onSubmit }) => {
  const isEdit = mode === 'edit';

  const [values, setValues] = useState<StaffFormValues>({
    name: '',
    email: '',
    phone: '',
    position: '',
    status: 'active',
    services: [],
    avatar: '',
  });

  const [servicesRaw, setServicesRaw] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init: StaffFormValues = {
      name: initialValue?.name ?? '',
      email: initialValue?.email ?? '',
      phone: initialValue?.phone ?? '',
      position: initialValue?.position ?? '',
      status: initialValue?.status ?? 'active',
      services: initialValue?.services ?? [],
      avatar: initialValue?.avatar ?? '',
    };

    setValues(init);
    setServicesRaw(joinServices(init.services));
  }, [initialValue]);

  const title = isEdit ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên';
  const submitLabel = isEdit ? 'Lưu' : 'Tạo mới';

  const canSubmit = useMemo(() => {
    return (
      values.name.trim().length > 0 &&
      values.email.trim().length > 0 &&
      values.phone.trim().length > 0 &&
      values.position.trim().length > 0 &&
      !!values.status
    );
  }, [values]);

  const handleChange = (key: keyof StaffFormValues, v: any) => {
    setValues((prev) => ({ ...prev, [key]: v }));
  };

  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{title}</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Họ tên</div>
          <input
            className="ap-input"
            value={values.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Nhập họ tên"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Trạng thái</div>
          <select
            className="ap-select"
            value={values.status}
            onChange={(e) => handleChange('status', e.target.value as StaffStatus)}
            style={{ width: '100%' }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Email</div>
          <input
            className="ap-input"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Nhập email"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Số điện thoại</div>
          <input
            className="ap-input"
            value={values.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Nhập số điện thoại"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Chức vụ</div>
          <input
            className="ap-input"
            value={values.position}
            onChange={(e) => handleChange('position', e.target.value)}
            placeholder="Nhập chức vụ"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Dịch vụ phụ trách</div>
          <input
            className="ap-input"
            value={servicesRaw}
            onChange={(e) => setServicesRaw(e.target.value)}
            placeholder="Nhập danh sách dịch vụ (ngăn cách bởi dấu phẩy)"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
        <button
          className="ap-btn"
          style={{
            border: '1px solid rgba(0,0,0,0.12)',
            background: 'transparent',
            padding: '8px 12px',
            borderRadius: 12,
            cursor: 'pointer',
          }}
          onClick={onCancel}
          disabled={submitting}
        >
          Hủy
        </button>

        <button
          className="ap-btn ap-btn-primary"
          style={{ padding: '8px 12px', borderRadius: 12 }}
          disabled={!canSubmit || submitting}
          onClick={async () => {
            setSubmitting(true);
            try {
              const payload: StaffFormValues = {
                ...values,
                services: parseServices(servicesRaw),
              };
              await onSubmit(payload);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {submitting ? 'Đang lưu...' : submitLabel}
        </button>
      </div>
    </div>
  );
};

