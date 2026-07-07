import React, { useMemo, useState } from 'react';
import { serviceService } from '@services/serviceService';
import type { Booking } from '@/types';

// admin page dùng appointmentService để cập nhật trạng thái
import { appointmentService } from '@services/appointmentService';

type AppointmentStatus = Booking['status'];

interface AppointmentRow {
  id: string;
  customer: string;
  phone: string;
  pet: string;
  service: string;
  staff: string;
  datetime: string;
  status: AppointmentStatus;
}

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  // FE Booking type hiện không có 'in_progress' nên để runtime vẫn hiển thị được
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
} as any;

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: 'background:#fef3c7;color:#92400e',
  confirmed: 'background:#dbeafe;color:#1e40af',
  completed: 'background:#d1fae5;color:#065f46',
  cancelled: 'background:#fee2e2;color:#991b1b',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  in_progress: 'background:#ede9fe;color:#6d28d9' as any,
} as any;


function parseStyle(styleStr: string) {
  return Object.fromEntries(
    styleStr
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.split(':'))
      .filter((kv) => kv.length === 2),
  ) as React.CSSProperties;
}

export const AdminAppointments: React.FC = () => {
  const [appointments, setAppointments] = React.useState<AppointmentRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | AppointmentStatus>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  // NOTE: Backend hiện tại không hỗ trợ filter status/date từ FE trong route.
  // Ta lọc client-side sau khi fetch để giữ đúng UI nghiệp vụ.
  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await serviceService.getAllBookings();
      const list = (data as any)?.data ?? data;
      const rows: AppointmentRow[] = (list as unknown as any[]).map((b) => {
        const id = b._id ?? b.id;
        const serviceName = b.service?.name ?? '';
        const staffName = b.staff?.name ?? '';
        const pet = `${b.petName ?? ''}${b.petType ? ` (${b.petType})` : ''}`.trim();
        const datePart = b.appointmentDate ? new Date(b.appointmentDate).toLocaleDateString('vi-VN') : '';
        const timePart = b.appointmentTime ?? '';
        const datetime = `${datePart}${timePart ? ` ${timePart}` : ''}`.trim();
        return {
          id: String(id),
          customer: b.customerName ?? '',
          phone: b.phone ?? '',
          pet,
          service: serviceName,
          staff: staffName,
          datetime,
          status: b.status,
        };
      });
      setAppointments(rows);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Lỗi khi tải lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(
    () =>
      appointments.filter((a) => {
        const kw = search.toLowerCase();
        const matchSearch =
          a.customer.toLowerCase().includes(kw) ||
          a.phone.includes(kw) ||
          a.pet.toLowerCase().includes(kw) ||
          a.service.toLowerCase().includes(kw) ||
          a.staff.toLowerCase().includes(kw);
        const matchStatus = statusFilter ? a.status === statusFilter : true;

        const matchDate = dateFilter
          ? (() => {
              const apptDateStr = a.datetime.split(' ')[0];
              return apptDateStr === new Date(dateFilter).toLocaleDateString('vi-VN');
            })()
          : true;

        return matchSearch && matchStatus && matchDate;
      }),
    [appointments, search, statusFilter, dateFilter],
  );

  const handleUpdateStatus = async (id: string, nextStatus: AppointmentStatus) => {
    try {
      await appointmentService.updateAppointmentStatus(id, nextStatus);
      await refresh();
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || 'Cập nhật trạng thái thất bại');
    }
  };

  const handleCancelWithConfirm = async (id: string) => {
    const ok = window.confirm('Bạn có chắc chắn muốn hủy lịch này không?');
    if (!ok) return;
    await handleUpdateStatus(id, 'cancelled');
  };

  const stats = useMemo(() => {
    const list = filtered.length ? filtered : appointments;
    return {
      total: list.length,
      pending: list.filter((x) => x.status === 'pending').length,
      confirmed: list.filter((x) => x.status === 'confirmed').length,
      completed: list.filter((x) => x.status === 'completed').length,
      cancelled: list.filter((x) => x.status === 'cancelled').length,
    };
  }, [appointments, filtered]);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý lịch hẹn</h1>
          <p className="admin-page-sub">Xem và quản lý toàn bộ lịch hẹn dịch vụ của khách hàng.</p>
        </div>
        <button className="ap-btn ap-btn-secondary" onClick={refresh}>
          Làm mới
        </button>
      </div>

      {/* A. Top stats cards */}
      <div className="ap-stats-grid ap-stats-grid--appointments">
        <div className="ap-stat ap-stat--total">
          <span className="ap-stat-icon">📅</span>
          <div className="ap-stat-body">
            <div className="ap-stat-value">{stats.total}</div>
            <div className="ap-stat-label">Tổng lịch hẹn</div>
          </div>
        </div>

        <div className="ap-stat ap-stat--pending">
          <span className="ap-stat-icon">⏳</span>
          <div className="ap-stat-body">
            <div className="ap-stat-value">{stats.pending}</div>
            <div className="ap-stat-label">Chờ xác nhận</div>
          </div>
        </div>

        <div className="ap-stat ap-stat--confirmed">
          <span className="ap-stat-icon">✅</span>
          <div className="ap-stat-body">
            <div className="ap-stat-value">{stats.confirmed}</div>
            <div className="ap-stat-label">Đã xác nhận</div>
          </div>
        </div>

        <div className="ap-stat ap-stat--completed">
          <span className="ap-stat-icon">🏁</span>
          <div className="ap-stat-body">
            <div className="ap-stat-value">{stats.completed}</div>
            <div className="ap-stat-label">Hoàn thành</div>
          </div>
        </div>

        <div className="ap-stat ap-stat--cancelled">
          <span className="ap-stat-icon">🚫</span>
          <div className="ap-stat-body">
            <div className="ap-stat-value">{stats.cancelled}</div>
            <div className="ap-stat-label">Đã hủy</div>
          </div>
        </div>
      </div>

      {/* B. Filters */}
      <div className="ap-card ap-card--appointments">
        <div className="ap-card-header ap-card-header--appointments">
          <span>Danh sách lịch hẹn ({filtered.length})</span>
        </div>

        <div className="ap-filters ap-filters--appointments">
          <input
            className="ap-search"
            placeholder="Tìm theo tên khách / số điện thoại / thú cưng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="ap-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          <input
            className="ap-search"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="ap-empty">Đang tải lịch hẹn...</div>
        ) : error ? (
          <div className="ap-empty">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="ap-empty">Không có lịch hẹn phù hợp.</div>
        ) : (
          <div className="ap-appointments-list">
            {filtered.map((a) => (
              <div key={a.id} className="ap-appointment-card">
                <div className="ap-appointment-card__grid">
                  <div className="ap-appointment-card__customer">
                    <div className="ap-appointment-card__customerName">{a.customer}</div>
                    <div className="ap-appointment-card__customerPhone">{a.phone}</div>
                  </div>

                  <div className="ap-appointment-card__service">
                    <div className="ap-appointment-card__pet">{a.pet}</div>
                    <div className="ap-appointment-card__serviceName">{a.service}</div>
                  </div>

                  <div className="ap-appointment-card__status">
                    <span
                      className="ap-status-pill"
                      style={parseStyle(STATUS_COLORS[a.status])}
                    >
                      {STATUS_LABELS[a.status]}
                    </span>
                    <div className="ap-appointment-card__staff">Nhân viên: {a.staff}</div>
                  </div>

                  <div className="ap-appointment-card__meta">
                    <div className="ap-appointment-card__datetime">{a.datetime}</div>

                    <div className="ap-appointment-card__actions">
                      {a.status === 'pending' && (
                        <>
                          <button
                            className="ap-icon-btn ap-icon-btn--ok"
                            onClick={() => handleUpdateStatus(a.id, 'confirmed')}
                            aria-label="Xác nhận"
                            title="✓ Xác nhận"
                          >
                            ✓
                          </button>
                          <button
                            className="ap-icon-btn ap-icon-btn--danger"
                            onClick={() => handleCancelWithConfirm(a.id)}
                            aria-label="Hủy"
                            title="✕ Hủy"
                          >
                            ✕
                          </button>
                        </>
                      )}

                      {a.status === 'confirmed' && (
                        <>
                          <button
                            className="ap-icon-btn ap-icon-btn--ok"
                            onClick={() => handleUpdateStatus(a.id, 'completed')}
                            aria-label="Hoàn thành"
                            title="✓ Hoàn thành"
                          >
                            ✓
                          </button>
                          <button
                            className="ap-icon-btn ap-icon-btn--danger"
                            onClick={() => handleCancelWithConfirm(a.id)}
                            aria-label="Hủy"
                            title="✕ Hủy"
                          >
                            ✕
                          </button>
                        </>
                      )}

                      {a.status === 'completed' && (
                        <span className="ap-appointment-card__noActions">Đã hoàn thành</span>
                      )}

                      {a.status === 'cancelled' && (
                        <span className="ap-appointment-card__noActions">Đã hủy</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

