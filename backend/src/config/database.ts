import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from './environment';
import User from '../models/User';
import Category from '../models/Category';
import Brand from '../models/Brand';
import Product from '../models/Product';
import Service from '../models/Service';
import Pet from '../models/Pet';

const sampleCategories = [
  { name: 'Thức ăn', description: 'Sản phẩm dinh dưỡng cho thú cưng.' },
  { name: 'Phụ kiện', description: 'Đồ dùng, túi xách và phụ kiện.' },
  { name: 'Chăm sóc', description: 'Sản phẩm vệ sinh và chăm sóc.' },
];

const sampleBrands = [
  { name: 'Royal Canin' },
  { name: 'PetJoy' },
  { name: 'HappyPaws' },
];

const sampleProducts = [
  {
    name: 'Thức ăn mèo Royal Canin 400g',
    description: 'Công thức dinh dưỡng cân bằng dành cho mèo trưởng thành.',
    price: 185000,
    quantity: 45,
    image: 'https://images.unsplash.com/photo-1608454509097-e2816ab39e82?auto=format&fit=crop&q=80&w=400',
    categoryName: 'Thức ăn',
    brandName: 'Royal Canin',
    rating: 4.8,
    reviews: 132,
  },
  {
    name: 'Balo vận chuyển thú cưng cao cấp',
    description: 'Thiết kế êm ái, thông gió giúp thú cưng thoải mái khi di chuyển.',
    price: 320000,
    quantity: 12,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=400',
    categoryName: 'Phụ kiện',
    brandName: 'PetJoy',
    rating: 4.6,
    reviews: 89,
  },
  {
    name: 'Shampoo thú cưng hương lavender 500ml',
    description: 'Giúp lông mềm mượt và thơm lâu, phù hợp mọi loại thú cưng.',
    price: 120000,
    quantity: 32,
    image: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80&w=400',
    categoryName: 'Chăm sóc',
    brandName: 'HappyPaws',
    rating: 4.4,
    reviews: 54,
  },
  {
    name: 'Combo đồ chơi chuột nhỏ cho mèo',
    description: 'Đồ chơi tương tác giúp mèo vận động và giảm stress.',
    price: 55000,
    quantity: 18,
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=400',
    categoryName: 'Phụ kiện',
    brandName: 'HappyPaws',
    rating: 4.7,
    reviews: 70,
  },
];

const sampleServices = [
  {
    name: 'Tắm & Cắt lông',
    description: 'Tắm sạch và cắt lông chuyên nghiệp cho thú cưng.',
    price: 150000,
    duration: 90,
    image: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    reviews: 220,
  },
  {
    name: 'Khám sức khỏe thú cưng',
    description: 'Kiểm tra tổng quát và tư vấn dinh dưỡng cho thú cưng.',
    price: 200000,
    duration: 30,
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    reviews: 180,
  },
  {
    name: 'Tiêm phòng',
    description: 'Tiêm đầy đủ vaccine cần thiết theo đúng lịch.',
    price: 250000,
    duration: 15,
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&q=80&w=400',
    rating: 4.7,
    reviews: 150,
  },
];

