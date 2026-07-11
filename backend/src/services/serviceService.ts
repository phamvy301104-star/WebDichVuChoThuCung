import Service, { IService, ServiceStatus } from '../models/Service';

interface GetServicesQuery {
  status?: string;
}

interface CreateServiceDTO {
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  image?: string;
  status?: ServiceStatus;
}

export const serviceService = {
  async getServices(query: GetServicesQuery): Promise<IService[]> {
    const filter: Record<string, any> = {};
    if (query.status) {
      filter.status = query.status.toUpperCase();
    }
    return await Service.find(filter).sort({ createdAt: -1 });
  },

  async getServiceById(id: string): Promise<IService> {
    const service = await Service.findById(id);
    if (!service) {
      throw new Error('Dịch vụ không tồn tại.');
    }
    return service;
  },

  async createService(data: CreateServiceDTO): Promise<IService> {
    if (!data.name?.trim()) throw new Error('Tên dịch vụ là bắt buộc.');
    if (!data.description?.trim()) throw new Error('Mô tả là bắt buộc.');
    if (!data.category?.trim()) throw new Error('Danh mục là bắt buộc.');
    if (data.price === undefined || isNaN(Number(data.price)) || data.price < 0) throw new Error('Giá dịch vụ không hợp lệ.');
    if (data.duration === undefined || isNaN(Number(data.duration)) || data.duration <= 0) throw new Error('Thời gian thực hiện không hợp lệ.');

    return await Service.create({
      name: data.name.trim(),
      description: data.description.trim(),
      category: data.category.trim(),
      price: Number(data.price),
      duration: Number(data.duration),
      image: data.image ? String(data.image) : undefined,
      status: data.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
    });
  },

  async updateService(id: string, data: Partial<CreateServiceDTO>): Promise<IService> {
    const updates: Record<string, any> = {};

    if (data.name !== undefined) updates.name = String(data.name).trim();
    if (data.description !== undefined) updates.description = String(data.description).trim();
    if (data.category !== undefined) updates.category = String(data.category).trim();
    if (data.price !== undefined) {
      if (isNaN(Number(data.price)) || Number(data.price) < 0) throw new Error('Giá phải là số dương.');
      updates.price = Number(data.price);
    }
    if (data.duration !== undefined) {
      if (isNaN(Number(data.duration)) || Number(data.duration) <= 0) throw new Error('Thời gian phải lớn hơn 0.');
      updates.duration = Number(data.duration);
    }
    if (data.image !== undefined) updates.image = data.image ? String(data.image) : undefined;
    if (data.status !== undefined) {
      updates.status = String(data.status).toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
    }

    const service = await Service.findByIdAndUpdate(id, updates, { new: true });
    if (!service) throw new Error('Dịch vụ không tồn tại.');
    return service;
  },

  async deleteService(id: string): Promise<IService> {
    const service = await Service.findByIdAndUpdate(id, { status: 'INACTIVE' }, { new: true });
    if (!service) throw new Error('Dịch vụ không tồn tại.');
    return service;
  },
};