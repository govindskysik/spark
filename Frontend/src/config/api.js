const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000' || 'http://192.168.238.1:5173/',
  
  ENDPOINTS: {
    AUTH: {
      SIGNIN: '/user/signin',
      SIGNUP: '/user/signup',
    },
    
    SEARCH: {
      BY_ID: '/app/search/id',
      FUZZY: '/app/search/fuzzy',
      CATEGORY: '/app/search/category',
    },
    
    CART: {
      ADD: '/app/cart/add',
    }
  },
  
  buildUrl: (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  }
};

export default API_CONFIG;