const samplePets = [
  {
    name: 'Max',
    species: 'Chó',
    breed: 'Golden Retriever',
    age: 3,
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600',
    description: 'Max thân thiện, hiền lành, cực kỳ trung thành và thích chơi bóng.',
    ownerEmail: 'admin@petcare.com',
    status: 'for_adoption',
  },
  {
    name: 'Bella',
    species: 'Mèo',
    breed: 'Maine Coon',
    age: 1,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600',
    description: 'Bella lanh lợi, nghịch ngợm nhưng rất tình cảm, quấn người.',
    ownerEmail: 'admin@petcare.com',
    status: 'for_adoption',
  },
  {
    name: 'Buddy',
    species: 'Chó',
    breed: 'Corgi',
    age: 2,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600',
    description: 'Buddy có cặp đùi to mông tròn đáng yêu, năng động và thân thiện.',
    ownerEmail: 'admin@petcare.com',
    status: 'for_sale',
    price: 3500000,
    quantity: 1,
  },
  {
    name: 'Milo',
    species: 'Chó',
    breed: 'Poodle',
    age: 1,
    image: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&q=80&w=600',
    description: 'Milo lông xoăn thông minh, rất nhanh nhẹn, dễ dạy bảo và không rụng lông.',
    ownerEmail: 'admin@petcare.com',
    status: 'for_sale',
    price: 2800000,
    quantity: 1,
  },
  {
    name: 'Luna',
    species: 'Mèo',
    breed: 'Anh lông ngắn',
    age: 2,
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=600',
    description: 'Luna mặt tròn bụ bẫm, rất thích ngủ nướng, điềm tĩnh và ngoan ngoãn.',
    ownerEmail: 'admin@petcare.com',
    status: 'for_adoption',
  },
  {
    name: 'Rocky',
    species: 'Chó',
    breed: 'Siberian Husky',
    age: 4,
    image: 'https://images.unsplash.com/photo-1531804055935-76f44d7c3621?auto=format&fit=crop&q=80&w=600',
    description: 'Rocky có đôi mắt xanh quyến rũ, hướng ngoại, cực kỳ tinh nghịch.',
    ownerEmail: 'admin@petcare.com',
    status: 'for_adoption',
  },
  {
    name: 'Simba',
    species: 'Mèo',
    breed: 'Ba Tư lông xù',
    age: 1,
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=600',
    description: 'Simba có bộ lông xù trắng muốt sang trọng, ngoan hiền và thích được vỗ về.',
    ownerEmail: 'admin@petcare.com',
    status: 'for_sale',
    price: 4500000,
    quantity: 1,
  },
  {
    name: 'Snowy',
    species: 'Thỏ',
    breed: 'Angora Rabbit',
    age: 1,
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=600',
    description: 'Snowy nhỏ nhắn xinh xắn, lông siêu mượt, rất thích ăn rau củ sạch.',
    ownerEmail: 'admin@petcare.com',
    status: 'for_adoption',
  },
];

const seedDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({ email: 'admin@petcare.com' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      email: 'admin@petcare.com',
      password: hashedPassword,
      name: 'Admin PetCare',
      role: 'admin',
      isActive: true,
    });
    console.log('✅ Default admin user created: admin@petcare.com / admin123');
  }
};

const seedSampleData = async () => {
  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    await Category.create(sampleCategories);
    console.log('✅ Seed categories completed');
  }

  const brandCount = await Brand.countDocuments();
  if (brandCount === 0) {
    await Brand.create(sampleBrands);
    console.log('✅ Seed brands completed');
  }

  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.create(sampleServices);
    console.log('✅ Seed services completed');
  }

  const petCount = await Pet.countDocuments();
  if (petCount === 0) {
    const adminUser = await User.findOne({ email: 'admin@petcare.com' });
    if (adminUser) {
      const petsToCreate = samplePets.map((item) => ({
        name: item.name,
        species: item.species,
        breed: item.breed,
        age: item.age,
        image: item.image,
        description: item.description,
        owner: adminUser._id,
        status: item.status,
        price: item.price,
        quantity: item.quantity,
      }));

      await Pet.create(petsToCreate);
      console.log('✅ Seed pets completed');
    }
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    const categories = await Category.find();
    const brands = await Brand.find();
    const categoryMap = new Map(categories.map((item) => [item.name, item._id]));
    const brandMap = new Map(brands.map((item) => [item.name, item._id]));

    const productsToCreate = sampleProducts.map((item) => ({
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      category: categoryMap.get(item.categoryName),
      brand: brandMap.get(item.brandName),
      rating: item.rating,
      reviews: item.reviews,
    }));

    await Product.create(productsToCreate);
    console.log('✅ Seed products completed');
  }
};

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Kết nối MongoDB thành công');
    await seedDefaultAdmin();
    await seedSampleData();
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ Ngắt kết nối MongoDB thành công');
  } catch (error) {
    console.error('❌ Lỗi ngắt kết nối MongoDB:', error);
  }
};
