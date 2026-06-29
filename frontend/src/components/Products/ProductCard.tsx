import React from "react";
import { Product } from "@types/index";
import { useDispatch } from "react-redux";
import { addToCart } from "@stores/slices/cartSlice";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    alert("Đã thêm vào giỏ hàng!");
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
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
};
