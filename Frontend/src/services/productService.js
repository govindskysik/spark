import axios from 'axios';
import API_CONFIG from '../config/api';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
});

const productService = {
  getProductsByCategory: async (category, limit = null) => {
    try {
      console.log(`Calling API to fetch ${category} products`);
      const url = `${API_CONFIG.ENDPOINTS.SEARCH.CATEGORY}/${encodeURIComponent(category)}`;
      console.log("API URL:", API_CONFIG.BASE_URL + url);
      
      // To fetch all products for a category, use limit=all
      const params = limit ? { limit } : { limit: 'all' };
      const response = await apiClient.get(url, { params });
      console.log("API response:", response);
      
      if (response.data && response.data.products) {
        return response.data.products;
      } else {
        console.warn(`No products found for ${category} or unexpected API response format`);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      return [];
    }
  },
  
  getProductById: async (productId) => {
    try {
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.SEARCH.BY_ID}/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  },
  
  searchProducts: async (query) => {
    try {
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.SEARCH.FUZZY}`, {
        params: { q: query }
      });
      return response.data.products;
    } catch (error) {
      console.error(`Error searching products with query "${query}":`, error);
      return [];
    }
  }
};

export default productService;
