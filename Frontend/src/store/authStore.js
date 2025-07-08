import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null })
}));

export default useAuthStore;