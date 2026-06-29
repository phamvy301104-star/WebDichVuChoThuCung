import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Service, Booking } from "@types/index";

interface ServiceState {
  services: Service[];
  selectedService: Service | null;
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  selectedService: null,
  bookings: [],
  loading: false,
  error: null,
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setServices: (state, action: PayloadAction<Service[]>) => {
      state.services = action.payload;
      state.loading = false;
    },
    setSelectedService: (state, action: PayloadAction<Service | null>) => {
      state.selectedService = action.payload;
    },
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setServices,
  setSelectedService,
  setBookings,
  addBooking,
  setError,
  clearError,
} = serviceSlice.actions;
export default serviceSlice.reducer;
