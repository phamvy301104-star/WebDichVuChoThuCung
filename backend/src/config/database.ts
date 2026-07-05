import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from './environment';
import User from '../models/User';

const seedDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({ email: 'admin@petcare.com' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      email: 'admin@petcare.com',
      password: hashedPassword,
      name: 'Admin PetCare',
      role: 'admin',
      isActive: true,
    });
    console.log('✅ Default admin user created: admin@petcare.com / admin123');
  }
};

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Kết nối MongoDB thành công');
    await seedDefaultAdmin();
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ Ngắt kết nối MongoDB thành công');
  } catch (error) {
    console.error('❌ Lỗi ngắt kết nối MongoDB:', error);
  }
};
