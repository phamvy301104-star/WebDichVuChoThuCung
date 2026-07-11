import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ManagedPet {
  id: string;
  name: string;
  species: string;
  breed: string;
  ageLabel: string;
  gender: '♂' | '♀';
  image: string;
  tags: string[];
  price: number;
  listingType: 'adoption' | 'sale';
  vaccinated: boolean;
  vaccineCount: number;
  weight: string;
  color: string;
  description: string;
  health: string;
  status: 'available' | 'sold' | 'rescue';
  publishStatus: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedByName: string;
  createdAt: string;
}

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_PETS: ManagedPet[] = [
  { id: 'mp1', name: 'Max', species: 'Chó', breed: 'Golden Retriever', ageLabel: '3 tuổi', gender: '♂', image: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=500&h=400&fit=crop&auto=format', tags: ['Thân thiện','Thích trẻ em','Hiền lành'], price: 0, listingType: 'adoption', vaccinated: true, vaccineCount: 3, weight: '28 kg', color: 'Vàng kem', description: 'Max rất thân thiện, hiền lành và thích trẻ em. Đã tiêm phòng đầy đủ và khỏe mạnh.', health: 'Tốt - Đã khám tổng quát 06/2026', status: 'available', publishStatus: 'approved', submittedBy: 'admin@petcare.com', submittedByName: 'Admin', createdAt: '2026-07-01T10:00:00' },
  { id: 'mp2', name: 'Bella', species: 'Mèo', breed: 'Maine Coon', ageLabel: '8 tháng', gender: '♀', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=400&fit=crop&auto=format', tags: ['Lanh lợi','Tình cảm','Thích ôm'], price: 0, listingType: 'adoption', vaccinated: true, vaccineCount: 2, weight: '4 kg', color: 'Đen trắng', description: 'Bella lanh lợi, hay nghịch ngợm nhưng rất dễ thương và tình cảm.', health: 'Tốt - Tiêm đủ 2 mũi đầu', status: 'available', publishStatus: 'approved', submittedBy: 'admin@petcare.com', submittedByName: 'Admin', createdAt: '2026-07-02T10:00:00' },
  { id: 'mp3', name: 'Buddy', species: 'Chó', breed: 'Corgi Pembroke', ageLabel: '1 tuổi', gender: '♂', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=400&fit=crop&auto=format', tags: ['Năng động','Thông minh','Vâng lời'], price: 5000000, listingType: 'sale', vaccinated: true, vaccineCount: 3, weight: '12 kg', color: 'Vàng đỏ', description: 'Buddy năng động, thích chạy nhảy và học các trò mới rất nhanh.', health: 'Xuất sắc - Bảo hành sức khoẻ 1 năm', status: 'available', publishStatus: 'approved', submittedBy: 'admin@petcare.com', submittedByName: 'Admin', createdAt: '2026-07-03T10:00:00' },
  { id: 'mp4', name: 'Whiskers', species: 'Mèo', breed: 'Ba Tư', ageLabel: '4 tuổi', gender: '♂', image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=500&h=400&fit=crop&auto=format', tags: ['Điềm tĩnh','Sang chảnh','Thích yên tĩnh'], price: 0, listingType: 'adoption', vaccinated: true, vaccineCount: 2, weight: '5 kg', color: 'Xám trắng', description: 'Whiskers điềm tĩnh, hợp với gia đình có không gian yên tĩnh.', health: 'Tốt - Cần chải lông thường xuyên', status: 'rescue', publishStatus: 'approved', submittedBy: 'admin@petcare.com', submittedByName: 'Admin', createdAt: '2026-07-04T10:00:00' },
  { id: 'mp5', name: 'Coco', species: 'Thỏ', breed: 'Holland Lop', ageLabel: '6 tháng', gender: '♀', image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=500&h=400&fit=crop&auto=format', tags: ['Đáng yêu','Im lặng','Phù hợp căn hộ'], price: 1200000, listingType: 'sale', vaccinated: false, vaccineCount: 0, weight: '1.5 kg', color: 'Trắng xám', description: 'Coco cực kỳ đáng yêu, hiền, không gây ồn. Phù hợp căn hộ chung cư.', health: 'Tốt - Chưa tiêm phòng', status: 'available', publishStatus: 'approved', submittedBy: 'admin@petcare.com', submittedByName: 'Admin', createdAt: '2026-07-05T10:00:00' },
  { id: 'mp6', name: 'Rocky', species: 'Chó', breed: 'Siberian Husky', ageLabel: '2 tuổi', gender: '♂', image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=500&h=400&fit=crop&auto=format', tags: ['Năng động','Trung thành','Ít sủa'], price: 8000000, listingType: 'sale', vaccinated: true, vaccineCount: 3, weight: '25 kg', color: 'Đen trắng', description: 'Rocky năng động, trung thành, lông dày đẹp. Cần không gian rộng để chạy nhảy.', health: 'Xuất sắc - Bảo hành sức khoẻ 1 năm', status: 'available', publishStatus: 'approved', submittedBy: 'admin@petcare.com', submittedByName: 'Admin', createdAt: '2026-07-06T10:00:00' },
  { id: 'mp7', name: 'Milo', species: 'Chó', breed: 'Poodle Tiny', ageLabel: '5 tháng', gender: '♂', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&h=400&fit=crop&auto=format', tags: ['Không rụng lông','Thông minh','Thân thiện'], price: 6500000, listingType: 'sale', vaccinated: true, vaccineCount: 2, weight: '3 kg', color: 'Trắng kem', description: 'Milo nhỏ nhắn, thông minh, không rụng lông. Phù hợp mọi gia đình.', health: 'Tốt - Đã tiêm 2 mũi đầu', status: 'available', publishStatus: 'approved', submittedBy: 'admin@petcare.com', submittedByName: 'Admin', createdAt: '2026-07-07T10:00:00' },
  { id: 'mp8', name: 'Luna', species: 'Mèo', breed: 'Exotic Shorthair', ageLabel: '2 tuổi', gender: '♀', image: 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=500&h=400&fit=crop&auto=format', tags: ['Béo tròn','Thích âu yếm','Lười biếng dễ thương'], price: 0, listingType: 'adoption', vaccinated: true, vaccineCount: 3, weight: '4.5 kg', color: 'Xám', description: 'Luna béo tròn, lười biếng theo kiểu đáng yêu, thích được âu yếm.', health: 'Tốt - Tiêm đủ lịch', status: 'available', publishStatus: 'approved', submittedBy: 'admin@petcare.com', submittedByName: 'Admin', createdAt: '2026-07-08T10:00:00' },
  // Pending submissions from users
  { id: 'mp9', name: 'Cookie', species: 'Chó', breed: 'Maltese', ageLabel: '1 tuổi', gender: '♀', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=400&fit=crop&auto=format', tags: ['Hiền lành','Nhỏ xinh'], price: 3000000, listingType: 'sale', vaccinated: true, vaccineCount: 2, weight: '2.5 kg', color: 'Trắng', description: 'Cookie hiền lành, bé nhỏ xinh xắn. Đã tiêm phòng đầy đủ.', health: 'Tốt', status: 'available', publishStatus: 'pending', submittedBy: 'user@petcare.com', submittedByName: 'Khách Hàng Demo', createdAt: '2026-07-10T14:00:00' },
];

function load<T>(key: string, seed: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : seed; } catch { return seed; }
}
function save(key: string, value: unknown) { localStorage.setItem(key, JSON.stringify(value)); }

interface PetMgmtState { pets: ManagedPet[]; }

const initialState: PetMgmtState = {
  pets: load('petmgmt_pets', SEED_PETS),
};

const petMgmtSlice = createSlice({
  name: 'petMgmt',
  initialState,
  reducers: {
    addPet: (state, { payload }: PayloadAction<Omit<ManagedPet, 'id' | 'createdAt'>>) => {
      state.pets.unshift({ id: 'mp' + Date.now(), createdAt: new Date().toISOString(), ...payload });
      save('petmgmt_pets', state.pets);
    },
    updatePet: (state, { payload }: PayloadAction<ManagedPet>) => {
      const i = state.pets.findIndex(p => p.id === payload.id);
      if (i >= 0) state.pets[i] = payload;
      save('petmgmt_pets', state.pets);
    },
    deletePet: (state, { payload }: PayloadAction<string>) => {
      state.pets = state.pets.filter(p => p.id !== payload);
      save('petmgmt_pets', state.pets);
    },
    approvePet: (state, { payload }: PayloadAction<string>) => {
      const p = state.pets.find(p => p.id === payload);
      if (p) p.publishStatus = 'approved';
      save('petmgmt_pets', state.pets);
    },
    rejectPet: (state, { payload }: PayloadAction<string>) => {
      const p = state.pets.find(p => p.id === payload);
      if (p) p.publishStatus = 'rejected';
      save('petmgmt_pets', state.pets);
    },
    submitPet: (state, { payload }: PayloadAction<Omit<ManagedPet, 'id' | 'createdAt' | 'publishStatus'>>) => {
      state.pets.unshift({ id: 'mp' + Date.now(), createdAt: new Date().toISOString(), publishStatus: 'pending', ...payload });
      save('petmgmt_pets', state.pets);
    },
  },
});

export const { addPet, updatePet, deletePet, approvePet, rejectPet, submitPet } = petMgmtSlice.actions;
export default petMgmtSlice.reducer;