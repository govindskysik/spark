const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',

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
  }
  ,

  buildUrl: (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`
};

export default API_CONFIG;
