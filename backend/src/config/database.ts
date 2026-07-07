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
    image: '',
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
    image: '',
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
    image: '',
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
    image: '',
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
    image: '',
    rating: 4.9,
    reviews: 220,
  },
  {
    name: 'Khám sức khỏe thú cưng',
    description: 'Kiểm tra tổng quát và tư vấn dinh dưỡng cho thú cưng.',
    price: 200000,
    duration: 30,
    image: '',
    rating: 4.8,
    reviews: 180,
  },
  {
    name: 'Tiêm phòng',
    description: 'Tiêm đầy đủ vaccine cần thiết theo đúng lịch.',
    price: 250000,
    duration: 15,
    image: '',
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
    image: 'https://placehold.co/400x300?text=Max',
    description: 'Max thân thiện, hiền lành và thích trẻ em.',
    ownerEmail: 'admin@petcare.com',
    status: 'for_adoption',
  },
  {
    name: 'Bella',
    species: 'Mèo',
    breed: 'Maine Coon',
    age: 1,
    image: 'https://placehold.co/400x300?text=Bella',
    description: 'Bella lanh lợi, nghịch ngợm nhưng rất tình cảm.',
    ownerEmail: 'admin@petcare.com',
    status: 'for_adoption',
  },
  {
    name: 'Buddy',
    species: 'Chó',
    breed: 'Corgi',
    age: 2,
    image: 'https://placehold.co/400x300?text=Buddy',
    description: 'Buddy năng động và thân thiện với gia đình.',
    ownerEmail: 'admin@petcare.com',
    status: 'for_sale',
    price: 3500000,
    quantity: 1,
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
