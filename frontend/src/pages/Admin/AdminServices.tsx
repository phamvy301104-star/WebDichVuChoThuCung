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

const STATUS_COLORS: Record<ServiceStatusFE, React.CSSProperties> = {
  active: { background: '#d1fae5', color: '#065f46' },
  hidden: { background: '#f3f4f6', color: '#6b7280' },
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

  const fetchServicesWithState = async () => {
    await fetchServices();
  };



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
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý dịch vụ</h1>
          <p className="admin-page-sub">Thêm, chỉnh sửa và quản lý danh sách dịch vụ.</p>
        </div>
        <button
          className="ap-btn ap-btn-primary"
          onClick={() => {
            console.log('Click add service');
            setFormMode('create');
            setSelectedService(null);
            setFormData({
              name: '',
              description: '',
              category: '',
              price: '',
              duration: '',
              image: '',
              status: 'ACTIVE',
            });
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
          <select className="ap-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="ap-empty" style={{ marginTop: 12 }}>
            Đang tải...
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
                  <img src={s.image} alt={s.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                </td>
                <td style={{ fontWeight: 600 }}>{s.name}</td>
                <td style={{ color: '#6b7280', maxWidth: 240 }}>{s.description}</td>
                <td>{s.price.toLocaleString('vi-VN')}đ</td>
                <td>{s.duration} phút</td>
                <td>
                  <span className="ap-status-badge" style={STATUS_COLORS[s.status]}>
                    {STATUS_LABELS[s.status]}
                  </span>
                </td>
                <td className="ap-actions">
                  <button
                    className="ap-action-btn"
                    onClick={() => {
                      console.log('Click view', s);
                      setSelectedService(s);
                      setIsViewModalOpen(true);
                    }}
                  >
                    👁 Xem
                  </button>
                  <button
                    className="ap-action-btn"
                    onClick={() => {
                      console.log('Click edit', s);
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
                      console.log('Click delete', s);
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
          className="ap-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsFormModalOpen(false);
          }}
        >
          <div
            className="ap-modal"
            style={{
              width: '100%',
              maxWidth: 760,
              background: '#fff',
              borderRadius: 12,
              padding: 18,
              boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>
                {formMode === 'create' ? 'Thêm dịch vụ' : 'Sửa dịch vụ'}
              </div>
              <button
                className="ap-action-btn"
                onClick={() => setIsFormModalOpen(false)}
                aria-label="Đóng"
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
                  setFormData({
                    name: '',
                    description: '',
                    category: '',
                    price: '',
                    duration: '',
                    image: '',
                    status: 'ACTIVE',
                  });
                  await fetchServices();
                } catch (err) {
                  console.error(err);
                  alert('Thao tác thất bại. Vui lòng thử lại.');
                }
              }}
            >
              <div className="ap-form-row">
                <div className="ap-form-group">
                  <label>Tên dịch vụ</label>
                  <input
                    className="ap-input"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="ap-form-group">
                  <label>Danh mục</label>
                  <input
                    className="ap-input"
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                    required
                  />
                </div>

                <div className="ap-form-group ap-form-full">
                  <label>Mô tả</label>
                  <input
                    className="ap-input"
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    required
                  />
                </div>

                <div className="ap-form-group">
                  <label>Giá</label>
                  <input
                    className="ap-input"
                    value={formData.price}
                    onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                    required
                    inputMode="numeric"
                  />
                </div>

                <div className="ap-form-group">
                  <label>Thời gian</label>
                  <input
                    className="ap-input"
                    value={formData.duration}
                    onChange={(e) => setFormData((p) => ({ ...p, duration: e.target.value }))}
                    required
                    inputMode="numeric"
                  />
                </div>

                <div className="ap-form-group ap-form-full">
                  <label>Ảnh/URL ảnh</label>
                  <input
                    className="ap-input"
                    value={formData.image}
                    onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
                  />
                </div>

                <div className="ap-form-group ap-form-full">
                  <label>Trạng thái</label>
                  <select
                    className="ap-input"
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
          className="ap-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsViewModalOpen(false);
          }}
        >
          <div
            className="ap-modal"
            style={{
              width: '100%',
              maxWidth: 760,
              background: '#fff',
              borderRadius: 12,
              padding: 18,
              boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>Chi tiết dịch vụ</div>
              <button className="ap-action-btn" onClick={() => setIsViewModalOpen(false)} aria-label="Đóng">
                ✖
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16, alignItems: 'start' }}>
              <img
                src={selectedService.image}
                alt={selectedService.name}
                style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 12, border: '1px solid #f3f4f6' }}
              />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: 8 }}>{selectedService.name}</div>

                <div style={{ marginBottom: 8, color: '#6b7280', lineHeight: 1.5 }}>{selectedService.description}</div>

                <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
                  <div><b>Danh mục:</b> {(selectedService as any).category || ''}</div>
                  <div><b>Giá:</b> {selectedService.price.toLocaleString('vi-VN')}đ</div>
                  <div><b>Thời gian:</b> {selectedService.duration} phút</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <b>Trạng thái:</b>
                    <span
                      className="ap-status-badge"
                      style={{
                        background: selectedService.status === 'active' ? '#d1fae5' : '#f3f4f6',
                        color: selectedService.status === 'active' ? '#065f46' : '#6b7280',
                      }}
                    >
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

