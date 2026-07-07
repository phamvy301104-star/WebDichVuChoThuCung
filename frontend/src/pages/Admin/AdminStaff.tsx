import React, { useEffect, useMemo, useState } from 'react';
import { staffService, type Staff } from '@/services/staffService';
import { StaffForm } from './AdminStaffForm';

type StaffMode = 'create' | 'view' | 'edit';



const STATUS_LABELS: Record<Staff['status'], string> = {
  active: 'Đang làm việc',
  on_leave: 'Nghỉ phép',
  inactive: 'Ngừng hoạt động',
};

const STATUS_COLORS: Record<Staff['status'], React.CSSProperties> = {
  active: { background: '#d1fae5', color: '#065f46' },
  on_leave: { background: '#fef3c7', color: '#92400e' },
  inactive: { background: '#fee2e2', color: '#991b1b' },
};

export const AdminStaff: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states (thêm/xem/sửa)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mode, setMode] = useState<StaffMode>('create');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const list = await staffService.getAll({ search, status: statusFilter || undefined });
      setStaffList(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  const filtered = useMemo(() => {
    return staffList;
  }, [staffList]);

  const totalStaff = staffList.length;
  const activeCount = staffList.filter((s) => s.status === 'active').length;
  const onLeaveCount = staffList.filter((s) => s.status === 'on_leave').length;
  const avgRating = useMemo(() => {
    return 0.0;
  }, []);


  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
    return (first + last).toUpperCase();
  };

  const handleAddStaff = () => {
    setMode('create');
    setSelectedStaff(null);
    setIsFormOpen(true);
  };

  const handleView = (staff: Staff) => {
    setMode('view');
    setSelectedStaff(staff);
    setIsFormOpen(true);
  };

  const handleEdit = (staff: Staff) => {
    setMode('edit');
    setSelectedStaff(staff);
    setIsFormOpen(true);
  };

  const handleDelete = async (staff: Staff) => {
    const ok = window.confirm(`Xác nhận xóa nhân viên: ${staff.name}?`);
    if (!ok) return;

    await staffService.remove(staff.id);
    await loadStaff();
  };


  const renderAvatar = (s: Staff) => {

    if (s.avatar) {
      return (
        <img
          src={s.avatar}
          alt={s.name}
          style={{ width: 44, height: 44, borderRadius: 14, objectFit: 'cover' }}
        />
      );
    }
    return (
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: 'rgba(99,102,241,0.12)',
          color: '#4f46e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 14,
          border: '1px solid rgba(99,102,241,0.25)',
        }}
      >
        {getInitials(s.name)}
      </div>
    );
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý nhân viên</h1>
          <p className="admin-page-sub">Thêm, chỉnh sửa và quản lý danh sách nhân viên.</p>
        </div>
        <button className="ap-btn ap-btn-primary" onClick={handleAddStaff}>
          + Thêm nhân viên
        </button>

      </div>

      {/* 1) Top stats */}

      <div className="ap-stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: 12,
        marginBottom: 14,
      }}>
        <div
          className="ap-stat"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(56,189,248,0.10))',
            borderRadius: 18,
            boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
            padding: 14,
            border: '1px solid rgba(99,102,241,0.18)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 20 }}>👥</div>
            <div style={{ width: 10 }} />
          </div>
          <div style={{ fontWeight: 900, fontSize: 26, marginTop: 8 }}>{totalStaff}</div>
          <div style={{ color: '#6b7280', fontSize: 13, marginTop: 2 }}>Tổng nhân viên</div>
        </div>

        <div
          className="ap-stat"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(59,130,246,0.08))',
            borderRadius: 18,
            boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
            padding: 14,
            border: '1px solid rgba(16,185,129,0.20)',
          }}
        >
          <div style={{ fontSize: 20 }}>🟢</div>
          <div style={{ fontWeight: 900, fontSize: 26, marginTop: 8 }}>{activeCount}</div>
          <div style={{ color: '#6b7280', fontSize: 13, marginTop: 2 }}>Đang làm việc</div>
        </div>

        <div
          className="ap-stat"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.14), rgba(251,191,36,0.10))',
            borderRadius: 18,
            boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
            padding: 14,
            border: '1px solid rgba(245,158,11,0.22)',
          }}
        >
          <div style={{ fontSize: 20 }}>🟡</div>
          <div style={{ fontWeight: 900, fontSize: 26, marginTop: 8 }}>{onLeaveCount}</div>
          <div style={{ color: '#6b7280', fontSize: 13, marginTop: 2 }}>Nghỉ phép</div>
        </div>

        <div
          className="ap-stat"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.14), rgba(236,72,153,0.08))',
            borderRadius: 18,
            boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
            padding: 14,
            border: '1px solid rgba(99,102,241,0.20)',
          }}
        >
          <div style={{ fontSize: 20 }}>⭐</div>
          <div style={{ fontWeight: 900, fontSize: 26, marginTop: 8 }}>{avgRating.toFixed(1)}</div>
          <div style={{ color: '#6b7280', fontSize: 13, marginTop: 2 }}>Rating trung bình</div>
        </div>
      </div>

      {/* 2) Filters row */}
      <div className="ap-card" style={{ overflowX: 'auto' }}>
        <div className="ap-card-header" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <span>Danh sách nhân viên ({filtered.length})</span>
        </div>

        <div className="ap-filters" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 12,
        }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <input
              className="ap-search"
              placeholder="Tìm theo tên, email, số điện thoại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ width: 260, minWidth: 220 }}>
            <select
              className="ap-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">Tất cả trạng thái</option>
              {Object.entries(STATUS_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 3) Staff table */}
        <table className="admin-table" style={{ minWidth: 980 }}>
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Chức vụ</th>
              <th>Dịch vụ phụ trách</th>
              <th>Trạng thái</th>
              <th>Rating</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} style={{ transition: 'all 150ms ease' }}>
                <td>{renderAvatar(s)}</td>
                <td style={{ fontWeight: 700 }}>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>{s.position}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {s.services.map((sv) => (
                      <span key={sv} className="ap-tag">{sv}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <span
                    className="ap-status-badge"
                    style={{
                      ...STATUS_COLORS[s.status],
                      fontWeight: 700,
                      borderRadius: 999,
                      padding: '6px 10px',
                      display: 'inline-block',
                    }}
                  >
                    {STATUS_LABELS[s.status]}
                  </span>
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span title="Rating">⭐</span>
                    <span style={{ fontWeight: 700 }}>{(0.0).toFixed(1)}</span>
                  </div>
                </td>

                <td className="ap-actions" style={{ whiteSpace: 'nowrap' }}>
                  <button
                    className="ap-action-btn"
                    title="Xem" aria-label="Xem"
                    onClick={() => handleView(s)}
                  >
                    👁
                  </button>
                  <button
                    className="ap-action-btn"
                    title="Sửa" aria-label="Sửa"
                    onClick={() => handleEdit(s)}
                  >
                    ✏️
                  </button>
                  <button
                    className="ap-action-btn ap-action-del"
                    title="Xóa" aria-label="Xóa"
                    onClick={() => handleDelete(s)}
                  >
                    🗑
                  </button>
                </td>

              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="ap-empty">Không có nhân viên phù hợp.</td></tr>
            )}
          </tbody>
        </table>
      {/* Modal render */}
      {isFormOpen && (
        <div
          className="ap-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setIsFormOpen(false)}
        >
          <div
            className="ap-modal"
            style={{
              width: 'min(640px, calc(100vw - 24px))',
              background: '#fff',
              borderRadius: 16,
              padding: 16,
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ fontWeight: 900, fontSize: 18 }}>
                {mode === 'create'
                  ? 'Thêm nhân viên'
                  : mode === 'view'
                    ? 'Thông tin nhân viên'
                    : 'Chỉnh sửa nhân viên'}
              </div>
              <button
                className="ap-btn"
                onClick={() => setIsFormOpen(false)}
                style={{
                  border: '1px solid rgba(0,0,0,0.12)',
                  background: 'transparent',
                  padding: '6px 10px',
                  borderRadius: 10,
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginTop: 12 }}>
              {mode === 'view' ? (
                <div>
                  <div style={{ marginBottom: 10, color: '#6b7280' }}>
                    {selectedStaff ? `Mã: ${selectedStaff.id}` : ''}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>Họ tên</div>
                      <div style={{ fontWeight: 800 }}>{selectedStaff?.name ?? '-'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>Trạng thái</div>
                      <div style={{ fontWeight: 800 }}>{selectedStaff ? STATUS_LABELS[selectedStaff.status] : '-'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>Email</div>
                      <div>{selectedStaff?.email ?? '-'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>Số điện thoại</div>
                      <div>{selectedStaff?.phone ?? '-'}</div>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>Chức vụ</div>
                      <div style={{ fontWeight: 800 }}>{selectedStaff?.position ?? '-'}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Dịch vụ phụ trách</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {(selectedStaff?.services ?? []).map((sv) => (
                        <span key={sv} className="ap-tag">
                          {sv}
                        </span>
                      ))}
                      {(!selectedStaff?.services || selectedStaff.services.length === 0) && <div>-</div>}
                    </div>
                  </div>
                </div>
              ) : (
                <StaffForm
                  mode={mode}
                  initialValue={selectedStaff}
                  onCancel={() => setIsFormOpen(false)}
                  onSubmit={async (payload) => {
                    if (mode === 'create') {
                      await staffService.create(payload);
                    } else if (mode === 'edit' && selectedStaff) {
                      await staffService.update(selectedStaff.id, payload);
                    }
                    await loadStaff();
                    setIsFormOpen(false);
                  }}
                />
              )}

            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};


