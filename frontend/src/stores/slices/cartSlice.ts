import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  totalPrice: number;
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const pid = (product._id || product.id) as string;
      const existingItem = state.items.find((item) => item.productId === pid);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          productId: pid,
          product,
          quantity,
          price: product.price,
        });
      }

      state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
      state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    updateCartItem: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);
      if (item) {
        // enforce minimum quantity of 1; if caller wants to remove, use removeFromCart
        item.quantity = Math.max(1, Math.floor(quantity));
      }
      state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateCartItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
