import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StoreSettings {
  name: string;
  slogan: string;
  description: string;
  phone: string;
  phone2: string;
  email: string;
  emailSupport: string;
  address: string;
  district: string;
  city: string;
  hoursWeekday: string;
  hoursWeekend: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  zalo: string;
  youtube: string;
  mapLink: string;
  warranty: string;
  // Payment settings
  codEnabled: boolean;
  codNote: string;
  bankEnabled: boolean;
  bankName: string;
  bankNumber: string;
  bankOwner: string;
  bankBranch: string;
  momoEnabled: boolean;
  momoPhone: string;
  momoName: string;
  momoNote: string;
  freeShipMinOrder: number;
  shippingFee: number;
}

const DEFAULT: StoreSettings = {
  name: 'PetCare - Chăm sóc thú cưng',
  slogan: 'Yêu thương thú cưng từ trái tim',
  description: 'PetCare cung cấp dịch vụ chăm sóc thú cưng chuyên nghiệp và sản phẩm chất lượng cao.',
  phone: '0900.123.456',
  phone2: '0900.789.012',
  email: 'info@petcare.vn',
  emailSupport: 'support@petcare.vn',
  address: '123 Nguyễn Văn Linh',
  district: 'Quận 7',
  city: 'TP. Hồ Chí Minh',
  hoursWeekday: '08:00 – 20:00',
  hoursWeekend: '08:00 – 21:00',
  facebook: 'https://facebook.com/petcare.vn',
  instagram: 'https://instagram.com/petcare.vn',
  tiktok: 'https://tiktok.com/@petcare',
  zalo: '0900123456',
  youtube: '',
  mapLink: 'https://maps.google.com',
  warranty: 'Bảo hành thú cưng: 30 ngày – 1 năm. Đổi trả sản phẩm trong 30 ngày.',
  // Payment defaults
  codEnabled: true,
  codNote: 'Thanh toán tiền mặt khi nhận hàng. Nhân viên giao hàng sẽ thu tiền trực tiếp.',
  bankEnabled: true,
  bankName: 'Vietcombank',
  bankNumber: '1234567890',
  bankOwner: 'PETCARE VN',
  bankBranch: 'Chi nhánh Quận 7, TP.HCM',
  momoEnabled: true,
  momoPhone: '0900123456',
  momoName: 'PETCARE VN',
  momoNote: 'Chuyển khoản MoMo và ghi nội dung mã đơn hàng.',
  freeShipMinOrder: 300000,
  shippingFee: 30000,
};

function load(): StoreSettings {
  try { const v = localStorage.getItem('store_settings'); return v ? { ...DEFAULT, ...JSON.parse(v) } : DEFAULT; } catch { return DEFAULT; }
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { data: load() },
  reducers: {
    updateSettings: (state, { payload }: PayloadAction<Partial<StoreSettings>>) => {
      state.data = { ...state.data, ...payload };
      localStorage.setItem('store_settings', JSON.stringify(state.data));
    },
    resetSettings: (state) => {
      state.data = DEFAULT;
      localStorage.setItem('store_settings', JSON.stringify(DEFAULT));
    },
  },
});

export const { updateSettings, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;