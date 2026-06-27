import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();

// ==================== Middleware ====================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== Routes ====================
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server đang chạy bình thường' });
});

// Routes sẽ được thêm ở đây
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/services', serviceRoutes);
// app.use('/api/pets', petRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/admin', adminRoutes);

// ==================== Error Handling ====================
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Lỗi nội bộ server',
  });
});

export default app;
