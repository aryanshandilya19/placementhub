import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      setAuth: (user, accessToken) => set({ user, accessToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      logout: () => set({ user: null, accessToken: null }),
    }),
    {
      name: 'auth-storage',
      partialState: (state) => ({ user: state.user }),
      // Only persist user info, not the access token
      // Access tokens should live in memory only — localStorage is XSS-vulnerable
    }
  )
);

export default useAuthStore;