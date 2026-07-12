import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/database';
import User from '../models/User';

const seed = async () => {
  await connectDB();

  const existing = await User.findOne({ email: 'admin@petcare.com' });
  if (existing) {
    console.log('⚠️  Tài khoản admin đã tồn tại');
    await disconnectDB();
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  await User.create({
    email: 'admin@petcare.com',
    password: hashedPassword,
    name: 'Admin',
    role: 'admin',
    isActive: true,
  });

  console.log('✅ Tạo tài khoản admin thành công');
  console.log('   Email   : admin@petcare.com');
  console.log('   Password: Admin@123');

  await disconnectDB();
};

seed().catch((err) => {
  console.error('❌ Lỗi seed:', err);
  process.exit(1);
});
