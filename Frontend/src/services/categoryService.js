import axios from 'axios';
import API_CONFIG from '../config/api';

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
});

const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await apiClient.get('/app/search/fetchCategories');
      return response.data.categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
};

export default categoryService;