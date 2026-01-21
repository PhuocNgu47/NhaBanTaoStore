import { useSelector, useDispatch } from 'react-redux';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartItemCount,
  selectCartTotal,
} from '../features/cartSlice';
import { toast } from 'react-toastify';

export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartItemCount);
  const total = useSelector(selectCartTotal);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success('Đã thêm vào giỏ hàng!');
  };

  const handleRemoveFromCart = (id, variant) => {
    dispatch(removeFromCart({ id, variant }));
    toast.info('Đã xóa khỏi giỏ hàng');
  };

  const handleUpdateQuantity = (id, variant, quantity) => {
    dispatch(updateQuantity({ id, variant, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.info('Đã xóa giỏ hàng');
  };

  return {
    items,
    itemCount,
    total,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
  };
};
