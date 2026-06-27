import mongoose from 'mongoose';
import { config } from './environment';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Kết nối MongoDB thành công');
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
