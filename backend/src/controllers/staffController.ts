import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { staffService } from '../services/staffService';
import { generateResponse } from '../utils/helpers';

export const staffController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const staffs = await staffService.getAll(req.query);
      return res.json(generateResponse(true, 'Lấy danh sách nhân viên thành công.', staffs));
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const staff = await staffService.getById(req.params.id);
      return res.json(generateResponse(true, 'Lấy thông tin nhân viên thành công.', staff));
    } catch (error) {
      next(error);
    }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const staff = await staffService.create(req.body);
      return res.status(201).json(generateResponse(true, 'Tạo nhân viên thành công.', staff));
    } catch (error) {
      next(error);
    }
  },

  update: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const staff = await staffService.update(req.params.id, req.body);
      return res.json(generateResponse(true, 'Cập nhật nhân viên thành công.', staff));
    } catch (error) {
      next(error);
    }
  },

  remove: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await staffService.remove(req.params.id);
      return res.json(generateResponse(true, 'Ẩn nhân viên thành công.'));
    } catch (error) {
      next(error);
    }
  },
};