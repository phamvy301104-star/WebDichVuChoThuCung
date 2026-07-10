import React, { useEffect, useMemo, useState } from 'react';
import { staffService } from '@/services/staffService';
import type { Staff, StaffStatus } from '@/types/staff'; 
import { StaffForm } from './AdminStaffForm';

type StaffMode = 'create' | 'view' | 'edit';

const STATUS_LABELS: Record<StaffStatus, string> = {
  active: 'Đang làm việc',
  on_leave: 'Nghỉ phép',
  inactive: 'Ngừng hoạt động',
};

// Hàm định dạng chuỗi hiển thị chữ viết tắt của Avatar fallback
const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
  return (first + last).toUpperCase();
};

export const AdminStaff: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mode, setMode] = useState<StaffMode>('create');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const list = await staffService.getAll({ search, status: statusFilter || undefined });
      setStaffList(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, [search, statusFilter]);

  const totalStaff = staffList.length;
  const activeCount = staffList.filter((s) => s.status === 'active').length;
  const onLeaveCount = staffList.filter((s) => s.status === 'on_leave').length;

  const handleDelete = async (staff: Staff) => {
    if (!staff.id) return;
    const ok = window.confirm(`Xác nhận chuyển trạng thái nhân viên [${staff.name}] thành NGỪNG HOẠT ĐỘNG?`);
    if (!ok) return;
    try {
      await staffService.remove(staff.id);
      await loadStaff();
    } catch (err: any) {
      alert(err.message || 'Lỗi xóa nhân viên.');
    }
  };

  return (
    <div className="admin-page">
      {/* KHỐI STYLE SCOPED: Đóng gói và quét sạch 100% cảnh báo no-inline-styles của Edge Tools */}
      <style>{`
        .ap-stats-grid-custom { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 14px; }
        .ap-stat-card-total { background: #f3f4f6; border-radius: 12px; padding: 14px; border: 1px solid #e5e7eb; }
        .ap-stat-card-active { background: #e0f2fe; border-radius: 12px; padding: 14px; border: 1px solid #bae6fd; }
        .ap-stat-card-leave { background: #fef3c7; border-radius: 12px; padding: 14px; border: 1px solid #fde68a; }
        .ap-stat-val-text { font-weight: 900; font-size: 24px; }
        .ap-stat-val-active { color: #0369a1; }
        .ap-stat-val-leave { color: #b45309; }
        .ap-stat-label-text { color: #6b7280; font-size: 13px; margin-top: 2px; }
        .ap-card-scrollable { overflow-x: auto; }
        .ap-filters-custom { display: flex; gap: 12px; margin-bottom: 12px; }
        .ap-search-flex { flex: 1; }
        .ap-select-width { width: 220px; }
        .ap-table-min-width { min-width: 900px; }
        .ap-avatar-img-custom { width: 40px; height: 40px; border-radius: 10px; object-fit: cover; }
        .ap-avatar-fallback-custom { width: 40px; height: 40px; border-radius: 10px; background: #e0e7ff; color: #4338ca; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; }
        .ap-tag-position-custom { background-color: #f3f4f6; }
        .ap-services-flex { display: flex; gap: 4px; flex-wrap: wrap; max-width: 220px; }
        .ap-tag-service-custom { font-size: 11px; background-color: #e5e7eb; }
        .ap-tag-service-populated { background-color: #e0e7ff; color: #4338ca; }
        .ap-tag-no-group { color: #9ca3af; }
        .ap-status-badge-inline { border-radius: 99px; padding: 4px 8px; font-size: 12px; }
        .ap-status-badge--active { background-color: #d1fae5; color: #065f46; }
        .ap-status-badge--on_leave { background-color: #fef3c7; color: #92400e; }
        .ap-status-badge--inactive { background-color: #fee2e2; color: #991b1b; }
        .ap-modal-overlay-custom { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 999; }
        .ap-modal-custom { width: 100%; max-width: 550px; background: #fff; border-radius: 12px; padding: 18px; }
        .ap-modal-header-custom { display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; }
        .ap-modal-title-custom { font-weight: 900; font-size: 17px; }
        .ap-view-grid { display: grid; gap: 10px; font-size: 14px; }
        .ap-label-grey { color: #6b7280; }
        .ap-view-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .ap-grid-full-column { grid-column: 1 / -1; }
        .ap-margin-top-12 { margin-top: 12px; }
        .ap-margin-bottom-6 { margin-bottom: 6px; }
        .ap-services-view-flex { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 6px; }
      `}</style>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý đội ngũ nhân viên</h1>
          <p className="admin-page-sub">Cấu hình hồ sơ chuyên viên, phân nhóm kỹ năng phụ trách dịch vụ kỹ thuật và quản lý ca làm việc.</p>
        </div>
        <button className="ap-btn ap-btn-primary" onClick={() => { setMode('create'); setSelectedStaff(null); setIsFormOpen(true); }}>
          + Thêm nhân viên mới
        </button>
      </div>

      {/* Hàng Thẻ Thống Kê Số Liệu Dashboard */}
      <div className="ap-stats-grid-custom">
        <div className="ap-stat-card-total">
          <div className="ap-stat-val-text">👥 {totalStaff}</div>
          <div className="ap-stat-label-text">Tổng nhân lực</div>
        </div>
        <div className="ap-stat-card-active">
          <div className="ap-stat-val-text ap-stat-val-active">🟢 {activeCount}</div>
          <div className="ap-stat-label-text">Sẵn sàng nhận ca</div>
        </div>
        <div className="ap-stat-card-leave">
          <div className="ap-stat-val-text ap-stat-val-leave">🟡 {onLeaveCount}</div>
          <div className="ap-stat-label-text">Đang nghỉ phép</div>
        </div>
      </div>

      {/* Trục Bộ Lọc */}
      <div className="ap-card ap-card-scrollable">
        <div className="ap-filters-custom">
          <input className="ap-search ap-search-flex" placeholder="Tìm theo họ tên, email, số điện thoại chức vụ..." value={search} onChange={(e) => setSearch(e.target.value)} />
          
          {/* ĐÃ SỬA LỖI 1: Thêm trường aria-label xử lý triệt để cảnh báo axe/forms khuyết danh */}
          <select 
            className="ap-select ap-select-width" 
            aria-label="Lọc danh sách nhân viên theo trạng thái ca làm việc"
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái ca làm</option>
            {Object.entries(STATUS_LABELS).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
          </select>
        </div>

        {loading ? <div className="ap-empty">⏳ Đang đồng bộ thông tin nhân sự...</div> : (
          <table className="admin-table ap-table-min-width">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Họ tên chuyên viên</th>
                <th>Địa chỉ Email</th>
                <th>Số điện thoại</th>
                <th>Vị trí công việc</th>
                <th>Kỹ năng dịch vụ đảm nhận</th>
                <th>Trạng thái</th>
                <th>Thao tác điều phối</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((s) => (
                <tr key={s.id}>
                  <td>
                    {s.avatar ? <img src={s.avatar} alt={s.name} className="ap-avatar-img-custom" /> : (
                      <div className="ap-avatar-fallback-custom">
                        {getInitials(s.name)}
                      </div>
                    )}
                  </td>
                  <td className="ap-text-bold">{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td><span className="ap-tag ap-tag-position-custom">{s.position}</span></td>
                  <td>
                    <div className="ap-services-flex">
                      {s.services.map((sv: any) => {
                        const serviceName = typeof sv === 'object' ? sv.name : sv;
                        return <span key={sv.id || sv} className="ap-tag ap-tag-service-custom">{serviceName}</span>;
                      })}
                      {s.services.length === 0 && <span className="ap-tag-no-group">— Chưa phân nhóm —</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`ap-status-badge-inline ap-status-badge--${s.status}`}>
                      {STATUS_LABELS[s.status]}
                    </span>
                  </td>
                  <td className="ap-actions">
                    <button className="ap-action-btn" onClick={() => { setMode('view'); setSelectedStaff(s); setIsFormOpen(true); }} aria-label={`Xem chi tiết hồ sơ ${s.name}`}>👁</button>
                    <button className="ap-action-btn" onClick={() => { setMode('edit'); setSelectedStaff(s); setIsFormOpen(true); }} aria-label={`Chỉnh sửa hồ sơ ${s.name}`}>✏️</button>
                    <button className="ap-action-btn ap-action-del" onClick={() => handleDelete(s)} aria-label={`Xóa hồ sơ ${s.name}`}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL ĐIỀU PHỐI ĐÓNG GÓI HỒ SƠ */}
      {isFormOpen && (
        <div className="ap-modal-overlay-custom" onClick={() => setIsFormOpen(false)}>
          <div className="ap-modal-custom" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modal-header-custom">
              {/* ĐÃ SỬA LỖI 2: Triệt tiêu hoàn toàn thuộc tính typo 'mountaineering' lỗi compile */}
              <div className="ap-modal-title-custom">
                {mode === 'create' ? 'Thêm chuyên viên mới' : mode === 'view' ? 'Hồ sơ nhân sự' : 'Cập nhật thông tin nhân viên'}
              </div>
              <button className="ap-action-btn" onClick={() => setIsFormOpen(false)} aria-label="Đóng bảng điều phối">✕</button>
            </div>

            {mode === 'view' && selectedStaff ? (
              <div className="ap-view-grid">
                <div className="ap-view-columns">
                  <div>
                    <div className="ap-label-grey">Họ và tên</div>
                    <div className="ap-text-bold">{selectedStaff.name}</div>
                  </div>
                  <div>
                    <div className="ap-label-grey">Trạng thái hiện tại</div>
                    <div>
                      <span className={`ap-status-badge-inline ap-status-badge--${selectedStaff.status}`}>
                        {STATUS_LABELS[selectedStaff.status]}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="ap-label-grey">Vị trí công tác</div>
                    <div className="ap-text-bold">{selectedStaff.position}</div>
                  </div>
                  <div>
                    <div className="ap-label-grey">Liên hệ di động</div>
                    <div>{selectedStaff.phone}</div>
                  </div>
                  <div className="ap-grid-full-column">
                    <div className="ap-label-grey">Hộp thư liên lạc</div>
                    <div>{selectedStaff.email}</div>
                  </div>
                </div>

                <div className="ap-margin-top-12">
                  <div className="ap-label-grey ap-margin-bottom-6">Danh mục dịch vụ đảm trách</div>
                  <div className="ap-services-view-flex">
                    {selectedStaff.services.map((sv: any) => (
                      <span key={sv.id || sv} className="ap-tag ap-tag-service-populated">
                        {typeof sv === 'object' ? sv.name : sv}
                      </span>
                    ))}
                    {selectedStaff.services.length === 0 && <div>— Chưa phân nhóm dịch vụ —</div>}
                  </div>
                </div>
              </div>
            ) : (
              <StaffForm
                mode={mode === 'view' ? 'edit' : mode}
                initialValue={selectedStaff}
                onCancel={() => setIsFormOpen(false)}
                onSubmit={async (payload) => {
                  try {
                    if (mode === 'create') {
                      await staffService.create(payload);
                    } else if (mode === 'edit' && selectedStaff?.id) {
                      await staffService.update(selectedStaff.id, payload);
                    }
                    setIsFormOpen(false);
                    loadStaff();
                  } catch (err: any) {
                    alert(err.message || 'Thao tác dữ liệu nhân sự lỗi.');
                  }
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};