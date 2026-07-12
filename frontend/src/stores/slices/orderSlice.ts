import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@types/index';

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  name: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

interface OrderState {
  orders: Order[];
}

const initialState: OrderState = {
  orders: JSON.parse(localStorage.getItem('petcare_orders') || '[]'),
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    placeOrder: (state, action: PayloadAction<Omit<Order, 'id' | 'status' | 'createdAt'>>) => {
      const newOrder: Order = {
        ...action.payload,
        id: 'ORD' + Date.now(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      state.orders.unshift(newOrder);
      localStorage.setItem('petcare_orders', JSON.stringify(state.orders));
    },
    cancelOrder: (state, action: PayloadAction<string>) => {
      const order = state.orders.find(o => o.id === action.payload);
      if (order) order.status = 'cancelled';
      localStorage.setItem('petcare_orders', JSON.stringify(state.orders));
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: Order['status'] }>) => {
      const order = state.orders.find(o => o.id === action.payload.id);
      if (order) order.status = action.payload.status;
      localStorage.setItem('petcare_orders', JSON.stringify(state.orders));
    },
  },
});

export const { placeOrder, cancelOrder, updateOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
