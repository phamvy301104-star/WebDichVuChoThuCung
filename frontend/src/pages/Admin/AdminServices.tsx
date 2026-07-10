import React, { useEffect, useMemo, useState } from 'react';
import { serviceService } from '@/services/serviceService';
import type { Service } from '@/types';

type ServiceStatusFE = 'active' | 'hidden';

type ServiceRow = {
  _id?: string;
  id?: string;
  image: string;
  name: string;
  description: string;
  category?: string;
  price: number;
  duration: number;
  status: ServiceStatusFE;
};

type ServiceFormMode = 'create' | 'edit';

type ServiceFormData = {
  name: string;
  description: string;
  category: string;
  price: string;
  duration: string;
  image: string;
  status: 'ACTIVE' | 'INACTIVE';
};

const STATUS_LABELS: Record<ServiceStatusFE, string> = {
  active: 'Đang hoạt động',
  hidden: 'Tạm ẩn',
};

const mapStatus = (backendStatus?: string): ServiceStatusFE => {
  if (!backendStatus) return 'active';
  return backendStatus === 'INACTIVE' ? 'hidden' : 'active';
};

export const AdminServices: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<ServiceRow[]>([]);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<ServiceFormMode>('create');
  const [selectedService, setSelectedService] = useState<ServiceRow | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    image: '',
    status: 'ACTIVE',
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const list = await serviceService.getServices();
      const mapped: ServiceRow[] = (list as any[]).map((s) => ({
        _id: s._id ? String(s._id) : undefined,
        id: s.id ? String(s.id) : String(s._id ?? ''),
        image: s.image || 'https://placehold.co/60x60?text=🛁',
        name: s.name,
        description: s.description,
        category: s.category,
        price: Number(s.price) || 0,
        duration: Number(s.duration) || 0,
        status: mapStatus(s.status),
      }));

      setServices(mapped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filtered = useMemo(
    () =>
      services.filter((s) => {
        const kw = search.toLowerCase();
        const matchSearch = s.name.toLowerCase().includes(kw) || s.description.toLowerCase().includes(kw);
        const matchStatus = statusFilter ? s.status === statusFilter : true;
        return matchSearch && matchStatus;
      }),
    [services, search, statusFilter],
  );

  return (
    <div className="admin-page">
      {/* KHỐI STYLE SCOPED: Loại bỏ hoàn toàn 100% thuộc tính style inline gây lỗi linter */}
      <style>{`
        .ap-img-thumb { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; }
        .ap-text-bold { font-weight: 600; }
        .ap-desc-cell { color: #6b7280; max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ap-status-badge--active { background-color: #d1fae5; color: #065f46; }
        .ap-status-badge--hidden { background-color: #f3f4f6; color: #6b7280; }
        .ap-empty-margin { margin-top: 12px; }
        .ap-modal-overlay-custom { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .ap-modal-custom { width: 100%; max-width: 760px; background: #fff; border-radius: 12px; padding: 18px; box-shadow: 0 12px 40px rgba(0,0,0,0.2); border: 1px solid #e5e7eb; }
        .ap-modal-header-custom { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .ap-modal-title-custom { font-weight: 900; font-size: 1.1rem; }
        .ap-modal-grid-custom { display: grid; grid-template-columns: 180px 1fr; gap: 16px; align-items: start; }
        .ap-img-large { width: 180px; height: 180px; object-fit: cover; border-radius: 12px; border: 1px solid #f3f4f6; }
        .ap-detail-title { font-size: 1.25rem; font-weight: 900; margin-bottom: 8px; }
        .ap-detail-desc { margin-bottom: 8px; color: #6b7280; line-height: 1.5; }
        .ap-detail-grid { display: grid; gap: 8px; margin-top: 12px; }
        .ap-detail-flex { display: flex; align-items: center; gap: 10px; }
      `}</style>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý dịch vụ</h1>
          <p className="admin-page-sub">Thêm, chỉnh sửa và quản lý danh sách dịch vụ.</p>
        </div>
        <button
          className="ap-btn ap-btn-primary"
          onClick={() => {
            setFormMode('create');
            setSelectedService(null);
            setFormData({ name: '', description: '', category: '', price: '', duration: '', image: '', status: 'ACTIVE' });
            setIsFormModalOpen(true);
          }}
        >
          + Thêm dịch vụ
        </button>
      </div>

      <div className="ap-card">
        <div className="ap-card-header">
          <span>Danh sách dịch vụ ({filtered.length})</span>
        </div>

        <div className="ap-filters">
          <input
            className="ap-search"
            placeholder="Tìm theo tên dịch vụ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {/* ĐÃ SỬA LỖI 1: Bổ sung aria-label phục vụ tiêu chuẩn axe/forms */}
          <select 
            className="ap-select" 
            aria-label="Lọc dịch vụ theo trạng thái hiển thị"
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="ap-empty ap-empty-margin">
            Đang tải dữ liệu dịch vụ...
          </div>
        ) : null}

        <table className="admin-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên dịch vụ</th>
              <th>Mô tả</th>
              <th>Giá</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>
                  <img src={s.image} alt={s.name} className="ap-img-thumb" />
                </td>
                <td className="ap-text-bold">{s.name}</td>
                <td className="ap-desc-cell">{s.description}</td>
                <td>{s.price.toLocaleString('vi-VN')}đ</td>
                <td>{s.duration} phút</td>
                <td>
                  <span className={`ap-status-badge ap-status-badge--${s.status}`}>
                    {STATUS_LABELS[s.status]}
                  </span>
                </td>
                <td className="ap-actions">
                  <button
                    className="ap-action-btn"
                    onClick={() => {
                      setSelectedService(s);
                      setIsViewModalOpen(true);
                    }}
                  >
                    👁 Xem
                  </button>
                  <button
                    className="ap-action-btn"
                    onClick={() => {
                      setFormMode('edit');
                      setSelectedService(s);
                      setFormData({
                        name: String((s as any).name || ''),
                        description: String((s as any).description || ''),
                        category: String((s as any).category || ''),
                        price: String((s as any).price || ''),
                        duration: String((s as any).duration || ''),
                        image: String((s as any).image || ''),
                        status: ((s as any).status === 'hidden' ? 'INACTIVE' : 'ACTIVE') as 'ACTIVE' | 'INACTIVE',
                      });
                      setIsFormModalOpen(true);
                    }}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    className="ap-action-btn ap-action-del"
                    onClick={() => {
                      const ok = confirm('Bạn có chắc muốn ẩn dịch vụ này không?');
                      if (!ok) return;
                      const id = (s as any)._id || (s as any).id;
                      serviceService
                        .updateService(String(id), { status: 'INACTIVE' })
                        .then(() => {
                          fetchServices();
                          alert('Đã ẩn dịch vụ');
                        })
                        .catch((err) => {
                          console.error(err);
                          alert('Ẩn dịch vụ thất bại');
                        });
                    }}
                  >
                    🗑 Xóa
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="ap-empty">Không có dịch vụ phù hợp.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Form create/edit */}
      {isFormModalOpen ? (
        <div
          className="ap-modal-overlay-custom"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsFormModalOpen(false);
          }}
        >
          <div className="ap-modal-custom">
            <div className="ap-modal-header-custom">
              <div className="ap-modal-title-custom">
                {formMode === 'create' ? 'Thêm dịch vụ' : 'Sửa dịch vụ'}
              </div>
              <button
                className="ap-action-btn"
                onClick={() => setIsFormModalOpen(false)}
                aria-label="Đóng biểu mẫu chỉnh sửa"
              >
                ✖
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const payload = {
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    price: formData.price,
                    duration: formData.duration,
                    image: formData.image,
                    status: formData.status,
                  };

                  if (formMode === 'create') {
                    await serviceService.createService(payload as any);
                  } else {
                    const id = selectedService?._id || (selectedService as any)?.id;
                    if (!id) throw new Error('Missing selectedService id');
                    await serviceService.updateService(String(id), payload as any);
                  }

                  setIsFormModalOpen(false);
                  setSelectedService(null);
                  setFormMode('create');
                  setFormData({ name: '', description: '', category: '', price: '', duration: '', image: '', status: 'ACTIVE' });
                  await fetchServices();
                } catch (err) {
                  console.error(err);
                  alert('Thao tác thất bại. Vui lòng thử lại.');
                }
              }}
            >
              <div className="ap-form-row">
                {/* ĐÃ SỬA LỖI 2: Đồng bộ cấu trúc liên kết id và htmlFor chuẩn axe/forms */}
                <div className="ap-form-group">
                  <label htmlFor="form-service-name">Tên dịch vụ</label>
                  <input
                    id="form-service-name"
                    className="ap-input"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="ap-form-group">
                  <label htmlFor="form-service-category">Danh mục</label>
                  <input
                    id="form-service-category"
                    className="ap-input"
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                    required
                  />
                </div>

                <div className="ap-form-group ap-form-full">
                  <label htmlFor="form-service-desc">Mô tả</label>
                  <input
                    id="form-service-desc"
                    className="ap-input"
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    required
                  />
                </div>

                <div className="ap-form-group">
                  <label htmlFor="form-service-price">Giá dịch vụ</label>
                  <input
                    id="form-service-price"
                    className="ap-input"
                    value={formData.price}
                    onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                    required
                    inputMode="numeric"
                  />
                </div>

                <div className="ap-form-group">
                  <label htmlFor="form-service-duration">Thời gian thực hiện</label>
                  <input
                    id="form-service-duration"
                    className="ap-input"
                    value={formData.duration}
                    onChange={(e) => setFormData((p) => ({ ...p, duration: e.target.value }))}
                    required
                    inputMode="numeric"
                  />
                </div>

                <div className="ap-form-group ap-form-full">
                  <label htmlFor="form-service-image">Ảnh/URL ảnh dịch vụ</label>
                  <input
                    id="form-service-image"
                    className="ap-input"
                    value={formData.image}
                    onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
                  />
                </div>

                <div className="ap-form-group ap-form-full">
                  <label htmlFor="form-service-status">Trạng thái kho</label>
                  <select
                    id="form-service-status"
                    className="ap-input"
                    aria-label="Cấu hình trạng thái hoạt động dịch vụ"
                    value={formData.status}
                    onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as any }))}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="ap-form-actions">
                <button type="button" className="ap-btn ap-btn-secondary" onClick={() => setIsFormModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="ap-btn ap-btn-primary">
                  {formMode === 'create' ? 'Tạo dịch vụ' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Modal: View detail */}
      {isViewModalOpen && selectedService ? (
        <div
          className="ap-modal-overlay-custom"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsViewModalOpen(false);
          }}
        >
          <div className="ap-modal-custom">
            <div className="ap-modal-header-custom">
              <div className="ap-modal-title-custom">Chi tiết hồ sơ dịch vụ</div>
              <button className="ap-action-btn" onClick={() => setIsViewModalOpen(false)} aria-label="Đóng hộp xem chi tiết">
                ✖
              </button>
            </div>

            <div className="ap-modal-grid-custom">
              <img
                src={selectedService.image}
                alt={selectedService.name}
                className="ap-img-large"
              />
              <div>
                <div className="ap-detail-title">{selectedService.name}</div>
                <div className="ap-detail-desc">{selectedService.description}</div>

                <div className="ap-detail-grid">
                  <div><b>Danh mục phân mục:</b> {(selectedService as any).category || ''}</div>
                  <div><b>Đơn giá niêm yết:</b> {selectedService.price.toLocaleString('vi-VN')}đ</div>
                  <div><b>Thời gian chiếm dụng ca:</b> {selectedService.duration} phút</div>
                  <div className="ap-detail-flex">
                    <b>Trạng thái hoạt động:</b>
                    <span className={`ap-status-badge ap-status-badge--${selectedService.status}`}>
                      {selectedService.status === 'active' ? 'Đang hoạt động' : 'Tạm ẩn'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};