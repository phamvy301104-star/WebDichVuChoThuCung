import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Staff, { StaffStatus } from '../models/Staff';

const normalizeStatus = (value: any): StaffStatus | undefined => {
  if (!value) return undefined;
  const s = String(value).toLowerCase();
  if (s === 'active' || s === 'on_leave' || s === 'on_leave ' || s === 'onleave') return 'on_leave';
  if (s === 'inactive') return 'inactive';
  if (s === 'active') return 'active';
  if (s === 'on_leave' || s === 'on-leave') return 'on_leave';
  if (s === 'on_leave ' ) return 'on_leave';
  return undefined;
};

export const staffController = {
  getAll: async (req: Request, res: Response) => {
    const { search, status } = req.query;

    const filter: any = {};

    if (status) {
      const normalized = normalizeStatus(status);
      if (normalized) filter.status = normalized;
    }

    if (search && typeof search === 'string') {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
      ];
    }

    const staffs = await Staff.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: staffs });
  },

  getById: async (req: Request, res: Response) => {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Nhân viên không tồn tại.' });
    res.json({ success: true, data: staff });
  },

  create: async (req: AuthRequest, res: Response) => {
    const { name, email, phone, position, status, services, avatar } = req.body;

    if (!name || !email || !phone || !position || !status) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đủ thông tin bắt buộc.' });
    }

    const normalizedStatus = normalizeStatus(status);
    if (!normalizedStatus) {
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
    }

    const existing = await Staff.findOne({ email: String(email).toLowerCase() });
    if (existing) return res.status(400).json({ success: false, message: 'Email nhân viên đã tồn tại.' });

    const staff = await Staff.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      position: String(position).trim(),
      status: normalizedStatus,
      services: Array.isArray(services) ? services.map((x: any) => String(x)) : [],
      avatar: avatar ? String(avatar) : undefined,
    });

    res.status(201).json({ success: true, data: staff, message: 'Tạo nhân viên thành công.' });
  },

  update: async (req: AuthRequest, res: Response) => {
    const { name, email, phone, position, status, services, avatar } = req.body;

    const updates: any = {};

    if (name !== undefined) updates.name = String(name).trim();
    if (email !== undefined) updates.email = String(email).trim().toLowerCase();
    if (phone !== undefined) updates.phone = String(phone).trim();
    if (position !== undefined) updates.position = String(position).trim();
    if (avatar !== undefined) updates.avatar = avatar ? String(avatar) : undefined;

    if (status !== undefined) {
      const normalizedStatus = normalizeStatus(status);
      if (!normalizedStatus) return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
      updates.status = normalizedStatus;
    }

    if (services !== undefined) {
      updates.services = Array.isArray(services) ? services.map((x: any) => String(x)) : [];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'Không có dữ liệu cập nhật.' });
    }

    const staff = await Staff.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!staff) return res.status(404).json({ success: false, message: 'Nhân viên không tồn tại.' });

    res.json({ success: true, data: staff, message: 'Cập nhật nhân viên thành công.' });
  },

  remove: async (req: AuthRequest, res: Response) => {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Nhân viên không tồn tại.' });
    res.json({ success: true, message: 'Xóa nhân viên thành công.' });
  },
};

