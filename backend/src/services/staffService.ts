import mongoose from 'mongoose';
import Staff, { IStaff, StaffStatus } from '../models/Staff';

interface GetStaffQuery {
  search?: string;
  status?: string;
}

interface CreateStaffDTO {
  name: string;
  email: string;
  phone: string;
  position: string;
  status: string;
  services?: string[];
  avatar?: string;
}

const normalizeStatus = (value: any): StaffStatus | undefined => {
  if (!value) return undefined;
  const s = String(value).toLowerCase().trim();
  if (s === 'active') return 'active';
  if (s === 'inactive') return 'inactive';
  if (s === 'on_leave' || s === 'onleave' || s === 'on-leave') return 'on_leave';
  return undefined;
};

export const staffService = {
  async getAll(query: GetStaffQuery): Promise<IStaff[]> {
    const { search, status } = query;
    const filter: Record<string, any> = {};

    if (status) {
      const normalized = normalizeStatus(status);
      if (normalized) filter.status = normalized;
    }

    if (search?.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } },
        { position: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    return await Staff.find(filter).populate('services', 'name price').sort({ createdAt: -1 });
  },

  async getById(id: string): Promise<IStaff> {
    const staff = await Staff.findById(id).populate('services', 'name price');
    if (!staff) throw new Error('Nhân viên không tồn tại.');
    return staff;
  },

  async create(data: CreateStaffDTO): Promise<IStaff> {
    const { name, email, phone, position, status, services, avatar } = data;

    if (!name || !email || !phone || !position || !status) {
      throw new Error('Vui lòng cung cấp đủ thông tin bắt buộc.');
    }

    const normalizedStatus = normalizeStatus(status);
    if (!normalizedStatus) throw new Error('Trạng thái không hợp lệ.');

    const existing = await Staff.findOne({ email: String(email).toLowerCase() });
    if (existing) throw new Error('Email nhân viên đã tồn tại.');

    // Chuyển đổi các chuỗi ID dịch vụ thành ObjectId hợp lệ
    const serviceIds = Array.isArray(services) 
      ? services.map(id => new mongoose.Types.ObjectId(id)) 
      : [];

    return await Staff.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      position: String(position).trim(),
      status: normalizedStatus,
      services: serviceIds,
      avatar: avatar ? String(avatar) : undefined,
    });
  },

  async update(id: string, data: Partial<CreateStaffDTO>): Promise<IStaff> {
    const updates: Record<string, any> = {};

    if (data.name !== undefined) updates.name = String(data.name).trim();
    if (data.email !== undefined) updates.email = String(data.email).trim().toLowerCase();
    if (data.phone !== undefined) updates.phone = String(data.phone).trim();
    if (data.position !== undefined) updates.position = String(data.position).trim();
    if (data.avatar !== undefined) updates.avatar = data.avatar ? String(data.avatar) : undefined;

    if (data.status !== undefined) {
      const normalizedStatus = normalizeStatus(data.status);
      if (!normalizedStatus) throw new Error('Trạng thái không hợp lệ.');
      updates.status = normalizedStatus;
    }

    if (data.services !== undefined) {
      updates.services = Array.isArray(data.services)
        ? data.services.map(sid => new mongoose.Types.ObjectId(sid))
        : [];
    }

    const staff = await Staff.findByIdAndUpdate(id, updates, { new: true });
    if (!staff) throw new Error('Nhân viên không tồn tại.');
    return staff;
  },

  async remove(id: string): Promise<IStaff> {
    const staff = await Staff.findByIdAndUpdate(id, { status: 'inactive' }, { new: true });
    if (!staff) throw new Error('Nhân viên không tồn tại.');
    return staff;
  },
};