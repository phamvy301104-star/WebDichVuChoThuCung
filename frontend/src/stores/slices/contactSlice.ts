import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  reply: string;
  createdAt: string;
}

const SEED: ContactMessage[] = [
  { id: 'cm1', name: 'Nguyễn Văn A', email: 'a@gmail.com', phone: '0901234567', subject: 'Bảo hành thú cưng', message: 'Bé Corgi mua tháng trước có dấu hiệu biếng ăn, cần được tư vấn.', status: 'new', reply: '', createdAt: '2026-07-10T09:00:00' },
  { id: 'cm2', name: 'Trần Thị B', email: 'b@gmail.com', phone: '0912345678', subject: 'Bảo hành sản phẩm', message: 'Thức ăn Royal Canin mua 3 ngày trước bé không chịu ăn, muốn đổi sản phẩm khác.', status: 'read', reply: '', createdAt: '2026-07-09T14:00:00' },
  { id: 'cm3', name: 'Lê Văn C', email: 'c@gmail.com', phone: '0923456789', subject: 'Tư vấn dịch vụ', message: 'Tôi muốn biết thêm về dịch vụ spa Premium cho chó Golden Retriever, giá và thời gian?', status: 'replied', reply: 'Dịch vụ Spa Premium cho Golden Retriever 25-30kg là 380.000đ, thời gian 2-2.5 giờ. Bạn có thể đặt lịch trực tiếp qua website!', createdAt: '2026-07-08T10:00:00' },
];

function load<T>(key: string, seed: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : seed; } catch { return seed; }
}
function save(key: string, v: unknown) { localStorage.setItem(key, JSON.stringify(v)); }

const contactSlice = createSlice({
  name: 'contact',
  initialState: { messages: load('contact_messages', SEED) as ContactMessage[] },
  reducers: {
    sendMessage: (state, { payload }: PayloadAction<Omit<ContactMessage, 'id' | 'status' | 'reply' | 'createdAt'>>) => {
      state.messages.unshift({ id: 'cm' + Date.now(), status: 'new', reply: '', createdAt: new Date().toISOString(), ...payload });
      save('contact_messages', state.messages);
    },
    markRead: (state, { payload }: PayloadAction<string>) => {
      const m = state.messages.find(m => m.id === payload);
      if (m && m.status === 'new') m.status = 'read';
      save('contact_messages', state.messages);
    },
    replyMessage: (state, { payload }: PayloadAction<{ id: string; reply: string }>) => {
      const m = state.messages.find(m => m.id === payload.id);
      if (m) { m.reply = payload.reply; m.status = 'replied'; }
      save('contact_messages', state.messages);
    },
    deleteMessage: (state, { payload }: PayloadAction<string>) => {
      state.messages = state.messages.filter(m => m.id !== payload);
      save('contact_messages', state.messages);
    },
  },
});

export const { sendMessage, markRead, replyMessage, deleteMessage } = contactSlice.actions;
export default contactSlice.reducer;