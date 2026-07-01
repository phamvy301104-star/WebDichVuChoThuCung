import { Pet, User, AdoptionRequest } from "../../types";

export const SAMPLE_IMAGES = {
  Chó: [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80&w=300",
  ],
  Mèo: [
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=300",
  ],
  Thỏ: [
    "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&q=80&w=300",
  ],
  Khác: [
    "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&q=80&w=300",
  ],
};

export const MOCK_ADMIN: User = {
  id: "admin_1",
  email: "admin@petcare.com",
  name: "Admin PetCare",
  role: "admin",
  createdAt: new Date().toISOString(),
};

export const INITIAL_MOCK_PETS: Pet[] = [
  {
    id: "pet_1",
    name: "Max",
    species: "Chó",
    breed: "Golden Retriever",
    age: 3,
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=300",
    description:
      "Max rất thân thiện, hiền lành và thích trẻ em. Đã tiêm phòng đầy đủ.",
    price: 150000,
    status: "for_sale",
    owner: MOCK_ADMIN,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "pet_2",
    name: "Bella",
    species: "Mèo",
    breed: "Maine Coon",
    age: 1,
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300",
    description:
      "Bella lanh lợi, hay nghịch ngợm nhưng rất dễ thương và tình cảm.",
    price: 200000,
    status: "for_sale",
    owner: MOCK_ADMIN,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "pet_3",
    name: "Buddy",
    species: "Chó",
    breed: "Corgi",
    age: 2,
    image:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=300",
    description:
      "Buddy năng động, thích chạy nhảy và học các trò mới rất nhanh.",
    price: 0,
    status: "for_sale",
    owner: MOCK_ADMIN,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "pet_4",
    name: "Milo",
    species: "Mèo",
    breed: "Ba Tư",
    age: 4,
    image:
      "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=300",
    description: "Milo thích sự yên tĩnh, thích được chải chuốt lông dài mượt.",
    price: 0,
    status: "owned",
    owner: MOCK_ADMIN,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "pet_5",
    name: "Snow",
    species: "Thỏ",
    breed: "Holland Lop",
    age: 1,
    image:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=300",
    description: "Thỏ trắng tinh, tai cụp đáng yêu và rất hiền.",
    price: 100000,
    status: "for_sale",
    owner: MOCK_ADMIN,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const INITIAL_ADOPTION_REQUESTS: AdoptionRequest[] = [
  {
    id: "req_1",
    petId: "pet_1",
    petName: "Max",
    petBreed: "Golden Retriever",
    petImage:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=300",
    petPrice: 150000,
    requesterName: "Nguyễn Văn Hùng",
    requesterEmail: "hung.nguyen@gmail.com",
    requesterPhone: "0904321987",
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "req_2",
    petId: "pet_2",
    petName: "Bella",
    petBreed: "Maine Coon",
    petImage:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300",
    petPrice: 200000,
    requesterName: "Trần Thị Mai",
    requesterEmail: "mai.tran@yahoo.com",
    requesterPhone: "0987654321",
    status: "pending",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
