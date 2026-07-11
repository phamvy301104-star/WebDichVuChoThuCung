import React, { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchAppointmentsThunk, 
  assignStaffThunk 
} from '@/stores/slices/appointmentSlice';
import { appointmentService } from '@/services/appointmentService';
import { staffService } from '@/services/staffService';
import type { RootState, AppDispatch } from '@/stores/store';
import type { Booking, BookingStatus } from '@/types/booking';
import type { Staff } from '@/types/staff';

interface AppointmentRow {
  id: string;
  customer: string;
  phone: string;
  pet: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  rawDate: string; 
  datetime: string;
  status: BookingStatus;
}

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  assigned: 'Đã xếp nhân viên',
  in_progress: 'Đang thực hiện',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

const formatCleanDate = (dateStr: string) => {
  if (!dateStr || !dateStr.includes('-')) return dateStr;
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

export const AdminAppointments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, loading, error: reduxError } = useSelector((state: RootState) => state.appointment);

  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | BookingStatus>('');
  const [dateFilter, setDateFilter] = useState<string>('');

  const refresh = () => {
    setLocalError(null);
    dispatch(fetchAppointmentsThunk());
    staffService.getAll({ status: 'active' })
      .then((data) => setStaffList(data))
      .catch((err) => console.error('Lỗi tải danh sách nhân viên:', err));
  };

  useEffect(() => {
    refresh();
  }, [dispatch]);

  const rows: AppointmentRow[] = useMemo(() => {
    return appointments.map((b: Booking) => {
      const id = b.id ?? b._id;
      const petInfo = `${b.petName ?? ''}${b.petType ? ` (${b.petType})` : ''}`.trim();
      const cleanDate = formatCleanDate(b.appointmentDate);
      const datetime = `${cleanDate} (${b.appointmentTime} - ${b.endTime ?? ''})`.trim();

      return {
        id: String(id),
        customer: b.customerName ?? '',
        phone: b.phone ?? '',
        pet: petInfo,
        serviceId: b.service?.id ?? '',
        serviceName: b.service?.name ?? 'Dịch vụ ẩn',
        staffId: b.staff?.id ?? '',
        staffName: b.staff?.name ?? 'Chưa phân công',
        rawDate: b.appointmentDate, 
        datetime,
        status: b.status,
      };
    });
  }, [appointments]);

  const filtered = useMemo(() => {
    return rows.filter((a) => {
      const kw = search.toLowerCase();
      const matchSearch =
        a.customer.toLowerCase().includes(kw) ||
        a.phone.includes(kw) ||
        a.pet.toLowerCase().includes(kw) ||
        a.serviceName.toLowerCase().includes(kw) ||
        a.staffName.toLowerCase().includes(kw);
      
      const matchStatus = statusFilter ? a.status === statusFilter : true;
      const matchDate = dateFilter ? a.rawDate === dateFilter : true;

      return matchSearch && matchStatus && matchDate;
    });
  }, [rows, search, statusFilter, dateFilter]);

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      pending: appointments.filter((x) => x.status === 'pending').length,
      confirmed: appointments.filter((x) => ['confirmed', 'assigned', 'in_progress'].includes(x.status)).length,
      completed: appointments.filter((x) => x.status === 'completed').length,
      cancelled: appointments.filter((x) => x.status === 'cancelled').length,
    };
  }, [appointments]);

  const handleUpdateStatus = async (id: string, nextStatus: BookingStatus) => {
    try {
      setLocalError(null);
      await appointmentService.updateAppointmentStatus(id, nextStatus);
      dispatch(fetchAppointmentsThunk());
    } catch (e: any) {
      setLocalError(e.message || 'Cập nhật tiến trình lịch hẹn thất bại.');
    }
  };

  const handleAssignStaff = async (bookingId: string, staffId: string) => {
    if (!staffId) return;
    try {
      setLocalError(null);
      const resultAction = await dispatch(assignStaffThunk({ id: bookingId, staffId }));
      if (assignStaffThunk.rejected.match(resultAction)) {
        alert(resultAction.payload as string);
      } else {
        alert('Phân công chuyên viên phụ trách lịch hẹn thành công!');
      }
    } catch (e: any) {
      setLocalError(e.message || 'Phân công nhân viên lỗi.');
    }
  };

  const displayError = localError || reduxError;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quản lý điều phối lịch hẹn</h1>
          <p className="admin-page-sub">Xem danh sách hồ sơ, duyệt ca và phân phối nhân viên xử lý công việc cửa hàng.</p>
        </div>
        <button className="ap-btn ap-btn-secondary" onClick={refresh} disabled={loading}>
          🔄 Tải lại dữ liệu
        </button>
      </div>

      <div className="ap-stats-grid ap-stats-grid--appointments">
        <div className="ap-stat ap-stat--total">
          <span className="ap-stat-icon">📅</span>
          <div className="ap-stat-body">
            <div className="ap-stat-value">{stats.total}</div>
            <div className="ap-stat-label">Tổng đơn đặt lịch</div>
          </div>
        </div>
        <div className="ap-stat ap-stat--pending">
          <span className="ap-stat-icon">⏳</span>
          <div className="ap-stat-body">
            <div className="ap-stat-value">{stats.pending}</div>
            <div className="ap-stat-label">Chờ duyệt ca</div>
          </div>
        </div>
        <div className="ap-stat ap-stat--confirmed">
          <span className="ap-stat-icon">⚡</span>
          <div className="ap-stat-body">
            <div className="ap-stat-value">{stats.confirmed}</div>
            <div className="ap-stat-label">Đang vận hành</div>
          </div>
        </div>
        <div className="ap-stat ap-stat--completed">
          <span className="ap-stat-icon">🏁</span>
          <div className="ap-stat-body">
            <div className="ap-stat-value">{stats.completed}</div>
            <div className="ap-stat-label">Đã hoàn thành</div>
          </div>
        </div>
        <div className="ap-stat ap-stat--cancelled">
          <span className="ap-stat-icon">🚫</span>
          <div className="ap-stat-body">
            <div className="ap-stat-value">{stats.cancelled}</div>
            <div className="ap-stat-label">Đã hủy bỏ</div>
          </div>
        </div>
      </div>

      <div className="ap-card ap-card--appointments">
        <div className="ap-card-header ap-card-header--appointments">
          <span>Hồ sơ danh sách hiển thị thực tế ({filtered.length})</span>
        </div>

        <div className="ap-filters ap-filters--appointments">
          <input
            className="ap-search"
            placeholder="Tìm nhanh tên khách / SĐT / tên pet / tên nhân viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="ap-select"
            aria-label="Lọc theo trạng thái hồ sơ lịch đặt"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="">Tất cả trạng thái xử lý</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="assigned">Đã gán nhân viên</option>
            <option value="in_progress">Đang thực hiện</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          <input
            className="ap-search"
            type="date"
            aria-label="Lọc danh sách theo ngày hẹn đến"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        {displayError && <div className="appointment__error ap-error-box">{displayError}</div>}

        {loading ? (
          <div className="ap-empty">⏳ Đang đồng bộ hóa kho dữ liệu đặt lịch...</div>
        ) : filtered.length === 0 ? (
          <div className="ap-empty">📭 Không tìm thấy lịch đặt chỗ nào khớp điều kiện tìm kiếm.</div>
        ) : (
          <div className="ap-appointments-list">
            {filtered.map((a) => (
              <div key={a.id} className="ap-appointment-card">
                <div className="ap-appointment-card__grid">
                  
                  <div className="ap-appointment-card__customer">
                    <div className="ap-appointment-card__customerName">👤 {a.customer}</div>
                    <div className="ap-appointment-card__customerPhone">📞 SĐT: {a.phone}</div>
                  </div>

                  <div className="ap-appointment-card__service">
                    <div className="ap-appointment-card__pet">🐾 Bé: <b>{a.pet}</b></div>
                    <div className="ap-appointment-card__serviceName">🛠️ {a.serviceName}</div>
                  </div>

                  <div className="ap-appointment-card__status">
                    {/* ĐÃ SỬA CHUẨN: Bọc ngoặc nhọn thực thi hàm hiển thị nhãn dịch */}
                    <span className={`ap-status-pill ap-status-pill--${a.status}`}>
                      {STATUS_LABELS[a.status]}
                    </span>
                    
                    <div className="ap-appointment-card__staffSelectZone ap-margin-top-8">
                      {['pending', 'confirmed', 'assigned'].includes(a.status) ? (
                        <select
                          className="ap-select ap-select-staff-inline"
                          aria-label="Chỉ định chuyên viên kỹ thuật nhận ca làm việc"
                          value={a.staffId}
                          onChange={(e) => handleAssignStaff(a.id, e.target.value)}
                        >
                          <option value="">-- Chỉ định chuyên viên --</option>
                          {staffList.map((st) => (
                            <option key={st.id} value={st.id}>
                              {st.name} ({st.position})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="ap-appointment-card__staff">🧑‍⚕️ Phụ trách: <b>{a.staffName}</b></div>
                      )}
                    </div>
                  </div>

                  <div className="ap-appointment-card__meta">
                    <div className="ap-appointment-card__datetime">⏰ {a.datetime}</div>

                    <div className="ap-appointment-card__actions ap-margin-top-8">
                      {a.status === 'pending' && (
                        <>
                          <button className="ap-btn ap-btn-primary ap-btn-primary-inline" onClick={() => handleUpdateStatus(a.id, 'confirmed')}>
                            Duyệt lịch
                          </button>
                          <button className="ap-btn ap-btn-secondary ap-btn-danger-inline" onClick={() => handleUpdateStatus(a.id, 'cancelled')}>
                            Từ chối
                          </button>
                        </>
                      )}

                      {a.status === 'confirmed' && (
                        <span className="ap-appointment-card__noActions ap-text-waiting">⚠️ Chờ xếp nhân viên</span>
                      )}

                      {a.status === 'assigned' && (
                        <button className="ap-btn ap-btn-primary ap-btn-progress-inline" onClick={() => handleUpdateStatus(a.id, 'in_progress')}>
                          Bắt đầu làm
                        </button>
                      )}

                      {a.status === 'in_progress' && (
                        <button className="ap-btn ap-btn-primary ap-btn-complete-inline" onClick={() => handleUpdateStatus(a.id, 'completed')}>
                          Hoàn thành đơn
                        </button>
                      )}

                      {a.status === 'completed' && (
                        <span className="ap-appointment-card__noActions ap-text-completed">🏁 Ca làm việc kết thúc</span>
                      )}

                      {a.status === 'cancelled' && (
                        <span className="ap-appointment-card__noActions ap-text-cancelled">❌ Lịch đã hủy bỏ</span>
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