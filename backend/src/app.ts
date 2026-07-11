import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import brandRoutes from './routes/brandRoutes';
import serviceRoutes from './routes/serviceRoutes';
import petRoutes from './routes/petRoutes';
import orderRoutes from './routes/orderRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import staffRoutes from './routes/staffRoutes';
import { notFound, errorHandler } from './middleware/errorHandler';


dotenv.config();

const app: Express = express();

// ==================== Middleware ====================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==================== Routes ====================
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server đang chạy bình thường' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/staff', staffRoutes);


app.use(notFound);
app.use(errorHandler);

export default app;
