import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import serviceReducer from './slices/serviceSlice';
import petReducer from './slices/petSlice';
import appointmentReducer from './slices/appointmentSlice';
import shopReducer from './slices/shopSlice';
import bookingReducer from './slices/bookingSlice';
import petMgmtReducer from './slices/petMgmtSlice';
import contactReducer from './slices/contactSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    service: serviceReducer,
    pet: petReducer,
    appointment: appointmentReducer,
    shop: shopReducer,
    booking: bookingReducer,
    petMgmt: petMgmtReducer,
    contact: contactReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
