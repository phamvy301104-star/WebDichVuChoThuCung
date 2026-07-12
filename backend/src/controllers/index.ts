import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import Category from '../models/Category';
import Brand from '../models/Brand';
import Service from '../models/Service';
import Pet from '../models/Pet';
import Booking from '../models/Booking';
import { config } from '../config/environment';
import { AuthRequest } from '../middleware/auth';
import { Request, Response } from 'express';

// tách serviceControlle và appointmentController ra khỏi file này để dễ quản lý
import { serviceController } from './serviceController';
import { appointmentController } from './appointmentController';
import { staffController } from './staffController';

const signToken = (user: any) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    } as any,
    config.JWT_SECRET as any,
    {
      expiresIn: config.JWT_EXPIRE,
    } as any
  );
};

const sanitizeUser = (user: any) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  phone: user.phone,
  address: user.address,
  avatar: user.avatar,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const authController = {
  register: async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp email, mật khẩu và tên.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email đã được sử dụng.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: 'user',
    });

    const token = signToken(user);

    res.status(201).json({
      success: true,
      data: {
        user: sanitizeUser(user),
        token,
      },
      message: 'Đăng ký thành công.',
    });
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp email và mật khẩu.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });
    }

    const token = signToken(user);

    res.json({
      success: true,
      data: {
        user: sanitizeUser(user),
        token,
      },
      message: 'Đăng nhập thành công.',
    });
  },

  me: async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });
    }

    res.json({ success: true, data: sanitizeUser(user) });
  },

  updateProfile: async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    const updates = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
    };

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });
    }

    res.json({ success: true, data: sanitizeUser(user), message: 'Cập nhật hồ sơ thành công.' });
  },
};

export const productController = {
  getProducts: async (req: Request, res: Response) => {
    const keyword = req.query.keyword as string;
    const query: any = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    const products = await Product.find(query).populate('category brand');
    res.json({ success: true, data: products });
  },

  getProductById: async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id).populate('category brand');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại.' });
    }
    res.json({ success: true, data: product });
  },

  createProduct: async (req: AuthRequest, res: Response) => {
    const { name, description, price, quantity, category, brand, image } = req.body;
    if (!name || !category || !brand) {
      return res.status(400).json({ success: false, message: 'Tên sản phẩm, danh mục và thương hiệu là bắt buộc.' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      quantity,
      category,
      brand,
      image,
      rating: 0,
      reviews: 0,
    });

    const newProduct = await product.populate('category brand');
    res.status(201).json({ success: true, data: newProduct, message: 'Sản phẩm đã được tạo.' });
  },

  updateProduct: async (req: AuthRequest, res: Response) => {
    const updates = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
      brand: req.body.brand,
      image: req.body.image,
    };

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('category brand');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại.' });
    }

    res.json({ success: true, data: product, message: 'Cập nhật sản phẩm thành công.' });
  },

  deleteProduct: async (req: AuthRequest, res: Response) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại.' });
    }
    res.json({ success: true, message: 'Sản phẩm đã được xóa.' });
  },
};

export const categoryController = {
  getCategories: async (_req: Request, res: Response) => {
    const categories = await Category.find();
    res.json({ success: true, data: categories });
  },

  createCategory: async (req: AuthRequest, res: Response) => {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Tên danh mục là bắt buộc.' });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Danh mục đã tồn tại.' });
    }

    const category = await Category.create({ name, description });
    res.status(201).json({ success: true, data: category, message: 'Danh mục đã được tạo.' });
  },

  updateCategory: async (req: AuthRequest, res: Response) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Danh mục không tồn tại.' });
    }
    res.json({ success: true, data: category, message: 'Cập nhật danh mục thành công.' });
  },

  deleteCategory: async (req: AuthRequest, res: Response) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Danh mục không tồn tại.' });
    }
    res.json({ success: true, message: 'Danh mục đã được xóa.' });
  },
};

