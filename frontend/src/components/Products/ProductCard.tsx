import React, { useCallback } from "react";
import type { Product } from "@/types";
import { useDispatch } from "react-redux";
import { addToCart } from "@stores/slices/cartSlice";

interface ProductCardProps {
  product: Product;
}

/**
 * React.memo — chỉ re-render khi props thay đổi (Roadmap mục 4)
 * useCallback — giữ nguyên reference của handler giữa các lần render (Roadmap mục 3)
 */
export const ProductCard = React.memo<ProductCardProps>(({ product }) => {
  const dispatch = useDispatch();

  // useCallback: hàm chỉ được tạo lại khi dispatch hoặc product thay đổi
  const handleAddToCart = useCallback(() => {
    dispatch(addToCart({ product, quantity: 1 }));
    alert("Đã thêm vào giỏ hàng!");
  }, [dispatch, product]);

    <div className="product-card">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              fontSize: "3rem",
            }}
          >
            🐾
          </div>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-meta">
          <span className="price">${product.price}</span>
          <span className="rating">⭐ {product.rating}</span>
        </div>
        <button onClick={handleAddToCart} className="btn-add-to-cart">
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
});
