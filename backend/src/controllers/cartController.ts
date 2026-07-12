import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Cart from '../models/Cart';
import Product from '../models/Product';

// Lấy giỏ hàng
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name image price quantity');
    if (!cart) return res.json({ success: true, data: { items: [], totalPrice: 0 } });
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Thêm sản phẩm vào giỏ
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    if (product.quantity < quantity) return res.status(400).json({ success: false, message: 'Sản phẩm không đủ số lượng' });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [], totalPrice: 0 });

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: product._id as any, quantity, price: product.price });
    }

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await cart.save();

    res.json({ success: true, message: 'Đã thêm vào giỏ hàng', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Cập nhật số lượng
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) return res.status(400).json({ success: false, message: 'Số lượng không hợp lệ' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    if (product.quantity < quantity) return res.status(400).json({ success: false, message: 'Sản phẩm không đủ số lượng' });

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: 'Giỏ hàng không tồn tại' });

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) return res.status(404).json({ success: false, message: 'Sản phẩm không có trong giỏ hàng' });

    item.quantity = quantity;
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await cart.save();

    res.json({ success: true, message: 'Đã cập nhật giỏ hàng', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Xóa sản phẩm khỏi giỏ
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: 'Giỏ hàng không tồn tại' });

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await cart.save();

    res.json({ success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ success: true, message: 'Đã xóa giỏ hàng' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
