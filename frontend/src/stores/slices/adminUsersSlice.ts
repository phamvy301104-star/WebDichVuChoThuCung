import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'staff' | 'user';
  status: 'active' | 'blocked';
  address: string;
  avatar: string;
  joinedAt: string;
  ordersCount: number;
  totalSpent: number;
  notes: string;
}

const SEED: AdminUser[] = [
  { id: 'u1', name: 'Admin PetCare', email: 'admin@petcare.com', phone: '0900000001', role: 'admin', status: 'active', address: '123 Nguyễn Văn Linh, Q7, TP.HCM', avatar: '', joinedAt: '2026-01-01', ordersCount: 0, totalSpent: 0, notes: '' },
  { id: 'u2', name: 'Khách Hàng Demo', email: 'user@petcare.com', phone: '0900000002', role: 'user', status: 'active', address: '456 Lê Lợi, Q1, TP.HCM', avatar: '', joinedAt: '2026-03-15', ordersCount: 3, totalSpent: 825000, notes: '' },
  { id: 'u3', name: 'Nguyễn Văn A', email: 'a@gmail.com', phone: '0901234567', role: 'user', status: 'active', address: '789 CMT8, Q3, TP.HCM', avatar: '', joinedAt: '2026-05-10', ordersCount: 5, totalSpent: 1250000, notes: 'Khách thân thiết' },
  { id: 'u4', name: 'Trần Thị B', email: 'b@gmail.com', phone: '0912345678', role: 'user', status: 'active', address: '321 Võ Văn Tần, Q3, TP.HCM', avatar: '', joinedAt: '2026-06-01', ordersCount: 2, totalSpent: 370000, notes: '' },
  { id: 'u5', name: 'Lê Văn C', email: 'c@gmail.com', phone: '0923456789', role: 'user', status: 'blocked', address: '654 Đinh Tiên Hoàng, BT, TP.HCM', avatar: '', joinedAt: '2026-06-15', ordersCount: 1, totalSpent: 285000, notes: 'Vi phạm chính sách đổi trả' },
  { id: 'u6', name: 'Minh Tuấn', email: 'tuan@petcare.vn', phone: '0901111001', role: 'staff', status: 'active', address: '123 PetCare Office, Q7', avatar: '', joinedAt: '2026-02-01', ordersCount: 0, totalSpent: 0, notes: 'Groomer chính' },
];

function load(): AdminUser[] { try { const v = localStorage.getItem('admin_users'); return v ? JSON.parse(v) : SEED; } catch { return SEED; } }
function save(v: AdminUser[]) { localStorage.setItem('admin_users', JSON.stringify(v)); }

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState: { users: load() },
  reducers: {
    addUser: (state, { payload }: PayloadAction<Omit<AdminUser, 'id'>>) => {
      state.users.unshift({ id: 'u' + Date.now(), ...payload });
      save(state.users);
    },
    updateUser: (state, { payload }: PayloadAction<AdminUser>) => {
      const i = state.users.findIndex(u => u.id === payload.id);
      if (i >= 0) state.users[i] = payload;
      save(state.users);
    },
    toggleUserStatus: (state, { payload }: PayloadAction<string>) => {
      const u = state.users.find(u => u.id === payload);
      if (u) u.status = u.status === 'active' ? 'blocked' : 'active';
      save(state.users);
    },
    deleteUser: (state, { payload }: PayloadAction<string>) => {
      state.users = state.users.filter(u => u.id !== payload);
      save(state.users);
    },
  },
});
export const { addUser, updateUser, toggleUserStatus, deleteUser } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;