import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PromoCode {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrder: number;
  limit: number;
  used: number;
  from: string;
  to: string;
  status: 'active' | 'inactive';
  description: string;
}

const today = () => new Date().toISOString().split('T')[0];
const addDays = (n: number) => { const d = new Date(); d.setDate(d.getDate()+n); return d.toISOString().split('T')[0]; };

const SEED: PromoCode[] = [
  { id: 'pr1', code: 'PETCARE10', type: 'percent', value: 10, minOrder: 200000, limit: 100, used: 28, from: today(), to: addDays(30), status: 'active', description: 'Giảm 10% cho đơn từ 200.000đ' },
  { id: 'pr2', code: 'NEWUSER',   type: 'fixed',   value: 50000, minOrder: 100000, limit: 200, used: 53, from: today(), to: addDays(60), status: 'active', description: 'Giảm 50.000đ cho khách hàng mới' },
  { id: 'pr3', code: 'SUMMER20',  type: 'percent', value: 20, minOrder: 300000, limit: 50, used: 49, from: today(), to: addDays(14), status: 'active', description: 'Khuyến mãi mùa hè giảm 20%' },
  { id: 'pr4', code: 'VIP15',     type: 'percent', value: 15, minOrder: 500000, limit: 30, used: 5, from: today(), to: addDays(90), status: 'active', description: 'Ưu đãi khách VIP giảm 15%' },
  { id: 'pr5', code: 'FREESHIP',  type: 'fixed',   value: 30000, minOrder: 150000, limit: 500, used: 120, from: today(), to: addDays(7), status: 'active', description: 'Miễn phí vận chuyển cho đơn từ 150.000đ' },
  { id: 'pr6', code: 'FLASH30',   type: 'percent', value: 30, minOrder: 400000, limit: 20, used: 20, from: addDays(-10), to: addDays(-1), status: 'inactive', description: 'Flash sale 30% - đã hết hạn' },
];

function load(): PromoCode[] {
  try { const v = localStorage.getItem('promo_codes'); return v ? JSON.parse(v) : SEED; } catch { return SEED; }
}
function save(v: PromoCode[]) { localStorage.setItem('promo_codes', JSON.stringify(v)); }

const promoSlice = createSlice({
  name: 'promo',
  initialState: { codes: load() },
  reducers: {
    addPromo: (state, { payload }: PayloadAction<Omit<PromoCode, 'id' | 'used'>>) => {
      state.codes.unshift({ id: 'pr' + Date.now(), used: 0, ...payload });
      save(state.codes);
    },
    updatePromo: (state, { payload }: PayloadAction<PromoCode>) => {
      const i = state.codes.findIndex(p => p.id === payload.id);
      if (i >= 0) state.codes[i] = payload;
      save(state.codes);
    },
    deletePromo: (state, { payload }: PayloadAction<string>) => {
      state.codes = state.codes.filter(p => p.id !== payload);
      save(state.codes);
    },
    usePromo: (state, { payload }: PayloadAction<string>) => {
      const p = state.codes.find(p => p.code === payload);
      if (p) p.used += 1;
      save(state.codes);
    },
  },
});

export const { addPromo, updatePromo, deletePromo, usePromo } = promoSlice.actions;
export default promoSlice.reducer;

// Helper: validate promo code
export const validatePromo = (codes: PromoCode[], code: string, orderAmount: number): { valid: boolean; discount: number; label: string; error?: string } => {
  const p = codes.find(c => c.code === code.toUpperCase().trim());
  if (!p) return { valid: false, discount: 0, label: '', error: 'Mã giảm giá không tồn tại.' };
  if (p.status !== 'active') return { valid: false, discount: 0, label: '', error: 'Mã giảm giá đã bị vô hiệu hoá.' };
  const now = today();
  if (now < p.from) return { valid: false, discount: 0, label: '', error: `Mã chưa có hiệu lực, bắt đầu từ ${p.from}.` };
  if (now > p.to) return { valid: false, discount: 0, label: '', error: 'Mã giảm giá đã hết hạn.' };
  if (p.used >= p.limit) return { valid: false, discount: 0, label: '', error: 'Mã giảm giá đã được sử dụng hết.' };
  if (orderAmount < p.minOrder) return { valid: false, discount: 0, label: '', error: `Đơn hàng tối thiểu ${p.minOrder.toLocaleString('vi-VN')}đ để áp dụng mã này.` };
  const discount = p.type === 'percent' ? Math.round(orderAmount * p.value / 100) : p.value;
  const label = p.type === 'percent' ? `Giảm ${p.value}%` : `Giảm ${p.value.toLocaleString('vi-VN')}đ`;
  return { valid: true, discount, label };
};