import axios from 'axios';
import API_CONFIG from '../config/api';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const cartService = {
  addToCart: async (payload) => {
    const res = await apiClient.post(API_CONFIG.ENDPOINTS.CART.ADD, payload);
    console.log("Added to cart:", res);
    return res.data;
  },
  getCart: async () => {
    const res = await apiClient.get(API_CONFIG.ENDPOINTS.CART.GET);
    return res.data;
  },
  removeFromCart: async (payload) => {
    const res = await apiClient.delete(API_CONFIG.ENDPOINTS.CART.REMOVE, { data: payload });
    return res.data;
  },
  updateCartItem: async (payload) => {
    const res = await apiClient.patch(API_CONFIG.ENDPOINTS.CART.UPDATE, payload);
    return res.data;
  },
  clearCart: async () => {
    const res = await apiClient.delete(API_CONFIG.ENDPOINTS.CART.CLEAR);
    return res.data;
  }
};

export default cartService;
