import mongoose from 'mongoose';
import Booking, { IBooking, BookingStatus } from '../models/Booking';
import Service from '../models/Service';
import Staff from '../models/Staff';

// ==========================================
// CÁC HÀM TRỢ GIÚP ĐỔI THỜI GIAN (HH:mm)
// ==========================================
const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const minutesToTime = (mins: number): string => {
  const h = Math.floor(mins / 60).toString().padStart(2, '0');
  const m = (mins % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

interface CreateBookingInput {
  service: string;
  customerName: string;
  phone: string;
  email?: string;
  pet?: string;
  petName: string;
  petType: string;
  appointmentDate: string; // 'YYYY-MM-DD'
  appointmentTime: string; // 'HH:mm'
  note?: string;
  userId?: string;
}

export const appointmentService = {
  /**
   * Tạo lịch hẹn mới (Hỗ trợ thuật toán chặn trùng thông minh)
   */
  async create(data: CreateBookingInput): Promise<IBooking> {
    const { service, customerName, phone, email, pet, petName, petType, appointmentDate, appointmentTime, note, userId } = data;

    if (!service || !customerName || !phone || !petName || !petType || !appointmentDate || !appointmentTime) {
      throw new Error('Vui lòng điền đầy đủ thông tin bắt buộc.');
    }

    const serviceDoc = await Service.findById(service);
    if (!serviceDoc || serviceDoc.status !== 'ACTIVE') {
      throw new Error('Dịch vụ không tồn tại hoặc hiện đang tạm đóng.');
    }

    // Kiểm tra giờ làm việc hệ thống (8:00 - 17:00)
    const startTimeMins = timeToMinutes(appointmentTime);
    const endTimeMins = startTimeMins + serviceDoc.duration;
    const appointmentEndTime = minutesToTime(endTimeMins);

    if (startTimeMins < timeToMinutes('08:00') || endTimeMins > timeToMinutes('17:00')) {
      throw new Error(`Thời gian phục vụ vượt quá khung giờ làm việc (08:00 - 17:00). Dịch vụ này cần ${serviceDoc.duration} phút.`);
    }

    // KIỂM TRA THUẬT TOÁN TRÙNG LỊCH:
    // Tìm toàn bộ nhân viên ACTIVE có khả năng làm dịch vụ này
    const eligibleStaffs = await Staff.find({ status: 'active', services: serviceDoc._id });
    if (eligibleStaffs.length === 0) {
      throw new Error('Hiện tại không có nhân viên nào trống lịch cho dịch vụ này.');
    }

    // Quét xem có ít nhất một nhân viên không bị kẹt lịch trong khoảng (appointmentTime -> appointmentEndTime) hay không
    const freeStaffs = [];
    for (const staff of eligibleStaffs) {
      const isBusy = await Booking.findOne({
        staff: staff._id,
        appointmentDate,
        status: { $in: ['confirmed', 'assigned', 'in_progress'] },
        appointmentTime: { $lt: appointmentEndTime },
        endTime: { $gt: appointmentTime }
      });
      if (!isBusy) {
        freeStaffs.push(staff);
      }
    }

    if (freeStaffs.length === 0) {
      throw new Error('Xin lỗi, tất cả nhân viên đáp ứng dịch vụ này đã kín lịch vào khung giờ bạn chọn. Vui lòng chọn giờ khác.');
    }

    // Tạo booking sạch
    const booking = await Booking.create({
      user: userId ? new mongoose.Types.ObjectId(userId) : undefined,
      service: serviceDoc._id,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email?.trim().toLowerCase(),
      pet: pet ? new mongoose.Types.ObjectId(pet) : undefined,
      petName: petName.trim(),
      petType: petType.trim(),
      appointmentDate,
      appointmentTime,
      duration: serviceDoc.duration,
      endTime: appointmentEndTime,
      note: note?.trim(),
      status: 'pending',
    });

    return await booking.populate('service', 'name price');
  },

  async getAll(query: { status?: string; date?: string }): Promise<IBooking[]> {
    const filter: Record<string, any> = {};
    if (query.status) filter.status = query.status;
    if (query.date) filter.appointmentDate = query.date; // Query string phẳng 'YYYY-MM-DD' cực nhanh

    return await Booking.find(filter)
      .populate('service', 'name price duration')
      .populate('user', 'name email')
      .populate('staff', 'name phone position status')
      .sort({ appointmentDate: -1, appointmentTime: -1 });
  },

  async getMine(userId: string): Promise<IBooking[]> {
    return await Booking.find({ user: new mongoose.Types.ObjectId(userId) })
      .populate('service', 'name price')
      .populate('staff', 'name phone position')
      .sort({ createdAt: -1 });
  },

  async getById(id: string): Promise<IBooking> {
    const booking = await Booking.findById(id)
      .populate('service', 'name price duration')
      .populate('user', 'name email phone')
      .populate('staff', 'name phone position status');

    if (!booking) throw new Error('Lịch hẹn không tồn tại.');
    return booking;
  },

  /**
   * Khách hàng tự cập nhật thông tin lịch hẹn (Chỉ được phép khi trạng thái là pending)
   */
  async updateAppointment(id: string, userId: string, updateData: Partial<CreateBookingInput>): Promise<IBooking> {
    const booking = await Booking.findById(id);
    if (!booking) throw new Error('Lịch hẹn không tồn tại.');
    if (booking.user?.toString() !== userId) throw new Error('Bạn không có quyền chỉnh sửa lịch hẹn này.');
    if (booking.status !== 'pending') throw new Error('Lịch hẹn đã được xử lý, không thể tự ý sửa đổi.');

    const allowedUpdates: Record<string, any> = {};
    if (updateData.customerName) allowedUpdates.customerName = updateData.customerName.trim();
    if (updateData.phone) allowedUpdates.phone = updateData.phone.trim();
    if (updateData.petName) allowedUpdates.petName = updateData.petName.trim();
    if (updateData.note) allowedUpdates.note = updateData.note.trim();

    const updatedBooking = await Booking.findByIdAndUpdate(id, allowedUpdates, { new: true }).populate('service', 'name price');
    return updatedBooking!;
  },

  /**
   * Khách hàng tự hủy lịch hẹn
   */
  async cancelAppointment(id: string, userId: string, reason?: string): Promise<IBooking> {
    const booking = await Booking.findById(id);
    if (!booking) throw new Error('Lịch hẹn không tồn tại.');
    if (booking.user?.toString() !== userId) throw new Error('Bạn không có quyền hủy lịch hẹn này.');
    if (['completed', 'cancelled'].includes(booking.status)) throw new Error('Lịch hẹn đã kết thúc hoặc đã hủy từ trước.');

    booking.status = 'cancelled';
    if (reason) booking.note = `${booking.note || ''} [Lý do hủy: ${reason}]`.trim();
    
    await booking.save();
    return booking;
  },

  /**
   * Khách hàng đánh giá chất lượng dịch vụ sau khi hoàn thành
   */
  async reviewAppointment(id: string, userId: string, data: { rating: number; reviewText?: string }): Promise<IBooking> {
    const booking = await Booking.findById(id);
    if (!booking) throw new Error('Lịch hẹn không tồn tại.');
    if (booking.user?.toString() !== userId) throw new Error('Bạn không có quyền đánh giá lịch hẹn này.');
    if (booking.status !== 'completed') throw new Error('Chỉ có thể đánh giá dịch vụ sau khi lịch hẹn hoàn thành.');

    // Tiến hành cập nhật điểm số trung bình vào Model Service
    const serviceDoc = await Service.findById(booking.service);
    if (serviceDoc) {
      const currentTotalRating = serviceDoc.rating * serviceDoc.reviews;
      serviceDoc.reviews += 1;
      serviceDoc.rating = Number(((currentTotalRating + data.rating) / serviceDoc.reviews).toFixed(1));
      await serviceDoc.save();
    }

    booking.note = `${booking.note || ''} [Đánh giá: ${data.rating}⭐ - ${data.reviewText || ''}]`.trim();
    await booking.save();
    return booking;
  },

  async updateStatus(id: string, status: BookingStatus): Promise<IBooking> {
    const booking = await Booking.findById(id);
    if (!booking) throw new Error('Lịch hẹn không tồn tại.');

    booking.status = status;
    await booking.save();

    return await booking.populate(['service', 'staff']);
  },

  /**
   * Admin điều phối gán nhân viên (Tích hợp thuật toán chặn Admin xếp trùng lịch nhân viên)
   */
  async assignStaff(id: string, staffId: string): Promise<IBooking> {
    if (!staffId) throw new Error('staffId là bắt buộc.');

    const booking = await Booking.findById(id);
    if (!booking) throw new Error('Lịch hẹn không tồn tại.');

    const staff = await Staff.findById(staffId);
    if (!staff) throw new Error('Nhân viên không tồn tại.');
    if (staff.status !== 'active') throw new Error('Nhân viên hiện đang nghỉ phép hoặc không hoạt động.');

    // Kiểm tra xem nhân viên này có kỹ năng làm dịch vụ này không
    if (!staff.services.includes(booking.service)) {
      throw new Error(`Nhân viên ${staff.name} không có kỹ năng thực hiện dịch vụ này.`);
    }

    // THUẬT TOÁN PHÒNG CHỐNG TRÙNG LỊCH CHO NHÂN VIÊN (Anti Double-Booking)
    const isEmployeeBusy = await Booking.findOne({
      _id: { $ne: booking._id }, // Ngoại trừ chính lịch hẹn đang cấu hình
      staff: staffId,
      appointmentDate: booking.appointmentDate,
      status: { $in: ['confirmed', 'assigned', 'in_progress'] },
      appointmentTime: { $lt: booking.endTime }, // Thời gian bắt đầu lịch khác nhỏ hơn giờ kết thúc lịch này
      endTime: { $gt: booking.appointmentTime }  // Thời gian kết thúc lịch khác lớn hơn giờ bắt đầu lịch này
    });

    if (isEmployeeBusy) {
      throw new Error(`Nhân viên ${staff.name} đã bị trùng lịch làm việc khác từ ${isEmployeeBusy.appointmentTime} đến ${isEmployeeBusy.endTime} cùng ngày.`);
    }

    booking.staff = staff._id;
    booking.status = 'assigned';
    await booking.save();

    return await booking.populate(['service', 'user', 'staff']);
  },
};