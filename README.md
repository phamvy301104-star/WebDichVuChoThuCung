# 🐾 PetCare — Hệ thống Quản lý & Dịch vụ Thú Cưng

> **Web ứng dụng thương mại điện tử và quản lý dịch vụ thú cưng toàn diện**  
> Xây dựng bằng React 18 + TypeScript + Vite · Redux Toolkit · Express · MongoDB

---

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt & Chạy](#cài-đặt--chạy)
- [Tài khoản demo](#tài-khoản-demo)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [API Endpoints](#api-endpoints)
- [Môi trường](#môi-trường)

---

## 🌟 Giới thiệu

**PetCare** là nền tảng web dịch vụ thú cưng đầy đủ tính năng, bao gồm:
- 🛍️ **Cửa hàng sản phẩm** thú cưng với giỏ hàng, thanh toán VietQR/MoMo/COD
- 📅 **Đặt lịch dịch vụ** Spa, Grooming, Khám bệnh, Tiêm phòng
- 🐾 **Quản lý thú cưng** — nhận nuôi, mua bán với hệ thống duyệt bài
- 👑 **Admin dashboard** — quản lý toàn bộ hoạt động kinh doanh
- 🔐 **Xác thực** — Email/Password + Google OAuth

---

## ✨ Tính năng

### 👤 Người dùng
| Tính năng | Chi tiết |
|-----------|----------|
| 🔐 Đăng nhập / Đăng ký | Email + Password · Google OAuth |
| 🛍️ Cửa hàng | Xem sản phẩm, thêm giỏ hàng, đặt hàng |
| 💳 Thanh toán | COD · Chuyển khoản VietQR · Ví MoMo |
| 🏷️ Mã giảm giá | Áp dụng voucher có ngày hết hạn |
| 📅 Đặt lịch spa | Chọn dịch vụ, nhân viên, ngày giờ |
| 🐾 Thú cưng | Xem, nhận nuôi, mua · Đăng bài tìm nhà |
| 👤 Hồ sơ | Cập nhật thông tin · Thú cưng cá nhân · Lịch sử |
| ⭐ Đánh giá | Viết review sản phẩm |
| 💬 Liên hệ | Gửi tin nhắn · Bảo hành |

### 👑 Admin
| Module | Tính năng |
|--------|-----------|
| 📊 Dashboard | Thống kê, quick actions, đơn hàng & lịch hẹn gần đây |
| 🛍️ Sản phẩm | CRUD + Tồn kho (inventory view, quick update stock) |
| 📋 Đơn hàng | Xem chi tiết · Xác nhận → Xử lý → Hoàn thành |
| 📁 Danh mục & 🏷️ Thương hiệu | CRUD |
| 📅 Lịch hẹn | CRUD + Xác nhận · Hoàn thành |
| ✂️ Dịch vụ | CRUD + upload ảnh |
| 👨‍💼 Nhân viên | CRUD dạng card |
| 🐾 Thú cưng | CRUD + Duyệt/Từ chối bài đăng user |
| 👥 Tài khoản | CRUD · Khóa/Mở tài khoản |
| ⭐ Đánh giá | Duyệt · Phản hồi · Xóa |
| 🎁 Khuyến mãi | CRUD mã giảm giá + ngày hết hạn + progress |
| 📊 Báo cáo | Biểu đồ doanh thu, tồn kho, lịch hẹn |
| 💬 Liên hệ | Xem · Trả lời tin nhắn khách |
| ⚙️ Cài đặt | Thông tin shop · Thanh toán (COD/Bank/MoMo) · Bảo hành |

---

## 🔧 Công nghệ sử dụng

### Frontend
```
React 18 + TypeScript       — UI framework
Vite 5                       — Build tool & dev server
Redux Toolkit                — State management
React Router v6              — Client-side routing
Lucide React                 — Icon library
@react-oauth/google          — Google OAuth
```

### Backend
```
Node.js + Express            — REST API server
TypeScript                   — Type safety
MongoDB + Mongoose           — Database
JWT                          — Authentication
```

### React Roadmap Coverage
| Mức độ | Concepts đã dùng |
|--------|-----------------|
| ✅ Basic | useState (168x) · useEffect (20x) · JSX · Props · Event handling |
| ✅ Intermediate | useRef · useMemo · useCallback · useReducer · Context API · React Router · API integration |
| ✅ Advanced | Redux Toolkit (30 slices) · React.memo · React.lazy (16x) · Suspense · Custom Hooks · TypeScript |

---

## 🚀 Cài đặt & Chạy

### Yêu cầu
- Node.js ≥ 18
- MongoDB (local hoặc Atlas)

### Frontend
```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

### Backend
```bash
cd backend
npm install
# Tạo file .env (xem .env.example)
npm run dev          # http://localhost:3000
```

### Google OAuth (tùy chọn)
```bash
# Tạo file frontend/.env.local
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```
> Không có Client ID → app vẫn chạy bình thường, nút Google bị disabled

---

## 🔑 Tài khoản demo

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| 👑 Admin | `admin@petcare.com` | `admin123` |
| 👤 User | `user@petcare.com` | `admin123` |

---

## 📁 Cấu trúc dự án

```
WebDichVuThuCung/
├── frontend/                    # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Admin/           # AdminSidebar
│   │   │   ├── Auth/            # LoginForm, RegisterForm
│   │   │   └── Common/          # Header, Footer
│   │   ├── contexts/            # AppContext (useReducer + Context API)
│   │   ├── hooks/               # useAuth, useProduct (Custom Hooks)
│   │   ├── pages/
│   │   │   ├── Admin/           # 15 admin pages
│   │   │   ├── Auth/            # Login, Register
│   │   │   ├── Products/        # ProductList, Detail, Cart, Checkout
│   │   │   ├── Services/        # ServiceList, AppointmentForm
│   │   │   └── Pets/            # PetList, SubmitPet
│   │   ├── stores/
│   │   │   └── slices/          # 12 Redux slices
│   │   └── styles/              # global.css
│   └── .env.example
└── backend/                     # Express + TypeScript + MongoDB
    ├── src/
    │   ├── controllers/         # Route handlers
    │   ├── models/              # Mongoose schemas
    │   ├── routes/              # API routes
    │   └── middleware/          # Auth, error handler
    └── .env.example
```

---

## 🌐 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/products` | Danh sách sản phẩm |
| GET | `/api/services` | Danh sách dịch vụ |
| POST | `/api/orders` | Tạo đơn hàng |
| GET | `/api/pets` | Danh sách thú cưng |
| POST | `/api/appointments` | Đặt lịch hẹn |

---

## 🔐 Môi trường

### `backend/.env`
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/petcare
JWT_SECRET=your_secret_key
```

### `frontend/.env.local` *(tùy chọn)*
```env
VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
VITE_API_URL=http://localhost:3000
```

---

## 👥 Nhóm phát triển

| Thành viên | Nhánh | Module |
|------------|-------|--------|
| Leader | `vipm` / `main` | Admin system, Auth, Architecture |
| Dũng | `dunghn` | Product module |
| Hoành Tiên | `hoanhtien` | Pet listing & adoption |
| Hùng | `hungmh` | Booking — Services, Staff, Appointments |
| Phát | `phatnt` | Services & Appointments |

---

*© 2026 PetCare — Chăm sóc thú cưng từ trái tim* 🐾