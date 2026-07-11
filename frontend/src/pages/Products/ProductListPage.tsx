import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@components/Common/Header";
import { Footer } from "@components/Common/Footer";
import { productService } from "@services/productService";
import type { Product } from "@/types";

const fmt = (n: number) => n.toLocaleString("vi-VN") + "đ";

// Dữ liệu mẫu hiển thị khi backend chưa kết nối
const MOCK_PRODUCTS: Partial<Product>[] = [
  { _id: '1', name: 'Thức ăn mèo Royal Canin 400g', category: 'Thức ăn', price: 185000, originalPrice: 220000, image: 'https://images.unsplash.com/photo-1589924691995-400dc9562c07?w=400&h=300&fit=crop&auto=format', rating: 4.8, sold: 124, description: 'Thức ăn hạt cao cấp dành cho mèo trưởng thành.' },
  { _id: '2', name: 'Balo vận chuyển thú cưng cao cấp', category: 'Phụ kiện', price: 320000, image: 'https://images.unsplash.com/photo-1553279734-78a57ac37a77?w=400&h=300&fit=crop&auto=format', rating: 4.6, sold: 43, description: 'Balo thoáng khí, chắc chắn, an toàn cho mèo và chó nhỏ.' },
  { _id: '3', name: 'Vitamin tổng hợp cho chó (60 viên)', category: 'Thuốc & Vitamin', price: 180000, image: 'https://images.unsplash.com/photo-1550583724-b7c71bcd9c9a?w=400&h=300&fit=crop&auto=format', rating: 4.5, sold: 76, description: 'Bổ sung vitamin và khoáng chất thiết yếu cho chó.' },
  { _id: '4', name: 'Combo đồ chơi chuột nhỏ cho mèo', category: 'Đồ chơi', price: 55000, originalPrice: 75000, image: 'https://images.unsplash.com/photo-1601758174493-7ddff9b1a7e6?w=400&h=300&fit=crop&auto=format', rating: 4.7, sold: 89, description: 'Bộ 5 đồ chơi kích thích bản năng săn mồi tự nhiên của mèo.' },
  { _id: '5', name: 'Shampoo thú cưng hương lavender 500ml', category: 'Chăm sóc', price: 120000, image: 'https://images.unsplash.com/photo-1559757148-5f89397f3755?w=400&h=300&fit=crop&auto=format', rating: 4.4, sold: 68, description: 'Dầu gội dịu nhẹ, an toàn, làm sạch sâu và khử mùi.' },
  { _id: '6', name: 'Cát vệ sinh cho mèo 5kg', category: 'Vệ sinh', price: 95000, image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop&auto=format', rating: 4.9, sold: 112, description: 'Cát vón cục siêu nhanh, khử mùi hiệu quả, ít bụi.' },
  { _id: '7', name: 'Vòng chống bọ chét & ve cho chó', category: 'Y tế', price: 145000, image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&auto=format', rating: 4.3, sold: 55, description: 'Bảo vệ chó khỏi bọ chét, ve và muỗi suốt 8 tháng.' },
  { _id: '8', name: 'Chuồng sắt gấp gọn cho chó cỡ vừa', category: 'Chuồng & Nhà', price: 750000, image: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=400&h=300&fit=crop&auto=format', rating: 4.6, sold: 21, description: 'Chuồng sắt chắc chắn, dễ lắp ráp và vệ sinh, gấp gọn tiện lợi.' },
];

export const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Partial<Product>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getProducts()
      .then(data => setProducts(data.length > 0 ? data : MOCK_PRODUCTS))
      .catch(() => setProducts(MOCK_PRODUCTS))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <main className="page-container">
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px 28px",
            background: 'linear-gradient(135deg,#fdf6ec,#fce4ec)',
            borderRadius: 16,
            color: '#1a1a1a',
            marginBottom: 32,
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: 10 }}>🛍️</div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 8px" }}>
            Cửa hàng thú cưng
          </h1>
          <p style={{ opacity: 0.9, margin: 0 }}>
            Sản phẩm chất lượng cao, giá tốt nhất thị trường
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: '#6b7280' }}>Đang tải sản phẩm...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 18, marginBottom: 48 }}>
            {products.map(p => (
              <Link key={p._id || p.id} to={`/products/${p._id || p.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1px solid #f0f0f0', transition: 'transform 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = '')}
                >
                  <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                    {(p as any).originalPrice && (
                      <span style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, background: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '2px 7px', borderRadius: 10 }}>
                        -{Math.round((1 - p.price / (p as any).originalPrice) * 100)}%
                      </span>
                    )}
                    {p.image
                      ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      : <div style={{ height: '100%', background: 'linear-gradient(135deg,#fef9f0,#fef3c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>{(p as any).icon || '🐾'}</div>
                    }
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <span style={{ background: '#E8F5EF', color: '#166534', fontSize: '0.72rem', fontWeight: 600, padding: '2px 7px', borderRadius: 5 }}>
                      {typeof p.category === 'string' ? p.category : (p.category as any)?.name || 'Sản phẩm'}
                    </span>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#253D4E', margin: '8px 0 6px', lineHeight: 1.3 }}>{p.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: '#ef4444', fontSize: '1rem' }}>{fmt(p.price)}</span>
                      <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>⭐ {p.rating}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: 4 }}>Đã bán: {(p as any).sold || 0}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};
