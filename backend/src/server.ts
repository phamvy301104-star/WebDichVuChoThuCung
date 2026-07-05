import app from './app';
import { connectDB } from './config/database';
import { config } from './config/environment';

const PORT = config.PORT;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại port ${PORT}`);
    console.log(`Environment: ${config.NODE_ENV}`);
  });
};

startServer().catch((error) => {
  console.error('❌ Lỗi khởi động server:', error);
  process.exit(1);
});
