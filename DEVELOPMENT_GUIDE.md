# PetCare - Hướng dẫn phát triển chi tiết

## 📂 Cấu trúc dự án hoàn chỉnh

```
WebDichVuThuCung/
├── frontend/                    # Frontend - React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/              # Các trang chính
│   │   │   ├── Auth/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   ├── Products/
│   │   │   │   ├── ProductListPage.tsx
│   │   │   │   ├── ProductDetailPage.tsx
│   │   │   │   └── CartPage.tsx
│   │   │   ├── Services/
│   │   │   │   └── ServiceListPage.tsx
│   │   │   ├── Pets/
│   │   │   │   ├── PetListPage.tsx
│   │   │   │   └── PetDetailPage.tsx (cần tạo)
│   │   │   ├── Orders/
│   │   │   │   └── OrderListPage.tsx (cần tạo)
│   │   │   ├── Admin/
│   │   │   │   └── DashboardPage.tsx (cần tạo)
│   │   │   └── HomePage.tsx
│   │   ├── components/         # Reusable components
│   │   │   ├── Common/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Navigation.tsx (cần tạo)
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── Products/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   └── ProductFilter.tsx (cần tạo)
│   │   │   ├── Services/
│   │   │   │   └── ServiceCard.tsx
│   │   │   ├── Pets/
│   │   │   │   └── PetCard.tsx
│   │   │   └── Cart/
│   │   │       └── CartSummary.tsx
│   │   ├── stores/             # Redux Toolkit store
│   │   │   ├── store.ts
│   │   │   └── slices/
│   │   │       ├── authSlice.ts
│   │   │       ├── productSlice.ts
│   │   │       ├── cartSlice.ts
│   │   │       ├── serviceSlice.ts
│   │   │       └── petSlice.ts
│   │   ├── services/           # API call services
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── productService.ts
│   │   │   ├── serviceService.ts
│   │   │   ├── petService.ts
│   │   │   └── orderService.ts
│   │   ├── hooks/              # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useProduct.ts
│   │   │   ├── useService.ts (cần tạo)
│   │   │   ├── usePet.ts (cần tạo)
│   │   │   └── useCart.ts (cần tạo)
│   │   ├── types/              # TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/              # Utilities
│   │   │   └── constants.ts
│   │   ├── styles/             # CSS
│   │   │   └── global.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── vite.config.ts
│   ├── eslint.config.js
│   └── index.html
│
├── backend/                     # Backend - Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/             # Configuration
│   │   │   ├── database.ts
│   │   │   └── environment.ts
│   │   ├── middleware/         # Middlewares
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts (cần tạo)
│   │   ├── routes/             # API Routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── productRoutes.ts
│   │   │   ├── serviceRoutes.ts
│   │   │   ├── petRoutes.ts
│   │   │   ├── orderRoutes.ts
│   │   │   └── adminRoutes.ts
│   │   ├── controllers/        # Controllers
│   │   │   ├── index.ts
│   │   │   ├── authController.ts (cần tạo)
│   │   │   ├── productController.ts (cần tạo)
│   │   │   ├── serviceController.ts (cần tạo)
│   │   │   ├── petController.ts (cần tạo)
│   │   │   ├── orderController.ts (cần tạo)
│   │   │   └── adminController.ts (cần tạo)
│   │   ├── services/           # Business Logic
│   │   │   └── index.ts
│   │   ├── models/             # Database Models
│   │   │   ├── User.ts
│   │   │   ├── Product.ts
│   │   │   ├── Category.ts
│   │   │   ├── Brand.ts
│   │   │   ├── Service.ts
│   │   │   ├── Pet.ts
│   │   │   ├── Booking.ts
│   │   │   ├── Order.ts
│   │   │   └── Review.ts
│   │   ├── types/              # TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/              # Utilities
│   │   │   ├── validators.ts
│   │   │   └── helpers.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   ├── .env.example
│   └── .gitignore
│
└── README.md                   # Project documentation

```

---

## 🚀 Bước tiếp theo để phát triển

### 1. Frontend - Phát triển các pages/components còn thiếu

