# 🚀 PetCare - Quick Start Guide

## 📦 Cài đặt nhanh

### 1️⃣ Frontend Setup (5 phút)

```bash
# Vào folder frontend
cd frontend

# Cài đặt dependencies
npm install

# Chạy dev server
npm run dev

# Mở browser: http://localhost:5173
```

**Tệp quan trọng:**
- `src/App.tsx` - Main app
- `src/stores/store.ts` - Redux store
- `src/services/api.ts` - API client

---

### 2️⃣ Backend Setup (5 phút)

```bash
# Vào folder backend
cd backend

# Cài đặt dependencies
npm install

# Copy .env.example → .env (nếu chưa có)
cp .env.example .env

# Chạy dev server
npm run dev

# Server chạy tại: http://localhost:3000
```

**Tệp quan trọng:**
- `src/app.ts` - Express app
- `src/server.ts` - Server entry
- `.env` - Environment variables

---

### 3️⃣ Database Setup (3 phút)

**Option A: MongoDB locally**
```bash
# Cài MongoDB Desktop hoặc
docker run -d -p 27017:27017 --name petcare-db mongo
```

**Option B: MongoDB Atlas (Cloud)**
- Đăng ký: https://www.mongodb.com/cloud/atlas
- Tạo cluster
- Copy connection string
- Update `MONGODB_URI` trong `.env`

---

## 📂 Cấu trúc project

```
WebDichVuThuCung/
├── frontend/                # React app
│   └── src/
│       ├── pages/          # Trang chính
│       ├── components/     # Components tái sử dụng
│       ├── stores/         # Redux store
│       ├── services/       # API calls
│       ├── hooks/          # Custom hooks
│       └── types/          # TypeScript types
│
├── backend/                 # Node.js API
│   └── src/
│       ├── models/         # MongoDB schemas
│       ├── routes/         # API routes
│       ├── controllers/    # Business logic (cần tạo)
│       ├── middleware/     # Middlewares
│       └── config/         # Configuration
│
├── README.md               # Tài liệu chung
├── PROJECT_STRUCTURE.md    # Cấu trúc chi tiết
└── DEVELOPMENT_GUIDE.md    # Hướng dẫn phát triển
```

---

## 🛠️ Công việc cần làm

### Phase 1: Authentication (Tuần 1)
- [ ] Tạo `authController.ts` - register, login
- [ ] Hoàn thành auth routes
- [ ] Implement JWT
- [ ] Test login/register flow

### Phase 2: Products (Tuần 2)
- [ ] Tạo `productController.ts`
- [ ] Hoàn thành product routes
- [ ] Thêm CategoryController, BrandController

### Phase 3: Services & Bookings (Tuần 3)
- [ ] Tạo `serviceController.ts`
- [ ] Implement booking logic

### Phase 4: Pets (Tuần 4)
- [ ] Tạo `petController.ts`
- [ ] Implement adoption flow

### Phase 5: Admin (Tuần 5)
- [ ] Tạo `adminController.ts`
- [ ] Admin dashboard pages

---

## 💻 Commands Hữu dụng

### Frontend
```bash
npm run dev      # Chạy dev server
npm run build    # Build production
npm run lint     # Check linting
npm run preview  # Preview build
```

### Backend
```bash
npm run dev      # Chạy dev server
npm run build    # Compile TypeScript
npm run start    # Chạy production
npm run typecheck # Check TypeScript
```

---

## 🔗 API Routes Template

```
🔐 Auth:
  POST /api/auth/register    - Đăng ký
  POST /api/auth/login       - Đăng nhập
  GET  /api/auth/me          - Lấy thông tin

📦 Products:
  GET  /api/products         - Danh sách
  GET  /api/products/:id     - Chi tiết
  POST /api/products         - Tạo (admin)

🎫 Services:
  GET  /api/services         - Danh sách
  POST /api/bookings         - Đặt lịch

🐾 Pets:
  GET  /api/pets             - Danh sách của tôi
  POST /api/pets             - Tạo

🛒 Orders:
  GET  /api/orders           - Danh sách
  POST /api/orders           - Tạo
```

---

## 📚 Key Files to Edit First

1. **Backend Controllers** (Ưu tiên 1)
   - `backend/src/controllers/authController.ts` ← TẠO MỚI
   - `backend/src/routes/authRoutes.ts` ← HOÀN THÀNH

2. **Frontend Pages** (Ưu tiên 2)
   - `frontend/src/pages/*` ← SẮP SỬA DỤng

3. **Services** (Ưu tiên 3)
   - `backend/src/services/` ← THÊM LOGIC

---

## 🚨 Common Issues & Solutions

### Frontend port already in use
```bash
# Port 5173 bị dùng
npm run dev -- --port 5174
```

### Backend MongoDB connection error
```bash
# Kiểm tra MongoDB đang chạy
mongo

# Hoặc check .env MONGODB_URI
```

### TypeScript errors
```bash
# Frontend
npm run lint

# Backend
npm run typecheck
```

---

## 📖 Documentation Files

- `README.md` - Overview dự án
- `PROJECT_STRUCTURE.md` - Cấu trúc chi tiết
- `DEVELOPMENT_GUIDE.md` - Hướng dẫn chi tiết
- `QUICK_START.md` - File này

---

## 💡 Tips

✅ **DO:**
- Tuân theo folder structure
- Sử dụng TypeScript
- Type định tất cả
- Validate inputs
- Handle errors

❌ **DON'T:**
- Không hard-code values
- Không commit .env
- Không mix logic ở files khác nhau
- Không quên add types

---

## 🆘 Help

Nếu có vấn đề:
1. Check `.env` configuration
2. MongoDB is running?
3. Frontend port 5173 free?
4. Backend port 3000 free?
5. Node version >= 18?

---

## 🎯 Next Steps

**Ngay hôm nay:**
1. Setup frontend: `npm install && npm run dev`
2. Setup backend: `npm install && npm run dev`
3. Test health endpoint: `curl http://localhost:3000/api/health`

**Ngày hôm sau:**
1. Bắt đầu phát triển authentication
2. Tạo authController
3. Test register/login API

---

**Happy Coding! 🚀**

Câu hỏi? Check [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)
