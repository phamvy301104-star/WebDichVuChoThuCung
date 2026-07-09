import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// CHẶN LỖ HỔNG BẢO MẬT: Bắt buộc cấu hình đầy đủ ở môi trường thật
if (isProduction) {
  if (!process.env.MONGODB_URI) {
    throw new Error('🚨 BIẾN MÔI TRƯỜNG THIẾU: MONGODB_URI là bắt buộc ở môi trường Production!');
  }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-jwt-secret') {
    throw new Error('🚨 BẢO MẬT YẾU: Bắt buộc phải thay đổi mật mã JWT_SECRET mặc định ở Production!');
  }
}

export const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/petcare',
  JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret',
  REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE || '30d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
  UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads/',
};