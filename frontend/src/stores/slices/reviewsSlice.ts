import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  adminReply: string;
  createdAt: string;
}

const SEED: Review[] = [
  { id: 'rv1', productId: 'p1', productName: 'Thức ăn mèo Royal Canin 400g', userId: 'u3', userName: 'Nguyễn Văn A', userEmail: 'a@gmail.com', rating: 5, title: 'Sản phẩm tuyệt vời!', comment: 'Bé mèo nhà mình rất thích ăn, lông bóng mượt hơn hẳn. Sẽ tiếp tục mua.', status: 'approved', adminReply: '', createdAt: '2026-07-10T10:00:00' },
  { id: 'rv2', productId: 'p4', productName: 'Combo đồ chơi chuột nhỏ cho mèo', userId: 'u4', userName: 'Trần Thị B', userEmail: 'b@gmail.com', rating: 4, title: 'Bé mèo rất thích', comment: 'Chất lượng ổn, bé chơi cả ngày không chán. Trừ 1 sao vì giao hàng hơi chậm.', status: 'approved', adminReply: 'Cảm ơn bạn đã phản hồi! Chúng tôi sẽ cải thiện dịch vụ giao hàng.', createdAt: '2026-07-09T14:00:00' },
  { id: 'rv3', productId: 'p6', productName: 'Cát vệ sinh cho mèo 5kg', userId: 'u2', userName: 'Khách Hàng Demo', userEmail: 'user@petcare.com', rating: 5, title: 'Khử mùi tốt, ít bụi', comment: 'Cát vón cục nhanh, khử mùi hiệu quả. Giá cả hợp lý. Rất hài lòng!', status: 'pending', adminReply: '', createdAt: '2026-07-11T09:00:00' },
  { id: 'rv4', productId: 'p2', productName: 'Balo vận chuyển thú cưng cao cấp', userId: 'u3', userName: 'Nguyễn Văn A', userEmail: 'a@gmail.com', rating: 2, title: 'Không như hình', comment: 'Chất lượng không tốt, khóa kéo bị kẹt sau 1 tuần sử dụng.', status: 'pending', adminReply: '', createdAt: '2026-07-11T11:00:00' },
];

function load(): Review[] { try { const v = localStorage.getItem('product_reviews'); return v ? JSON.parse(v) : SEED; } catch { return SEED; } }
function save(v: Review[]) { localStorage.setItem('product_reviews', JSON.stringify(v)); }

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: { reviews: load() },
  reducers: {
    addReview: (state, { payload }: PayloadAction<Omit<Review, 'id' | 'createdAt' | 'status' | 'adminReply'>>) => {
      state.reviews.unshift({ id: 'rv' + Date.now(), createdAt: new Date().toISOString(), status: 'pending', adminReply: '', ...payload });
      save(state.reviews);
    },
    approveReview: (state, { payload }: PayloadAction<string>) => {
      const r = state.reviews.find(r => r.id === payload); if (r) r.status = 'approved'; save(state.reviews);
    },
    rejectReview: (state, { payload }: PayloadAction<string>) => {
      const r = state.reviews.find(r => r.id === payload); if (r) r.status = 'rejected'; save(state.reviews);
    },
    replyReview: (state, { payload }: PayloadAction<{ id: string; reply: string }>) => {
      const r = state.reviews.find(r => r.id === payload.id); if (r) { r.adminReply = payload.reply; r.status = 'approved'; } save(state.reviews);
    },
    deleteReview: (state, { payload }: PayloadAction<string>) => {
      state.reviews = state.reviews.filter(r => r.id !== payload); save(state.reviews);
    },
  },
});
export const { addReview, approveReview, rejectReview, replyReview, deleteReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;