export const brandController = {
  getBrands: async (_req: Request, res: Response) => {
    const brands = await Brand.find();
    res.json({ success: true, data: brands });
  },

  createBrand: async (req: AuthRequest, res: Response) => {
    const { name, logo } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Tên thương hiệu là bắt buộc.' });
    }

    const existing = await Brand.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Thương hiệu đã tồn tại.' });
    }

    const brand = await Brand.create({ name, logo });
    res.status(201).json({ success: true, data: brand, message: 'Thương hiệu đã được tạo.' });
  },

  updateBrand: async (req: AuthRequest, res: Response) => {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Thương hiệu không tồn tại.' });
    }
    res.json({ success: true, data: brand, message: 'Cập nhật thương hiệu thành công.' });
  },

  deleteBrand: async (req: AuthRequest, res: Response) => {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Thương hiệu không tồn tại.' });
    }
    res.json({ success: true, message: 'Thương hiệu đã được xóa.' });
  },
};


export const petController = {
  getPetsForSale: async (_req: Request, res: Response) => {
    const pets = await Pet.find({ status: 'for_sale' }).populate('owner');
    res.json({ success: true, data: pets });
  },

  getPetsForAdoption: async (_req: Request, res: Response) => {
    const pets = await Pet.find({ status: 'for_adoption' }).populate('owner');
    res.json({ success: true, data: pets });
  },

  getAllPets: async (_req: Request, res: Response) => {
    const pets = await Pet.find().populate('owner');
    res.json({ success: true, data: pets });
  },

  getPetById: async (req: Request, res: Response) => {
    const pet = await Pet.findById(req.params.id).populate('owner');
    if (!pet) return res.status(404).json({ success: false, message: 'Thú cưng không tồn tại.' });
    res.json({ success: true, data: pet });
  },

  createPet: async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập.' });
    const pet = await Pet.create({ ...req.body, owner: req.user.id });
    res.status(201).json({ success: true, data: pet });
  },

  updatePet: async (req: AuthRequest, res: Response) => {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pet) return res.status(404).json({ success: false, message: 'Thú cưng không tồn tại.' });
    res.json({ success: true, data: pet });
  },

  deletePet: async (req: AuthRequest, res: Response) => {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ success: false, message: 'Thú cưng không tồn tại.' });
    res.json({ success: true, message: 'Đã xóa thú cưng.' });
  },

  getMyPets: async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập.' });
    const pets = await Pet.find({ owner: req.user.id });
    res.json({ success: true, data: pets });
  },

  getAllAdoptionRequests: async (_req: Request, res: Response) => {
    res.json({ success: true, data: [] });
  },

  updateAdoptionRequestStatus: async (req: Request, res: Response) => {
    res.json({ success: true, message: 'Đã cập nhật trạng thái.' });
  },

  createAdoptionRequest: async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập.' });
    res.status(201).json({ success: true, message: 'Yêu cầu nhận nuôi đã được gửi.' });
  },
};

export const orderController = {
  createOrder: async (req: AuthRequest, res: Response) => {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập.' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Đơn hàng phải có ít nhất một sản phẩm.' });
    }

    const orderItems = items.map((item: any) => ({
      product: typeof item.product === 'string' && mongoose.Types.ObjectId.isValid(item.product)
        ? new mongoose.Types.ObjectId(item.product)
        : item.product,
      quantity: item.quantity,
      price: item.price,
    }));

    const totalPrice = orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalPrice,
      shippingAddress,
      paymentMethod,
    });

    res.status(201).json({ success: true, data: order, message: 'Đơn hàng đã được tạo.' });
  },

  getMyOrders: async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập.' });
    }

    const orders = await Order.find({ user: req.user.id }).populate('items.product').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  },

  getAllOrders: async (_req: Request, res: Response) => {
    const orders = await Order.find().populate('user items.product').sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  },

  getOrderById: async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập.' });
    }

    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại.' });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Không có quyền truy cập đơn hàng này.' });
    }

    res.json({ success: true, data: order });
  },

  updateOrder: async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập.' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại.' });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Không có quyền cập nhật đơn hàng này.' });
    }

    if (req.body.status) {
      order.status = req.body.status;
    }

    await order.save();
    res.json({ success: true, data: order, message: 'Cập nhật đơn hàng thành công.' });
  },

  cancelOrder: async (req: AuthRequest, res: Response) => {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Yêu cầu đăng nhập.' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại.' });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Không có quyền hủy đơn hàng này.' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ success: true, data: order, message: 'Đơn hàng đã được hủy.' });
  },
};

export {
  serviceController,
  appointmentController,
  staffController
};


