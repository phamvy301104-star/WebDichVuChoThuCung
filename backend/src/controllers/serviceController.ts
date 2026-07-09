import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { serviceService } from '../services/serviceService';
import { generateResponse } from '../utils/helpers';

export const serviceController = {
  getServices: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const services = await serviceService.getServices(req.query);
      return res.json(generateResponse(true, 'Lấy danh sách dịch vụ thành công.', services));
    } catch (error) {
      next(error);
    }
  },

  getServiceById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const service = await serviceService.getServiceById(req.params.id);
      return res.json(generateResponse(true, 'Lấy chi tiết dịch vụ thành công.', service));
    } catch (error) {
      next(error);
    }
  },

  createService: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const service = await serviceService.createService(req.body);
      return res.status(201).json(generateResponse(true, 'Dịch vụ đã được tạo.', service));
    } catch (error) {
      next(error);
    }
  },

  updateService: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const service = await serviceService.updateService(req.params.id, req.body);
      return res.json(generateResponse(true, 'Cập nhật dịch vụ thành công.', service));
    } catch (error) {
      next(error);
    }
  },

  deleteService: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const service = await serviceService.deleteService(req.params.id);
      return res.json(generateResponse(true, 'Ẩn dịch vụ thành công.', service));
    } catch (error) {
      next(error);
    }
  },
};