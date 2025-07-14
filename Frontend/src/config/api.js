const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL|| "https://localhost:3000", 
  BASE_URL_AGENT: import.meta.env.VITE_API_BASE_URL_AGENT,

  ENDPOINTS: {
    SEARCH: {
      BY_ID: '/app/search/id',
      FUZZY: '/app/search/fuzzy',
      CATEGORY: '/app/search/category',
    },

    AUTH: {
      SIGNUP: '/user/signup',
      SIGNIN: '/user/signin',
    },

    CART: {
      ADD: '/app/cart/add',
      GET: '/app/cart',
      REMOVE: '/app/cart',
      UPDATE: '/app/cart',
      CLEAR: '/app/cart/clearCart',
    }
  },

  buildUrl: (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`,
  buildUrlAgent: (endpoint) => `${API_CONFIG.BASE_URL_AGENT}${endpoint}`
};

export default API_CONFIG;