**Cần tạo:**
- `PetDetailPage.tsx` - Chi tiết thú cưng
- `OrderListPage.tsx` - Danh sách đơn hàng
- `AdminDashboardPage.tsx` - Dashboard quản lý
- `Navigation.tsx` - Component nav bổ sung
- `ProductFilter.tsx` - Filter sản phẩm

**Cần tạo custom hooks:**
- `useService.ts` - Hook cho dịch vụ
- `usePet.ts` - Hook cho thú cưng
- `useCart.ts` - Hook cho giỏ hàng
- `useOrder.ts` - Hook cho đơn hàng
- `useAdmin.ts` - Hook cho admin

### 2. Backend - Phát triển controllers

**Cần tạo:**
- `authController.ts` - Xử lý xác thực
- `productController.ts` - Xử lý sản phẩm
- `serviceController.ts` - Xử lý dịch vụ
- `petController.ts` - Xử lý thú cưng
- `orderController.ts` - Xử lý đơn hàng
- `adminController.ts` - Xử lý admin

**Cần phát triển services:**
- Thêm các function thực tế vào `services/` folders
- Kết nối với models
- Xử lý validation

### 3. Database Setup

```bash
# Cài đặt MongoDB (hoặc sử dụng MongoDB Atlas)
# Update MONGODB_URI trong .env

# Hoặc dùng Docker:
docker run -d -p 27017:27017 --name petcare-db mongo
```

### 4. Cài đặt dependencies

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
npm install
npm run dev
```

---

## 📋 Workflow phát triển

### Cho mỗi chức năng:

1. **Database Model** - Tạo schema trong `models/`
2. **Service Layer** - Tạo business logic
3. **Controller** - Xử lý requests
4. **Routes** - Thêm endpoints
5. **API Service** - Tạo client-side API calls
6. **Redux Slices** - Quản lý state
7. **Components** - Tạo UI
8. **Pages** - Ghép components vào pages
9. **Routes** - Thêm vào React Router

---

## 🔗 API Endpoints (Template)

```
Authentication:
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
PUT    /api/auth/profile
PUT    /api/auth/change-password

Products:
GET    /api/products
GET    /api/products/:id
POST   /api/products (admin)
PUT    /api/products/:id (admin)
DELETE /api/products/:id (admin)
GET    /api/categories
POST   /api/categories (admin)
GET    /api/brands
POST   /api/brands (admin)

Services:
GET    /api/services
GET    /api/services/:id
POST   /api/services (admin)
PUT    /api/services/:id (admin)
DELETE /api/services/:id (admin)

Bookings:
GET    /api/bookings/my-bookings
POST   /api/bookings
PUT    /api/bookings/:id
PUT    /api/bookings/:id/cancel

Pets:
GET    /api/pets/my-pets
POST   /api/pets
GET    /api/pets/:id
PUT    /api/pets/:id
DELETE /api/pets/:id
GET    /api/pets/for-sale
GET    /api/pets/for-adoption
POST   /api/pets/:id/adoption-request

Orders:
GET    /api/orders/my-orders
POST   /api/orders
GET    /api/orders/:id
PUT    /api/orders/:id
PUT    /api/orders/:id/cancel

Admin:
GET    /api/admin/products
GET    /api/admin/users
GET    /api/admin/orders
GET    /api/admin/bookings
PUT    /api/admin/orders/:id/status
```

---

## 💡 Tips phát triển

### Frontend Tips:
- Sử dụng TypeScript để type-safety
- Tách logic ra custom hooks
- Sử dụng Redux cho global state
- Tách components nhỏ để tái sử dụng
- Thêm loading states và error handling
- Validate form trước khi submit

### Backend Tips:
- Validate tất cả inputs
- Sử dụng middleware cho authentication
- Error handling centralized
- Sử dụng environment variables
- Log important events
- Implement pagination cho list endpoints

---

## 🧪 Testing (Upcoming)

- Frontend: Jest + React Testing Library
- Backend: Jest + Supertest

---

## 📚 Resources

- React Docs: https://react.dev
- Redux Toolkit: https://redux-toolkit.js.org
- Express: https://expressjs.com
- MongoDB: https://docs.mongodb.com
- TypeScript: https://www.typescriptlang.org

---

**Happy Coding! 🚀**
