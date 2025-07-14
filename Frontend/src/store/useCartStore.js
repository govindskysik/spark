import { create } from 'zustand';
import cartService from '../services/cartService';

const useCartStore = create((set) => ({
  products: [],
  totalPrice: 0,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await cartService.getCart();
      // FIX: Use res.data.products and res.data.total_price
      set({
        products: res.data.products,
        totalPrice: res.data.total_price,
        loading: false
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addItem: async (item) => {
    try {
      const res = await cartService.addToCart(item);
      set({ products: res.data.products, totalPrice: res.data.total_price });
    } catch (error) {
      console.error(error);
    }
  },

  removeItem: async (item) => {
    try {
      const res = await cartService.removeFromCart(item);
      set({ products: res.data.products, totalPrice: res.data.total_price });
    } catch (error) {
      console.error(error);
    }
  },

  updateItem: async (item) => {
    try {
      const res = await cartService.updateCartItem(item);
      set({ products: res.data.products, totalPrice: res.data.total_price });
    } catch (error) {
      console.error(error);
    }
  },

  clearCart: async () => {
    try {
      const res = await cartService.clearCart();
      set({ products: [], totalPrice: 0 });
    } catch (error) {
      console.error(error);
    }
  }
}));

export default useCartStore;
