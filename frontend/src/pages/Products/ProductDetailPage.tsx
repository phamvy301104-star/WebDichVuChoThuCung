import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Header } from '@components/Common/Header';
import { Footer } from '@components/Common/Footer';
import { addToCart } from '@stores/slices/cartSlice';

const PRODUCTS = [
  { id: '1', name: 'Thức ăn mèo Royal Canin 400g', category: 'Thức ăn', price: 185000, oldPrice: 220000, icon: '🐱', rating: 4.8, sold: 124, description: 'Thức ăn hạt cao cấp dành cho mèo trưởng thành, bổ sung đầy đủ dinh dưỡng, tốt cho tiêu hoá và lông mượt.', brand: 'Royal Canin', weight: '400g', origin: 'Pháp' },
  { id: '2', name: 'Balo vận chuyển thú cưng cao cấp', category: 'Phụ kiện', price: 320000, icon: '🎒', rating: 4.6, sold: 43, description: 'Balo tiện lợi, thoáng khí, phù hợp cho thú cưng dưới 5kg.', brand: 'PetCare', weight: '0.8kg', origin: 'Việt Nam' },
  { id: '3', name: 'Vitamin tổng hợp cho chó (60 viên)', category: 'Thuốc & Vitamin', price: 180000, icon: '💊', rating: 4.5, sold: 76, description: 'Bổ sung vitamin và khoáng chất thiết yếu cho chó mọi lứa tuổi.', brand: 'VetPlus', weight: '120g', origin: 'Anh' },
  { id: '4', name: 'Combo đồ chơi chuột nhỏ cho mèo', category: 'Đồ chơi', price: 55000, oldPrice: 75000, icon: '🐭', rating: 4.7, sold: 89, description: 'Bộ đồ chơi kích thích bản năng săn mồi của mèo, an toàn và bền.', brand: 'PetToy', weight: '200g', origin: 'Trung Quốc' },
  { id: '5', name: 'Shampoo thú cưng hương lavender 500ml', category: 'Chăm sóc', price: 120000, icon: '🛁', rating: 4.4, sold: 68, description: 'Sữa tắm dịu nhẹ, không gây kích ứng da, hương thơm dễ chịu.', brand: 'PetClean', weight: '500ml', origin: 'Thái Lan' },
  { id: '6', name: 'Cát vệ sinh cho mèo 5kg', category: 'Vệ sinh', price: 95000, icon: '🪣', rating: 4.9, sold: 112, description: 'Cát vón cục, khử mùi tốt, ít bụi, an toàn cho mèo.', brand: 'CatSand', weight: '5kg', origin: 'Việt Nam' },
  { id: '7', name: 'Vòng chống bọ chét & ve cho chó', category: 'Y tế', price: 145000, icon: '🐕', rating: 4.3, sold: 55, description: 'Bảo vệ chó khỏi bọ chét và ve trong 8 tháng liên tục.', brand: 'Seresto', weight: '30g', origin: 'Đức' },
  { id: '8', name: 'Chuồng sắt gấp gọn cho chó cỡ vừa', category: 'Chuồng & Nhà', price: 750000, icon: '🏠', rating: 4.6, sold: 21, description: 'Chuồng sắt chắc chắn, dễ gấp gọn, phù hợp chó 10-20kg.', brand: 'PetHome', weight: '4kg', origin: 'Việt Nam' },
];

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];

  const handleAddToCart = () => {
    dispatch(addToCart({
      product: { id: p.id, name: p.name, description: p.description, price: p.price, quantity: 99, image: '', category: { id: '1', name: p.category }, brand: { id: '1', name: p.brand }, rating: p.rating, reviews: 0, createdAt: '' },
      quantity: qty,
    }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <>
      <Header />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          {/* Ảnh sản phẩm */}
          <div style={{ background: 'linear-gradient(135deg,#fef9f0,#fef3c7)', borderRadius: 16, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8rem', position: 'relative' }}>
            {p.icon}
            {p.oldPrice && (
              <span style={{ position: 'absolute', top: 16, left: 16, background: '#ef4444', color: '#fff', fontSize: '0.85rem', fontWeight: 800, padding: '4px 10px', borderRadius: 10 }}>
                -{Math.round((1 - p.price / p.oldPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Thông tin */}
          <div>
            <span style={{ background: '#E8F5EF', color: '#166534', fontSize: '0.78rem', fontWeight: 600, padding: '3px 10px', borderRadius: 6 }}>{p.category}</span>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#253D4E', margin: '12px 0 8px' }}>{p.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ef4444' }}>{fmt(p.price)}</span>
              {p.oldPrice && <span style={{ fontSize: '1rem', color: '#9ca3af', textDecoration: 'line-through' }}>{fmt(p.oldPrice)}</span>}
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <span style={{ background: '#f0fdf4', color: '#166534', padding: '4px 10px', borderRadius: 8, fontSize: '0.82rem' }}>⭐ {p.rating}</span>
              <span style={{ background: '#f3f4f6', color: '#374151', padding: '4px 10px', borderRadius: 8, fontSize: '0.82rem' }}>Đã bán: {p.sold}</span>
            </div>
            <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: 20 }}>{p.description}</p>

            <div style={{ background: '#f9fafb', borderRadius: 10, padding: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: '#6b7280' }}>Thương hiệu</span><b>{p.brand}</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span style={{ color: '#6b7280' }}>Trọng lượng</span><b>{p.weight}</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6b7280' }}>Xuất xứ</span><b>{p.origin}</b></div>
            </div>

            {/* Chọn số lượng */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ color: '#374151', fontWeight: 600 }}>Số lượng:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem' }}>−</button>
                <span style={{ minWidth: 36, textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem' }}>+</button>
              </div>
            </div>

            {/* Nút hành động */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={handleAddToCart}
                style={{ flex: 1, background: added ? '#16a34a' : '#fff', color: added ? '#fff' : '#3BB77E', border: '2px solid #3BB77E', padding: '12px', borderRadius: 10, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {added ? '✓ Đã thêm!' : '🛒 Thêm vào giỏ'}
              </button>
              <button
                onClick={handleBuyNow}
                style={{ flex: 1, background: 'linear-gradient(135deg,#3BB77E,#2D9B6A)', color: '#fff', border: 'none', padding: '12px', borderRadius: 10, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};
