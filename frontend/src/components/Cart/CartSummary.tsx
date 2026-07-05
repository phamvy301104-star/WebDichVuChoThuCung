import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@stores/store';
import { removeFromCart, updateCartItem, clearCart } from '@stores/slices/cartSlice';

export const CartSummary: React.FC = () => {
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateCartItem({ productId, quantity }));
    }
  };

  if (items.length === 0) {
    return <div className="empty-cart">Giỏ hàng trống</div>;
  }

  return (
    <div className="cart-summary">
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.productId} className="cart-item">
            <img src={item.product.image} alt={item.product.name} />
            <div className="item-details">
              <h4>{item.product.name}</h4>
              <p>${item.product.price}</p>
            </div>
            <div className="item-quantity">
              <button onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}>+</button>
            </div>
            <button onClick={() => handleRemove(item.productId)} className="btn-remove">
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <h3>Tổng tiền: ${totalPrice.toFixed(2)}</h3>
        <button className="btn-checkout">Thanh toán</button>
        <button onClick={() => dispatch(clearCart())} className="btn-clear">
          Xóa giỏ
        </button>
      </div>
    </div>
  );
};
