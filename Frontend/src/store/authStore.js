import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  
  clearError: () => set({ error: null }),

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.signup(userData);
      const { user, token } = response;
      
      console.log('User data from server:', response);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('Stored in localStorage:', JSON.stringify(user));
      
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      return { success: true, user, token };
    } catch (error) {
      set({ 
        error: error.msg || 'Signup failed', 
        isLoading: false 
      });
      return { success: false, error: error.msg };
    }
  },

  // Sign in action
  signin: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.signin(credentials);
      const { user, token } = response;
      
      console.log('User data from server:', response);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('Stored in localStorage:', JSON.stringify(user));
      
      // Update store
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      return { success: true, user, token };
    } catch (error) {
      set({ 
        error: error.msg || 'Signin failed', 
        isLoading: false 
      });
      return { success: false, error: error.msg };
    }
  },

  // Logout action
  logout: () => {
    authService.logout();
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false, 
      error: null 
    });
  },

  // Initialize auth state from localStorage
  initializeAuth: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    console.log('Retrieved from localStorage:', user);
    
    if (token && user && authService.isAuthenticated()) {
      set({ 
        user: JSON.parse(user), 
        token, 
        isAuthenticated: true 
      });
    } else {
      // Clear invalid data
      authService.logout();
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      });
    }
  }
}));

export default useAuthStore;