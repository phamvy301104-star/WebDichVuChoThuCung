import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Coupon from '../models/Coupon';

// Lấy danh sách coupon khả dụng cho user
export const getAvailableCoupons = async (req: AuthRequest, res: Response) => {
  try {
    const { totalPrice } = req.query;
    const coupons = await Coupon.find({
      isActive: true,
      expiresAt: { $gt: new Date() },
      $expr: { $lt: ['$usedCount', '$usageLimit'] },
      minOrderValue: { $lte: Number(totalPrice) || 0 },
    }).select('-usedCount -usageLimit -__v');
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Kiểm tra mã khuyến mãi
export const validateCoupon = async (req: AuthRequest, res: Response) => {
  try {
    const { code, totalPrice } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Mã khuyến mãi không hợp lệ' });
    if (coupon.expiresAt < new Date()) return res.status(400).json({ success: false, message: 'Mã khuyến mãi đã hết hạn' });
    if (coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ success: false, message: 'Mã khuyến mãi đã hết lượt sử dụng' });
    if (totalPrice < coupon.minOrderValue)
      return res.status(400).json({ success: false, message: `Đơn hàng tối thiểu ${coupon.minOrderValue}đ để dùng mã này` });

    let discount = coupon.discountType === 'percent'
      ? (totalPrice * coupon.discountValue) / 100
      : coupon.discountValue;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);

    res.json({ success: true, data: { discount, finalPrice: Math.max(totalPrice - discount, 0), coupon } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// [Admin] Lấy tất cả coupon
export const getAllCoupons = async (req: AuthRequest, res: Response) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// [Admin] Tạo coupon
export const createCoupon = async (req: AuthRequest, res: Response) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (error: any) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Mã coupon đã tồn tại' });
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// [Admin] Cập nhật coupon
export const updateCoupon = async (req: AuthRequest, res: Response) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Không tìm thấy coupon' });
    res.json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// [Admin] Xóa coupon
export const deleteCoupon = async (req: AuthRequest, res: Response) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Không tìm thấy coupon' });
    res.json({ success: true, message: 'Đã xóa coupon' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
