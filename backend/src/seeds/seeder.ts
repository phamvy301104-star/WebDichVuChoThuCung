import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/database';
import User from '../models/User';
import Category from '../models/Category';
import Brand from '../models/Brand';
import Product from '../models/Product';
import Service from '../models/Service';
import Pet from '../models/Pet';
import Staff from '../models/Staff';
import Booking from '../models/Booking';

// Helpers tính toán ngày dạng 'YYYY-MM-DD' cho năm 2026
const getRelativeDateString = (offsetDays: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
};

const sampleCategories = [
  { name: 'Thức ăn', description: 'Sản phẩm dinh dưỡng cho thú cưng.' },
  { name: 'Phụ kiện', description: 'Đồ dùng, túi xách và phụ kiện.' },
  { name: 'Chăm sóc', description: 'Sản phẩm vệ sinh và chăm sóc.' },
];

const sampleBrands = [{ name: 'Royal Canin' }, { name: 'PetJoy' }, { name: 'HappyPaws' }];

const sampleServices = [
  { name: 'Tắm & Cắt lông', description: 'Tắm sạch và cắt lông chuyên nghiệp.', category: 'Spa', price: 150000, duration: 90, status: 'ACTIVE' as const },
  { name: 'Khám sức khỏe thú cưng', description: 'Kiểm tra tổng quát và tư vấn.', category: 'Y tế', price: 200000, duration: 30, status: 'ACTIVE' as const },
  { name: 'Tiêm phòng', description: 'Tiêm đầy đủ vaccine cần thiết.', category: 'Y tế', price: 250000, duration: 15, status: 'ACTIVE' as const },
];

const samplePets = [
  { name: 'Max', species: 'Chó', breed: 'Golden Retriever', age: 3, image: 'https://placehold.co/400x300?text=Max', description: 'Max thân thiện.', status: 'for_adoption' },
  { name: 'Bella', species: 'Mèo', breed: 'Maine Coon', age: 1, image: 'https://placehold.co/400x300?text=Bella', description: 'Bella lanh lợi.', status: 'for_adoption' },
];

export const runSeeder = async () => {
  try {
    console.log('🌱 Đang dọn sạch dữ liệu cũ để tránh xung đột Schema...');
    
    // ĐÃ THÊM: Xóa sạch các bảng dữ liệu test liên quan đến đặt lịch để tránh bẫy dữ liệu cũ
    await Booking.deleteMany({});
    await Staff.deleteMany({});
    await Service.deleteMany({});
    await Pet.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Brand.deleteMany({});

    console.log('🌱 Đang khởi tạo dữ liệu mẫu hệ thống mới...');

    // 1. Seed Admin
    let adminUser = await User.findOne({ email: 'admin@petcare.com' });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminUser = await User.create({
        email: 'admin@petcare.com',
        password: hashedPassword,
        name: 'Admin PetCare',
        role: 'admin',
        isActive: true,
      });
      console.log('✅ Đã tạo tài khoản Admin mặc định: admin@petcare.com / admin123');
    }

    // 2. Seed Danh mục & Thương hiệu
    await Category.create(sampleCategories);
    await Brand.create(sampleBrands);
    console.log('✅ Đã khởi tạo Danh mục & Thương hiệu.');

    // 3. Seed Dịch vụ 
    await Service.create(sampleServices);
    console.log('✅ Đã khởi tạo danh sách Dịch vụ mới.');
    
    const servicesFromDB = await Service.find();
    const serviceMap = new Map(servicesFromDB.map(s => [s.name, s._id]));

    // 4. Seed Nhân viên (Map động ObjectId của Dịch vụ)
    await Staff.create([
      {
        name: 'Nguyễn Văn An',
        email: 'an@petcare.com',
        phone: '0901234567',
        position: 'Pet Groomer',
        status: 'active',
        services: [serviceMap.get('Tắm & Cắt lông')], 
        avatar: '',
      },
      {
        name: 'Trần Thị Bình',
        email: 'binh@petcare.com',
        phone: '0901234568',
        position: 'Veterinarian',
        status: 'active',
        services: [serviceMap.get('Khám sức khỏe thú cưng'), serviceMap.get('Tiêm phòng')],
        avatar: '',
      },
    ]);
    console.log('✅ Đã khởi tạo danh sách Nhân viên (Liên kết ObjectId chuẩn).');
    
    const staffsFromDB = await Staff.find();

    // 5. Seed Thú cưng
    const petsToCreate = samplePets.map(p => ({ ...p, owner: adminUser!._id }));
    await Pet.create(petsToCreate);
    console.log('✅ Đã khởi tạo dữ liệu Thú cưng mẫu.');

    // 6. Seed Đặt lịch (Khớp 100% logic mới)
    const tomorrowStr = getRelativeDateString(1); 
    const day2Str = getRelativeDateString(2);      

    const service0 = servicesFromDB.find(s => s.name === 'Tắm & Cắt lông');
    const service1 = servicesFromDB.find(s => s.name === 'Khám sức khỏe thú cưng');

    // Chốt chặn kiểm tra phòng hờ bảo vệ lỗi logic trống
    if (!service0 || !service1) {
      throw new Error('Lỗi tìm kiếm dịch vụ mẫu sau khi khởi tạo.');
    }

    await Booking.create([
      {
        user: adminUser._id,
        service: service0._id,
        customerName: 'Nguyễn Văn A',
        phone: '0901111111',
        email: 'demo1@gmail.com',
        petName: 'Lucky',
        petType: 'Chó',
        appointmentDate: tomorrowStr,
        appointmentTime: '09:00',
        duration: service0.duration, 
        endTime: '10:30',            
        note: 'Tắm cắt lông',
        status: 'assigned',
        staff: staffsFromDB[0]._id,  
      },
      {
        user: adminUser._id,
        service: service1._id,
        customerName: 'Trần Thị B',
        phone: '0902222222',
        email: 'demo2@gmail.com',
        petName: 'Mimi',
        petType: 'Mèo',
        appointmentDate: day2Str,
        appointmentTime: '14:00',
        duration: service1.duration, 
        endTime: '14:30',
        note: 'Khám định kỳ',
        status: 'assigned',
        staff: staffsFromDB[1]._id,  
      },
    ]);
    console.log('✅ Đã khởi tạo dữ liệu Đặt lịch mẫu.');

    console.log('🎉 Toàn bộ dữ liệu mẫu đã được nạp thành công!');
  } catch (error) {
    console.error('❌ Lỗi trong quá trình Seed dữ liệu:', error);
  }
};

if (require.main === module) {
  const execute = async () => {
    await connectDB();
    await runSeeder();
    await disconnectDB();
    process.exit(0);
  };
  execute();
}