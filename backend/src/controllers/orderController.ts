import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import Coupon from '../models/Coupon';

// Tạo đơn hàng từ giỏ hàng (thanh toán)
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { shippingAddress, paymentMethod, couponCode } = req.body;

    if (!shippingAddress || !paymentMethod)
      return res.status(400).json({ success: false, message: 'Thiếu địa chỉ hoặc phương thức thanh toán' });

    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống' });

    // Kiểm tra tồn kho
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product || product.quantity < item.quantity)
        return res.status(400).json({ success: false, message: `Sản phẩm không đủ số lượng` });
    }

    // Áp dụng mã khuyến mãi
    let discount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (!coupon) return res.status(400).json({ success: false, message: 'Mã khuyến mãi không hợp lệ' });
      if (coupon.expiresAt < new Date()) return res.status(400).json({ success: false, message: 'Mã khuyến mãi đã hết hạn' });
      if (coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ success: false, message: 'Mã khuyến mãi đã hết lượt sử dụng' });
      if (cart.totalPrice < coupon.minOrderValue)
        return res.status(400).json({ success: false, message: `Đơn hàng tối thiểu ${coupon.minOrderValue}đ để dùng mã này` });

      discount = coupon.discountType === 'percent'
        ? (cart.totalPrice * coupon.discountValue) / 100
        : coupon.discountValue;

      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
      appliedCoupon = coupon;
    }

    const finalPrice = Math.max(cart.totalPrice - discount, 0);

    // Tạo đơn hàng
    const order = await Order.create({
      user: req.user.id,
      items: cart.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: cart.totalPrice,
      discount,
      finalPrice,
      couponCode: appliedCoupon?.code,
      shippingAddress,
      paymentMethod,
      status: 'pending',
    });

    // Tăng usedCount coupon
    if (appliedCoupon) await Coupon.findByIdAndUpdate(appliedCoupon._id, { $inc: { usedCount: 1 } });

    // Trừ tồn kho
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { quantity: -item.quantity } });
    }

    // Xóa giỏ hàng
    await Cart.findOneAndDelete({ user: req.user.id });

    res.status(201).json({ success: true, message: 'Đặt hàng thành công', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy danh sách đơn hàng của user
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy chi tiết đơn hàng
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id }).populate('items.product', 'name image price');
    if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Hủy đơn hàng
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    if (order.status !== 'pending')
      return res.status(400).json({ success: false, message: 'Chỉ có thể hủy đơn hàng đang chờ xử lý' });

    order.status = 'cancelled';
    await order.save();

    // Hoàn lại tồn kho
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { quantity: item.quantity } });
    }

    res.json({ success: true, message: 'Đã hủy đơn hàng', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// [Admin] Lấy tất cả đơn hàng
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// [Admin] Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });

    res.json({ success: true, message: 'Đã cập nhật trạng thái', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
