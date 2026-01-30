import { createSlice } from '@reduxjs/toolkit';

// Get cart from localStorage
const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  if (cart && cart.length > 0) {
    localStorage.setItem('cart', JSON.stringify(cart));
  } else {
    // Remove cart key completely when empty
    localStorage.removeItem('cart');
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getCartFromStorage(),
    isLoading: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, image, quantity = 1, variant, variantId } = action.payload;
      const existingItem = state.items.find(
        (item) => item.id === id && (variantId ? item.variantId === variantId : item.variant === variant)
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ id, name, price, image, quantity, variant, variantId });
      }
      saveCartToStorage(state.items);
    },

    removeFromCart: (state, action) => {
      const { id, variant, variantId } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.id === id && (variantId ? item.variantId === variantId : item.variant === variant))
      );
      saveCartToStorage(state.items);
    },

    updateQuantity: (state, action) => {
      const { id, variant, variantId, quantity } = action.payload;
      const item = state.items.find(
        (item) => item.id === id && (variantId ? item.variantId === variantId : item.variant === variant)
      );
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      saveCartToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
